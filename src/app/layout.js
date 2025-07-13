// External Modules
import { Geist, Geist_Mono, Bebas_Neue, Poppins } from "next/font/google";
import "./styles/globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config, library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { faBars } from "@fortawesome/free-solid-svg-icons"; // Importar el icono específico
import { Toaster } from 'react-hot-toast';

// Internal Modules
import Header from "./_components/Header/Header";
import Footer from "./_components/Footer/Footer";

// Añadir iconos a la librería
library.add(fab, faBars); // Añadir solo el icono "bars" y los iconos de marcas

// Evitar que Font Awesome añada automáticamente su CSS
config.autoAddCss = false;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: '400'
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: '200'
});

export const metadata = {
  title: "Imperio Tickets",
  description: "Comprá tus entradas online en segundos. Con Imperio Tickets accedé fácil, rápido y seguro a los mejores eventos de tu ciudad.",
  icons: {
    icon: "/favicon.ico",
  },

};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body id="body" style={{ overflow: 'hidden' }} className={`${geistSans.variable} ${geistMono.variable}`}>
        <main>
          <Header />
          {children}
          
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#ffffffff", 
                zIndex: 99999,         
                color: "#000",                   
                fontFamily: '"Bebas Neue", sans-serif',
                fontSize: "1.1rem",
                borderRadius: "5px",
                padding: "10px 16px",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.25)",
                marginTop: "5rem",                
              },
            }}
          />
          <Footer />
        </main>
      </body>
    </html>
  );
}