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
      <nav className="sticky top-0 z-[90] bg-white/80 backdrop-blur-md border-b border-brand-primary/5 py-2 md:py-3 px-4 md:px-12 flex items-center justify-between shrink-0 gap-2">
        <Link to="/" className="flex items-center gap-2 md:gap-3 group shrink-0">
          <div className="w-9 h-9 md:w-11 md:h-11 bg-brand-primary rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg shadow-brand-primary/20 group-hover:rotate-6 transition-transform">
            <span className="text-white font-serif text-lg md:text-xl font-bold italic">S</span>
          </div>
          <div className="text-left hidden sm:block">
            <span className="block text-base md:text-lg font-serif text-slate-800 font-bold leading-none">Sahu Saathi</span>
            <span className="text-[7px] md:text-[9px] uppercase tracking-[0.2em] md:tracking-[0.3em] text-brand-primary font-bold">SahuSaathi</span>
          </div>
          <div className="text-left sm:hidden">
            <span className="block text-sm font-serif text-slate-800 font-bold leading-none">Sahu Saathi</span>
            <span className="text-[7px] uppercase tracking-[0.1em] text-brand-primary font-bold">SahuSaathi</span>
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
                className="px-4 md:px-6 py-2 md:py-2 text-xs md:text-sm font-bold text-brand-primary hover:text-brand-primary-dark transition-all cursor-pointer uppercase tracking-wider md:tracking-widest"
              >
                Login
              </button>
              <button 
                onClick={() => { setAuthView('register'); setIsLoginOpen(true); }}
                className="px-5 md:px-8 py-2 md:py-2.5 text-xs md:text-sm font-bold bg-brand-primary text-white rounded-full shadow-lg shadow-brand-primary/20 hover:scale-105 transition-transform cursor-pointer uppercase tracking-wider md:tracking-widest"
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
      <footer className="bg-slate-900 py-10 px-6 text-white overflow-hidden relative shrink-0">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
              <span className="text-brand-primary font-serif text-xl font-bold italic">S</span>
            </div>
            <div className="text-left">
              <span className="block text-lg font-serif text-white font-bold leading-none">Sahu Saathi</span>
              <span className="text-[9px] uppercase tracking-[0.2em] text-slate-400 font-bold">SahuSaathi</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-x-12 gap-y-6">
            <div className="flex items-center gap-6">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Community</h4>
              <ul className="flex gap-4 text-slate-400 text-xs">
                <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div className="flex items-center gap-6">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Support</h4>
              <ul className="flex gap-4 text-slate-400 text-xs">
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
                <li><Link to="/terms" className="hover:text-white transition-colors">Terms</Link></li>
                <li><Link to="/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto pt-8 mt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-[10px] tracking-widest uppercase font-bold">
          <span>© 2026 SahuSaathi. All Rights Reserved.</span>
          <span className="hidden md:block text-slate-600">Built for Sahu Society</span>
        </div>
        
        {/* Background Decor */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl"></div>
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
