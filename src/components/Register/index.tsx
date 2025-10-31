import React, { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { AlertCircle } from "lucide-react";
import "./Register.css";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // Registration
      if (!formData.name || !formData.email || !formData.password) {
        setErrorMessage("Todos os campos são obrigatórios");
        setIsSubmitting(false);
        return;
      }

      const user = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      if (user) {
        navigate("/dashboard");
      } else {
        setErrorMessage("Este email já está em uso");
      }
    } catch (error) {
      setErrorMessage("Ocorreu um erro. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-container">
      <img
        src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExdGN5Z2JqYTVuNGx5b2FxcHk0dWg1ZGJ5cW02b3psM2Q2cWlpcXE1NCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26hirJIfLazHxrInC/giphy.gif"
        alt="Background Register"
        className="register-background"
      />
      <div className="upper-layer">
        <div className="inner-container">
          <h1 className="text-center">Bem vindo ao OrganizaAí</h1>
          <div className="register-header">
            <h2>Cadastre-se</h2>
            <p className="login-link">
              Já tem uma conta? <a href="/">Entrar</a>
            </p>
          </div>
              
          {errorMessage && (
            <div className="error-message">
              <AlertCircle size={16} />
              <p>{errorMessage}</p>
            </div>
          )}

          <div className="form-container">
            <form className="form-register" onSubmit={handleSubmit}>
              <label className="label-register">Nome</label>
              <input
                className="input-register"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Seu nome completo"
                required
              />
              
              <label className="label-register">E-mail</label>
              <input
                className="input-register"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="seu@email.com"
                required
              />
              
              <label className="label-register">Senha</label>
              <input
                className="input-register"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Senha"
                required
              />

              <button
                className="register-button"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Cadastrando..." : "Cadastrar"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;