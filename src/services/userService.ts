import { supabase } from './supabaseClient';
import { AuthCredentials, RegisterData, User, AuthResponse } from '../types';

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
  }
};

export default userService;