import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        navigate("/profile");
      } else {
        setError(data.message || "Credenciales incorrectas");
      }
    } catch (err) {
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <section>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit} style={{maxWidth: 320}}>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit">Entrar</button>
        {error && <p style={{color: 'red'}}>{error}</p>}
      </form>
    </section>
  );
}
