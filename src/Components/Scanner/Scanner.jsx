import React from "react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";

function Scanner() {
  const [data, setData] = React.useState("Not Found");

  const onScan = (err, result) => {

    if (result) {
      console.log(result)
      window.reload()
    }

  }

  return (
    <>
    <h1>Escaneáte el QR Papu</h1>
      <BarcodeScannerComponent
        width={500}
        height={500}
        onUpdate={onScan}
      />
      {data}
    </>
  );
}

export default Scanner;