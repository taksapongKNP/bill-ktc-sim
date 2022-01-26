import React from 'react';
import { Lottie } from '@alfonmga/react-lottie-light-ts';
import animationData from './loading.json';

export const Lotties: React.FC<any> = () => {
  return (
    <div
      style={{
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Lottie config={{ animationData: animationData }} height={'500px'} width={'500px'}></Lottie>
    </div>
  );
};
