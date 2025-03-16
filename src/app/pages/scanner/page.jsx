'use client'
import React from "react";
import './Scanner.scss'
import {Html5QrcodeScanner} from "html5-qrcode"


function Scanner() {

  React.useEffect(() => {

    const scanner = new Html5QrcodeScanner('reader', {
      qrbox:{
        width: 250,
        height: 250
      },
      fps: 5
    })

    scanner.render(onScan)


    function onScan (err, result) {

      scanner.clear()

      if (result) {
        window.reload()
        setData(result)
      }

    }
  }, [])
  const [data, setData] = React.useState("Escanea tu entrada");


  return (
    <>
      <h1>Escaneáte el QR Papu</h1>

      <div id='reader'></div>

      {data}
    </>
  );
}

export default Scanner;