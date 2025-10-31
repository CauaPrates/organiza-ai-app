import React, { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { AlertCircle } from "lucide-react";
import "./Login.css";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const { login } = useAuth();
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
      const user = await login({
        email: formData.email,
        password: formData.password
      });
      
      if (user) {
        navigate("/dashboard");
      } else {
        setErrorMessage("Email ou senha inválidos");
      }
    } catch (error) {
      setErrorMessage("Ocorreu um erro. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <img
        src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExdGN5Z2JqYTVuNGx5b2FxcHk0dWg1ZGJ5cW02b3psM2Q2cWlpcXE1NCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26hirJIfLazHxrInC/giphy.gif"
        alt="Background Login"
        className="login-background"
      />
      <div className="upper-layer">
            <div className="inner-container">
              <h1 className="text-center">Bem vindo ao OrganizaAí</h1>
              <div className="login-header">
                <h2>Entrar</h2>
              </div>
              
              {errorMessage && (
                <div className="error-message">
                  <AlertCircle size={16} />
                  <span>{errorMessage}</span>
                </div>
              )}
              
              <div className="form-container">
                <form className="form-login" onSubmit={handleSubmit}>
                    <label className="label-login">E-mail</label>
                    <input
                      className="input-login"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="seunome@gmail.com"
                      required
                    />
                    <label className="label-login">Senha</label>
                    <input
                      className="input-login"
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Senha"
                      required
                    />

                    <button 
                      className="next-action-button" 
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Entrando..." : "Entrar"}
                    </button>
                  </form>
                </div>
            </div>
          </div>
    </div>
  );
}

export default Login;
