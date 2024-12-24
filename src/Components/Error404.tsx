import React from 'react';

interface Error404Props {
  rutaNoEncontrada: string;
}

const Error404: React.FC<Error404Props> = ({ rutaNoEncontrada }) => {
  return (
    <div>
      <h1>Página no encontrada</h1>
      <p>La ruta '{rutaNoEncontrada}' no pudo ser encontrada.</p>
    </div>
  );
};

export default Error404;