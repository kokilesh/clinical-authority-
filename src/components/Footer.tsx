'use client';

import React from 'react';

interface FooterProps {
  onScrollToEnroll: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onScrollToEnroll }) => {
  return (
    <>
      {/* Final CTA Banner */}
      <section className="canva-section py-16 bg-espresso text-paper border-b border-brown/30">
        <div className="section-wrap flex flex-col items-center justify-between gap-7 text-center md:flex-row md:text-left">
          <div>
            <p className="canva-text eyebrow text-xs font-bold text-butter tracking-widest uppercase">
              Join Your Academic Batch Today
            </p>
            <h2 className="canva-text mt-3 text-2xl sm:text-3xl font-bold text-paper font-serif">
              Elevate Your Pharmacology &amp; Pathology Grades
            </h2>
          </div>
          <button
            className="canva-button button-primary shrink-0 rounded-full bg-butter text-espresso hover:bg-gold transition-colors px-7 py-4 font-bold text-sm shadow-xl"
            type="button"
            onClick={onScrollToEnroll}
          >
            Verify &amp; Enroll Now
          </button>
        </div>
      </section>

      {/* Main Footer */}
      <footer className="canva-footer bg-espresso text-parchment/80 py-10 text-xs">
        <div className="section-wrap flex flex-col justify-between gap-7 md:flex-row">
          <div>
            <p className="canva-text font-bold text-lg text-paper font-serif">
              Clinical Authority
            </p>
            <p className="canva-text mt-2 text-parchment/60">
              High-yield video courses &amp; clinical prep for selected medical colleges.
            </p>
          </div>
          <p className="canva-text max-w-2xl leading-relaxed text-parchment/60 md:text-right">
            © {new Date().getFullYear()} Clinical Authority. All rights reserved. All course content, videos, PDF materials, and histology slide graphics are protected under registered digital copyrights and signed student non-disclosure agreements.
          </p>
        </div>
      </footer>
    </>
  );
};
