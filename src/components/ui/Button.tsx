'use client';

import { motion } from 'framer-motion';
import type { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'ghost' | 'danger';
type Size    = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: React.ReactNode;
}

const variantStyles: Record<Variant, string> = {
  primary: [
    'bg-transparent border border-[var(--accent)] text-[var(--accent)]',
    'hover:bg-[var(--accent)] hover:text-[var(--bg-deep)]',
    'shadow-[0_0_16px_var(--accent-glow)]',
    'hover:shadow-[0_0_28px_rgba(79,209,255,0.35)]',
    'disabled:opacity-40 disabled:cursor-not-allowed',
  ].join(' '),
  ghost: [
    'bg-transparent border border-[var(--border)] text-[var(--text-secondary)]',
    'hover:border-[var(--border-hover)] hover:text-[var(--text-primary)]',
    'disabled:opacity-40 disabled:cursor-not-allowed',
  ].join(' '),
  danger: [
    'bg-transparent border border-[var(--danger)] text-[var(--danger)]',
    'hover:bg-[var(--danger)] hover:text-white',
    'disabled:opacity-40 disabled:cursor-not-allowed',
  ].join(' '),
};

const sizeStyles: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs tracking-wider',
  md: 'px-5 py-2.5 text-sm tracking-wider',
  lg: 'px-8 py-3.5 text-base tracking-widest',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  className = '',
  disabled,
  onClick,
  onFocus,
  onBlur,
  type = 'button',
  form,
  name,
  'aria-label': ariaLabel,
}: ButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className={[
        'relative inline-flex items-center justify-center gap-2',
        'rounded font-mono uppercase transition-all duration-200',
        'cursor-pointer select-none',
        variantStyles[variant],
        sizeStyles[size],
        className,
      ].join(' ')}
      disabled={disabled || loading}
      onClick={onClick}
      onFocus={onFocus}
      onBlur={onBlur}
      type={type}
      form={form}
      name={name}
      aria-label={ariaLabel}
    >
      {loading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        icon && <span className="shrink-0">{icon}</span>
      )}
      {children}
    </motion.button>
  );
}
