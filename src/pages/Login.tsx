import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import "../styles/login.css";

const Login = () => {
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate("/register");
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <img
          src="/logo-compensar.png"
          alt="Compensar"
          className="logo"
        />

        <div className="welcome-content">
          <h1>Bienvenido</h1>
          <p className="subtitle">Ingresa y disfruta</p>

          <p className="register-text">
            Si aún no tienes una cuenta<br />
            puedes <span className="register-link" onClick={handleRegisterClick}>Registrarte aquí</span>
          </p>
        </div>

        <img
          src="/illustration.png"
          alt="Ilustración"
          className="illustration"
        />
      </div>

      <div className="login-right">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;