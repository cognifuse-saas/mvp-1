import React from 'react';
import { LucideIcon } from 'lucide-react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`rounded-lg border border-gray-200 bg-white p-6 shadow-sm ${className}`}>
      {children}
    </div>
  );
};

interface CardHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ 
  title, 
  description, 
  icon: Icon,
  className = '' 
}) => {
  return (
    <div className={`flex items-start gap-4 ${className}`}>
      {Icon && (
        <div className="rounded-lg bg-primary/10 p-2">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      )}
      <div className="space-y-1">
        <h3 className="text-lg font-medium text-gray-dark">{title}</h3>
        {description && (
          <p className="text-sm text-gray-dark/70">{description}</p>
        )}
      </div>
    </div>
  );
}; 