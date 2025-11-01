import { supabase } from './supabaseClient';
import { AuthCredentials, RegisterData, User, AuthResponse, DashboardBackground, DashboardBackgroundType } from '../types';

export const userService = {
  // Registrar um novo usuário
async register(data: RegisterData): Promise<AuthResponse> {
  try {
    // 1️⃣ Registrar usuário com Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    if (authError) {
      return { user: null, session: null, error: authError };
    }

    const userId = authData.user?.id;
    if (!userId) {
      return { user: null, session: null, error: new Error('Erro ao criar usuário') };
    }

    // 2️⃣ Atualizar campos extras (opcional), como name
    if (data.name) {
      const { error: updateError } = await supabase
        .from('users')
        .update({ name: data.name })
        .eq('id', userId);

      if (updateError) {
        console.error('Erro ao atualizar nome do usuário:', updateError);
      }
    }

    // 3️⃣ Retornar usuário
    const user: User = {
      id: userId,
      name: data.name || '',
      email: data.email,
      createdAt: new Date() // ou authData.user?.created_at se quiser
    };

    return {
      user,
      session: authData.session,
      error: null
    };
  } catch (error) {
    return {
      user: null,
      session: null,
      error: error instanceof Error ? error : new Error('Erro desconhecido no registro')
    };
  }
},


  // Login de usuário
  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (authError) {
        return {
          user: null,
          session: null,
          error: authError
        };
      }

      // Buscar dados do usuário
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user?.id)
        .single();

      if (userError) {
        return {
          user: null,
          session: null,
          error: userError
        };
      }

      const user: User = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        createdAt: new Date(userData.created_at)
      };

      return {
        user,
        session: authData.session,
        error: null
      };
    } catch (error) {
      return {
        user: null,
        session: null,
        error: error instanceof Error ? error : new Error('Erro desconhecido no login')
      };
    }
  },

  // Logout de usuário
  async logout(): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      return {
        error: error instanceof Error ? error : new Error('Erro desconhecido no logout')
      };
    }
  },

  // Obter usuário atual
  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData.session) {
        return null;
      }

      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', sessionData.session.user.id)
        .single();

      if (error || !userData) {
        return null;
      }

      return {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        createdAt: new Date(userData.created_at)
      };
    } catch (error) {
      console.error('Erro ao obter usuário atual:', error);
      return null;
    }
  },

  // Obter configuração de fundo do dashboard do usuário
  async getUserBackground(): Promise<{ data: DashboardBackground | null, error: Error | null }> {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData.session) {
        return { data: null, error: new Error('Usuário não autenticado') };
      }

      const { data: userData, error } = await supabase
        .from('users')
        .select('dashboard_background_type, dashboard_background_value')
        .eq('id', sessionData.session.user.id)
        .single();

      if (error) {
        return { data: null, error };
      }

      // Se não houver dados, retornar valores padrão
      if (!userData.dashboard_background_type || !userData.dashboard_background_value) {
        return { 
          data: { 
            type: 'color', 
            value: '#D9E4EC' 
          }, 
          error: null 
        };
      }

      return { 
        data: {
          type: userData.dashboard_background_type as DashboardBackgroundType,
          value: userData.dashboard_background_value
        }, 
        error: null 
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error : new Error('Erro ao obter fundo do dashboard')
      };
    }
  },

  // Atualizar configuração de fundo do dashboard do usuário
  async updateUserBackground(background: DashboardBackground): Promise<{ data: DashboardBackground | null, error: Error | null }> {
    try {
      // Validações
      if (background.type !== 'color' && background.type !== 'image') {
        return { data: null, error: new Error('Tipo de fundo inválido. Deve ser "color" ou "image"') };
      }

      if (background.type === 'color') {
        // Validar formato de cor hex
        const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
        if (!hexColorRegex.test(background.value)) {
          return { data: null, error: new Error('Formato de cor inválido. Deve ser um valor hexadecimal (ex: #D9E4EC)') };
        }
      } else if (background.type === 'image') {
        // Validar URL ou data:image
        if (!background.value.startsWith('http') && !background.value.startsWith('data:image/')) {
          return { data: null, error: new Error('Formato de imagem inválido. Deve ser uma URL ou data:image') };
        }
      }

      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData.session) {
        return { data: null, error: new Error('Usuário não autenticado') };
      }

      const { data, error } = await supabase
        .from('users')
        .update({
          dashboard_background_type: background.type,
          dashboard_background_value: background.value
        })
        .eq('id', sessionData.session.user.id)
        .select('dashboard_background_type, dashboard_background_value')
        .single();

      if (error) {
        return { data: null, error };
      }

      return { 
        data: {
          type: data.dashboard_background_type as DashboardBackgroundType,
          value: data.dashboard_background_value
        }, 
        error: null 
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error : new Error('Erro ao atualizar fundo do dashboard')
      };
    }
  }
};

export default userService;