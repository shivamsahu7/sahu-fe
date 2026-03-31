import React from 'react';

const TermsConditions = () => {
  return (
    <div className="min-h-screen bg-brand-accent py-20 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-[2.5rem] p-12 shadow-2xl border border-brand-primary/5">
        <h1 className="text-4xl font-serif text-slate-800 mb-8 leading-tight">Terms & Conditions</h1>
        <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-6">
          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-4 uppercase tracking-widest text-xs">1. Acceptance of Terms</h2>
            <p>
              By accessing and using the SahuSaathi website, you agree to comply with and be bound by these Terms and Conditions. If you do not agree, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-4 uppercase tracking-widest text-xs">2. Eligibility</h2>
            <p>
              Our services are intended for individuals who are of legal marriageable age as per the laws of India. You must be at least 18 years old for females and 21 years old for males.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-4 uppercase tracking-widest text-xs">3. User Responsibility</h2>
            <p>
              Users are responsible for the accuracy of the information provided in their profiles. Any false or misleading information may lead to termination of membership without notice.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-4 uppercase tracking-widest text-xs">4. Privacy</h2>
            <p>
              Your use of our website is also governed by our Privacy Policy. Please review our Privacy Policy to understand how we collect and use your data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-4 uppercase tracking-widest text-xs">5. Limitation of Liability</h2>
            <p>
              SahuSaathi will not be liable for any damages arising out of the use or inability to use our services. We do not guarantee the accuracy of any user-provided information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-4 uppercase tracking-widest text-xs">6. Modifications</h2>
            <p>
              We reserve the right to change these Terms and Conditions at any time. Your continued use of the site signifies your acceptance of any such changes.
            </p>
          </section>

          <section className="pt-8 border-t border-slate-100">
            <p className="text-sm font-bold text-brand-primary uppercase tracking-[0.2em]">Contact us for any questions regarding these terms.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;
