'use client'

import { Loader2 } from 'lucide-react';
import { JSX } from 'react';

interface LoadingSpinnerProps {
  title?: string;
}

export default function LoadingSpinner({ title }: LoadingSpinnerProps): JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      <p className="text-sm text-slate-400">{title}</p>
    </div>
  );
}