import { useState } from "react";
import Input from "./Input";
import SocialLogin from "./SocialLogin";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ email, password });
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h2>Iniciar sesión</h2>

      <Input
        type="text"
        placeholder="Email o nombre de usuario"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <Input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="login-button">Iniciar sesión</button>

      <p className="forgot">Olvidé mi contraseña</p>

      <SocialLogin />
    </form>
  );
};

export default LoginForm;
