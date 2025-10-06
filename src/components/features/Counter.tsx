import React from 'react';
import { useLocalStorage } from '../../hooks';
import Button from '../ui/Button';
import Card from '../ui/Card';

interface CounterProps {
  initialValue?: number;
  step?: number;
  persistKey?: string;
}

const Counter: React.FC<CounterProps> = ({
  initialValue = 0,
  step = 1,
  persistKey = 'counter-value',
}) => {
  const [count, setCount] = useLocalStorage(persistKey, initialValue);

  const increment = () => setCount(prev => prev + step);
  const decrement = () => setCount(prev => prev - step);
  const reset = () => setCount(initialValue);

  return (
    <Card 
      title="Contador" 
      subtitle="Exemplo de componente modular com persistência"
      className="max-w-md mx-auto"
    >
      <div className="text-center">
        <div className="text-4xl font-bold text-blue-600 mb-6">
          {count}
        </div>
        
        <div className="flex gap-3 justify-center mb-4">
          <Button 
            variant="secondary" 
            onClick={decrement}
            size="small"
          >
            -
          </Button>
          
          <Button 
            variant="primary" 
            onClick={increment}
            size="small"
          >
            +
          </Button>
        </div>
        
        <Button 
          variant="danger" 
          onClick={reset}
          size="small"
        >
          Reset
        </Button>
        
        <p className="text-sm text-gray-500 mt-4">
          Valor persistido no localStorage
        </p>
      </div>
    </Card>
  );
};

export default Counter;