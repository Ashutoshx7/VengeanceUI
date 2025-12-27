import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="relative bg-black text-white w-full min-h-[600px] flex flex-col overflow-hidden pt-20 px-6 md:px-12 lg:px-24">

      <article id="lighting-wrap">
        <article id="lightings">
          <section id="light-one" className="lighting-section">
            <section id="light-two" className="lighting-section">
              <section id="light-three" className="lighting-section">
                <section id="light-four" className="lighting-section">
                  <section id="light-five" className="lighting-section" />
                </section>
              </section>
            </section>
          </section>
        </article>
      </article>

      <div className="flex flex-col lg:flex-row justify-between w-full h-full pb-20 z-10 relative">

        <div className="flex flex-col mb-32 lg:mb-28 max-w-xl">

          <div className="mb-8">
            <span className="inline-block px-4 py-1.5 rounded-full bg-zinc-900 text-zinc-400 text-[10px] font-medium tracking-[0.2em] uppercase">
              Vengeance UI
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif-elegant leading-tight">
            Build landing pages<br />
            that feel alive<br />
            and effortless
          </h2>

          <p className="mt-6 text-zinc-400 text-sm leading-relaxed max-w-md">
            VengeanceUI helps you build stunning landing pages using beautifully
            animated, copy-paste ready components — crafted to be subtle,
            tasteful, and production-ready.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 lg:gap-24">

          <div className="flex flex-col space-y-6">
            <h3 className="text-zinc-500 text-[11px] font-medium tracking-[0.2em] uppercase">
              Product
            </h3>
            <ul className="flex flex-col space-y-3">
              <li><FooterLink href="#">Components</FooterLink></li>
              <li><FooterLink href="#">Animations</FooterLink></li>
              <li><FooterLink href="#">Templates</FooterLink></li>
              <li><FooterLink href="#">Showcase</FooterLink></li>
            </ul>
          </div>

          <div className="flex flex-col space-y-6">
            <h3 className="text-zinc-500 text-[11px] font-medium tracking-[0.2em] uppercase">
              Resources
            </h3>
            <ul className="flex flex-col space-y-3">
              <li><FooterLink href="#">Documentation</FooterLink></li>
              <li><FooterLink href="#">Getting Started</FooterLink></li>
              <li><FooterLink href="#">Changelog</FooterLink></li>
              <li><FooterLink href="#">Roadmap</FooterLink></li>
            </ul>
          </div>

          <div className="flex flex-col space-y-6">
            <h3 className="text-zinc-500 text-[11px] font-medium tracking-[0.2em] uppercase">
              Community
            </h3>
            <ul className="flex flex-col space-y-3">
              <li><FooterLink href="#">GitHub</FooterLink></li>
              <li><FooterLink href="#">Discord</FooterLink></li>
              <li><FooterLink href="#">Twitter / X</FooterLink></li>
              <li><FooterLink href="#">Instagram</FooterLink></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full pointer-events-none select-none flex justify-center overflow-hidden">
        <h1 className="text-[18vw] font-serif-elegant leading-none translate-y-[0%] tracking-tighter whitespace-nowrap wordmark-gradient">
          Vengeance UI
        </h1>
      </div>

      <div className="mt-auto pb-8 z-10 text-center w-full relative">
        <p className="text-[10px] tracking-[0.2em] text-zinc-700 font-medium uppercase">
          © 2025 Vengeance UI — Crafted for modern web builders
        </p>
      </div>
    </footer>
  );
};

interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
}

const FooterLink: React.FC<FooterLinkProps> = ({ href, children }) => {
  return (
    <a
      href={href}
      className="text-zinc-200 hover:text-white text-sm tracking-wide transition-colors duration-200 ease-in-out block"
    >
      {children}
    </a>
  );
};

export default Footer;