export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#041024] via-[#091933] to-[#071126] p-6 text-slate-100">
      <div className="mx-auto max-w-7xl">{children}</div>
    </main>
  );
}
