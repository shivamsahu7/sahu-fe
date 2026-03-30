import React from 'react';

const ContactUs = () => {
  return (
    <div className="min-h-screen bg-brand-accent py-20 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-[2.5rem] p-12 shadow-2xl border border-brand-primary/5">
        <h1 className="text-4xl font-serif text-slate-800 mb-8 leading-tight">Contact Us</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Our Office</h2>
              <p className="text-slate-700 font-medium leading-relaxed">
                Eternal Bonds Matrimony HQ<br />
                Sahu Community Center, 4th Floor<br />
                Civil Lines, Raipur, Chhattisgarh<br />
                India - 492001
              </p>
            </div>

            <div>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Support Hours</h2>
              <p className="text-slate-700 font-medium">Monday - Saturday</p>
              <p className="text-slate-500 text-sm">10:00 AM - 07:00 PM (IST)</p>
            </div>

            <div>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Connect With Us</h2>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <span className="text-brand-primary font-bold text-sm">E:</span>
                  <a href="mailto:support@eternalbonds.id" className="text-slate-600 hover:text-brand-primary transition-colors text-sm font-medium">support@eternalbonds.com</a>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-brand-primary font-bold text-sm">P:</span>
                  <span className="text-slate-600 text-sm font-medium">+91 (771) 400-XXXX</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
            <h2 className="text-xl font-serif text-brand-primary mb-6">Send us a message</h2>
            <form className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">Full Name</label>
                <input type="text" className="p-3 bg-white rounded-xl border border-slate-100 outline-none focus:border-brand-primary/30 transition-all text-sm" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">Email Address</label>
                <input type="email" className="p-3 bg-white rounded-xl border border-slate-100 outline-none focus:border-brand-primary/30 transition-all text-sm" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">Message</label>
                <textarea className="p-3 bg-white rounded-xl border border-slate-100 outline-none focus:border-brand-primary/30 transition-all text-sm h-32" />
              </div>
              <button type="button" className="w-full bg-brand-primary text-white py-4 rounded-xl font-bold uppercase tracking-[0.2em] text-xs shadow-xl shadow-brand-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
