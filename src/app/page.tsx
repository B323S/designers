import { Calendar, DollarSign, Link as LinkIcon, Mail } from "lucide-react";
import Link from "next/link";
import GuestTaskCardClient from "@/components/GuestTaskCardClient";

export default function Home() {
  return (
    <div className="relative min-h-[calc(100vh-80px)] overflow-hidden">

      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-bl from-peach-100/50 to-transparent -z-10 rounded-bl-[100px]" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">

        {/* HERO SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">

          {/* Left Column: Action Card / Form */}
          <div className="order-2 lg:order-1 relative">
            {/* Use client component that shows CTA when guest, real form when authenticated */}
            <div className="max-w-md mx-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {/* Render guest/auth aware card */}
              {/* Import dynamically to avoid making whole page client */}
              <div>
                {/* @ts-ignore */}
                <GuestTaskCardClient />
              </div>
            </div>

            {/* Detailed background blob for card */}
            <div className="absolute top-10 left-10 w-full h-full bg-peach-200/50 rounded-3xl -z-10 blur-xl" />
          </div>

          {/* Right Column: Hero Text */}
          <div className="order-1 lg:order-2 text-center lg:text-left">
            <div className="inline-block px-4 py-1.5 bg-peach-100 rounded-full text-peach-700 font-semibold text-sm mb-6 tracking-wide uppercase">
              Organización Estudiantil
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold text-peach-900 leading-tight mb-8">
              QUE TUS <br />
              <span className="text-peach-400">PROYECTOS</span> <br />
              SEAN ALGO <br />
              MEMORABLE
            </h1>
            <p className="text-xl text-gray-500 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Designers Box es tu herramienta todo en uno para gestionar horarios, presupuestos y creatividad sin perder el estilo.
            </p>
          </div>
        </div>

        {/* FEATURES / ICONS SECTION */}
        <div className="relative z-10">
          {/* Custom Wave Background for this section could go here if separating visually, but staying clean for now as per image 'white with icons at bottom' */}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 justify-items-center">

            <Link href="/schedule" className="group flex flex-col items-center gap-4 cursor-pointer">
              <div className="size-24 md:size-32 rounded-full bg-white border-4 border-peach-300 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 group-hover:border-peach-500 relative overflow-hidden">
                <div className="absolute inset-0 bg-peach-50 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Calendar className="size-10 md:size-14 text-peach-600 relative z-10" />
              </div>
              <span className="text-lg font-bold text-white bg-peach-500 px-4 py-1 rounded-full shadow-md group-hover:bg-peach-600 transition-colors">
                Horario
              </span>
            </Link>

            <Link href="/budget" className="group flex flex-col items-center gap-4 cursor-pointer">
              <div className="size-24 md:size-32 rounded-full bg-white border-4 border-peach-300 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 group-hover:border-peach-500 relative overflow-hidden">
                <div className="absolute inset-0 bg-peach-50 opacity-0 group-hover:opacity-100 transition-opacity" />
                <DollarSign className="size-10 md:size-14 text-peach-600 relative z-10" />
              </div>
              <span className="text-lg font-bold text-white bg-peach-500 px-4 py-1 rounded-full shadow-md group-hover:bg-peach-600 transition-colors">
                Presupuesto
              </span>
            </Link>

            <Link href="/links" className="group flex flex-col items-center gap-4 cursor-pointer">
              <div className="size-24 md:size-32 rounded-full bg-white border-4 border-peach-300 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 group-hover:border-peach-500 relative overflow-hidden">
                <div className="absolute inset-0 bg-peach-50 opacity-0 group-hover:opacity-100 transition-opacity" />
                <LinkIcon className="size-10 md:size-14 text-peach-600 relative z-10" />
              </div>
              <span className="text-lg font-bold text-white bg-peach-500 px-4 py-1 rounded-full shadow-md group-hover:bg-peach-600 transition-colors">
                Enlaces
              </span>
            </Link>

            {/* Decorative Extra Icon or 'Coming Soon' */}
            <div className="group flex flex-col items-center gap-4 opacity-70">
              <div className="size-24 md:size-32 rounded-full bg-gray-50 border-4 border-gray-200 flex items-center justify-center shadow-inner">
                <div className="text-3xl font-bold text-gray-300">?</div>
              </div>
              <span className="text-lg font-bold text-gray-400">
                Próximamente
              </span>
            </div>

          </div>
        </div>

        {/* Decorative Wave at the very bottom of the page content */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none rotate-180 z-0 opacity-20 pointer-events-none">
          <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="block w-[calc(100%+1.3px)] h-[100px] fill-peach-400">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
          </svg>
        </div>

      </main>
    </div>
  );
}
