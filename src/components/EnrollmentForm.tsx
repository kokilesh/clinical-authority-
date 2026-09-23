'use client';

import React, { useState } from 'react';
import {
  ScrollText,
  LockKeyhole,
  CheckCircle2,
  Loader2,
  ShieldAlert,
  ExternalLink,
  Pill,
  Microscope,
} from 'lucide-react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface EnrollmentFormProps {
  selectedCourse: string;
  setSelectedCourse: (course: string) => void;
}

export const EnrollmentForm: React.FC<EnrollmentFormProps> = ({
  selectedCourse,
  setSelectedCourse,
}) => {
  const [formData, setFormData] = useState({
    student_name: '',
    college_name: '',
    city: '',
    roll_number: '',
    signature_name: '',
    agreed_to_terms: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [completedOrderId, setCompletedOrderId] = useState('');
  const [availableChannels, setAvailableChannels] = useState<string[]>([]);
  const [redirectingChannel, setRedirectingChannel] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCourse(e.target.value);
  };

  /** On-demand: calls backend to create a 15-min single-use link, then redirects immediately */
  const handleJoinChannel = async (channel: string) => {
    setRedirectingChannel(channel);
    setErrorMessage('');

    try {
      const res = await fetch('/api/telegram/generate-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id: completedOrderId,
          channel,
          student_name: formData.student_name,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.invite_link) {
        window.location.href = data.invite_link;
      } else {
        setErrorMessage(
          data.error || `Could not generate invite link for ${channel}. Please try again.`
        );
        setRedirectingChannel(null);
      }
    } catch (err) {
      console.error('Channel redirect error:', err);
      setErrorMessage('Network error connecting to Telegram service.');
      setRedirectingChannel(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (
      !formData.student_name ||
      !formData.college_name ||
      !selectedCourse ||
      !formData.signature_name ||
      !formData.agreed_to_terms
    ) {
      setErrorMessage(
        'Please complete all required fields, sign the document, and accept the agreement.'
      );
      return;
    }

    if (
      formData.student_name.trim().toLowerCase() !==
      formData.signature_name.trim().toLowerCase()
    ) {
      setErrorMessage(
        'Your typed digital signature must match the full student name entered above.'
      );
      return;
    }

    setIsLoading(true);

    try {
      // Step 1: Create Order via Backend API
      const res = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          course_selected: selectedCourse,
        }),
      });

      const orderData = await res.json();

      if (!res.ok || orderData.error) {
        setErrorMessage(orderData.error || 'Failed to initialize payment.');
        setIsLoading(false);
        return;
      }

      // Step 2: Configure Razorpay Checkout Options
      const options = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Clinical Authority',
        description: `Enrollment — ${selectedCourse}`,
        order_id: orderData.order_id.startsWith('order_demo_') ? undefined : orderData.order_id,
        prefill: {
          name: formData.student_name,
        },
        notes: {
          college_name: formData.college_name,
          course_selected: selectedCourse,
        },
        theme: {
          color: '#65432d',
        },
        handler: async function (response: any) {
          await verifyAndShowSuccess(orderData.order_id, response);
        },
        modal: {
          ondismiss: function () {
            setIsLoading(false);
          },
        },
      };

      // Open Razorpay checkout or simulate for dev
      if (typeof window !== 'undefined' && window.Razorpay && orderData.key_id) {
        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response: any) {
          setErrorMessage(
            response.error?.description || 'Payment failed. Please try again.'
          );
          setIsLoading(false);
        });
        rzp.open();
      } else {
        // Dev simulation when Razorpay SDK or key is not loaded
        console.warn('Razorpay SDK not loaded or key not configured. Simulating checkout.');
        setTimeout(async () => {
          await verifyAndShowSuccess(orderData.order_id, {
            razorpay_payment_id: `pay_demo_${Date.now()}`,
            razorpay_signature: 'demo_signature',
          });
        }, 1200);
      }
    } catch (err: any) {
      console.error('Submit Exception:', err);
      setErrorMessage('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  /** Verify payment & transition to success view */
  const verifyAndShowSuccess = async (orderId: string, razorpayResponse: any) => {
    try {
      const verifyRes = await fetch('/api/razorpay/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id: orderId,
          razorpay_payment_id: razorpayResponse.razorpay_payment_id || `pay_demo_${Date.now()}`,
          razorpay_signature: razorpayResponse.razorpay_signature || '',
          student_name: formData.student_name,
          course_selected: selectedCourse,
        }),
      });

      const verifyData = await verifyRes.json();

      if (verifyRes.ok && verifyData.success) {
        setCompletedOrderId(orderId);
        setAvailableChannels(verifyData.channels || []);
        setIsSuccess(true);
      } else {
        setErrorMessage(
          verifyData.error || 'Payment verification failed. Please contact support.'
        );
      }
    } catch (verifyErr) {
      console.error('Payment verify exception:', verifyErr);
      setErrorMessage('Network error while verifying payment.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetForm = () => {
    setIsSuccess(false);
    setCompletedOrderId('');
    setAvailableChannels([]);
    setRedirectingChannel(null);
    setFormData({
      student_name: '',
      college_name: '',
      city: '',
      roll_number: '',
      signature_name: '',
      agreed_to_terms: false,
    });
    setErrorMessage('');
  };

  const channelIcon = (channel: string) => {
    if (channel === 'Pharmacology') return <Pill className="h-5 w-5" />;
    if (channel === 'Pathology') return <Microscope className="h-5 w-5" />;
    return null;
  };

  return (
    <section id="enrol" className="paper-texture py-20 lg:py-28 border-b border-brown/15">
      <div className="section-wrap grid gap-10 lg:grid-cols-[.75fr_1.25fr]">
        <aside>
          <div className="sticky top-28">
            <p className="canva-text eyebrow text-xs font-bold text-brass tracking-widest uppercase">
              Student Verification
            </p>
            <h2 className="canva-text mt-4 text-3xl font-bold leading-tight text-ink font-serif">
              Verification &amp; Enrollment Form
            </h2>
            <p className="canva-text mt-5 text-sm leading-relaxed text-ink/80">
              Please enter your medical college details accurately. Access links are generated specifically for verified students upon payment completion.
            </p>

            <div className="canva-card mt-8 rounded-2xl p-5 border border-brown/20 bg-parchment/50">
              <div className="flex gap-3">
                <LockKeyhole className="mt-0.5 h-5 w-5 shrink-0 text-brass" />
                <div>
                  <h3 className="canva-text font-bold text-sm text-ink font-serif">
                    Secure Instant Processing
                  </h3>
                  <p className="canva-text mt-2 text-xs leading-relaxed text-ink/75">
                    Clicking &quot;Join Channel&quot; generates a 15-minute single-use Telegram link and opens the channel instantly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <div className="canva-panel rounded-3xl p-6 shadow-xl sm:p-9 border border-brown/15 bg-paper">
          {!isSuccess ? (
            <form id="verification-form" onSubmit={handleSubmit} noValidate>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="canva-text mb-2 block font-bold text-xs uppercase tracking-wider text-brown" htmlFor="student-name">
                    Student Full Name *
                  </label>
                  <input
                    className="canva-input form-field"
                    id="student-name"
                    name="student_name"
                    type="text"
                    placeholder="e.g. Dr. Rohan Sharma"
                    value={formData.student_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <label className="canva-text mb-2 block font-bold text-xs uppercase tracking-wider text-brown" htmlFor="college-name">
                    Medical College Name *
                  </label>
                  <select
                    className="form-field"
                    id="college-name"
                    name="college_name"
                    value={formData.college_name}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select your medical college</option>
                    <option value="Government Medical College (GMC)">Government Medical College (GMC)</option>
                    <option value="State Medical University">State Medical University</option>
                    <option value="Institute of Medical Sciences (IMS)">Institute of Medical Sciences (IMS)</option>
                    <option value="King George's Medical University (KGMU)">King George&apos;s Medical University (KGMU)</option>
                    <option value="All India Institute of Medical Sciences (AIIMS)">All India Institute of Medical Sciences (AIIMS)</option>
                    <option value="Other Selected Medical College">Other Selected Medical College</option>
                  </select>
                </div>

                <div>
                  <label className="canva-text mb-2 block font-bold text-xs uppercase tracking-wider text-brown" htmlFor="city">
                    City / Campus Location
                  </label>
                  <input
                    className="canva-input form-field"
                    id="city"
                    name="city"
                    type="text"
                    placeholder="e.g. Mumbai / Delhi / Lucknow"
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label className="canva-text mb-2 block font-bold text-xs uppercase tracking-wider text-brown" htmlFor="roll-number">
                    Student Roll Number / Enrollment ID
                  </label>
                  <input
                    className="canva-input form-field"
                    id="roll-number"
                    name="roll_number"
                    type="text"
                    placeholder="e.g. MBBS/2023/104"
                    value={formData.roll_number}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="canva-text mb-2 block font-bold text-xs uppercase tracking-wider text-brown" htmlFor="course-selected">
                    Selected Medical Course *
                  </label>
                  <select
                    className="form-field font-bold text-ink"
                    id="course-selected"
                    name="course_selected"
                    value={selectedCourse}
                    onChange={handleCourseChange}
                    required
                  >
                    <option value="">Choose a course</option>
                    <option value="Pharmacology">Pharmacology Course — ₹555</option>
                    <option value="Pathology">Pathology Course — ₹355</option>
                    <option value="Combined">Combined Special Package — ₹855 (Best Value)</option>
                  </select>
                </div>
              </div>

              {/* Scrollable Agreement / Terms Document */}
              <section className="canva-panel agreement-document mt-7 rounded-2xl p-5 sm:p-7" aria-labelledby="agreement-heading">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-brown/10 p-2 text-brown shrink-0">
                    <ScrollText className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 id="agreement-heading" className="canva-text font-bold text-base text-ink font-serif">
                      Non-Disclosure &amp; Student Content Licensing Agreement
                    </h3>
                    <p className="canva-text mt-2 text-xs leading-relaxed text-ink/80">
                      Please read these terms carefully before completing enrollment.
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-4 text-xs text-ink/80">
                  <div className="agreement-clause">
                    <h4 className="canva-text font-bold text-ink text-xs uppercase tracking-wider">
                      1. Proprietary Medical Content
                    </h4>
                    <p className="canva-text mt-1 leading-relaxed">
                      All video lectures, PDF notes, histopathology charts, and pharmacology mnemonics provided by Clinical Authority are protected intellectual property.
                    </p>
                  </div>

                  <div className="agreement-clause">
                    <h4 className="canva-text font-bold text-ink text-xs uppercase tracking-wider">
                      2. Personal Single-Student License
                    </h4>
                    <p className="canva-text mt-1 leading-relaxed">
                      Course enrollment grants a personal, non-transferable license exclusively to the verified individual named on this registration form.
                    </p>
                  </div>

                  <div className="agreement-clause">
                    <h4 className="canva-text font-bold text-ink text-xs uppercase tracking-wider">
                      3. Strict Prohibition of Sharing &amp; Screen Recording
                    </h4>
                    <p className="canva-text mt-1 leading-relaxed">
                      Screen recording, re-broadcasting, credential sharing, or forwarding Telegram single-use join links is strictly forbidden and monitored.
                    </p>
                  </div>

                  <div className="agreement-clause">
                    <h4 className="canva-text font-bold text-ink text-xs uppercase tracking-wider">
                      4. Automated Watermarking &amp; Tracking
                    </h4>
                    <p className="canva-text mt-1 leading-relaxed">
                      Materials distributed via Telegram channels are watermarked with digital student session tokens to detect unauthorized leaks.
                    </p>
                  </div>

                  <div className="agreement-clause">
                    <h4 className="canva-text font-bold text-ink text-xs uppercase tracking-wider">
                      5. Legal Enforcement
                    </h4>
                    <p className="canva-text mt-1 leading-relaxed">
                      Violations will result in immediate termination of course access without refund and escalation under applicable copyright regulations.
                    </p>
                  </div>
                </div>
              </section>

              <div className="mt-7">
                <label className="canva-text mb-2 block font-bold text-xs uppercase tracking-wider text-brown" htmlFor="signature-name">
                  Type Digital Signature (Must match Student Full Name) *
                </label>
                <input
                  className="canva-input form-field signature-field text-lg font-serif"
                  id="signature-name"
                  name="signature_name"
                  type="text"
                  placeholder="e.g. Dr. Rohan Sharma"
                  value={formData.signature_name}
                  onChange={handleInputChange}
                  required
                />
                <p className="canva-text mt-2 text-[11px] text-muted">
                  By typing your full legal name above, you acknowledge this as your binding digital signature.
                </p>
              </div>

              <label className="mt-6 flex cursor-pointer items-start gap-3">
                <input
                  id="terms-agreement"
                  name="agreed_to_terms"
                  type="checkbox"
                  checked={formData.agreed_to_terms}
                  onChange={handleInputChange}
                  className="mt-1 h-5 w-5 rounded border-brown/40 accent-brown"
                  required
                />
                <span className="canva-text text-xs leading-relaxed text-ink/85">
                  I agree to the Non-Disclosure Agreement terms, confirm my student details are true, and understand that sharing Telegram access links will terminate access.
                </span>
              </label>

              {errorMessage && (
                <div className="mt-5 rounded-xl bg-red-50 p-4 border border-red-200 text-red-900 text-xs font-medium">
                  {errorMessage}
                </div>
              )}

              <button
                id="submit-button"
                className="canva-button button-primary mt-7 flex w-full items-center justify-center gap-2 rounded-xl px-6 py-4 font-bold text-base shadow-lg disabled:opacity-50"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Processing Enrollment &amp; Payment...</span>
                  </>
                ) : (
                  <span>Proceed to Razorpay Checkout — ₹{selectedCourse === 'Pharmacology' ? '555' : selectedCourse === 'Pathology' ? '355' : '855'}</span>
                )}
              </button>

              <p className="canva-text mt-4 text-center text-[11px] text-muted leading-relaxed">
                Encrypted payment processing via Razorpay SSL • Instant Automated Telegram Access
              </p>
            </form>
          ) : (
            /* ═══════ SUCCESS PANEL — On-Demand Join Buttons (no visible links) ═══════ */
            <div id="success-panel" className="py-8 text-center" tabIndex={-1}>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                <CheckCircle2 className="h-9 w-9" />
              </div>

              <h2 className="canva-text mt-6 text-3xl font-bold text-ink font-serif">
                Enrollment &amp; Verification Complete!
              </h2>

              <p className="canva-text mx-auto mt-3 max-w-xl text-sm leading-relaxed text-ink/80">
                Welcome to <strong>Clinical Authority</strong>. Your payment has been verified and your student profile is registered.
                {availableChannels.length > 1 && (
                  <> Click each button below to join your respective course channels.</>
                )}
              </p>

              {errorMessage && (
                <div className="mt-5 max-w-xl mx-auto rounded-xl bg-red-50 p-4 border border-red-200 text-red-900 text-xs font-medium">
                  {errorMessage}
                </div>
              )}

              {/* Channel Join Buttons — no raw URLs shown */}
              <div className="mt-7 max-w-xl mx-auto space-y-4">
                {availableChannels.map((channel, idx) => {
                  const isRedirectingThis = redirectingChannel === channel;
                  const isRedirectingAny = redirectingChannel !== null;

                  return (
                    <div
                      key={idx}
                      className="rounded-2xl bg-parchment/70 p-5 border border-brass/40 text-left shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-brown/10 p-2.5 text-brown">
                          {channelIcon(channel)}
                        </div>
                        <div>
                          <p className="canva-text font-bold text-base text-ink font-serif">
                            {channel} Channel
                          </p>
                          <p className="canva-text text-xs text-muted">
                            Single-use link • Expires in 15 min
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleJoinChannel(channel)}
                        disabled={isRedirectingAny}
                        className="canva-button shrink-0 flex items-center justify-center gap-2 w-full sm:w-auto py-3 px-6 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-60 text-white font-bold text-sm shadow-md transition-colors"
                      >
                        {isRedirectingThis ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Redirecting...</span>
                          </>
                        ) : (
                          <>
                            <span>Join {channel} Channel</span>
                            <ExternalLink className="h-4 w-4" />
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="canva-banner mx-auto mt-6 max-w-xl rounded-2xl p-5 text-left bg-amber-50 border border-amber-200">
                <p className="canva-text flex gap-3 text-xs leading-relaxed text-amber-900">
                  <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-800" />
                  <span>
                    <strong>Important:</strong> Clicking &quot;Join Channel&quot; generates a single-use link valid for 15 minutes. Make sure Telegram is installed on your device.
                  </span>
                </p>
              </div>

              <button
                className="canva-button button-secondary mt-8 rounded-full border border-brown/30 px-6 py-3 font-bold text-sm text-ink hover:bg-parchment/40"
                onClick={handleResetForm}
                type="button"
              >
                Enroll Another Student
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
