'use client';

import React from 'react';

export const Testimonials: React.FC = () => {
  return (
    <section id="reviews" className="canva-section py-20 lg:py-28 border-b border-brown/15 bg-paper">
      <div className="section-wrap">
        <div className="mx-auto max-w-3xl text-center">
          <p className="canva-text eyebrow text-xs font-bold text-brass tracking-widest uppercase">
            Student Feedback
          </p>
          <h2 className="canva-text mt-4 text-3xl sm:text-4xl font-bold text-ink font-serif">
            Trusted by Top Medical College Achievers
          </h2>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          <article className="canva-card testimonial-card rounded-3xl p-7 border border-brown/15 bg-paper/90 shadow-sm flex flex-col justify-between">
            <div>
              <img
                src="https://images.unsplash.com/photo-1594824813571-215334be6b06?w=120&auto=format&fit=crop&q=80"
                alt="Dr. Ananya Sharma"
                className="canva-image h-14 w-14 rounded-full object-cover border-2 border-brass/40"
                loading="lazy"
              />
              <div className="mt-5 text-amber-600 text-sm tracking-widest" aria-label="5 out of 5 stars">
                ★★★★★
              </div>
              <blockquote className="canva-text relative z-10 mt-4 text-sm leading-relaxed text-ink/85 italic">
                “The drug mechanism charts and autonomic pharmacology videos saved my university professional exams. Concepts are explained with exact exam answer structuring!”
              </blockquote>
            </div>
            <div className="mt-6 pt-4 border-t border-brown/10">
              <p className="canva-text font-bold text-sm text-ink font-serif">
                Dr. Ananya Sharma
              </p>
              <p className="canva-text text-xs text-muted">
                GMC Mumbai • Batch 2023
              </p>
            </div>
          </article>

          <article className="canva-card testimonial-card rounded-3xl p-7 border border-brown/15 bg-paper/90 shadow-sm flex flex-col justify-between">
            <div>
              <img
                src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=120&auto=format&fit=crop&q=80"
                alt="Rahul Verma"
                className="canva-image h-14 w-14 rounded-full object-cover border-2 border-brass/40"
                loading="lazy"
              />
              <div className="mt-5 text-amber-600 text-sm tracking-widest" aria-label="5 out of 5 stars">
                ★★★★★
              </div>
              <blockquote className="canva-text relative z-10 mt-4 text-sm leading-relaxed text-ink/85 italic">
                “The combined package is incredible value. High-yield pathology slides identification breakdown helped me score distinction in my histopathology practicals.”
              </blockquote>
            </div>
            <div className="mt-6 pt-4 border-t border-brown/10">
              <p className="canva-text font-bold text-sm text-ink font-serif">
                Rahul Verma
              </p>
              <p className="canva-text text-xs text-muted">
                IMS BHU • Batch 2024
              </p>
            </div>
          </article>

          <article className="canva-card testimonial-card rounded-3xl p-7 border border-brown/15 bg-paper/90 shadow-sm flex flex-col justify-between">
            <div>
              <img
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=120&auto=format&fit=crop&q=80"
                alt="Sneha Patel"
                className="canva-image h-14 w-14 rounded-full object-cover border-2 border-brass/40"
                loading="lazy"
              />
              <div className="mt-5 text-amber-600 text-sm tracking-widest" aria-label="5 out of 5 stars">
                ★★★★★
              </div>
              <blockquote className="canva-text relative z-10 mt-4 text-sm leading-relaxed text-ink/85 italic">
                “Instant access via Telegram made studying so easy during hospital postings. Clean, fast, and no unnecessary distraction!”
              </blockquote>
            </div>
            <div className="mt-6 pt-4 border-t border-brown/10">
              <p className="canva-text font-bold text-sm text-ink font-serif">
                Sneha Patel
              </p>
              <p className="canva-text text-xs text-muted">
                KGMU Lucknow • Batch 2023
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};
