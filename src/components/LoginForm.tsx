import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "./Input";
import SocialLogin from "./SocialLogin";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ email, password });
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/change-password");
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h2 className="login-title">Iniciar sesión</h2>

      <div className="form-group">
        <label className="input-label">Email o nombre de usuario</label>
        <Input
          type="text"
          placeholder="Email o nombre de usuario"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
        />
      </div>

      <a href="#" className="forgot-password" onClick={handleForgotPassword}>
        ¿Olvidó su contraseña?
      </a>

      <button type="submit" className="login-button">
        Iniciar sesión
      </button>

      <SocialLogin />
    </form>
  );
};

export default LoginForm;