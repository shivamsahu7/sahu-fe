import { useState, useEffect, useRef } from 'react'
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import ProfilePage from './pages/ProfilePage'
import Login from './components/auth/Login'
import { isAuthenticated, logout } from './services/authService'
import { getProfileDetails } from './services/profileService'
import PrivacyPolicy from './pages/compliance/PrivacyPolicy'
import TermsConditions from './pages/compliance/TermsConditions'
import Disclaimer from './pages/compliance/Disclaimer'
import ContactUs from './pages/compliance/ContactUs'
import AboutUs from './pages/compliance/AboutUs'
import PublicProfile from './pages/PublicProfile'
import ResetPassword from './pages/ResetPassword'
import './App.css'

function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [authView, setAuthView] = useState('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const hasFetchedBrief = useRef(false);

  useEffect(() => {
    if (isAuthenticated()) {
      setIsLoggedIn(true);
      if (!hasFetchedBrief.current) {
        fetchUserBrief();
        hasFetchedBrief.current = true;
      }
    }
  }, []);

  const fetchUserBrief = async () => {
    try {
      const res = await getProfileDetails();
      if (res && res.data) {
        setUserProfile(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch user brief:", error);
    }
  };

  const handleAuthSuccess = () => {
    setIsLoggedIn(true);
    setIsLoginOpen(false);
    fetchUserBrief();
  };

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    navigate('/');
  };

  const scrollToAbout = () => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById('about');
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById('about');
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen font-sans bg-brand-accent flex flex-col">
      {/* Navbar */}
      <nav className="sticky top-0 z-[90] bg-white/80 backdrop-blur-md border-b border-brand-primary/5 py-3 md:py-4 px-4 md:px-12 flex items-center justify-between shrink-0 gap-2">
        <Link to="/" className="flex items-center gap-2 md:gap-3 group shrink-0">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-brand-primary rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg shadow-brand-primary/20 group-hover:rotate-6 transition-transform">
            <span className="text-white font-serif text-xl md:text-2xl font-bold italic">S</span>
          </div>
          <div className="text-left hidden sm:block">
            <span className="block text-lg md:text-xl font-serif text-slate-800 font-bold leading-none">Eternal Bonds</span>
            <span className="text-[8px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] text-brand-primary font-bold">Sahu Matrimony</span>
          </div>
          <div className="text-left sm:hidden">
            <span className="block text-base font-serif text-slate-800 font-bold leading-none">Eternal Bonds</span>
            <span className="text-[8px] uppercase tracking-[0.1em] text-brand-primary font-bold">Sahu Matrimony</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          <Link to="/" className="text-sm font-bold text-slate-600 hover:text-brand-primary transition-colors uppercase tracking-widest">Home</Link>
          <button onClick={scrollToAbout} className="text-sm font-bold text-slate-600 hover:text-brand-primary transition-colors uppercase tracking-widest cursor-pointer border-none bg-transparent">About Us</button>
        </div>

        <div className="flex gap-2 md:gap-4 shrink-0">
          {isLoggedIn ? (
            <div className="flex gap-2 md:gap-3">
              <Link 
                to="/profile"
                className="pl-1 md:pl-2 pr-4 md:pr-6 py-1.5 text-xs md:text-sm font-semibold bg-brand-primary text-white rounded-full shadow-lg shadow-brand-primary/20 hover:scale-105 transition-transform cursor-pointer flex items-center gap-2 md:gap-3"
              >
                <div className="w-6 h-6 md:w-8 md:h-8 rounded-full overflow-hidden border-2 border-white/20 bg-white/10 shrink-0">
                  {userProfile?.profile_image || userProfile?.profileImage ? (
                    <img 
                      src={userProfile.profile_image || userProfile.profileImage} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-brand-primary-dark text-[10px] font-bold uppercase">
                      {userProfile?.first_name?.charAt(0) || 'U'}
                    </div>
                  )}
                </div>
                <span className="hidden sm:inline">My Profile</span>
                <span className="sm:hidden">Profile</span>
              </Link>
              <button 
                onClick={handleLogout}
                className="p-1.5 md:p-2 text-slate-400 hover:text-red-500 transition-colors"
                title="Logout"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          ) : (
            <>
              <button 
                onClick={() => { setAuthView('login'); setIsLoginOpen(true); }}
                className="px-3 md:px-6 py-1.5 md:py-2 text-[10px] md:text-sm font-bold text-brand-primary hover:text-brand-primary-dark transition-all cursor-pointer uppercase tracking-wider md:tracking-widest"
              >
                Login
              </button>
              <button 
                onClick={() => { setAuthView('register'); setIsLoginOpen(true); }}
                className="px-4 md:px-8 py-1.5 md:py-2.5 text-[10px] md:text-sm font-bold bg-brand-primary text-white rounded-full shadow-lg shadow-brand-primary/20 hover:scale-105 transition-transform cursor-pointer uppercase tracking-wider md:tracking-widest"
              >
                Register
              </button>
            </>
          )}
        </div>
      </nav>

      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/user/:slug" element={<PublicProfile />} />
          <Route path="/reset-password/:email/:token" element={<ResetPassword />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsConditions />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/contact" element={<ContactUs />} />
        </Routes>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 py-20 px-6 text-white overflow-hidden relative shrink-0">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10 text-left">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center">
                <span className="text-brand-primary font-serif text-2xl font-bold italic">S</span>
              </div>
              <div className="text-left">
                <span className="block text-xl font-serif text-white font-bold leading-none">Eternal Bonds</span>
                <span className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-bold">Sahu Matrimony</span>
              </div>
            </div>
            <p className="text-slate-400 text-sm max-w-md leading-relaxed mb-8">
              Helping Sahu community members find their perfect life partner for over two decades. Built on trust, tradition, and transparency.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-8">Community</h4>
            <ul className="space-y-4 text-slate-400 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-8">Support</h4>
            <ul className="space-y-4 text-slate-400 text-sm">
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms Conditions</Link></li>
              <li><Link to="/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto pt-12 mt-12 border-t border-white/5 text-center text-slate-500 text-xs tracking-widest uppercase font-bold">
          © 2026 Eternal Bonds Matrimony. All Rights Reserved.
        </div>
        
        {/* Background Decor */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl"></div>
      </footer>

      <Login 
        isOpen={isLoginOpen} 
        initialView={authView}
        onClose={() => setIsLoginOpen(false)} 
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  )
}

export default App
