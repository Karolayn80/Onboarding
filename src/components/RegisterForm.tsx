import { useState } from "react";
import Input from "./Input";
import SocialLogin from "./SocialLogin";

const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ email, username, phone, password, confirmPassword });
  };

  return (
    <form className="register-form" onSubmit={handleSubmit}>
      <h2 className="register-title">Registro</h2>

      <div className="form-group">
        <label className="input-label">Email</label>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="input-label">Nombre de usuario</label>
        <Input
          type="text"
          placeholder="Nombre de usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="input-label">Número de celular</label>
        <Input
          type="tel"
          placeholder="Número de celular"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
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

      <div className="form-group">
        <label className="input-label">Confirmar contraseña</label>
        <Input
          type="password"
          placeholder="Confirmar contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          showPasswordToggle={true}
        />
      </div>

      <button type="submit" className="register-button">
        Registrarte
      </button>

      <SocialLogin />
    </form>
  );
};

export default RegisterForm;