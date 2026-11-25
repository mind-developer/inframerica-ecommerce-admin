import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/Skeleton';
import { getLoginMethods } from '@/services/adminAuth.service';
import { LoginOptions } from '../components/LoginOptions';

export function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-primary px-4 py-12">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-2xl">
        <p className="font-heading text-lg font-bold">Inframérica</p>
        <p className="mb-6 text-xs text-muted-foreground">Painel Administrativo</p>
        <h1 className="mb-1 font-heading text-2xl font-bold">Entrar</h1>
        <p className="mb-6 text-sm text-muted-foreground">Acesso restrito à equipe Inframérica.</p>
        {/* The methods come from the API, and ?redirect= and ?erro= from the URL: all known at request time. */}
        <Suspense fallback={<Skeleton className="h-56 w-full rounded-xl" />}>
          <LoginContent />
        </Suspense>
      </div>
    </main>
  );
}

async function LoginContent() {
  return <LoginOptions methods={await getLoginMethods()} />;
}
