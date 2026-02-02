import { useState } from "react";

interface PasswordInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PasswordInput = ({ value, onChange }: PasswordInputProps) => {
  const [show, setShow] = useState(false);

  return (
    <div className="input-wrapper password">
      <input
        type={show ? "text" : "password"}
        placeholder="Contraseña"
        value={value}
        onChange={onChange}
      />

      <span
        className="eye"
        onClick={() => setShow(!show)}
      >
        {show ? "🙈" : "👁️"}
      </span>
    </div>
  );
};

export default PasswordInput;
