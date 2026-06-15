import { QrCode } from 'lucide-react';

export default function ReceiveLoading() {
  return (
    <div className="flex h-[50vh] w-full flex-col items-center justify-center gap-4">
      <div className="brutal-sm flex h-16 w-16 animate-pulse items-center justify-center bg-muted">
        <QrCode className="h-8 w-8 text-muted-foreground animate-spin-slow" />
      </div>
      <p className="font-mono text-sm font-bold text-muted-foreground uppercase tracking-widest">
        Generating Address...
      </p>
    </div>
  );
}