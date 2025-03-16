'use client'

import dynamic from 'next/dynamic'

const AccesoProd = dynamic(() => import('./AccesoProductores'), {
  ssr: false
})

export default function ClientPage() {
  return <AccesoProd />
}

