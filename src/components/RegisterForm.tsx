import { useState } from "react";
import Input from "./Input";
import SocialLogin from "./SocialLogin";

const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fontSize, setFontSize] = useState("normal"); // normal, large, xlarge
  
  // Estados para errores
  const [emailError, setEmailError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  // Función para cambiar tamaño de fuente
  const handleFontSizeChange = () => {
    if (fontSize === "normal") {
      setFontSize("large");
      document.documentElement.setAttribute("data-font-size", "large");
    } else if (fontSize === "large") {
      setFontSize("xlarge");
      document.documentElement.setAttribute("data-font-size", "xlarge");
    } else {
      setFontSize("normal");
      document.documentElement.setAttribute("data-font-size", "normal");
    }
  };

  // Validación de email en tiempo real
  const validateEmailRealTime = (email: string) => {
    if (email && !email.includes('@gmail.com')) {
      setEmailError("Debe ser un correo de Gmail válido (@gmail.com)");
    } else if (email && !email.match(/^[^\s@]+@gmail\.com$/)) {
      setEmailError("Formato de correo inválido");
    } else {
      setEmailError("");
    }
  };

  // Validación de email final
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@gmail\.com$/;
    if (!email) {
      setEmailError("⚠️ El email es obligatorio");
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError("Debe ser un correo de Gmail válido (@gmail.com)");
      return false;
    }
    setEmailError("");
    return true;
  };

  // Validación de username
  const validateUsername = (username: string): boolean => {
    if (!username) {
      setUsernameError("⚠️ El nombre de usuario es obligatorio");
      return false;
    }
    if (username.length < 3) {
      setUsernameError("Debe tener al menos 3 caracteres");
      return false;
    }
    setUsernameError("");
    return true;
  };

  // Validación de número de celular (Colombia - 10 dígitos)
  const validatePhone = (phone: string): boolean => {
    if (!phone) {
      setPhoneError("⚠️ El número de celular es obligatorio");
      return false;
    }
    if (phone.length !== 10) {
      setPhoneError("El número debe tener exactamente 10 dígitos");
      return false;
    }
    if (!/^[0-9]{10}$/.test(phone)) {
      setPhoneError("Solo se permiten números");
      return false;
    }
    setPhoneError("");
    return true;
  };

  // Validación de contraseña
  const validatePassword = (password: string): boolean => {
    if (!password) {
      setPasswordError("⚠️ La contraseña es obligatoria");
      return false;
    }
    if (password.length < 8) {
      setPasswordError("La contraseña debe tener al menos 8 caracteres");
      return false;
    }
    
    if (!/[A-Z]/.test(password)) {
      setPasswordError("Debe contener al menos una letra mayúscula");
      return false;
    }
    
    if (!/[a-z]/.test(password)) {
      setPasswordError("Debe contener al menos una letra minúscula");
      return false;
    }
    
    if (!/[0-9]/.test(password)) {
      setPasswordError("Debe contener al menos un número");
      return false;
    }
    
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      setPasswordError("Debe contener al menos un carácter especial (!@#$%^&*)");
      return false;
    }
    
    setPasswordError("");
    return true;
  };

  // Validación de confirmación de contraseña en tiempo real
  const validateConfirmPasswordRealTime = (confirmPass: string) => {
    if (confirmPass && confirmPass !== password) {
      setConfirmPasswordError("Las contraseñas no coinciden");
    } else if (confirmPass && confirmPass === password) {
      setConfirmPasswordError("");
    }
  };

  // Validación de confirmación de contraseña final
  const validateConfirmPassword = (confirmPass: string): boolean => {
    if (!confirmPass) {
      setConfirmPasswordError("⚠️ Debes confirmar tu contraseña");
      return false;
    }
    if (confirmPass !== password) {
      setConfirmPasswordError("Las contraseñas no coinciden");
      return false;
    }
    setConfirmPasswordError("");
    return true;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    validateEmailRealTime(value);
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);
    if (usernameError && value.length > 0) {
      if (value.length >= 3) {
        setUsernameError("");
      }
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Solo permitir números y limitar a 10 dígitos
    const numericValue = value.replace(/[^0-9]/g, '').slice(0, 10);
    setPhone(numericValue);
    if (phoneError && numericValue.length > 0) {
      if (numericValue.length === 10) {
        setPhoneError("");
      }
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    if (passwordError) validatePassword(value);
    // Revalidar confirmación si ya hay algo escrito
    if (confirmPassword) validateConfirmPasswordRealTime(confirmPassword);
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);
    validateConfirmPasswordRealTime(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validar todos los campos
    const isEmailValid = validateEmail(email);
    const isUsernameValid = validateUsername(username);
    const isPhoneValid = validatePhone(phone);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);

    // Si algún campo es inválido, mostrar mensaje general
    if (!isEmailValid || !isUsernameValid || !isPhoneValid || !isPasswordValid || !isConfirmPasswordValid) {
      // Crear lista de campos vacíos
      const emptyFields = [];
      if (!email) emptyFields.push("Email");
      if (!username) emptyFields.push("Nombre de usuario");
      if (!phone) emptyFields.push("Número de celular");
      if (!password) emptyFields.push("Contraseña");
      if (!confirmPassword) emptyFields.push("Confirmar contraseña");

      if (emptyFields.length > 0) {
        alert(`⚠️ Por favor completa los siguientes campos obligatorios:\n\n${emptyFields.join('\n')}`);
      }
      return;
    }

    console.log({ email, username, phone, password, confirmPassword });
    alert("¡Registro exitoso! ✓");
  };

  return (
    <>
      {/* Botón de accesibilidad */}
      <button 
        type="button"
        className="accessibility-btn" 
        onClick={handleFontSizeChange}
        title="Ajustar tamaño de texto"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 7V4h16v3M9 20h6M12 4v16"/>
        </svg>
        {fontSize === "normal" && "A"}
        {fontSize === "large" && "A+"}
        {fontSize === "xlarge" && "A++"}
      </button>

      <form className="register-form" onSubmit={handleSubmit}>
        <h2 className="register-title">Registro</h2>

        <div className="form-group">
          <label className="input-label">
            Email <span className="required-indicator">*</span>
          </label>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
          />
          {emailError && <span className="error-message">{emailError}</span>}
          {!emailError && email && email.includes('@gmail.com') && email.match(/^[^\s@]+@gmail\.com$/) && (
            <span className="success-message">✓ Correo válido</span>
          )}
        </div>

        <div className="form-group">
          <label className="input-label">
            Nombre de usuario <span className="required-indicator">*</span>
          </label>
          <Input
            type="text"
            placeholder="Nombre de usuario"
            value={username}
            onChange={handleUsernameChange}
          />
          {usernameError && <span className="error-message">{usernameError}</span>}
          {!usernameError && username && username.length >= 3 && (
            <span className="success-message">✓ Usuario válido</span>
          )}
        </div>

        <div className="form-group">
          <label className="input-label">
            Número de celular <span className="required-indicator">*</span>
          </label>
          <Input
            type="tel"
            placeholder="Número de celular (10 dígitos)"
            value={phone}
            onChange={handlePhoneChange}
          />
          {phoneError && <span className="error-message">{phoneError}</span>}
          {!phoneError && phone.length === 10 && (
            <span className="success-message">✓ Número válido</span>
          )}
        </div>

        <div className="form-group">
          <label className="input-label">
            Contraseña <span className="required-indicator">*</span>
          </label>
          <Input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={handlePasswordChange}
            showPasswordToggle={true}
          />
          {passwordError && <span className="error-message">{passwordError}</span>}
          <div className="password-requirements">
            <p className="requirements-title">La contraseña debe contener:</p>
            <ul className="requirements-list">
              <li className={password.length >= 8 ? "valid" : ""}>Mínimo 8 caracteres</li>
              <li className={/[A-Z]/.test(password) ? "valid" : ""}>Una letra mayúscula</li>
              <li className={/[a-z]/.test(password) ? "valid" : ""}>Una letra minúscula</li>
              <li className={/[0-9]/.test(password) ? "valid" : ""}>Un número</li>
              <li className={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) ? "valid" : ""}>
                Un carácter especial (!@#$%^&*)
              </li>
            </ul>
          </div>
        </div>

        <div className="form-group">
          <label className="input-label">
            Confirmar contraseña <span className="required-indicator">*</span>
          </label>
          <Input
            type="password"
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            showPasswordToggle={true}
          />
          {confirmPasswordError && <span className="error-message">{confirmPasswordError}</span>}
          {!confirmPasswordError && confirmPassword && confirmPassword === password && (
            <span className="success-message">✓ Las contraseñas coinciden</span>
          )}
        </div>

        <button type="submit" className="register-button">
          Registrarte
        </button>

        <SocialLogin />
      </form>
    </>
  );
};

export default RegisterForm;