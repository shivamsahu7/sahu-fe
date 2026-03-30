import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register, verifyOtp, forgotPassword, resetPassword } from '../../services/authService';
import { getLocations } from '../../services/commonService';

const AuthModal = ({ isOpen, onClose, onAuthSuccess, initialView = 'login' }) => {
  const navigate = useNavigate();
  const [view, setView] = useState(initialView); // 'login', 'register', 'verify-otp', 'forgot-password'

  useEffect(() => {
    if (isOpen) {
      setView(initialView);
      setError('');
      setSuccessMsg('');
    }
  }, [isOpen, initialView]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [userId, setUserId] = useState(null);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Registration states
  const [regData, setRegData] = useState({
    first_name: '', last_name: '', date_of_birth: '', gender: 'male',
    state_id: '', district: '', phone: '', relation: 'self'
  });
  const [statesList, setStatesList] = useState([]);
  const [districtsList, setDistrictsList] = useState([]);

  // Fetch states
  useEffect(() => {
    if (view === 'register') {
      getLocations().then(data => setStatesList(data.data || [])).catch(console.error);
    }
  }, [view]);

  // Fetch districts on state change
  useEffect(() => {
    if (regData.state_id) {
      getLocations(regData.state_id).then(data => setDistrictsList(data.data || [])).catch(console.error);
    } else {
      setDistrictsList([]);
    }
  }, [regData.state_id]);

  if (!isOpen) return null;

  const handleSwitchView = (newView) => {
    setView(newView);
    setError('');
    setSuccessMsg('');
    setLoading(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      onAuthSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      // Format YYYY-MM-DD to DD-MM-YYYY expected by API
      let formattedDob = regData.date_of_birth;
      if (formattedDob && formattedDob.includes('-')) {
        const parts = formattedDob.split('-');
        if (parts[0].length === 4) { // ensuring it's YYYY-MM-DD
          formattedDob = `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
      }

      const payload = {
        first_name: regData.first_name,
        last_name: regData.last_name,
        email: email,
        date_of_birth: formattedDob,
        gender: regData.gender,
        state_id: Number(regData.state_id),
        district: Number(regData.district),
        phone: regData.phone,
        password: password,
        relation: regData.relation
      };
      const res = await register(payload);
      if (res.data?.user?.id || res.data?.userId || res.data?.id) {
        setUserId(res.data?.user?.id || res.data?.userId || res.data?.id);
        handleSwitchView('verify-otp');
        setSuccessMsg(`OTP sent to email: ${email}. Please check.`);
      } else {
        // Fallback if userId isn't easily found
        setError('Registered, but could not read userId for OTP verify. Please check backend response.');
      }
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // API expects userId and otp
      await verifyOtp(userId, otp);
      setSuccessMsg('OTP Verified! Redirecting to your profile...');
      onAuthSuccess(); // updates App.jsx state to show logged in
      setTimeout(() => {
        onClose();
        navigate('/profile?edit=true');
      }, 1500);
    } catch (err) {
      setError(err.message || 'OTP Verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await forgotPassword(email);
      setSuccessMsg('If this email exists, a reset token has been sent to it. Please check your inbox and click the reset link!');
    } catch (err) {
      setError(err.message || 'Failed to request password reset.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await resetPassword(email, resetToken, password);
      setSuccessMsg('Password has been securely reset! You can now login.');
      setTimeout(() => {
        handleSwitchView('login');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  // UI Helpers
  const renderError = () => error && (
    <div className="bg-red-50 text-red-600 text-xs p-4 rounded-xl mb-6">{error}</div>
  );
  
  const renderSuccess = () => successMsg && (
    <div className="bg-green-50 text-green-600 text-xs p-4 rounded-xl mb-6">{successMsg}</div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl relative animate-in fade-in zoom-in py-10 px-6 sm:px-10 my-auto">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 z-10">
          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        {view === 'login' && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-serif text-brand-primary mb-2">Welcome Back</h2>
              <p className="text-slate-500 text-sm">Please enter your details to login</p>
            </div>
            {renderError()}{renderSuccess()}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Email Address</label>
                <input type="email" required className="w-full px-4 py-3 bg-slate-50 border rounded-xl" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Password</label>
                <input type={showPassword ? "text" : "password"} required className="w-full px-4 py-3 bg-slate-50 border rounded-xl" value={password} onChange={e => setPassword(e.target.value)} />
              </div>
              <div className="flex justify-between items-center text-xs">
                <button type="button" onClick={() => handleSwitchView('forgot-password')} className="text-brand-primary font-bold hover:underline">Forgot Password?</button>
              </div>
              <button disabled={loading} type="submit" className="w-full py-4 bg-brand-primary text-white rounded-xl font-bold hover:bg-opacity-90 mt-4">{loading ? 'Loading...' : 'Login to Account'}</button>
            </form>
            <div className="mt-8 text-center text-sm">
              <span className="text-slate-500">Don't have an account? </span>
              <button onClick={() => handleSwitchView('register')} className="text-brand-primary font-bold hover:underline">Register Now</button>
            </div>
          </div>
        )}

        {view === 'register' && (
          <div>
            <div className="text-center mb-6">
              <h2 className="text-3xl font-serif text-brand-primary mb-2">Create Account</h2>
              <p className="text-slate-500 text-sm">Join the largest Sahu matrimony community</p>
            </div>
            {renderError()}{renderSuccess()}
            <form onSubmit={handleRegister} className="space-y-4 text-sm max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">First Name</label>
                  <input type="text" required className="w-full px-4 py-2 bg-slate-50 border rounded-xl" value={regData.first_name} onChange={e => setRegData({...regData, first_name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Last Name</label>
                  <input type="text" required className="w-full px-4 py-2 bg-slate-50 border rounded-xl" value={regData.last_name} onChange={e => setRegData({...regData, last_name: e.target.value})} />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Email</label>
                <input type="email" required className="w-full px-4 py-2 bg-slate-50 border rounded-xl" value={email} onChange={e => setEmail(e.target.value)} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Date of Birth</label>
                  <input type="date" required className="w-full px-4 py-2 bg-slate-50 border rounded-xl appearance-none" value={regData.date_of_birth} onChange={e => setRegData({...regData, date_of_birth: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Gender</label>
                  <select className="w-full px-4 py-2 bg-slate-50 border rounded-xl" value={regData.gender} onChange={e => setRegData({...regData, gender: e.target.value})}>
                    <option value="male">Male (Groom)</option>
                    <option value="female">Female (Bride)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">State</label>
                  <select required className="w-full px-4 py-2 bg-slate-50 border rounded-xl" value={regData.state_id} onChange={e => setRegData({...regData, state_id: e.target.value})}>
                    <option value="">Select State</option>
                    {statesList.map(s => <option key={s.id} value={s.id}>{s.name || s.state_name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">District</label>
                  <select required className="w-full px-4 py-2 bg-slate-50 border rounded-xl" value={regData.district} onChange={e => setRegData({...regData, district: e.target.value})}>
                    <option value="">Select District</option>
                    {districtsList.map(d => <option key={d.id} value={d.id}>{d.name || d.district_name}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Phone</label>
                  <input type="tel" required className="w-full px-4 py-2 bg-slate-50 border rounded-xl" value={regData.phone} onChange={e => setRegData({...regData, phone: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Profile For</label>
                  <select className="w-full px-4 py-2 bg-slate-50 border rounded-xl" value={regData.relation} onChange={e => setRegData({...regData, relation: e.target.value})}>
                    <option value="self">Self</option>
                    <option value="son">Son</option>
                    <option value="daughter">Daughter</option>
                    <option value="brother">Brother</option>
                    <option value="sister">Sister</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Create Password</label>
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} required className="w-full px-4 py-2 bg-slate-50 border rounded-xl pr-10" value={password} onChange={e => setPassword(e.target.value)} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-primary focus:outline-none">
                      {showPassword ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Confirm Password</label>
                  <div className="relative">
                    <input type={showConfirmPassword ? "text" : "password"} required className="w-full px-4 py-2 bg-slate-50 border rounded-xl pr-10" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-primary focus:outline-none">
                      {showConfirmPassword ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <button disabled={loading} type="submit" className="w-full py-4 mt-6 bg-brand-primary text-white rounded-xl font-bold hover:bg-opacity-90">{loading ? 'Registering...' : 'Create Account'}</button>
            </form>
            <div className="mt-6 text-center text-sm">
              <span className="text-slate-500">Already have an account? </span>
              <button onClick={() => handleSwitchView('login')} className="text-brand-primary font-bold hover:underline">Login Here</button>
            </div>
          </div>
        )}

        {view === 'verify-otp' && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-serif text-brand-primary mb-2">Verify Account</h2>
              <p className="text-slate-500 text-sm">Please enter the OTP sent to your email</p>
            </div>
            {renderError()}{renderSuccess()}
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">6-Digit OTP</label>
                <input type="text" required className="w-full px-4 py-3 bg-slate-50 border rounded-xl tracking-widest text-center text-xl font-bold" maxLength="6" value={otp} onChange={e => setOtp(e.target.value)} />
              </div>
              <button disabled={loading} type="submit" className="w-full py-4 bg-brand-primary text-white rounded-xl font-bold">{loading ? 'Verifying...' : 'Verify OTP'}</button>
            </form>
          </div>
        )}

        {view === 'forgot-password' && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-serif text-brand-primary mb-2">Forgot Password</h2>
              <p className="text-slate-500 text-sm">We'll send a password reset token to your email</p>
            </div>
            {renderError()}{renderSuccess()}
            <form onSubmit={handleForgotPassword} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Email Address</label>
                <input type="email" required className="w-full px-4 py-3 bg-slate-50 border rounded-xl" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <button disabled={loading} type="submit" className="w-full py-4 bg-brand-primary text-white rounded-xl font-bold">{loading ? 'Sending...' : 'Send Reset Token'}</button>
            </form>
            <div className="mt-6 text-center text-sm">
              <button onClick={() => handleSwitchView('login')} className="text-brand-primary font-bold hover:underline">Back to Login</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AuthModal;
