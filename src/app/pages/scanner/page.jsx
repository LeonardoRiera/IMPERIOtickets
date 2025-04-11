'use client'
import React from "react";
import './Scanner.scss'
import {Html5QrcodeScanner} from "html5-qrcode"

export default function Scanner() {
  const [scanResult, setScanResult] = React.useState("Escanea tu entrada");
  const scannerRef = React.useRef(null);

  React.useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: {
        width: 250,
        height: 250
      },
      fps: 160
    });

    const onScanSuccess = (result) => {
      console.log(result)
      scanner.stop();  // Detener el scanner al detectar QR
      setScanResult(result);
    };

    const onScanError = (error) => {

      console.warn("Error al escanear:", error);
    };

    scanner.render(onScanSuccess, onScanError);
    scannerRef.current = scanner;

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(error => {
          console.log("Error al limpiar scanner:", error);
        });
      }
    };
  }, []);

  return (
    <div className="scanner-container">
      <h1>Escaneá el QR</h1>
      {scanResult === "Escanea tu entrada" ? (
        <div id="reader"></div>
      ) : (
        <div>
          <p className="resultado">Entrada válida:</p>
          <p className="resultado-datos">{scanResult}</p>
        </div>
      )}
    </div>
  );
}