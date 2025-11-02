import React, { useEffect, useState } from "react";
import { buildApiUrl } from '../config/api';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No autenticado");
      return;
    }
  fetch(buildApiUrl('api/users/profile'), {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data && !data.message) {
          setProfile(data);
        } else {
          setError(data.message || "No se pudo obtener el perfil");
        }
      })
      .catch(() => setError("Error de conexión con el servidor"));
  }, []);

  if (error) return <section><h2>Perfil</h2><p style={{color:'red'}}>{error}</p></section>;
  if (!profile) return <section><h2>Perfil</h2><p>Cargando...</p></section>;

  return (
    <section>
      <h2>Perfil</h2>
      <pre>{JSON.stringify(profile, null, 2)}</pre>
    </section>
  );
}
