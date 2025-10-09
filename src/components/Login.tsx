import React, { useState } from "react";



function Login(){

  const [active, setActive] = useState<"login" | "signup">("login");


  return (
    
    <div className="login-container">
      <img
      src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcGw2OTBqZXB5YzJlZDBranJxb2VneTltNHIycDNqaXF1N3E3em8yZiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/r1IMdmkhUcpzy/giphy.gif"
      alt="Background Login"
      className="login-background"
      />
      <div className="min-h-screen animate-fade-in">
        <div className="container-responsive">
          <div className="upper-layer">
            <div className="inner-container">
              <h1 className="text-center">Bem vindo ao OrganizaAí</h1>
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
            
              {/*Formulário*/}

              </div>
              <div className="form-container">
                {active === "login" ? (
                <form className="form-login">
                    <label className="label-login">E-mail</label>
                    <input 
                    className="input-login" 
                    type="text" 
                    name="email" 
                    placeholder="seunome@gmail.com" />
                    <label className="label-login">Senha</label>
                    <input 
                    className="input-login" 
                    type="password" 
                    name="pass" 
                    placeholder="Senha" />

                    <button className="next-action-button">Entrar</button>                    
                </form>
                ) : (
                <form className="form-login">
                    <label className="label-login">Nome</label>
                    <input 
                    className="input-login" 
                    type="text" 
                    name="name" 
                    placeholder="Seu nome" />
                    <label className="label-login">E-mail</label>
                    <input 
                    className="input-login" 
                    type="text" 
                    name="email" 
                    placeholder="seuemail@gmail.com" />
                    <label className="label-login">Senha</label>
                    <input 
                    className="input-login" 
                    type="password" 
                    name="pass" 
                    placeholder="Senha" />

                    <button className="next-action-button">Cadastrar</button>    
                                    
                </form>                  
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;