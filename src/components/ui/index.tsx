import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Button = ({ 
  className, 
  variant = 'primary', 
  size = 'md',
  ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { 
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}) => {
  const variants = {
    primary: 'bg-black text-white hover:bg-slate-800 shadow-[0_0_15px_rgba(0,0,0,0.18)]',
    secondary: 'bg-white text-slate-900 hover:bg-slate-100 border border-slate-200',
    outline: 'border border-black/20 text-black hover:bg-black/5',
    ghost: 'hover:bg-slate-100 text-slate-600 hover:text-slate-900',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-[0_0_15px_rgba(220,38,38,0.5)]',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-6 py-2.5 text-sm',
    lg: 'px-8 py-3 text-base',
  };

  return (
    <button 
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-all active:scale-95 disabled:opacity-50',
        variants[variant],
        sizes[size],
        className
      )} 
      {...props} 
    />
  );
};

export const Card = ({ className, children, glow = false }: { className?: string; children: React.ReactNode; glow?: boolean }) => (
  <div className={cn(
    'bg-white backdrop-blur-xl border border-slate-200 rounded-2xl p-6 overflow-hidden relative shadow-sm',
    glow && 'shadow-[0_0_30px_rgba(0,0,0,0.08)]',
    className
  )}>
    {children}
  </div>
);

export const Badge = ({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'default' | 'success' | 'warning' | 'error' | 'severe' }) => {
  const styles = {
    default: 'bg-slate-100 text-slate-700 border border-slate-200',
    success: 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-700 border border-amber-500/20',
    error: 'bg-orange-500/10 text-orange-700 border border-orange-500/20',
    severe: 'bg-red-500/10 text-red-500 border border-red-500/20 animate-pulse',
  };
  return <span className={cn('px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold', styles[variant])}>{children}</span>;
}
