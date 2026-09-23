'use client';

import React from 'react';

interface HeaderProps {
  onScrollToEnroll: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onScrollToEnroll }) => {
  return (
    <>
      {/* Exclusivity Top Banner */}
      <div className="canva-banner top-grid w-full px-4 py-2.5 bg-brown text-paper">
        <div className="section-wrap flex items-center justify-center gap-3 text-center text-xs sm:text-sm">
          <div className="exclusive-dots hidden sm:flex gap-1" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
          <span className="canva-tag rounded-full bg-butter/20 text-butter px-3 py-1 font-bold tracking-wider text-[11px] uppercase border border-butter/30">
            Selective Medical College Access
          </span>
          <p className="canva-text font-medium text-parchment/90">
            Exclusive video courses for verified medical students
          </p>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header className="canva-header sticky top-0 z-40 border-b border-brown/15 bg-paper/90 backdrop-blur-xl">
        <div className="section-wrap flex min-h-[72px] items-center justify-between gap-5">
          <a
            href="#home"
            className="flex items-center gap-3 rounded focus:outline-none group"
            aria-label="Clinical Authority home"
          >
            <svg className="logo-mark transition-transform group-hover:scale-105" viewBox="0 0 64 64" fill="none" aria-hidden="true">
              <path
                d="M18 10v18a14 14 0 0 0 28 0V10M12 10h12M40 10h12"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="round"
              />
              <path
                d="M32 42v5a9 9 0 0 0 18 0v-5"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="round"
              />
              <circle cx="50" cy="37" r="6" stroke="currentColor" strokeWidth="4" />
            </svg>
            <div>
              <p className="canva-text font-bold text-ink text-xl leading-none font-serif tracking-tight">
                Clinical Authority
              </p>
              <p className="canva-text mt-1 text-[10px] uppercase tracking-[.22em] text-brass font-medium">
                Pharmacology & Pathology
              </p>
            </div>
          </a>

          <nav className="hidden items-center gap-7 lg:flex text-sm" aria-label="Main navigation">
            <a className="canva-link font-medium text-ink/80 hover:text-brass transition-colors" href="#courses">
              Courses
            </a>
            <a className="canva-link font-medium text-ink/80 hover:text-brass transition-colors" href="#process">
              Process
            </a>
            <a className="canva-link font-medium text-ink/80 hover:text-brass transition-colors" href="#reviews">
              Reviews
            </a>
            <a className="canva-link font-medium text-ink/80 hover:text-brass transition-colors" href="#faq">
              FAQ
            </a>
          </nav>

          <button
            className="canva-button button-primary rounded-full px-5 py-2.5 font-bold text-sm shadow-md"
            type="button"
            onClick={onScrollToEnroll}
          >
            Enroll Now
          </button>
        </div>
      </header>
    </>
  );
};
