'use client'

import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      textAlign: 'center',
      padding: '20px'
    }}>
      <h1 style={{ fontSize: '6rem', margin: '0', color: '#666' }}>404</h1>
      <h2 style={{ color: '#666' }}>Página no encontrada</h2>
      <p style={{ color: '#666' }}>Lo sentimos, la página que buscas no existe.</p>
      <Link href="/" style={{ 
        color: '#FE7247', 
        textDecoration: 'none',
        marginTop: '20px',
        fontWeight: 'bold'
      }}>
        Volver a Inicio
      </Link>
    </div>
  )
}

