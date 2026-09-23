'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { SocialProof } from '@/components/SocialProof';
import { Courses } from '@/components/Courses';
import { Process } from '@/components/Process';
import { EnrollmentForm } from '@/components/EnrollmentForm';
import { Testimonials } from '@/components/Testimonials';
import { FAQ } from '@/components/FAQ';
import { Footer } from '@/components/Footer';
import { FreeTrialModal } from '@/components/FreeTrial';

export default function Home() {
  const [selectedCourse, setSelectedCourse] = useState<string>('Combined');
  const [isTrialOpen, setIsTrialOpen] = useState(false);

  const scrollToEnroll = (course?: string) => {
    if (course) {
      setSelectedCourse(course);
    }
    const enrollEl = document.getElementById('enrol');
    if (enrollEl) {
      enrollEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => {
        const input = document.getElementById('student-name');
        if (input) input.focus();
      }, 600);
    }
  };

  return (
    <main className="w-full min-h-screen">
      <Header onScrollToEnroll={() => scrollToEnroll()} />
      <Hero onScrollToEnroll={() => scrollToEnroll()} />
      <SocialProof />
      <Courses
        onSelectCourse={(course) => scrollToEnroll(course)}
        onStartFreeTrial={() => setIsTrialOpen(true)}
      />
      <Process />
      <EnrollmentForm
        selectedCourse={selectedCourse}
        setSelectedCourse={setSelectedCourse}
      />
      <Testimonials />
      <FAQ />
      <Footer onScrollToEnroll={() => scrollToEnroll()} />

      <FreeTrialModal
        isOpen={isTrialOpen}
        onClose={() => setIsTrialOpen(false)}
      />
    </main>
  );
}
