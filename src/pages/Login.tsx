import LoginForm from "../components/LoginForm";
import "../styles/login.css";

const Login = () => {
  return (
    <div className="login-page">
      {/* Columna izquierda */}
      <div className="login-left">
        <img
          src="/logo-compensar.png"
          alt="Compensar"
          className="logo"
        />

        <h1>Bienvenido</h1>
        <p className="subtitle">Ingresa y disfruta</p>

        <p className="register-text">
          Si aún no tienes una cuenta <br />
          puedes <span>Registrarte aquí</span>
        </p>

        <img
          src="/illustration.png"
          alt="Ilustración"
          className="illustration"
        />
      </div>

      {/* Columna derecha */}
      <div className="login-right">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
