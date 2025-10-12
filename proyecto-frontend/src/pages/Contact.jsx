import React, { useState } from "react";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    try {
      const res = await fetch("http://localhost:3000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Mensaje enviado correctamente.");
        setName(""); setEmail(""); setMessage("");
      } else {
        setError(data.message || "No se pudo enviar el mensaje");
      }
    } catch (err) {
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <section>
      <h2>Contacto</h2>
      <form onSubmit={handleSubmit} style={{maxWidth: 400}}>
        <input type="text" placeholder="Nombre" value={name} onChange={e => setName(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <textarea placeholder="Mensaje" value={message} onChange={e => setMessage(e.target.value)} required rows={5} />
        <button type="submit">Enviar</button>
        {success && <p style={{color: 'green'}}>{success}</p>}
        {error && <p style={{color: 'red'}}>{error}</p>}
      </form>
    </section>
  );
}
