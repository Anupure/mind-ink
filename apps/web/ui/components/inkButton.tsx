import React, { useState, useRef } from 'react';

interface InkDropProps {
  top: number;
  left: number;
}

const InkDrop: React.FC<InkDropProps> = ({ top, left }) => {
  return (
    <div 
      className="absolute rounded-full animate-ink-splash"
      style={{
        top: `${top}px`,
        left: `${left}px`,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        width: '10px',
        height: '10px',
        transform: 'scale(0)',
      }}
    />
  );
};

interface InkButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
}

export const InkButton: React.FC<InkButtonProps> = ({ 
  children, 
  onClick, 
  className = '',
  variant = 'primary'
}) => {
  const [inkDrops, setInkDrops] = useState<{ id: number; top: number; left: number }[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  const variantClasses = {
    primary: 'bg-black text-white hover:bg-black/90',
    secondary: 'bg-white text-black border border-black hover:bg-gray-50',
    outline: 'bg-transparent text-black border border-black hover:bg-gray-50'
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = buttonRef.current;
    if (!button) return;
    
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Create 3-5 random ink drops around the click point
    const newDrops = Array.from({ length: Math.floor(Math.random() * 3) + 3 }, (_, i) => ({
      id: Date.now() + i,
      top: y + (Math.random() * 20 - 10),
      left: x + (Math.random() * 20 - 10)
    }));
    
    setInkDrops(prev => [...prev, ...newDrops]);
    
    // Remove ink drops after animation
    setTimeout(() => {
      setInkDrops(prev => prev.filter(drop => !newDrops.find(newDrop => newDrop.id === drop.id)));
    }, 1000);
    
    if (onClick) onClick();
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      className={`relative overflow-hidden px-6 py-3 rounded-md transition-colors duration-300 font-medium ${variantClasses[variant]} ${className}`}
    >
      {children}
      {inkDrops.map(drop => (
        <InkDrop key={drop.id} top={drop.top} left={drop.left} />
      ))}
    </button>
  );
};
