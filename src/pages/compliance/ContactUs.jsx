import React, { useState } from 'react';
import { submitFeedback } from '../../services/commonService';

const ContactUs = () => {
  const [formData, setFormData] = useState({ name: '', email: '', data: '' });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.data) {
      setStatus({ type: 'error', message: 'Please fill all fields / कृपया सभी फ़ील्ड भरें' });
      return;
    }

    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      await submitFeedback(formData);
      setStatus({ type: 'success', message: 'Message sent successfully! / संदेश सफलतापूर्वक भेजा गया!' });
      setFormData({ name: '', email: '', data: '' });
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Failed to send message' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-accent py-20 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-[2.5rem] p-12 shadow-2xl border border-brand-primary/5">
        <h1 className="text-4xl font-serif text-slate-800 mb-8 leading-tight">Contact Us</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Our Office</h2>
              <p className="text-slate-700 font-medium leading-relaxed">
                SahuSaathi HQ<br />
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
                  <a href="mailto:support@eternalbonds.com" className="text-slate-600 hover:text-brand-primary transition-colors text-sm font-medium">support@eternalbonds.com</a>
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
            <form className="space-y-4" onSubmit={handleSubmit}>
              {status.message && (
                <div className={`p-4 rounded-xl text-xs font-bold ${status.type === 'success' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                  {status.message}
                </div>
              )}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">Full Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="p-3 bg-white rounded-xl border border-slate-100 outline-none focus:border-brand-primary/30 transition-all text-sm" 
                  placeholder="Your Name"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="p-3 bg-white rounded-xl border border-slate-100 outline-none focus:border-brand-primary/30 transition-all text-sm" 
                  placeholder="name@email.com"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">Message</label>
                <textarea 
                  name="data"
                  value={formData.data}
                  onChange={handleChange}
                  className="p-3 bg-white rounded-xl border border-slate-100 outline-none focus:border-brand-primary/30 transition-all text-sm h-32" 
                  placeholder="Tell us about the issue..."
                />
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-brand-primary text-white py-4 rounded-xl font-bold uppercase tracking-[0.2em] text-xs shadow-xl shadow-brand-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
