import { API_URL } from './api';

export interface User {
  id: number;
  email: string;
  nombre: string;
  provincia_id?: number;
}

const TOKEN_KEY = 'opobusca_token';
const USER_KEY = 'opobusca_user';

// Función para guardar sesión
export const saveSession = (user: User, token: string) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.setItem(TOKEN_KEY, token);
};

// Función para obtener el usuario actual
export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

// Función para obtener el token
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

// Función para cerrar sesión
export const clearSession = () => {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
};

// Función para login
export const login = async (email: string, password: string): Promise<{ user: User; token: string }> => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error al iniciar sesión');
  }

  if (!data.success) {
    throw new Error(data.message || 'Credenciales incorrectas');
  }

  saveSession(data.user, data.token);
  return { user: data.user, token: data.token };
};

// Función para registro
export const register = async (
  email: string,
  password: string,
  nombre: string,
  provincia_id?: number
): Promise<{ user: User; token: string }> => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password, nombre, provincia_id }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error al registrarse');
  }

  if (!data.success) {
    throw new Error(data.message || 'Error al crear la cuenta');
  }

  saveSession(data.user, data.token);
  return { user: data.user, token: data.token };
};
