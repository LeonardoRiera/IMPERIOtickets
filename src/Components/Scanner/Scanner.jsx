import React from "react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";

function Scanner() {
  const [data, setData] = React.useState("Not Found");

  return (
    <>
    <h1>Escaneáte el QR Papu</h1>
      <BarcodeScannerComponent
        width={500}
        height={500}
        onUpdate={(err, result) => {
          if (result) setData(result.text);
          else setData("Not Found");
        }}
      />
    </>
  );
}

export default Scanner;