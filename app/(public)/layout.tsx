import Image from "next/image";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative min-h-screen flex items-center justify-center ">
      <section className="relative z-40 w-full max-w-4xl px-4">
        {children}
      </section>
      <Image 
        className="absolute inset-0 z-10 max-h-screen object-cover"
        width={2400}
        height={1600}
        alt="background audla tasks"
        src="/bg.jpg"
        priority
      />
    </main>
  )
}

