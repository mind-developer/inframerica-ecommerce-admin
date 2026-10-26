import { LoginForm } from '../components/LoginForm';

export function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-primary px-4 py-12">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-2xl">
        <p className="font-heading text-lg font-bold">Inframérica</p>
        <p className="mb-6 text-xs text-muted-foreground">Painel Administrativo</p>
        <h1 className="mb-1 font-heading text-2xl font-bold">Entrar</h1>
        <p className="mb-6 text-sm text-muted-foreground">Acesso restrito à equipe Inframérica.</p>
        <LoginForm />
      </div>
    </main>
  );
}
