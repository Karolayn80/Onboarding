const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const USE_MOCK = true; // Cambiar a false cuando tengas backend real

// Tipos de respuesta
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface RegisterData {
  email: string;
  username: string;
  phone: string;
  password: string;
}

export interface LoginData {
  emailOrUsername: string;
  password: string;
}

export interface ChangePasswordData {
  email: string;
  newPassword: string;
}

export interface UserResponse {
  id: string;
  email: string;
  username: string;
  phone: string;
  createdAt: string;
}

export interface LoginResponse {
  token: string;
  user: UserResponse;
}

// ========== MOCK DATA (Base de datos simulada en memoria) ==========
let mockUsers: UserResponse[] = [
  {
    id: '1',
    email: 'admin@example.com',
    username: 'admin',
    phone: '+57 300 1234567',
    createdAt: new Date().toISOString(),
  },
];

let mockPasswords: { [key: string]: string } = {
  'admin@example.com': 'password123',
};

// Simular delay de red
const mockDelay = (ms: number = 800) => new Promise(resolve => setTimeout(resolve, ms));

// ========== FUNCIONES MOCK ==========

const mockRegisterUser = async (userData: RegisterData): Promise<ApiResponse<UserResponse>> => {
  await mockDelay();

  // Validar si el email o username ya existe
  const emailExists = mockUsers.some(u => u.email === userData.email);
  const usernameExists = mockUsers.some(u => u.username === userData.username);

  if (emailExists) {
    return {
      success: false,
      error: 'El email ya está registrado',
    };
  }

  if (usernameExists) {
    return {
      success: false,
      error: 'El nombre de usuario ya está en uso',
    };
  }

  // Crear nuevo usuario
  const newUser: UserResponse = {
    id: String(mockUsers.length + 1),
    email: userData.email,
    username: userData.username,
    phone: userData.phone,
    createdAt: new Date().toISOString(),
  };

  mockUsers.push(newUser);
  mockPasswords[userData.email] = userData.password;

  return {
    success: true,
    data: newUser,
    message: 'Usuario registrado exitosamente',
  };
};

const mockLoginUser = async (loginData: LoginData): Promise<ApiResponse<LoginResponse>> => {
  await mockDelay();

  // Buscar usuario por email o username
  const user = mockUsers.find(
    u => u.email === loginData.emailOrUsername || u.username === loginData.emailOrUsername
  );

  if (!user) {
    return {
      success: false,
      error: 'USER_NOT_FOUND',
      message: 'No encontramos una cuenta con ese correo o nombre de usuario',
    };
  }

  // Verificar contraseña
  const storedPassword = mockPasswords[user.email];
  if (storedPassword !== loginData.password) {
    return {
      success: false,
      error: 'INCORRECT_PASSWORD',
      message: 'La contraseña es incorrecta. Por favor verifica e intenta nuevamente',
    };
  }

  // Login exitoso
  return {
    success: true,
    data: {
      token: `mock-token-${user.id}-${Date.now()}`,
      user: user,
    },
    message: 'Login exitoso',
  };
};

const mockVerifyEmail = async (email: string): Promise<ApiResponse<{ exists: boolean }>> => {
  await mockDelay(500);

  const exists = mockUsers.some(u => u.email === email);

  return {
    success: true,
    data: { exists },
  };
};

const mockChangePassword = async (
  passwordData: ChangePasswordData
): Promise<ApiResponse<{ message: string }>> => {
  await mockDelay();

  const user = mockUsers.find(u => u.email === passwordData.email);

  if (!user) {
    return {
      success: false,
      error: 'Email no encontrado',
    };
  }

  // Actualizar contraseña
  mockPasswords[passwordData.email] = passwordData.newPassword;

  return {
    success: true,
    data: { message: 'Contraseña actualizada exitosamente' },
  };
};

// ========== FUNCIONES REALES (para cuando tengas backend) ==========

async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || 'Error en la petición',
      };
    }

    return {
      success: true,
      data: data,
      message: data.message,
    };
  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error de conexión con el servidor',
    };
  }
}

// ========== EXPORTS (usan MOCK o REAL según configuración) ==========

export const registerUser = async (
  userData: RegisterData
): Promise<ApiResponse<UserResponse>> => {
  if (USE_MOCK) {
    console.log('🔧 Usando MOCK API - registerUser');
    return mockRegisterUser(userData);
  }
  return fetchAPI<UserResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

export const loginUser = async (
  loginData: LoginData
): Promise<ApiResponse<LoginResponse>> => {
  if (USE_MOCK) {
    console.log('🔧 Usando MOCK API - loginUser');
    return mockLoginUser(loginData);
  }
  return fetchAPI<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(loginData),
  });
};

export const verifyEmail = async (email: string): Promise<ApiResponse<{ exists: boolean }>> => {
  if (USE_MOCK) {
    console.log('🔧 Usando MOCK API - verifyEmail');
    return mockVerifyEmail(email);
  }
  return fetchAPI<{ exists: boolean }>('/auth/verify-email', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
};

export const changePassword = async (
  passwordData: ChangePasswordData
): Promise<ApiResponse<{ message: string }>> => {
  if (USE_MOCK) {
    console.log('🔧 Usando MOCK API - changePassword');
    return mockChangePassword(passwordData);
  }
  return fetchAPI<{ message: string }>('/auth/change-password', {
    method: 'POST',
    body: JSON.stringify(passwordData),
  });
};

// OAuth (estos redirigen al backend, no se pueden mockear fácilmente)
export const loginWithGoogle = async (): Promise<ApiResponse<LoginResponse>> => {
  if (USE_MOCK) {
    alert('🔧 MOCK: En producción, esto redirigiría a Google OAuth');
    return { success: false, error: 'OAuth no disponible en modo mock' };
  }
  window.location.href = `${API_BASE_URL}/auth/google`;
  return { success: true };
};

export const loginWithFacebook = async (): Promise<ApiResponse<LoginResponse>> => {
  if (USE_MOCK) {
    alert('🔧 MOCK: En producción, esto redirigiría a Facebook OAuth');
    return { success: false, error: 'OAuth no disponible en modo mock' };
  }
  window.location.href = `${API_BASE_URL}/auth/facebook`;
  return { success: true };
};

export const loginWithApple = async (): Promise<ApiResponse<LoginResponse>> => {
  if (USE_MOCK) {
    alert('🔧 MOCK: En producción, esto redirigiría a Apple OAuth');
    return { success: false, error: 'OAuth no disponible en modo mock' };
  }
  window.location.href = `${API_BASE_URL}/auth/apple`;
  return { success: true };
};

// Helpers de autenticación
export const saveAuthToken = (token: string): void => {
  localStorage.setItem('authToken', token);
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

export const removeAuthToken = (): void => {
  localStorage.removeItem('authToken');
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

// ========== ENCUESTA API ==========

export interface SurveyAnswer {
  date: string;
  question1: string;
  question2: string;
  question3: string;
  question4: string;
}

export interface SurveyResponse {
  id: string;
  userId: string;
  answers: SurveyAnswer;
  createdAt: string;
}

// Mock: almacenar encuestas por usuario
let mockSurveys: { [userId: string]: SurveyResponse } = {};

const mockSubmitSurvey = async (
  surveyData: SurveyAnswer
): Promise<ApiResponse<SurveyResponse>> => {
  await mockDelay();

  // Obtener el token del usuario actual
  const token = getAuthToken();
  if (!token) {
    return {
      success: false,
      error: 'Debes iniciar sesión para responder la encuesta',
    };
  }

  // Simular extracción del userId del token
  const userId = token.split('-')[2] || '1';

  // Verificar si ya respondió
  if (mockSurveys[userId]) {
    return {
      success: false,
      error: 'Ya has respondido esta encuesta anteriormente',
    };
  }

  // Guardar encuesta
  const survey: SurveyResponse = {
    id: `survey-${Date.now()}`,
    userId,
    answers: surveyData,
    createdAt: new Date().toISOString(),
  };

  mockSurveys[userId] = survey;

  return {
    success: true,
    data: survey,
    message: 'Encuesta guardada exitosamente',
  };
};

const mockCheckUserSurvey = async (): Promise<ApiResponse<{ hasAnswered: boolean }>> => {
  await mockDelay(300);

  const token = getAuthToken();
  if (!token) {
    return {
      success: true,
      data: { hasAnswered: false },
    };
  }

  const userId = token.split('-')[2] || '1';
  const hasAnswered = !!mockSurveys[userId];

  return {
    success: true,
    data: { hasAnswered },
  };
};

// Exports
export const submitSurvey = async (
  surveyData: SurveyAnswer
): Promise<ApiResponse<SurveyResponse>> => {
  if (USE_MOCK) {
    console.log('🔧 Usando MOCK API - submitSurvey');
    return mockSubmitSurvey(surveyData);
  }
  return fetchAPI<SurveyResponse>('/survey/submit', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
    body: JSON.stringify(surveyData),
  });
};

export const checkUserSurvey = async (): Promise<ApiResponse<{ hasAnswered: boolean }>> => {
  if (USE_MOCK) {
    console.log('🔧 Usando MOCK API - checkUserSurvey');
    return mockCheckUserSurvey();
  }
  return fetchAPI<{ hasAnswered: boolean }>('/survey/check', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });
};
// ========== EMAIL API ==========

export interface EmailData {
  to: string;
  subject: string;
  body: string;
  surveyData: SurveyAnswer;
}

const mockSendEmail = async (emailData: EmailData): Promise<ApiResponse<{ sent: boolean }>> => {
  await mockDelay(1000);

  console.log('📧 Enviando email a:', emailData.to);
  console.log('📄 Asunto:', emailData.subject);
  console.log('📝 Contenido:', emailData.body);

  // En producción, aquí se llamaría a un servicio de email real
  // como SendGrid, AWS SES, o tu propio backend

  return {
    success: true,
    data: { sent: true },
    message: 'Email enviado exitosamente',
  };
};

export const sendSurveyEmail = async (emailData: EmailData): Promise<ApiResponse<{ sent: boolean }>> => {
  if (USE_MOCK) {
    console.log('🔧 Usando MOCK API - sendSurveyEmail');
    return mockSendEmail(emailData);
  }
  
  return fetchAPI<{ sent: boolean }>('/email/send-survey', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
    body: JSON.stringify(emailData),
  });
};

// Helper para obtener el email del usuario autenticado
export const getUserEmail = (): string | null => {
  const token = getAuthToken();
  if (!token) return null;

  // En el mock, extraemos el email de los usuarios registrados
  const userId = token.split('-')[2] || '1';
  const user = mockUsers.find(u => u.id === userId);
  return user?.email || null;
};