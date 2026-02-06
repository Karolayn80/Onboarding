import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "./Input";
import SocialLogin from "./SocialLogin";
import NotificationModal from "./NotificationModal";
import { loginUser, saveAuthToken } from "../services/apiService";

const LoginForm = () => {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{
    isOpen: boolean;
    type: 'success' | 'error' | 'warning';
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: 'error',
    title: '',
    message: '',
  });
  const navigate = useNavigate();

  const showNotification = (
    type: 'success' | 'error' | 'warning',
    title: string,
    message: string
  ) => {
    setNotification({
      isOpen: true,
      type,
      title,
      message,
    });
  };

  const closeNotification = () => {
    setNotification({
      ...notification,
      isOpen: false,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones básicas
    if (!emailOrUsername || !password) {
      showNotification(
        'warning',
        'Campos incompletos',
        'Por favor completa todos los campos para continuar'
      );
      return;
    }

    setIsLoading(true);

    try {
      // Llamar a la API de login
      const response = await loginUser({
        emailOrUsername,
        password,
      });

      if (response.success && response.data) {
        // Login exitoso
        saveAuthToken(response.data.token);
        
        showNotification(
          'success',
          '¡Bienvenido!',
          `Hola ${response.data.user.username}, has iniciado sesión correctamente`
        );

        // Redirigir después de 1.5 segundos
        setTimeout(() => {
          navigate("/survey");
        }, 1500);
      } else {
        // Errores específicos
        if (response.error === 'USER_NOT_FOUND') {
          showNotification(
            'error',
            'Usuario no encontrado',
            'No encontramos una cuenta con ese correo o nombre de usuario. ¿Quieres registrarte?'
          );
        } else if (response.error === 'INCORRECT_PASSWORD') {
          showNotification(
            'error',
            'Contraseña incorrecta',
            'La contraseña que ingresaste no es correcta. Por favor verifica e intenta nuevamente.'
          );
        } else {
          showNotification(
            'error',
            'Error de autenticación',
            response.message || 'Hubo un problema al iniciar sesión. Por favor intenta de nuevo.'
          );
        }
      }
    } catch (error) {
      console.error('Error en el login:', error);
      showNotification(
        'error',
        'Error de conexión',
        'No pudimos conectar con el servidor. Por favor verifica tu conexión e intenta nuevamente.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/change-password");
  };

  return (
    <>
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-title">Iniciar sesión</h2>

        <div className="form-group">
          <label className="input-label">Email o nombre de usuario</label>
          <Input
            type="text"
            placeholder="Email o nombre de usuario"
            value={emailOrUsername}
            onChange={(e) => setEmailOrUsername(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label className="input-label">Contraseña</label>
          <Input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            showPasswordToggle={true}
            disabled={isLoading}
          />
        </div>

        <a 
          href="#" 
          className="forgot-password" 
          onClick={handleForgotPassword}
          style={{ pointerEvents: isLoading ? 'none' : 'auto' }}
        >
          ¿Olvidó su contraseña?
        </a>

        <button 
          type="submit" 
          className="login-button"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="button-spinner"></span>
              Iniciando sesión...
            </>
          ) : (
            'Iniciar sesión'
          )}
        </button>

        <SocialLogin />
      </form>

      <NotificationModal
        isOpen={notification.isOpen}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        onClose={closeNotification}
      />
    </>
  );
};

export default LoginForm;