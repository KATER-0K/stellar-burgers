import React from 'react';
import { useParams } from 'react-router-dom';
import { OrderInfo } from '../order-info';

export const OrderDetailsModal: React.FC = () => {
  const { number } = useParams<{ number: string }>();

  return (
    <div>
      <OrderInfo />
    </div>
  );
};
