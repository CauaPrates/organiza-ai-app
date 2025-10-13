import React, { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { AlertCircle } from "lucide-react";
import "./Login.css";

function Login() {
  const [active, setActive] = useState<"login" | "signup">("login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const { login, register } = useAuth();
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
      if (active === "login") {
        const user = await login({
          email: formData.email,
          password: formData.password
        });
        
        if (user) {
          navigate("/dashboard");
        } else {
          setErrorMessage("Email ou senha inválidos");
        }
      } else {
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
        src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcGw2OTBqZXB5YzJlZDBranJxb2VneTltNHIycDNqaXF1N3E3em8yZiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/r1IMdmkhUcpzy/giphy.gif"
        alt="Background Login"
        className="login-background"
      />
      <div className="upper-layer">
            <div className="inner-container">
              <h1 className="text-center">Bem vindo ao OrganizaAí</h1>
              <div className="slider-container">
                <div
                  className={`slider-bg ${active === "signup" ? "right" : "left"}`}
                ></div>

                <p
                  className={`slider-option ${active === "login" ? "active" : ""}`}
                  onClick={() => setActive("login")}
                >
                  Entrar
                </p>

                <p
                  className={`slider-option ${active === "signup" ? "active" : ""}`}
                  onClick={() => setActive("signup")}
                >
                  Cadastrar
                </p>
              </div>
              
              {errorMessage && (
                <div className="error-message">
                  <AlertCircle size={16} />
                  <span>{errorMessage}</span>
                </div>
              )}
              
              <div className="form-container">
                {active === "login" ? (
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
                ) : (
                  <form className="form-login" onSubmit={handleSubmit}>
                    <label className="label-login">Nome</label>
                    <input
                      className="input-login"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Seu nome"
                      required
                    />
                    <label className="label-login">E-mail</label>
                    <input
                      className="input-login"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="seuemail@gmail.com"
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
                      {isSubmitting ? "Cadastrando..." : "Cadastrar"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
    </div>
  );
}

export default Login;