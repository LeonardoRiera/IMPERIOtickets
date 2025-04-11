'use client'
import React from 'react'
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import './Scanner.scss'
import validateEntryService from '@/app/services/scanner.service';

export default  function Scanner() {

  // Local State
  const [data, setData]             = React.useState('Escaneá la entrada guachin')
  const [loading, setLoading]       = React.useState(false)
  const [stopStream, setStopStream] = React.useState(false)
  const [success, setSuccess]       = React.useState(false)
  const [error, setError]           = React.useState(false)

  // Methods
  const onScan = async (err, result) => {

    setLoading(true)

    if (result) {
  
      const data = await validateEntryService({ entryId: result.text });

      if(data.success) {

        setData('Éxito Total')
        setSuccess(true)
        setStopStream(true)
        setLoading(false)

      } else {

        console.log( err)
        setLoading(false)
        setError(true)
        setStopStream(true)

      }

    } else {
      'Escaneá la entrada guachin'
      setLoading(false)
    }

  }

  const dismissQrReader = () => {
    setStopStream(false)
    window.location.reload()
  }

  return (
    <div id='scanner'>
      <BarcodeScannerComponent
        width={500}
        height={500}
        onUpdate={(err, result) => onScan(err, result)}
        stopStream={stopStream}
      />
      {
        loading ? <div className='spin' /> : 
  
        <div className='container-data'>
          <p className={`${success ? 'success' : ''}`}>{data}</p> {success && <div className="checkmark"></div>}
        </div>

      }

      {
        stopStream && <button onClick={() => dismissQrReader()}>Escanear de nuevo</button>
      }
    </div>
  );
}
