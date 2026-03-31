import React from 'react';

const Disclaimer = () => {
  return (
    <div className="min-h-screen bg-brand-accent py-20 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-[2.5rem] p-12 shadow-2xl border border-brand-primary/5">
        <h1 className="text-4xl font-serif text-slate-800 mb-8 leading-tight">Disclaimer</h1>
        <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-6">
          <section>
            <p>
              The information contained on the SahuSaathi website is for general information purposes only. SahuSaathi assumes no responsibility for errors or omissions in the contents of the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-4 uppercase tracking-widest text-xs">1. Errors and Omissions</h2>
            <p>
              In no event shall SahuSaathi be liable for any special, direct, indirect, consequential, or incidental damages or any damages whatsoever, whether in an action of contract, negligence, or other tort, arising out of or in connection with the use of the service or the contents of the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-4 uppercase tracking-widest text-xs">2. External Links Disclaimer</h2>
            <p>
              The Service may contain links to external websites that are not provided or maintained by or in any way affiliated with SahuSaathi. Please note that SahuSaathi does not guarantee the accuracy, relevance, timeliness, or completeness of any information on these external websites.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-4 uppercase tracking-widest text-xs">3. Profile Authenticity Disclaimer</h2>
            <p>
              While we strive to maintain high standards of profile verification, SahuSaathi does not verify every single detail provided by users. Users are advised to conduct their own independent verification before entering into any matrimonial alliance.
            </p>
          </section>

          <section className="pt-8 border-t border-slate-100">
            <p className="text-sm font-bold text-brand-primary uppercase tracking-[0.2em]">Usage of this site constitutes acceptance of this disclaimer.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Disclaimer;
