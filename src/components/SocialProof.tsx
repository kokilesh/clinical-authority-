'use client';

import React from 'react';

export const SocialProof: React.FC = () => {
  return (
    <section className="canva-section border-b border-brown/15 bg-paper/50">
      <div className="section-wrap grid items-stretch lg:grid-cols-[1.25fr_.75fr]">
        <div className="grid sm:grid-cols-3">
          <div className="stat-divider px-6 py-7 text-center">
            <strong className="canva-text block font-bold text-2xl sm:text-3xl text-ink font-serif">
              1,200+
            </strong>
            <span className="canva-text mt-1 block text-xs uppercase tracking-wider text-muted font-medium">
              Verified Medical Students
            </span>
          </div>
          <div className="stat-divider px-6 py-7 text-center">
            <strong className="canva-text block font-bold text-2xl sm:text-3xl text-ink font-serif">
              24+
            </strong>
            <span className="canva-text mt-1 block text-xs uppercase tracking-wider text-muted font-medium">
              Medical Colleges Covered
            </span>
          </div>
          <div className="stat-divider px-6 py-7 text-center">
            <strong className="canva-text block font-bold text-2xl sm:text-3xl text-ink font-serif">
              180+
            </strong>
            <span className="canva-text mt-1 block text-xs uppercase tracking-wider text-muted font-medium">
              High-Yield Video Lectures
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 border-t border-brown/15 px-6 py-6 lg:border-l lg:border-t-0">
          <div className="avatar-stack flex shrink-0">
            <img
              src="https://images.unsplash.com/photo-1594824813571-215334be6b06?w=100&auto=format&fit=crop&q=80"
              alt="Medical student avatar 1"
              className="canva-image"
            />
            <img
              src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=100&auto=format&fit=crop&q=80"
              alt="Medical student avatar 2"
              className="canva-image"
            />
            <img
              src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&auto=format&fit=crop&q=80"
              alt="Medical student avatar 3"
              className="canva-image"
            />
          </div>
          <div>
            <div className="flex text-amber-600 text-sm tracking-wider" aria-label="5 out of 5 stars">
              ★★★★★
            </div>
            <p className="canva-text mt-1 text-xs sm:text-sm font-medium text-ink">
              “The pathology slide charts and drug tables made university exams so manageable!”
            </p>
            <p className="canva-text mt-1 text-[11px] uppercase tracking-wider text-brass font-bold">
              98.4% Exam Pass &amp; Retention Rate
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
