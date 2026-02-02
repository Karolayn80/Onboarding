import { useState } from "react";
import Input from "./Input";
import PasswordInput from "./PasswordInput";
import SocialLogin from "./SocialLogin";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch(
      "https://7wmbjxblzi.execute-api.us-east-1.amazonaws.com/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailOrUser: email,
          password,
        }),
      }
    );

    const data = await response.json();
    alert(`Bienvenido ${data.data.user}`);
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h2>Iniciar sesión</h2>

      <Input
        placeholder="Email o nombre de usuario"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <PasswordInput
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <p className="forgot">Olvidé mi contraseña</p>

      <button className="login-btn">Iniciar sesión</button>

      <p className="divider">o continúa con</p>

      <SocialLogin />
    </form>
  );
};

export default LoginForm;
