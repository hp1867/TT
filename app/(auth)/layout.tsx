export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-[100svh] pt-28 pb-16">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-32 left-1/2 -translate-x-1/2 h-[60vh] w-[60vh] rounded-full bg-neon-cyan/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[40vh] w-[40vh] rounded-full bg-neon-violet/10 blur-3xl" />
      </div>
      <div className="container-px">{children}</div>
    </div>
  );
}
