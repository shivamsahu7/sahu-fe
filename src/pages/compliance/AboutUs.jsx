import React from 'react';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-brand-accent py-20 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-[2.5rem] p-12 shadow-2xl border border-brand-primary/5">
        <div className="inline-block px-4 py-1.5 bg-brand-primary/10 text-brand-primary rounded-full text-[10px] font-bold tracking-[0.2em] uppercase mb-6">
          हमारे बारे में / About Us
        </div>
        <h1 className="text-4xl md:text-5xl font-serif text-slate-800 mb-8 leading-tight">
          Sahu Parivar Matrimony <br />
          <span className="text-brand-primary italic">Trusted by Sahu Society</span>
        </h1>
        
        <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-8">
          <p className="text-lg">
            <span className="font-bold text-slate-800 block mb-2">Sahu Parivar Matrimony साहू समाज के लिए एक समर्पित मंच है।</span>
            We are a dedicated platform for the Sahu community, where familial values, traditions, and modernity blend seamlessly. Our goal is to provide a secure and reliable space for members of the Sahu community to find their perfect life partners.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-y border-slate-100">
            <div>
              <h3 className="text-brand-primary font-bold mb-4 flex items-center gap-2 uppercase text-xs tracking-widest">
                <span>हमारी विशेषताएं / Our Features</span>
              </h3>
              <p className="text-sm">
                सुरक्षित और विश्वसनीय प्रोफाइल: गहन सत्यापन प्रक्रिया। <br />
                <span className="text-slate-400 italic text-xs">Secure and Trusted Profiles: Rigorous verification process for every user.</span>
              </p>
            </div>
            
            <div>
              <h3 className="text-brand-primary font-bold mb-4 flex items-center gap-2 uppercase text-xs tracking-widest">
                <span>हमारा उद्देश्य / Our Vision</span>
              </h3>
              <p className="text-sm">
                हमारा उद्देश्य समाज के हर वर-वधू को उनके आदर्श जीवनसाथी से जोड़ना है। <br />
                <span className="text-slate-400 italic text-xs">Our goal is to connect every groom and bride of the community with their ideal life partner.</span>
              </p>
            </div>
          </div>

          <div className="pt-8">
            <h2 className="text-2xl font-serif text-slate-800 mb-4">Our Legacy</h2>
            <p>
              With over 20 years of experience in the matchmaking industry, SahuSaathi has become a household name within the Sahu community. We take pride in having facilitated thousands of successful marriages, built on a foundation of trust and cultural alignment.
            </p>
          </div>

          <div className="p-8 bg-brand-primary rounded-[2rem] text-white shadow-2xl shadow-brand-primary/20 relative overflow-hidden group">
            <div className="relative z-10">
              <h4 className="text-xl font-serif mb-2">आपकी खुशी, हमारा मिशन</h4>
              <p className="text-sm opacity-90 italic">Your happiness is our mission. Together, let's build the future of the Sahu community.</p>
            </div>
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
