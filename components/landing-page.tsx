"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  CircleDollarSign,
  Landmark,
  Target,
  Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";

interface LandingPageProps {
  userId?: string | null;
}

export default function LandingPage({ userId }: LandingPageProps) {
  const [scrolled, setScrolled] = useState(false);

  // Change navbar after scrolling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 70);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Reveal sections as they enter the viewport
  useEffect(() => {
    const elements = document.querySelectorAll("[data-reveal]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -60px 0px",
      },
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return (
    <main className="min-h-screen bg-white text-[#111]">
      {/* ====================================================== */}
      {/* NAVBAR */}
      {/* ====================================================== */}

      <header
        className={`
          fixed left-1/2 z-50 -translate-x-1/2
          transition-all duration-500
          ease-[cubic-bezier(0.22,1,0.36,1)]
          ${
            scrolled
              ? "top-4 w-[calc(100%-32px)] max-w-[780px] rounded-full border border-black/[0.08] bg-white/90 shadow-[0_10px_40px_rgba(0,0,0,0.08)] backdrop-blur-xl"
              : "top-0 w-full border-b border-black/[0.06] bg-white/90 backdrop-blur-xl"
          }
        `}
      >
        <nav
          className={`
            mx-auto flex items-center justify-between
            transition-all duration-500
            ease-[cubic-bezier(0.22,1,0.36,1)]
            ${
              scrolled
                ? "h-[58px] px-3 pl-5 sm:px-4 sm:pl-5"
                : "h-[72px] max-w-7xl px-5 sm:px-8 lg:px-10"
            }
          `}
        >
          {/* Logo */}

          <Link href="/" className="flex shrink-0 items-center gap-2.5">
            <Image
              src="/neon.jpeg"
              alt="NeonNest"
              width={30}
              height={30}
              className={`
                rounded-lg object-cover
                transition-all duration-500
                ${scrolled ? "h-7 w-7" : "h-[30px] w-[30px]"}
              `}
            />

            <span className="text-[15px] font-semibold tracking-[-0.025em]">
              NeonNest
            </span>
          </Link>

          {/* Navigation */}

          <div
            className={`
              hidden items-center md:flex
              transition-all duration-500
              ${scrolled ? "gap-5" : "gap-8"}
            `}
          >
            <a
              href="#features"
              className="text-sm text-black/50 transition-colors duration-200 hover:text-black"
            >
              Features
            </a>

            <a
              href="#how-it-works"
              className="text-sm text-black/50 transition-colors duration-200 hover:text-black"
            >
              How it works
            </a>
          </div>

          {/* Authentication */}

          <div className="flex shrink-0 items-center gap-2">
            {userId ? (
              <Link
                href="/dashboard"
                className={`
                  group flex items-center gap-1.5 bg-black
                  font-medium text-white
                  transition-all duration-300
                  hover:bg-black/80
                  ${
                    scrolled
                      ? "rounded-full px-4 py-2 text-xs sm:text-sm"
                      : "rounded-full px-5 py-2.5 text-sm"
                  }
                `}
              >
                Dashboard

                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            ) : (
              <>
                <Link
                  href="/log-in"
                  className="hidden px-3 py-2 text-sm font-medium text-black/55 transition-colors hover:text-black sm:block"
                >
                  Log in
                </Link>

                <Link
                  href="/sign-up"
                  className={`
                    group flex items-center gap-1.5 bg-black
                    font-medium text-white
                    transition-all duration-300
                    hover:bg-black/80
                    ${
                      scrolled
                        ? "rounded-full px-4 py-2 text-xs sm:text-sm"
                        : "rounded-full px-5 py-2.5 text-sm"
                    }
                  `}
                >
                  Get started

                  <ArrowRight className="hidden h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 sm:block" />
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* ====================================================== */}
      {/* HERO */}
      {/* ====================================================== */}

      <section className="relative overflow-hidden px-5 pb-24 pt-40 sm:px-8 sm:pb-32 sm:pt-48">
        {/* Very subtle background */}

        <div className="pointer-events-none absolute left-1/2 top-24 h-[450px] w-[800px] -translate-x-1/2 rounded-full bg-black/[0.018] blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <div className="grid items-center gap-16 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
            {/* Hero text */}

            <div className="hero-enter">
              <h1 className="max-w-4xl text-[3.3rem] font-semibold leading-[0.97] tracking-[-0.055em] sm:text-7xl lg:text-[5rem]">
                Keep track of your money,
                <span className="text-black/35"> all in one place.</span>
              </h1>

              <p className="mt-7 max-w-xl text-[16px] leading-7 text-black/50 sm:text-[17px]">
                Keep up with your accounts, record what you earn and spend,
                plan your budget and see how your savings are coming along.
              </p>

              {/* Hero actions */}

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                {userId ? (
                  <Link
                    href="/dashboard"
                    className="group inline-flex items-center justify-center gap-2 rounded-full bg-black px-6 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-black/80"
                  >
                    Open dashboard

                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/sign-up"
                      className="group inline-flex items-center justify-center gap-2 rounded-full bg-black px-6 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-black/80"
                    >
                      Get started

                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>

                    <Link
                      href="/log-in"
                      className="inline-flex items-center justify-center rounded-full border border-black/[0.1] bg-white px-6 py-3.5 text-sm font-medium transition-all duration-300 hover:border-black/20 hover:bg-black/[0.025]"
                    >
                      Log in
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* ================================================== */}
            {/* BALANCE PREVIEW */}
            {/* ================================================== */}

            <div className="hero-enter hero-delay-1 w-full max-w-[440px] lg:justify-self-end">
              <div className="group rounded-[26px] border border-black/[0.07] bg-[#fafafa] p-5 transition-all duration-500 hover:-translate-y-1 hover:border-black/[0.12] hover:shadow-[0_24px_70px_rgba(0,0,0,0.07)] sm:p-6">
                {/* Balance header */}

                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-black/40">Total balance</p>

                    <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] sm:text-[35px]">
                      ₦1,840,500
                    </p>
                  </div>

                  <div className="flex items-center gap-1 rounded-full bg-black/[0.045] px-2.5 py-1.5 text-xs font-medium text-black/55">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                    8.4%
                  </div>
                </div>

                <p className="mt-2 text-xs text-black/30">
                  Total across all accounts
                </p>

                {/* Balance graph */}

                <div className="mt-8 h-[125px]">
                  <svg
                    viewBox="0 0 400 125"
                    className="h-full w-full overflow-visible"
                    fill="none"
                    aria-hidden="true"
                  >
                    <defs>
                      <linearGradient
                        id="balanceGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="currentColor"
                          stopOpacity="0.09"
                        />

                        <stop
                          offset="100%"
                          stopColor="currentColor"
                          stopOpacity="0"
                        />
                      </linearGradient>
                    </defs>

                    {/* Area */}

                    <path
                      d="
                        M0 100
                        C30 97, 48 81, 78 83
                        C110 86, 128 66, 158 69
                        C190 73, 210 49, 242 53
                        C273 57, 294 34, 326 39
                        C353 43, 375 21, 400 24
                        L400 125
                        L0 125
                        Z
                      "
                      fill="url(#balanceGradient)"
                      className="text-black"
                    />

                    {/* Line */}

                    <path
                      d="
                        M0 100
                        C30 97, 48 81, 78 83
                        C110 86, 128 66, 158 69
                        C190 73, 210 49, 242 53
                        C273 57, 294 34, 326 39
                        C353 43, 375 21, 400 24
                      "
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      className="text-black/65"
                    />
                  </svg>
                </div>

                {/* Accounts */}

                <div className="mt-4 border-t border-black/[0.07] pt-2">
                  <BalanceRow
                    name="GTBank"
                    amount="₦820,000"
                    letter="G"
                  />

                  <BalanceRow
                    name="OPay"
                    amount="₦420,500"
                    letter="O"
                  />

                  <BalanceRow
                    name="Cash"
                    amount="₦600,000"
                    letter="C"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* PRODUCT AREAS */}
      {/* ====================================================== */}

      <section
        data-reveal
        className="reveal border-y border-black/[0.06] bg-[#fafafa]"
      >
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y divide-black/[0.06] sm:grid-cols-5 sm:divide-y-0">
          <OverviewItem icon={Landmark} text="Accounts" />

          <OverviewItem icon={CircleDollarSign} text="Income" />

          <OverviewItem icon={Wallet} text="Expenses" />

          <OverviewItem icon={BarChart3} text="Budgets" />

          <OverviewItem icon={Target} text="Savings goals" />
        </div>
      </section>

      {/* ====================================================== */}
      {/* FEATURES */}
      {/* ====================================================== */}

      <section
        id="features"
        data-reveal
        className="reveal px-5 py-24 sm:px-8 sm:py-32"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-end">
            <div>
              <p className="text-sm font-medium text-black/40">
                What you can do
              </p>

              <h2 className="mt-4 max-w-xl text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">
                See what&apos;s happening with your money.
              </h2>
            </div>

            <p className="max-w-md text-[15px] leading-7 text-black/45 lg:justify-self-end">
              Your accounts, income, spending and savings are easier to
              understand when you can see them together.
            </p>
          </div>

          <div className="mt-16 border-t border-black/[0.08]">
            <FeatureRow
              number="01"
              title="Financial accounts"
              description="Add the accounts you use and see how much you have across them."
            />

            <FeatureRow
              number="02"
              title="Income"
              description="Record what you earn and see where your income is coming from."
            />

            <FeatureRow
              number="03"
              title="Expenses"
              description="Keep track of what you spend and which accounts the money came from."
            />

            <FeatureRow
              number="04"
              title="Budgets"
              description="Set spending limits and check how much you have left as the month goes on."
            />

            <FeatureRow
              number="05"
              title="Savings goals"
              description="Choose what you're saving for and keep track of how close you're getting."
            />
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* HOW IT WORKS */}
      {/* ====================================================== */}

      <section
        id="how-it-works"
        data-reveal
        className="reveal border-y border-black/[0.06] bg-[#fafafa] px-5 py-24 sm:px-8 sm:py-32"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-black/40">
                Getting started
              </p>

              <h2 className="mt-4 max-w-lg text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">
                Start with the accounts you already use.
              </h2>
            </div>

            <p className="max-w-md text-[15px] leading-7 text-black/45 lg:justify-self-end lg:pt-8">
              Add an account, start recording your income and expenses, and
              you&apos;ll have a better view of where your money stands.
            </p>
          </div>

          <div className="relative mt-20 grid gap-12 md:grid-cols-3 md:gap-8">
            <div className="absolute left-0 right-0 top-[17px] hidden h-px bg-black/[0.1] md:block" />

            <Step
              number="1"
              title="Add your accounts"
              description="Add your bank accounts, wallets or cash."
            />

            <Step
              number="2"
              title="Record what happens"
              description="Add your income and expenses as money comes in or goes out."
            />

            <Step
              number="3"
              title="Keep an eye on things"
              description="See how your balances, spending and savings change over time."
            />
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* CTA */}
      {/* ====================================================== */}

      <section data-reveal className="reveal px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[28px] bg-[#111] px-6 py-16 text-center text-white sm:px-12 sm:py-20">
          {userId ? (
            <>
              <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">
                Your dashboard is ready.
              </h2>

              <p className="mx-auto mt-5 max-w-md text-sm leading-6 text-white/45">
                Head back in and see how your finances are looking.
              </p>

              <Link
                href="/dashboard"
                className="group mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-medium text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/90"
              >
                Open dashboard

                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </>
          ) : (
            <>
              <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">
                Start keeping track of your money.
              </h2>

              <p className="mx-auto mt-5 max-w-md text-sm leading-6 text-white/45">
                Create an account and start with the money you already have.
              </p>

              <Link
                href="/sign-up"
                className="group mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-medium text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/90"
              >
                Create an account

                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </>
          )}
        </div>
      </section>

      {/* ====================================================== */}
      {/* FOOTER */}
      {/* ====================================================== */}

      <footer className="border-t border-black/[0.06] px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/neon.jpeg"
              alt="NeonNest"
              width={26}
              height={26}
              className="rounded-md"
            />

            <span className="text-sm font-semibold">NeonNest</span>
          </Link>

          <div className="flex items-center gap-6 text-xs text-black/40">
            <a
              href="#features"
              className="transition-colors duration-200 hover:text-black"
            >
              Features
            </a>

            <a
              href="#how-it-works"
              className="transition-colors duration-200 hover:text-black"
            >
              How it works
            </a>
          </div>

          <p className="text-xs text-black/35">© 2026 NeonNest</p>
        </div>
      </footer>

      {/* ====================================================== */}
      {/* ANIMATIONS */}
      {/* ====================================================== */}

      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }

        @keyframes heroEnter {
          from {
            opacity: 0;
            transform: translateY(16px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hero-enter {
          animation: heroEnter 700ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .hero-delay-1 {
          animation-delay: 120ms;
        }

        .reveal {
          opacity: 0;
          transform: translateY(24px);

          transition:
            opacity 700ms cubic-bezier(0.22, 1, 0.36, 1),
            transform 700ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .reveal-visible {
          opacity: 1;
          transform: translateY(0);
        }

        @media (prefers-reduced-motion: reduce) {
          html {
            scroll-behavior: auto;
          }

          .hero-enter {
            animation: none;
          }

          .reveal {
            opacity: 1;
            transform: none;
            transition: none;
          }
        }
      `}</style>
    </main>
  );
}

/* ========================================================== */
/* BALANCE ROW */
/* ========================================================== */

function BalanceRow({
  name,
  amount,
  letter,
}: {
  name: string;
  amount: string;
  letter: string;
}) {
  return (
    <div className="group/row flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black/[0.05] text-xs font-semibold text-black/55 transition-colors duration-300 group-hover/row:bg-black/[0.08]">
          {letter}
        </div>

        <span className="text-sm font-medium text-black/60">{name}</span>
      </div>

      <span className="text-sm font-semibold tracking-[-0.02em]">
        {amount}
      </span>
    </div>
  );
}

/* ========================================================== */
/* OVERVIEW ITEM */
/* ========================================================== */

function OverviewItem({
  icon: Icon,
  text,
}: {
  icon: React.ElementType;
  text: string;
}) {
  return (
    <div className="group flex items-center justify-center gap-2.5 px-4 py-6">
      <Icon className="h-4 w-4 text-black/35 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:text-black/60" />

      <span className="text-sm font-medium text-black/55">{text}</span>
    </div>
  );
}

/* ========================================================== */
/* FEATURE ROW */
/* ========================================================== */

function FeatureRow({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="group grid gap-4 border-b border-black/[0.08] py-7 transition-colors duration-300 hover:border-black/[0.16] sm:grid-cols-[70px_220px_1fr] sm:items-center">
      <span className="text-xs text-black/25">{number}</span>

      <h3 className="text-[15px] font-semibold transition-transform duration-300 group-hover:translate-x-1">
        {title}
      </h3>

      <p className="max-w-lg text-sm leading-6 text-black/45">
        {description}
      </p>
    </div>
  );
}

/* ========================================================== */
/* STEP */
/* ========================================================== */

function Step({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="relative group">
      <div className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full border border-black/[0.1] bg-white text-xs font-medium transition-all duration-300 group-hover:border-black/25 group-hover:bg-black group-hover:text-white">
        {number}
      </div>

      <h3 className="mt-7 text-base font-semibold tracking-[-0.02em]">
        {title}
      </h3>

      <p className="mt-2 max-w-xs text-sm leading-6 text-black/45">
        {description}
      </p>
    </div>
  );
}