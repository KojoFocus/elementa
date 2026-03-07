'use client';

type BadgeVariant =
  | 'passed' | 'failed'
  | 'chemistry' | 'biology' | 'physics'
  | 'beginner' | 'intermediate' | 'advanced'
  | 'default';

const styles: Record<BadgeVariant, string> = {
  passed:       'bg-[rgba(122,255,178,0.12)] text-[#7affb2] border-[rgba(122,255,178,0.3)]',
  failed:       'bg-[rgba(255,126,179,0.12)] text-[#ff7eb3] border-[rgba(255,126,179,0.3)]',
  chemistry:    'bg-[rgba(79,209,255,0.1)]   text-[#4fd1ff] border-[rgba(79,209,255,0.25)]',
  biology:      'bg-[rgba(122,255,178,0.1)]  text-[#7affb2] border-[rgba(122,255,178,0.25)]',
  physics:      'bg-[rgba(255,214,79,0.1)]   text-[#ffd64f] border-[rgba(255,214,79,0.25)]',
  beginner:     'bg-[rgba(122,255,178,0.1)]  text-[#7affb2] border-[rgba(122,255,178,0.2)]',
  intermediate: 'bg-[rgba(245,158,11,0.1)]   text-[#f59e0b] border-[rgba(245,158,11,0.2)]',
  advanced:     'bg-[rgba(255,126,179,0.1)]  text-[#ff7eb3] border-[rgba(255,126,179,0.2)]',
  default:      'bg-[rgba(90,122,153,0.15)]  text-[#5a7a99] border-[rgba(90,122,153,0.2)]',
};

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

export default function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-widest border ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
