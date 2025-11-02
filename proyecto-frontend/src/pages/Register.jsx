import React, { useState } from "react";
import { buildApiUrl } from '../config/api';

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    try {
  const res = await fetch(buildApiUrl('api/users/register'), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Registro exitoso. Ahora puedes iniciar sesión.");
      } else {
        setSuccess(data.message || "No se pudo registrar");
      }
    } catch (err) {
      setSuccess("Error de conexión con el servidor");
    }
  };

  return (
    <section>
      <h2>Registro</h2>
      <form onSubmit={handleSubmit} style={{maxWidth: 320}}>
        <input type="text" placeholder="Nombre" value={name} onChange={e => setName(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit">Registrarse</button>
        {success && <p style={{color: 'green'}}>{success}</p>}
      </form>
    </section>
  );
}
