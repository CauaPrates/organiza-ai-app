import { STORAGE_KEYS } from '../constants';

class StorageService {
  /**
   * Get item from localStorage
   */
  get<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch (error) {
      console.error(`Error getting item from localStorage: ${key}`, error);
      return defaultValue || null;
    }
  }

  /**
   * Set item in localStorage
   */
  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting item in localStorage: ${key}`, error);
    }
  }

  /**
   * Remove item from localStorage
   */
  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item from localStorage: ${key}`, error);
    }
  }

  /**
   * Clear all localStorage
   */
  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage', error);
    }
  }

  /**
   * Check if key exists in localStorage
   */
  exists(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }

  // Convenience methods for common storage keys
  getUser() {
    return this.get(STORAGE_KEYS.user);
  }

  setUser(user: any) {
    this.set(STORAGE_KEYS.user, user);
  }

  getToken() {
    return this.get<string>(STORAGE_KEYS.token);
  }

  setToken(token: string) {
    this.set(STORAGE_KEYS.token, token);
  }

  getTheme() {
    return this.get<string>(STORAGE_KEYS.theme, 'light');
  }

  setTheme(theme: string) {
    this.set(STORAGE_KEYS.theme, theme);
  }

  getLanguage() {
    return this.get<string>(STORAGE_KEYS.language, 'pt-BR');
  }

  setLanguage(language: string) {
    this.set(STORAGE_KEYS.language, language);
  }
}

export default new StorageService();