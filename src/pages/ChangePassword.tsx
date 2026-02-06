import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import "../styles/ChangePassword.css";

const ChangePassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState<boolean | null>(null);
  const navigate = useNavigate();

  // Validaciones de contraseña
  const hasMinLength = newPassword.length >= 8;
  const hasUpperCase = /[A-Z]/.test(newPassword);
  const hasLowerCase = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

  const allRequirementsMet = hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;

  // Simulación de usuarios registrados
  const registeredEmails = ["usuario@gmail.com", "test@gmail.com", "admin@gmail.com"];

  // Validar formato de email
  const isValidEmailFormat = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isGmailEmail = (email: string) => {
    return email.toLowerCase().endsWith("@gmail.com");
  };

  const handleVerifyUser = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Por favor ingrese su correo electrónico");
      return;
    }

    if (!isValidEmailFormat(email)) {
      setError("Por favor ingrese un correo electrónico válido");
      return;
    }

    if (!isGmailEmail(email)) {
      setError("Solo se permiten correos de Gmail (@gmail.com)");
      return;
    }

    // Verificar si el correo existe
    const emailExists = registeredEmails.includes(email.toLowerCase());

    if (!emailExists) {
      setError("Este correo no está registrado en el sistema");
      return;
    }

    setStep(2);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!newPassword || !confirmPassword) {
      setError("Por favor complete todos los campos");
      return;
    }

    if (!allRequirementsMet) {
      setError("La contraseña no cumple con todos los requisitos");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      setPasswordsMatch(false);
      return;
    }

    try {
      setPasswordsMatch(true);
      setSuccess(true);

      setTimeout(() => {
        navigate("/login");
      }, 2500);
    } catch (err) {
      setError("Error al cambiar la contraseña. Inténtelo de nuevo.");
    }
  };

  const handleCancel = () => {
    navigate("/login");
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    if (value && newPassword) {
      setPasswordsMatch(value === newPassword);
    } else {
      setPasswordsMatch(null);
    }
  };

  // Mostrar advertencia si el email no es Gmail
  const showGmailWarning = email && isValidEmailFormat(email) && !isGmailEmail(email);

  if (success) {
    return (
      <div className="change-password-container">
        <div className="change-password-card">
          <div className="success-message">
            <div className="success-icon">✓</div>
            <h2>Contraseña cambiada correctamente</h2>
            <p>Será redirigido al inicio de sesión...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="change-password-container">
      <div className="change-password-card">
        <div className="change-password-header">
          <h2>Cambiar contraseña</h2>
          <p>{step === 1 ? "Verifique su identidad" : "Ingrese su nueva contraseña"}</p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleVerifyUser} className="change-password-form">
            {error && (
              <div className="error-message">
                <span className="error-icon">⚠</span>
                {error}
              </div>
            )}

            <div className="form-group">
              <label className="input-label">Email *</label>
              <Input
                type="email"
                placeholder="ejemplo@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {showGmailWarning && (
                <div className="warning-message">
                  <span className="warning-icon">⚠</span>
                  Solo se permiten correos de Gmail (@gmail.com)
                </div>
              )}
            </div>

            <div className="button-group">
              <button type="submit" className="change-button">
                Continuar
              </button>
              <button
                type="button"
                className="cancel-button"
                onClick={handleCancel}
              >
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleChangePassword} className="change-password-form">
            {error && (
              <div className="error-message">
                <span className="error-icon">⚠</span>
                {error}
              </div>
            )}

            <div className="user-info">
              <p>Correo: <strong>{email}</strong></p>
            </div>

            <div className="form-group">
              <label className="input-label">Contraseña *</label>
              <Input
                type="password"
                placeholder="Contraseña"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                showPasswordToggle={true}
              />
            </div>

            <div className="password-requirements">
              <p className="requirements-title">La contraseña debe contener:</p>
              <ul>
                <li className={hasMinLength ? "valid" : ""}>
                  Mínimo 8 caracteres
                </li>
                <li className={hasUpperCase ? "valid" : ""}>
                  Una letra mayúscula
                </li>
                <li className={hasLowerCase ? "valid" : ""}>
                  Una letra minúscula
                </li>
                <li className={hasNumber ? "valid" : ""}>
                  Un número
                </li>
                <li className={hasSpecialChar ? "valid" : ""}>
                  Un carácter especial (!@#$%^&*)
                </li>
              </ul>
            </div>

            <div className="form-group">
              <label className="input-label">Confirmar contraseña *</label>
              <Input
                type="password"
                placeholder="Confirmar contraseña"
                value={confirmPassword}
                onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                showPasswordToggle={true}
              />
              {passwordsMatch === true && confirmPassword && (
                <div className="match-message success">
                  ✓ Las contraseñas coinciden
                </div>
              )}
              {passwordsMatch === false && confirmPassword && (
                <div className="match-message error">
                  ✗ Las contraseñas no coinciden
                </div>
              )}
            </div>

            <div className="button-group">
              <button 
                type="submit" 
                className="change-button"
                disabled={!allRequirementsMet || passwordsMatch === false}
              >
                Cambiar contraseña
              </button>
              <button
                type="button"
                className="cancel-button"
                onClick={handleCancel}
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ChangePassword;