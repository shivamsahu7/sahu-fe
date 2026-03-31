import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-brand-accent py-20 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-[2.5rem] p-12 shadow-2xl border border-brand-primary/5">
        <h1 className="text-4xl font-serif text-slate-800 mb-8 leading-tight">Privacy Policy</h1>
        <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-6">
          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-4 uppercase tracking-widest text-xs">1. Information Collection</h2>
            <p>
              We collect personal information that you provide to us when you register on the SahuSaathi website. This includes but is not limited to your name, contact information, date of birth, gender, occupation, and family details.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-4 uppercase tracking-widest text-xs">2. Use of Information</h2>
            <p>
              The information we collect is used to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide and maintain our service.</li>
              <li>Match you with potential life partners based on your preferences.</li>
              <li>Communicate with you regarding updates, security alerts, and support.</li>
              <li>Improve our website and user experience.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-4 uppercase tracking-widest text-xs">3. Data Security</h2>
            <p>
              We implement a variety of security measures to maintain the safety of your personal information. However, no method of transmission over the Internet or method of electronic storage is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-4 uppercase tracking-widest text-xs">4. Third-Party Services & Advertising</h2>
            <p>
              We may use third-party service providers to monitor and analyze the use of our service. This includes Google AdSense, which uses cookies to serve ads based on your prior visits to our website or other websites.
            </p>
            <p className="mt-2 text-sm italic">
              Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our site and/or other sites on the Internet.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-4 uppercase tracking-widest text-xs">5. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
            </p>
          </section>

          <section className="pt-8 border-t border-slate-100">
            <p className="text-sm font-bold text-brand-primary uppercase tracking-[0.2em]">Last Updated: March 30, 2026</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
