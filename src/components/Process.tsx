'use client';

import React from 'react';
import { LockKeyhole } from 'lucide-react';

export const Process: React.FC = () => {
  return (
    <section id="process" className="canva-section py-20 lg:py-24 border-b border-brown/15 bg-paper/60">
      <div className="section-wrap">
        <div className="grid gap-12 lg:grid-cols-[.78fr_1.22fr] lg:items-center">
          <div>
            <p className="canva-text eyebrow text-xs font-bold text-brass tracking-widest uppercase">
              Simplified Enrollment
            </p>
            <h2 className="canva-text mt-4 text-3xl sm:text-4xl font-bold leading-tight text-ink font-serif">
              3 Simple Steps to Access Your Course
            </h2>
            <p className="canva-text mt-5 text-base text-ink/80 leading-relaxed">
              We verify medical college affiliation to maintain exclusive, high-yield academic standards for every batch.
            </p>
            <div className="mt-7 rounded-2xl border border-brown/20 bg-parchment/40 p-5 backdrop-blur-sm">
              <p className="canva-text flex gap-3 text-sm text-ink/90 leading-relaxed">
                <LockKeyhole className="mt-0.5 h-5 w-5 shrink-0 text-brass" />
                <span>
                  All content is digitally protected under signed non-disclosure agreements to prevent unauthorized redistribution.
                </span>
              </p>
            </div>
          </div>

          <ol className="grid gap-4 sm:grid-cols-3">
            <li className="canva-card rounded-2xl p-6 border border-brown/15 bg-paper shadow-sm flex flex-col">
              <span className="serif text-3xl font-bold text-brass">01</span>
              <h3 className="canva-text mt-4 text-lg font-bold text-ink font-serif">
                Student Verification
              </h3>
              <p className="canva-text mt-3 text-xs leading-relaxed text-ink/75">
                Fill in your student name, college, roll number, and sign the non-disclosure agreement.
              </p>
            </li>

            <li className="canva-card rounded-2xl p-6 border border-brown/15 bg-paper shadow-sm flex flex-col">
              <span className="serif text-3xl font-bold text-brass">02</span>
              <h3 className="canva-text mt-4 text-lg font-bold text-ink font-serif">
                Razorpay Payment
              </h3>
              <p className="canva-text mt-3 text-xs leading-relaxed text-ink/75">
                Complete checkout via Razorpay with Instant UPI, Cards, NetBanking, or Wallet payments.
              </p>
            </li>

            <li className="canva-card rounded-2xl p-6 border border-brown/15 bg-paper shadow-sm flex flex-col">
              <span className="serif text-3xl font-bold text-brass">03</span>
              <h3 className="canva-text mt-4 text-lg font-bold text-ink font-serif">
                Telegram Access
              </h3>
              <p className="canva-text mt-3 text-xs leading-relaxed text-ink/75">
                Get an automated single-use Telegram Bot invite link to join your batch group immediately.
              </p>
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
};
