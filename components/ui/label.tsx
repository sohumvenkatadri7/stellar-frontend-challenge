import { type LabelHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

const Label = forwardRef<HTMLLabelElement, LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        'text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground',
        className
      )}
      {...props}
    />
  )
);
Label.displayName = 'Label';

export { Label };
