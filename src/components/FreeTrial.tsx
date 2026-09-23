'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Send,
} from 'lucide-react';
import {
  FREE_TRIAL_DURATION_LABEL,
  FREE_TRIAL_TELEGRAM_INVITE,
  FREE_TRIAL_BATCH_OPTIONS,
} from '@/lib/freeTrial';

interface FreeTrialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormState {
  full_name: string;
  college: string;
  batch: string;
  email: string;
  phone: string;
  consent: boolean;
}

const INITIAL_FORM: FormState = {
  full_name: '',
  college: '',
  batch: '',
  email: '',
  phone: '',
  consent: false,
};

export const FreeTrialModal: React.FC<FreeTrialModalProps> = ({ isOpen, onClose }) => {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<FormState & { submit: string }>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Focus first field when modal opens
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => firstFieldRef.current?.focus(), 80);
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) handleClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen]);

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
    // Reset after transition completes
    setTimeout(() => {
      setForm(INITIAL_FORM);
      setErrors({});
      setIsSuccess(false);
      setIsDuplicate(false);
      setIsJoining(false);
    }, 300);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setForm(prev => ({ ...prev, [name]: newValue }));
    // Clear field error on change
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // ── Client-side validation ────────────────────────────────────────────────
  const validate = (): boolean => {
    const newErrors: Partial<FormState & { submit: string }> = {};

    if (!form.full_name.trim() || form.full_name.trim().length < 2) {
      newErrors.full_name = 'Please enter your full name (min 2 characters).';
    }
    if (!form.college.trim()) {
      newErrors.college = 'College name is required.';
    }
    if (!form.batch) {
      newErrors.batch = 'Please select your batch / year.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }
    const cleanPhone = form.phone.replace(/[\s\-().]/g, '');
    if (!/^(\+91|91|0)?[6-9]\d{9}$/.test(cleanPhone)) {
      newErrors.phone = 'Please enter a valid 10-digit Indian mobile number.';
    }
    if (!form.consent) {
      newErrors.consent = true as any;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const res = await fetch('/api/free-trial/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsSuccess(true);
      } else if (data.duplicate) {
        setIsDuplicate(true);
        setErrors({ submit: data.error });
      } else {
        setErrors({ submit: data.error || 'Registration failed. Please try again.' });
      }
    } catch {
      setErrors({ submit: 'Network error. Please check your connection and try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleJoinTelegram = () => {
    setIsJoining(true);
    window.location.href = FREE_TRIAL_TELEGRAM_INVITE;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="free-trial-backdrop"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="free-trial-title"
        ref={modalRef}
        className="free-trial-modal"
      >
        {/* Header */}
        <div className="free-trial-modal-header">
          <div>
            <p className="canva-text free-trial-eyebrow">Limited Time Offer</p>
            <h2 id="free-trial-title" className="canva-text free-trial-title font-serif">
              Start Your Free Trial
            </h2>
            <p className="canva-text free-trial-subtitle">
              Free access for {FREE_TRIAL_DURATION_LABEL} — no payment needed.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="free-trial-close-btn"
            aria-label="Close free trial form"
            disabled={isSubmitting}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="free-trial-modal-body">
          {isSuccess ? (
            /* ── Success state ─────────────────────────────────────────── */
            <div className="free-trial-success" role="status" aria-live="polite">
              <div className="free-trial-success-icon">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h3 className="canva-text free-trial-success-heading font-serif">
                You're registered!
              </h3>
              <p className="canva-text free-trial-success-text">
                Welcome to <strong>Clinical Authority</strong>. Click the button below to join
                your free trial Telegram channel.
              </p>
              <button
                type="button"
                onClick={handleJoinTelegram}
                disabled={isJoining}
                className="canva-button free-trial-join-btn"
              >
                {isJoining ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Opening Telegram…</span>
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    <span>Join Telegram Channel</span>
                  </>
                )}
              </button>
              <p className="canva-text free-trial-success-note">
                Make sure Telegram is installed on your device.
              </p>
            </div>
          ) : (
            /* ── Registration form ─────────────────────────────────────── */
            <form id="free-trial-form" onSubmit={handleSubmit} noValidate>
              <div className="free-trial-grid">
                {/* Full Name */}
                <div className="free-trial-field-wrap">
                  <label className="free-trial-label" htmlFor="ft-full-name">
                    Full Name *
                  </label>
                  <input
                    ref={firstFieldRef}
                    id="ft-full-name"
                    name="full_name"
                    type="text"
                    autoComplete="name"
                    placeholder="e.g. Dr. Priya Sharma"
                    value={form.full_name}
                    onChange={handleChange}
                    className={`form-field free-trial-input${errors.full_name ? ' free-trial-input-error' : ''}`}
                  />
                  {errors.full_name && (
                    <p className="free-trial-field-error">{errors.full_name}</p>
                  )}
                </div>

                {/* College */}
                <div className="free-trial-field-wrap">
                  <label className="free-trial-label" htmlFor="ft-college">
                    College Name *
                  </label>
                  <input
                    id="ft-college"
                    name="college"
                    type="text"
                    autoComplete="organization"
                    placeholder="e.g. AIIMS New Delhi"
                    value={form.college}
                    onChange={handleChange}
                    className={`form-field free-trial-input${errors.college ? ' free-trial-input-error' : ''}`}
                  />
                  {errors.college && (
                    <p className="free-trial-field-error">{errors.college}</p>
                  )}
                </div>

                {/* Batch */}
                <div className="free-trial-field-wrap">
                  <label className="free-trial-label" htmlFor="ft-batch">
                    Batch / Year *
                  </label>
                  <select
                    id="ft-batch"
                    name="batch"
                    value={form.batch}
                    onChange={handleChange}
                    className={`form-field free-trial-input${errors.batch ? ' free-trial-input-error' : ''}`}
                  >
                    <option value="">Select your batch</option>
                    {FREE_TRIAL_BATCH_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  {errors.batch && (
                    <p className="free-trial-field-error">{errors.batch}</p>
                  )}
                </div>

                {/* Email */}
                <div className="free-trial-field-wrap">
                  <label className="free-trial-label" htmlFor="ft-email">
                    Email Address *
                  </label>
                  <input
                    id="ft-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    className={`form-field free-trial-input${errors.email ? ' free-trial-input-error' : ''}`}
                  />
                  {errors.email && (
                    <p className="free-trial-field-error">{errors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div className="free-trial-field-wrap sm:col-span-2">
                  <label className="free-trial-label" htmlFor="ft-phone">
                    Phone Number * <span className="free-trial-label-hint">(10-digit Indian mobile, +91 optional)</span>
                  </label>
                  <input
                    id="ft-phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={handleChange}
                    className={`form-field free-trial-input${errors.phone ? ' free-trial-input-error' : ''}`}
                  />
                  {errors.phone && (
                    <p className="free-trial-field-error">{errors.phone}</p>
                  )}
                </div>
              </div>

              {/* Consent */}
              <label className="free-trial-consent-label" htmlFor="ft-consent">
                <input
                  id="ft-consent"
                  name="consent"
                  type="checkbox"
                  checked={form.consent}
                  onChange={handleChange}
                  className="free-trial-checkbox accent-brown"
                />
                <span className={`canva-text free-trial-consent-text${errors.consent ? ' text-red-600' : ''}`}>
                  I agree to share my details and be contacted about this course. *
                </span>
              </label>
              {errors.consent && (
                <p className="free-trial-field-error mt-1 ml-8">Please accept the consent to continue.</p>
              )}

              {/* Submit error */}
              {errors.submit && (
                <div className={`free-trial-alert${isDuplicate ? ' free-trial-alert-warn' : ' free-trial-alert-error'}`} role="alert">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{errors.submit}</span>
                </div>
              )}

              <button
                id="free-trial-submit-btn"
                type="submit"
                disabled={isSubmitting}
                className="canva-button free-trial-submit-btn"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Registering…</span>
                  </>
                ) : (
                  <span>Register for Free Trial</span>
                )}
              </button>

              <p className="canva-text free-trial-privacy-note">
                Your details are stored securely and never shared publicly.
              </p>
            </form>
          )}
        </div>
      </div>
    </>
  );
};
