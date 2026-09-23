'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';

interface HeroProps {
  onScrollToEnroll: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onScrollToEnroll }) => {
  return (
    <section id="home" className="canva-section hero-section paper-texture py-16 lg:py-24">
      <div className="section-wrap grid items-center gap-14 lg:grid-cols-[1.06fr_.94fr]">
        <div className="relative z-10">
          <div className="reveal">
            <span className="canva-tag eyebrow inline-flex rounded-full border border-brass/30 bg-parchment/60 px-4 py-2 font-bold text-xs text-brown">
              Selective Medical Access 2026
            </span>
          </div>

          <h1 className="canva-text reveal delay-1 mt-7 max-w-3xl font-bold leading-[1.08] text-3xl sm:text-4xl lg:text-5xl text-ink">
            Master Medical Pharmacology &amp; Pathology with Clinical Precision
          </h1>

          <p className="canva-text reveal delay-2 mt-6 max-w-2xl leading-relaxed text-base sm:text-lg text-ink/80">
            Focused high-yield video courses, exam-oriented pathology slide breakdowns, and drug mechanism mnemonics curated specifically for students in selected medical colleges.
          </p>

          <div className="reveal delay-3 mt-8 flex flex-wrap gap-4">
            <button
              className="canva-button button-primary flex items-center gap-2 rounded-full px-6 py-3.5 font-bold shadow-lg"
              type="button"
              onClick={onScrollToEnroll}
            >
              <span>Verify &amp; Enroll Now</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <a
              className="canva-link button-secondary flex items-center justify-center rounded-full border px-6 py-3.5 font-bold text-ink hover:border-brown"
              href="#courses"
            >
              Explore Courses
            </a>
          </div>

          <div className="reveal delay-3 mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm">
            <p className="canva-text flex items-center gap-2 font-medium text-ink/90">
              <CheckCircle2 className="h-5 w-5 text-brass shrink-0" />
              <span>100% Curriculum Aligned</span>
            </p>
            <p className="canva-text flex items-center gap-2 font-medium text-ink/90">
              <CheckCircle2 className="h-5 w-5 text-brass shrink-0" />
              <span>Verified Student Access</span>
            </p>
            <p className="canva-text flex items-center gap-2 font-medium text-ink/90">
              <CheckCircle2 className="h-5 w-5 text-brass shrink-0" />
              <span>Instant Telegram Access</span>
            </p>
          </div>
        </div>

        <div className="relative reveal delay-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="hero-image-frame relative">
              <Image
                src="/images/hero1.png"
                alt="Clinical Authority Medical Faculty"
                fill
                className="canva-image object-cover object-top"
                priority
              />
            </div>
            <div className="hero-image-frame relative">
              <Image
                src="/images/hero2.png"
                alt="Clinical Authority Medical Faculty"
                fill
                className="canva-image object-cover object-top"
                priority
              />
            </div>
          </div>

          {/* Floating Proof Card */}
          <div className="canva-card hero-proof-card rounded-2xl border p-5 shadow-2xl">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-parchment p-2 text-brass shrink-0 border border-brass/20">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="canva-text font-bold text-ink text-sm">Verified Medical Network</p>
                <p className="canva-text mt-1 text-xs leading-relaxed text-ink/75">
                  Over 1,200+ MBBS &amp; Medical students enrolled across premier medical institutions.
                </p>
              </div>
            </div>
          </div>

          <div className="absolute -right-5 top-12 hidden h-24 w-24 rounded-full border border-brass/20 lg:block pointer-events-none" />
        </div>
      </div>
    </section>
  );
};
