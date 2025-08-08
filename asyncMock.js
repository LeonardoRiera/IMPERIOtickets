const eventos = [

  { 
    id: 1,
    idProductor: 101,
    nombre: "Soplafortune en Vivo",
    ticketsVendidos: 120,
    totalVentas: 850000,
    ticketsDiarios: 40,
    ventasDelDia: 250000

  },

  { 
    id: 2,
    idProductor: 101,
    nombre: "Bohemios",
    ticketsVendidos: 100,
    totalVentas: 450000,
    ticketsDiarios: 30,
    ventasDelDia: 150000

  },

  { 
    id: 3,
    idProductor: 102,
    nombre: "Ange y los Productores",
    ticketsVendidos: 30,
    totalVentas: 50000,
    ticketsDiarios: 10,
    ventasDelDia: 50000

  }


]

// Simula obtener los eventos del productor logueado (por ahora hardcodeamos el id)

export const getEventoPorProductor = (idProductor) => {
  return new Promise ((resolve, reject) => {
    setTimeout(() => {
      const eventosFiltrados = eventos.filter(ev => ev.idProductor === idProductor);
      resolve(eventosFiltrados);
    }, 3000);
  })

}