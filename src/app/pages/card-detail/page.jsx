'use client'
import React, { Suspense, useState, useEffect } from 'react';
import EntradasCount from '../../Components/EntradasCount/EntradasCount';
import { useRouter, useSearchParams } from 'next/navigation';
import './CardDetail.css';
import Link from 'next/link';

// Componente que usa useSearchParams
const CardDetailContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  React.useEffect(() => {
    if (!router) {
      return router.back();
    }
  }, [router]);

  const [count, setCount] = useState(1);
  const [total, setTotal] = useState(0);
  const [imageDetail, setImageDetail] = React.useState(null);
  const [title, setTitle] = React.useState('');
  const [price, setPrice] = React.useState(0);
  const [dia, setDia] = React.useState('');
  const [fecha, setFecha] = React.useState(0);
  const [hora, setHora] = React.useState(0);
  const [lugar, setLugar] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [clasificacion, setClasificacion] = React.useState('');

  React.useEffect(() => {
    setImageDetail(searchParams.get('imageDetail'));
    setTitle(searchParams.get('title'));
    setPrice(searchParams.get('price'));
    setDia(searchParams.get('dia'));
    setFecha(searchParams.get('fecha'));
    setHora(searchParams.get('hora'));
    setLugar(searchParams.get('lugar'));
    setDescription(searchParams.get('description'));
    setClasificacion(searchParams.get('clasificacion'));
  }, [searchParams]);

  const increment = () => {
    if (count > 0) {
      setCount(count + 1);
    }
  };

  const decrement = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  useEffect(() => {
    const newTotal = price * count;
    setTotal(newTotal);
  }, [price, count]);

  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    validarCorreos(e.target.value, confirmEmail);
  };

  const handleConfirmEmailChange = (e) => {
    setConfirmEmail(e.target.value);
    validarCorreos(email, e.target.value);
  };

  const validarCorreos = (email1, email2) => {
    if (email1 === email2 && email1 !== '') {
      setIsButtonDisabled(false);
      setErrorMessage('');
    } else if (email2 === '') {
      setIsButtonDisabled(true);
    } else {
      setIsButtonDisabled(true);
      setErrorMessage('Los correos electrónicos no coinciden.');
    }
  };

  return (
    <div className='DetailContainer'>
      {/* ... (resto del código del componente) ... */}
    </div>
  );
};

// Componente principal que envuelve CardDetailContent en Suspense
const CardDetail = () => {
  return (
    <Suspense fallback={<div>Cargando Detalles...</div>}>
      <CardDetailContent />
    </Suspense>
  );
};

export default CardDetail;