import React from "react";

export default function Footer() {
  return (
    <footer style={{background: '#222', color: '#fff', padding: '1rem', textAlign: 'center', marginTop: '2rem'}}>
      <small>&copy; {new Date().getFullYear()} Proyecto</small>
    </footer>
  );
}
