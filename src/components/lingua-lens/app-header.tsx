import { ScanText } from 'lucide-react';

export function AppHeader() {
  return (
    <header className="py-6 px-4 md:px-8 bg-card border-b shadow-sm">
      <div className="container mx-auto flex items-center gap-3">
        <ScanText className="h-10 w-10 text-primary" strokeWidth={1.5}/>
        <h1 className="text-4xl font-headline font-bold text-primary">
          LinguaLens
        </h1>
      </div>
    </header>
  );
}
