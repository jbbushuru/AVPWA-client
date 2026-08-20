import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  icon: LucideIcon;
  bgColor?: string;
  borderColor?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  textColor?: string;
  iconColor?: string;
  className?: string;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  text,
  icon: Icon,
  bgColor = 'bg-indigo-600 hover:bg-indigo-700',
  borderColor = 'border-transparent',
  onClick,
  textColor = 'text-white',
  iconColor,
  className = '',
  disabled = false,
  type = 'button',
  ...props
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        backgroundColor: bgColor?.startsWith('#') || bgColor?.startsWith('rgb') ? bgColor : undefined,
        borderColor: borderColor?.startsWith('#') || borderColor?.startsWith('rgb') ? borderColor : undefined,
      }}
      className={`
        inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm
        transition-all duration-200 shadow-sm active:scale-95 border
        disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100
        ${bgColor?.startsWith('#') || bgColor?.startsWith('rgb') ? '' : bgColor}
        ${borderColor?.startsWith('#') || borderColor?.startsWith('rgb') ? '' : borderColor}
        ${textColor}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      {...props}
    >
      {Icon && (
        <Icon
          className={`w-4 h-4 shrink-0 ${
            iconColor && !iconColor.startsWith('#') && !iconColor.startsWith('rgb') ? iconColor : ''
          }`}
          style={{
            color: iconColor?.startsWith('#') || iconColor?.startsWith('rgb') ? iconColor : undefined,
          }}
        />
      )}
      {text && <span>{text}</span>}
    </button>
  );
};

export default ActionButton;
