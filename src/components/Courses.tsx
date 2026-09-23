'use client';

import React from 'react';
import { Pill, Crown, Microscope, Check } from 'lucide-react';
import { FREE_TRIAL_DURATION_LABEL } from '@/lib/freeTrial';

interface CoursesProps {
  onSelectCourse: (course: 'Pharmacology' | 'Combined' | 'Pathology') => void;
  onStartFreeTrial?: () => void;
}

export const Courses: React.FC<CoursesProps> = ({ onSelectCourse, onStartFreeTrial }) => {
  return (
    <section id="courses" className="paper-texture py-20 lg:py-28 border-b border-brown/15">
      <div className="section-wrap">
        <div className="mx-auto max-w-3xl text-center">
          <p className="canva-text eyebrow text-xs font-bold text-brass tracking-widest uppercase">
            Curriculum Breakdown
          </p>
          <h2 className="canva-text mt-4 text-3xl sm:text-4xl font-bold leading-tight text-ink font-serif">
            High-Yield Focused Medical Courses
          </h2>
          <p className="canva-text mt-5 text-base text-ink/80 leading-relaxed">
            Choose your individual subject module or select the combined bundle for complete pharmacology &amp; pathology mastery.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3 items-stretch">
          {/* Pharmacology Card */}
          <article className="canva-card course-card flex flex-col rounded-3xl p-7 relative">
            <div className="flex items-center justify-between">
              <div className="rounded-2xl bg-amber-900/10 p-3 text-brown">
                <Pill className="h-6 w-6" />
              </div>
              <span className="canva-tag rounded-full bg-brass/15 text-brown border border-brass/30 px-3 py-1 font-bold text-xs uppercase">
                Core Subject
              </span>
            </div>

            <h3 className="canva-text mt-6 text-2xl font-bold text-ink font-serif">
              Pharmacology
            </h3>
            <p className="canva-text mt-3 text-sm leading-relaxed text-ink/80">
              Master autonomic, cardiovascular, antimicrobial, and systemic drug mechanisms with clinical mnemonics.
            </p>

            <div className="mt-7">
              <span className="canva-text text-sm text-muted line-through font-medium">₹1,499</span>
              <div className="flex items-end gap-2 mt-1">
                <strong className="canva-text text-3xl font-bold text-ink leading-none font-serif">₹555</strong>
                <span className="canva-text text-xs text-muted pb-1">one-time payment</span>
              </div>
            </div>

            <ul className="mt-7 space-y-3 text-sm text-ink/85 flex-1" aria-label="Pharmacology course features">
              <li className="canva-text flex gap-3">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-brass" />
                <span>90+ High-Yield Pharmacology Video Lectures</span>
              </li>
              <li className="canva-text flex gap-3">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-brass" />
                <span>Mechanism Flowcharts &amp; Drug Mnemonics PDF</span>
              </li>
              <li className="canva-text flex gap-3">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-brass" />
                <span>Private Telegram Batch &amp; Doubt Group Access</span>
              </li>
            </ul>

            <button
              className="canva-button course-button mt-8 w-full rounded-xl px-5 py-3.5 font-bold text-sm shadow-md"
              type="button"
              onClick={() => onSelectCourse('Pharmacology')}
            >
              Select Pharmacology
            </button>
            {onStartFreeTrial && (
              <button
                type="button"
                className="free-trial-trigger-btn"
                onClick={onStartFreeTrial}
              >
                Start Free Trial
                <span className="free-trial-trigger-hint">Free access for {FREE_TRIAL_DURATION_LABEL}, no payment needed</span>
              </button>
            )}
          </article>

          {/* Combined Card (Featured) */}
          <article className="canva-card course-card featured-card relative flex flex-col overflow-hidden rounded-3xl p-7 border-2 border-gold shadow-2xl">
            <div className="canva-banner absolute right-0 top-0 rounded-bl-2xl bg-gold px-4 py-1.5 font-bold text-xs text-espresso uppercase tracking-wider shadow-md">
              ★ Best Value Pack
            </div>

            <div className="flex items-center justify-between">
              <div className="rounded-2xl bg-gold/20 p-3 text-butter">
                <Crown className="h-6 w-6" />
              </div>
            </div>

            <h3 className="canva-text mt-6 text-2xl font-bold text-butter font-serif">
              Combined Special
            </h3>
            <p className="canva-text mt-3 text-sm leading-relaxed text-parchment/90">
              Complete Pharmacology + Pathology syllabus package at the maximum discounted bundle rate.
            </p>

            <div className="mt-7">
              <span className="canva-text text-sm text-parchment/60 line-through font-medium">₹2,999</span>
              <div className="flex items-end gap-2 mt-1">
                <strong className="canva-text text-4xl font-bold text-butter leading-none font-serif">₹855</strong>
                <span className="canva-text text-xs text-parchment/80 pb-1">one-time full access</span>
              </div>
            </div>

            <ul className="mt-7 space-y-3 text-sm text-parchment flex-1" aria-label="Combined course features">
              <li className="canva-text flex gap-3">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-butter" />
                <span>Complete Pharmacology &amp; Pathology Video Access</span>
              </li>
              <li className="canva-text flex gap-3">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-butter" />
                <span>High-Yield Slide Identification &amp; Drug Tables</span>
              </li>
              <li className="canva-text flex gap-3">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-butter" />
                <span>Priority Single-Use Telegram Channel &amp; Updates</span>
              </li>
            </ul>

            <button
              className="canva-button mt-8 w-full rounded-xl bg-butter text-espresso hover:bg-gold transition-colors px-5 py-3.5 font-bold text-sm shadow-xl"
              type="button"
              onClick={() => onSelectCourse('Combined')}
            >
              Select Combined Package
            </button>
            {onStartFreeTrial && (
              <button
                type="button"
                className="free-trial-trigger-btn free-trial-trigger-btn-featured"
                onClick={onStartFreeTrial}
              >
                Start Free Trial
                <span className="free-trial-trigger-hint">Free access for {FREE_TRIAL_DURATION_LABEL}, no payment needed</span>
              </button>
            )}
          </article>

          {/* Pathology Card */}
          <article className="canva-card course-card flex flex-col rounded-3xl p-7 relative">
            <div className="flex items-center justify-between">
              <div className="rounded-2xl bg-amber-900/10 p-3 text-brown">
                <Microscope className="h-6 w-6" />
              </div>
              <span className="canva-tag rounded-full bg-brass/15 text-brown border border-brass/30 px-3 py-1 font-bold text-xs uppercase">
                Core Subject
              </span>
            </div>

            <h3 className="canva-text mt-6 text-2xl font-bold text-ink font-serif">
              Pathology
            </h3>
            <p className="canva-text mt-3 text-sm leading-relaxed text-ink/80">
              General pathology, systemic histopathology, gross specimen slides, and exam case studies.
            </p>

            <div className="mt-7">
              <span className="canva-text text-sm text-muted line-through font-medium">₹999</span>
              <div className="flex items-end gap-2 mt-1">
                <strong className="canva-text text-3xl font-bold text-ink leading-none font-serif">₹355</strong>
                <span className="canva-text text-xs text-muted pb-1">one-time payment</span>
              </div>
            </div>

            <ul className="mt-7 space-y-3 text-sm text-ink/85 flex-1" aria-label="Pathology course features">
              <li className="canva-text flex gap-3">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-brass" />
                <span>85+ High-Yield Pathology Video Modules</span>
              </li>
              <li className="canva-text flex gap-3">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-brass" />
                <span>Gross &amp; Microscopic Histopathology Guide</span>
              </li>
              <li className="canva-text flex gap-3">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-brass" />
                <span>Dedicated Exam Revision Telegram Group Access</span>
              </li>
            </ul>

            <button
              className="canva-button course-button mt-8 w-full rounded-xl px-5 py-3.5 font-bold text-sm shadow-md"
              type="button"
              onClick={() => onSelectCourse('Pathology')}
            >
              Select Pathology
            </button>
            {onStartFreeTrial && (
              <button
                type="button"
                className="free-trial-trigger-btn"
                onClick={onStartFreeTrial}
              >
                Start Free Trial
                <span className="free-trial-trigger-hint">Free access for {FREE_TRIAL_DURATION_LABEL}, no payment needed</span>
              </button>
            )}
          </article>
        </div>
      </div>
    </section>
  );
};
