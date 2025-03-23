// Fix for packages/ui/components/InkLink.tsx
import React, { useState } from 'react';
import Link from 'next/link';

interface InkLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export const InkLink: React.FC<InkLinkProps> = ({ href, children, className = '' }) => {
  const [inkActive, setInkActive] = useState(false);

  const handleClick = () => {
    setInkActive(true);
    setTimeout(() => setInkActive(false), 500);
  };

  return (
    <Link 
      href={href}
      className={`relative inline-block ${className}`}
      onClick={handleClick}
    >
      <span className="relative z-10">{children}</span>
      {inkActive && (
        <span 
          className="absolute inset-0 bg-black/10 rounded animate-ink-spread"
          style={{ transform: 'scale(0.5)', opacity: 0 }}
        />
      )}
    </Link>
  );
};