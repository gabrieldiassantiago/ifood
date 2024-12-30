// components/AdditionsSelector.tsx
import { getAdditions } from '@/app/services/api';
import { Addition } from '@/app/types/order';
import React, { useState, useEffect } from 'react';


interface AdditionsSelectorProps {
  onAddAddition: (addition: Addition) => void;
}

const AdditionsSelector: React.FC<AdditionsSelectorProps> = ({ onAddAddition }) => {
  const [additions, setAdditions] = useState<Addition[]>([]);

  useEffect(() => {
    const fetchAdditions = async () => {
      const response = await getAdditions();
      setAdditions(response.data);
    };

    fetchAdditions();
  }, []);

  return (
    <div className="space-y-2">
      {additions.map((addition) => (
        <div key={addition.id} className="flex items-center justify-between">
          <span>{addition.name} - R$ {addition.price.toFixed(2)}</span>
          <button
            className="text-blue-600 hover:underline"
            onClick={() => onAddAddition(addition)}
          >
            Adicionar
          </button>
        </div>
      ))}
    </div>
  );
};

export default AdditionsSelector;