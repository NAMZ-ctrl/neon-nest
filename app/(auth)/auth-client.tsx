"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function AuthClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isSignUp = pathname.includes("sign-up");

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">
      {/* Brand panel */}
      <section className="hidden lg:flex flex-col items-center justify-center relative bg-black text-white p-12 overflow-hidden fade-up">
        {/* oversized logo bled into the background */}
        <Image
          src="/neon.jpeg"
          width={520}
          height={520}
          alt=""
          aria-hidden
          className="absolute -right-28 -bottom-28 rounded-full opacity-[0.06] pointer-events-none select-none"
        />

        <div className="relative z-10 flex flex-col items-center text-center max-w-xs">
          <Image
            src="/neon.jpeg"
            width={112}
            height={112}
            alt="Neon Nest logo"
            className="rounded-full mb-10"
            priority
          />
          <h1 className="text-3xl font-black uppercase leading-tight tracking-tight mb-4">
            Build the life
            <br />
            you&apos;re saving for.
          </h1>
          <div className="w-10 h-px bg-white/30 mb-4" />
          <p className="text-xs tracking-[0.25em] uppercase text-white/40">
            Budget · Track · Save
          </p>
        </div>

        <p className="absolute bottom-8 text-[10px] tracking-[0.2em] uppercase text-white/25">
          © {new Date().getFullYear()} Neon Nest
        </p>
      </section>

      {/* Form panel */}
      <section className="flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-16 fade-up fade-up-delay">
        <div className="lg:hidden flex flex-col items-center mb-10">
          <Image
            src="/neon.jpeg"
            width={72}
            height={72}
            alt="Neon Nest logo"
            className="rounded-full mb-4"
            priority
          />
          <p className="text-[11px] tracking-[0.25em] uppercase text-black/40 text-center">
            Build the life you&apos;re saving for.
          </p>
        </div>

        <div className="max-w-sm w-full mx-auto lg:mx-0">
          <div className="relative grid grid-cols-2 mb-10 border-b border-black/15">
            <span
              aria-hidden
              className="absolute bottom-0 h-[2px] w-1/2 bg-black transition-transform duration-300 ease-out"
              style={{
                transform: isSignUp ? "translateX(100%)" : "translateX(0%)",
              }}
            />
            <Link
              href="/log-in"
              className={`pb-4 text-sm font-semibold uppercase tracking-widest text-center transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30 ${
                !isSignUp ? "text-black" : "text-black/35 hover:text-black/60"
              }`}
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className={`pb-4 text-sm font-semibold uppercase tracking-widest text-center transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30 ${
                isSignUp ? "text-black" : "text-black/35 hover:text-black/60"
              }`}
            >
              Sign up
            </Link>
          </div>

          {children}
        </div>
      </section>

      <style jsx>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .fade-up {
          animation: fadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .fade-up-delay {
          animation-delay: 0.12s;
        }
        @media (prefers-reduced-motion: reduce) {
          .fade-up {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}