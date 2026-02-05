import { useNavigate } from "react-router-dom";
import RegisterForm from "../components/RegisterForm";
import "../styles/register.css";

const Register = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <div className="register-page">
      <div className="register-left">
        <img
          src="/logo-compensar.png"
          alt="Compensar"
          className="logo"
        />

        <div className="welcome-content">
          <h1>Regístrate</h1>
          <p className="subtitle">Te invitamos a crear tu cuenta</p>
          <p className="login-text">Si ya tienes una cuenta</p>
          <p className="login-text">
            puedes <span className="login-link" onClick={handleLoginClick}>Iniciar sesión aquí !</span>
          </p>
        </div>

        <img
          src="/illustration.png"
          alt="Ilustración"
          className="illustration"
        />
      </div>

      <div className="register-right">
        <RegisterForm />
      </div>
    </div>
  );
};

export default Register;