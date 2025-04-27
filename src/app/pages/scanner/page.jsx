// 'use client'
// import React from 'react'
// // import BarcodeScannerComponent from "react-qr-barcode-scanner";
// import './Scanner.scss'
// import validateEntryService from '@/app/services/scanner.service';

// export default  function Scanner() {

//   // Local State
//   const [data, setData]             = React.useState('Escaneá la entrada guachin')
//   const [loading, setLoading]       = React.useState(false)
//   const [stopStream, setStopStream] = React.useState(false)
//   const [success, setSuccess]       = React.useState(false)
//   const [error, setError]           = React.useState(false)

//   // Methods
//   const onScan = async (err, result) => {
//     if (!result || loading) return
    
//     setLoading(true)
    
//     try {
//       const data = await validateEntryService({ entryId: result.text })
      
//       if (data.success) {
//         setData('Éxito Total')
//         setSuccess(true)
//       } else {
//         setData(data.message || 'Error de validación')
//         setError(true)
//       }
      
//       setStopStream(true)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const dismissQrReader = () => {
//     setStopStream(false)
//     setSuccess(false)
//     setError(false)    
//     window.location.reload()
//   }

//   return (
//     <div id='scanner'>
//       <BarcodeScannerComponent
//         key={stopStream ? "off" : "on"}
//         constraints={{
//           video: {
//             facingMode: "environment",
//             focusMode: "continuous",
//             width: { ideal: 4096 },
//             height: { ideal: 2160 }
//           }
//         }}        facingMode="environment" 
//         width={500}
//         height={500}
//         onUpdate={(err, result) => onScan(err, result)}
//         stopStream={stopStream}
//       />
//       {
//         loading ? <div className='spin' /> : 
//         <div className='container-data'>
//           <p className={`${success ? 'success' : ''} ${error ? 'error' : ''}`}>
//             {data}
//           </p>
//           {success && <div className="checkmark"></div>}
//           {error && <div className="crossmark"></div>}
//         </div>
//       }

//       {
//         stopStream && <button onClick={() => dismissQrReader()}>Escanear de nuevo</button>
//       }
//     </div>
//   );
// }
