import React, { useState } from "react";

function Login(){

  const [active, setActive] = useState<"login" | "signup">("login");


  return (
    <div className="login-container">
      <div className="min-h-screen animate-fade-in">
        <div className="container-responsive">
          <div className="upper-layer">
            <div className="inner-container">
              <h1 className="text-center">Bem vindo!</h1>
              <div className="slider-container">

                <div className={`slider-bg ${active === "signup" ? "right" : "left"}`}
                ></div>

                <p className={`slider-option ${active === "login" ? "active" : ""}`}
                  onClick={() => setActive("login")}
                >
                  Entrar
                </p>

                <p className={`slider-option ${active === "signup" ? "active" : ""}`}
                  onClick={() => setActive("signup")}
                >
                  Cadastrar
                </p>
            
              </div>
              <div className="form-container">
                <form className="form-login">
                    <label className="label-login">E-mail</label>
                    <input className="input-login" type="text" name="email" placeholder="seunome@gmail.com" />
                    <label className="label-login">Senha</label>
                    <input className="input-login" type="password" name="pass" placeholder="Senha" />
                    <button className="next-action-button">Entrar</button>                    
                </form>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;