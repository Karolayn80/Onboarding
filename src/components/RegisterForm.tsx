import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "./Input";
import SocialLogin from "./SocialLogin";
import Modal from "./Modal";
import SuccessModal from "./SuccessModal";
import { registerUser } from "../services/apiService";

const RegisterForm = () => {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fontSize, setFontSize] = useState("normal");
  
  // Estados para errores
  const [emailError, setEmailError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  // Estados para los modales
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  // Validación de username con límite de 20 caracteres
  const validateUsername = (username: string): boolean => {
    if (!username) {
      setUsernameError("⚠️ El nombre de usuario es obligatorio");
      return false;
    }
    if (username.length < 3) {
      setUsernameError("Debe tener al menos 3 caracteres");
      return false;
    }
    if (username.length > 20) {
      setUsernameError("Máximo 20 caracteres");
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
    const limitedValue = value.slice(0, 20);
    setUsername(limitedValue);
    
    if (usernameError || limitedValue.length > 0) {
      validateUsername(limitedValue);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
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

    // Si algún campo es inválido, no continuar
    if (!isEmailValid || !isUsernameValid || !isPhoneValid || !isPasswordValid || !isConfirmPasswordValid) {
      return;
    }

    // ✅ Si todos los campos son válidos, abrir el modal de confirmación
    setShowModal(true);
  };

  // Función para confirmar el registro desde el modal
  const handleConfirmRegistration = async () => {
    setIsLoading(true);

    try {
      // Llamar a la API de registro
      const response = await registerUser({
        email,
        username,
        phone,
        password,
      });

      if (response.success) {
        setIsLoading(false);
        setShowModal(false);
        
        // ✅ Mostrar modal de éxito en lugar de alert
        setShowSuccessModal(true);
      } else {
        setIsLoading(false);
        setShowModal(false);
        alert(`❌ Error en el registro:\n\n${response.error || 'Por favor intenta de nuevo.'}`);
      }
    } catch (error) {
      console.error('Error en el registro:', error);
      setIsLoading(false);
      setShowModal(false);
      alert("❌ Hubo un error en el registro. Por favor intenta de nuevo.");
    }
  };

  // Función para cerrar el modal de confirmación
  const handleCloseModal = () => {
    if (!isLoading) {
      setShowModal(false);
    }
  };

  // Función para cerrar el modal de éxito y redirigir al login
  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    navigate("/login");
  };

  return (
    <>
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
            placeholder="Nombre de usuario (máx. 20 caracteres)"
            value={username}
            onChange={handleUsernameChange}
          />
          <span className="character-count">{username.length}/20</span>
          {usernameError && <span className="error-message">{usernameError}</span>}
          {!usernameError && username && username.length >= 3 && username.length <= 20 && (
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

      {/* Modal de confirmación */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmRegistration}
        title="Confirmar Registro"
        message="Por favor verifica que tus datos sean correctos antes de continuar:"
        userData={{
          email,
          username,
          phone,
        }}
        isLoading={isLoading}
      />

      {/* Modal de éxito */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleCloseSuccessModal}
        title="¡Registro Exitoso!"
        message="Tu cuenta ha sido creada correctamente. Ahora puedes iniciar sesión con tu cuenta."
        buttonText="Ir a Iniciar Sesión"
      />
    </>
  );
};

export default RegisterForm;