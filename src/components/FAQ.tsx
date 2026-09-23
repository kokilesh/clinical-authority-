'use client';

import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'Who is eligible to enroll in Clinical Authority courses?',
    answer:
      'Our courses are specifically tailored for enrolled medical students (MBBS, BDS, and affiliated medical sciences) seeking focused pharmacology and pathology preparation. Verification of student name, college, and agreement to NDA terms is required during registration.',
  },
  {
    question: 'How do I access the course material after payment?',
    answer:
      'Immediately upon successful Razorpay payment verification, our automated backend creates a single-use Telegram Bot invite link. You will see your link directly on the success screen, allowing you to join the private batch channel instantly.',
  },
  {
    question: 'Can I share my Telegram invite link with classmates?',
    answer:
      'No. Every Telegram invite link is generated with single-use session parameters bound to your verified student record. Sharing links or forwarding course content violates the Non-Disclosure Agreement signed during registration and leads to immediate access revocation.',
  },
  {
    question: 'Which payment methods are supported by Razorpay?',
    answer:
      'Razorpay supports all major Indian payment options including UPI (Google Pay, PhonePe, Paytm, BHIM), Credit/Debit Cards (Visa, Mastercard, RuPay), Net Banking across 50+ banks, and Digital Wallets.',
  },
];

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="paper-texture py-20 lg:py-24 border-b border-brown/15">
      <div className="section-wrap max-w-4xl">
        <div className="text-center">
          <p className="canva-text eyebrow text-xs font-bold text-brass tracking-widest uppercase">
            Have Questions?
          </p>
          <h2 className="canva-text mt-4 text-3xl sm:text-4xl font-bold text-ink font-serif">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="mt-10 space-y-3">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="canva-card overflow-hidden rounded-2xl border border-brown/15 bg-paper/90 shadow-sm transition-all"
              >
                <button
                  className="faq-button flex w-full items-center justify-between gap-4 p-5 text-left font-bold text-sm sm:text-base text-ink focus:outline-none"
                  type="button"
                  onClick={() => toggleAccordion(idx)}
                  aria-expanded={isOpen}
                >
                  <span className="canva-text font-serif">{item.question}</span>
                  <div className="rounded-full bg-parchment p-1 text-brown shrink-0">
                    {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </div>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-ink/80 leading-relaxed border-t border-brown/10 bg-parchment/20">
                    <p className="canva-text">{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
