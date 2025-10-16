import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const [logged, setLogged] = useState(!!localStorage.getItem("token"));
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setLogged(!!localStorage.getItem("token"));
    // Escucha cambios en otras pestañas
    function syncLogin() {
      setLogged(!!localStorage.getItem("token"));
    }
    window.addEventListener("storage", syncLogin);
    return () => window.removeEventListener("storage", syncLogin);
  }, []);

  useEffect(() => {
    // Actualiza el estado cada vez que cambia la ruta
    setLogged(!!localStorage.getItem("token"));
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLogged(false);
    navigate("/login");
  };

  return (
    <nav style={{display: 'flex', gap: 16, justifyContent: 'center', margin: '1rem 0'}}>
      <Link to="/">Inicio</Link>
      <Link to="/contact">Contacto</Link>
      {logged ? (
        <>
          <Link to="/profile">Perfil</Link>
          <button onClick={handleLogout} style={{background:'none',border:'none',color:'#007bff',cursor:'pointer',padding:0}}>Cerrar sesión</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Registro</Link>
        </>
      )}
    </nav>
  );
}
