import { useState, useEffect } from 'react'
import Login from './components/auth/Login'
import ProfileModal from './components/profile/ProfileModal'
import { getProfileDetails } from './services/profileService'
import './App.css'

function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    // Fetch profile details immediately after login success if needed
    // fetchProfile(); 
  };

  const fetchProfile = async () => {
    setLoadingProfile(true);
    try {
      const data = await getProfileDetails();
      setProfileData(data);
      setIsProfileOpen(true);
    } catch (error) {
      alert("Failed to load profile: " + error.message);
    } finally {
      setLoadingProfile(false);
    }
  };
  return (
    <div className="min-h-screen font-sans bg-brand-accent">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-brand-primary/10 px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-serif font-bold text-brand-primary">
          Eternal<span className="text-brand-secondary">Bonds</span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-slate-600 uppercase tracking-wider">
          <a href="#" className="hover:text-brand-primary transition-colors">Home</a>
          <a href="#about" className="hover:text-brand-primary transition-colors">About Us</a>
        </div>
        <div className="flex gap-4">
          {isLoggedIn ? (
            <button 
              onClick={fetchProfile}
              disabled={loadingProfile}
              className="px-6 py-2 text-sm font-semibold bg-brand-primary text-white rounded-full shadow-lg shadow-brand-primary/20 hover:scale-105 transition-transform cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              {loadingProfile ? (
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              )}
              {loadingProfile ? 'Loading...' : 'My Profile'}
            </button>
          ) : (
            <>
              <button 
                onClick={() => setIsLoginOpen(true)}
                className="px-4 py-2 text-sm font-semibold border border-brand-primary text-brand-primary rounded-full hover:bg-brand-primary hover:text-white transition-all cursor-pointer"
              >
                Login
              </button>
              <button className="px-6 py-2 text-sm font-semibold bg-brand-primary text-white rounded-full shadow-lg shadow-brand-primary/20 hover:scale-105 transition-transform cursor-pointer">
                Register
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main>
        <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
          {/* Hero Content */}
          <div className="relative z-10 text-center px-4 max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-serif text-slate-800 mb-6 leading-tight">
              Begin Your Journey to <br />
              <span className="italic text-brand-primary font-light">Everlasting Love</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
              The world's most trusted matrimony site. Connecting millions of hearts over 25 years.
            </p>
            
            {/* Quick Search Bar */}
            <div className="bg-white p-4 rounded-2xl shadow-2xl shadow-brand-primary/10 flex flex-wrap gap-4 items-center justify-center border border-brand-primary/5">
              <div className="flex flex-col items-start px-4 md:border-r border-slate-100">
                <label className="text-[10px] font-bold uppercase text-slate-400 mb-1">Looking for</label>
                <select className="bg-transparent font-medium text-slate-700 outline-none cursor-pointer">
                  <option>Bride</option>
                  <option>Groom</option>
                </select>
              </div>
              <div className="flex flex-col items-start px-4">
                <label className="text-[10px] font-bold uppercase text-slate-400 mb-1">Age</label>
                <div className="flex gap-2">
                  <select className="bg-transparent font-medium text-slate-700 outline-none cursor-pointer">
                    <option>21</option>
                    <option>25</option>
                    <option>30</option>
                  </select>
                  <span className="text-slate-300">to</span>
                  <select className="bg-transparent font-medium text-slate-700 outline-none cursor-pointer">
                    <option>30</option>
                    <option>35</option>
                    <option>40</option>
                  </select>
                </div>
              </div>
              <button className="bg-brand-primary text-white px-10 py-4 rounded-xl font-bold hover:bg-opacity-90 transition-all shadow-xl shadow-brand-primary/20 cursor-pointer">
                Let's Begin
              </button>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-20 left-10 w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-brand-secondary/10 rounded-full blur-3xl animate-pulse delay-700"></div>
        </section>
        
        {/* Featured Profiles Section */}
        <section className="py-24 px-6 bg-brand-accent/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif text-slate-800 mb-4">Featured Profiles</h2>
              <p className="text-slate-500 max-w-xl mx-auto">Discover our most premium profiles. Handpicked for excellence and compatibility.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Profile Card 1 */}
              <div className="group bg-white rounded-3xl overflow-hidden shadow-xl shadow-brand-primary/5 hover:shadow-2xl hover:shadow-brand-primary/10 transition-all border border-brand-primary/5">
                <div className="relative h-80 overflow-hidden">
                  <img src="/bride_1.png" alt="Ananya" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-brand-primary uppercase tracking-widest">Premium</div>
                </div>
                <div className="p-6 text-left">
                  <h3 className="text-xl font-serif text-slate-800 mb-1">Ananya, 26</h3>
                  <p className="text-slate-500 text-sm mb-4 italic">Software Engineer, Bangalore</p>
                  <button className="w-full py-3 rounded-xl border border-brand-primary/20 text-brand-primary font-semibold text-sm hover:bg-brand-primary hover:text-white transition-all cursor-pointer">View Profile</button>
                </div>
              </div>

              {/* Profile Card 2 */}
              <div className="group bg-white rounded-3xl overflow-hidden shadow-xl shadow-brand-primary/5 hover:shadow-2xl hover:shadow-brand-primary/10 transition-all border border-brand-primary/5">
                <div className="relative h-80 overflow-hidden">
                  <img src="/groom_1.png" alt="Rohan" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 right-4 bg-brand-secondary/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-widest">Verified</div>
                </div>
                <div className="p-6 text-left">
                  <h3 className="text-xl font-serif text-slate-800 mb-1">Rohan, 29</h3>
                  <p className="text-slate-500 text-sm mb-4 italic">Architect, Mumbai</p>
                  <button className="w-full py-3 rounded-xl border border-brand-primary/20 text-brand-primary font-semibold text-sm hover:bg-brand-primary hover:text-white transition-all cursor-pointer">View Profile</button>
                </div>
              </div>

              {/* Profile Card 3 */}
              <div className="group bg-white rounded-3xl overflow-hidden shadow-xl shadow-brand-primary/5 hover:shadow-2xl hover:shadow-brand-primary/10 transition-all border border-brand-primary/5">
                <div className="relative h-80 overflow-hidden">
                  <img src="/bride_2.png" alt="Meera" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-brand-primary uppercase tracking-widest">New</div>
                </div>
                <div className="p-6 text-left">
                  <h3 className="text-xl font-serif text-slate-800 mb-1">Meera, 24</h3>
                  <p className="text-slate-500 text-sm mb-4 italic">Doctor, Delhi</p>
                  <button className="w-full py-3 rounded-xl border border-brand-primary/20 text-brand-primary font-semibold text-sm hover:bg-brand-primary hover:text-white transition-all cursor-pointer">View Profile</button>
                </div>
              </div>

               {/* Profile Card 4 */}
              <div className="group bg-white rounded-3xl overflow-hidden shadow-xl shadow-brand-primary/5 hover:shadow-2xl hover:shadow-brand-primary/10 transition-all border border-brand-primary/5">
                <div className="relative h-80 overflow-hidden">
                  <img src="/groom_2.png" alt="Kabir" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 right-4 bg-brand-secondary/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-widest">Verified</div>
                </div>
                <div className="p-6 text-left">
                  <h3 className="text-xl font-serif text-slate-800 mb-1">Kabir, 31</h3>
                  <p className="text-slate-500 text-sm mb-4 italic">Marketing Manager, Pune</p>
                  <button className="w-full py-3 rounded-xl border border-brand-primary/20 text-brand-primary font-semibold text-sm hover:bg-brand-primary hover:text-white transition-all cursor-pointer">View Profile</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Us Section */}
        <section id="about" className="py-24 px-6 bg-white overflow-hidden relative">
          <div className="max-w-4xl mx-auto relative z-10">
            <div className="text-center mb-16">
               <h2 className="text-4xl md:text-5xl font-serif text-slate-800 mb-2">हमारे बारे में</h2>
               <p className="text-brand-secondary font-medium uppercase tracking-[0.2em] text-xs mb-6">About Us</p>
               <div className="w-24 h-1 bg-brand-secondary mx-auto mb-8 rounded-full"></div>
            </div>
            
            <div className="prose prose-lg max-w-none text-slate-700 leading-relaxed text-center font-medium">
              <div className="mb-16">
                <p className="text-xl md:text-2xl text-brand-primary font-serif italic mb-4">
                  Sahu Parivar Matrmony साहू समाज के लिए एक समर्पित मंच के रूप में, हम आपके लिए एक ऐसा स्थान प्रदान करते हैं जहां पारिवारिक मूल्यों, परंपराओं और आधुनिकता का अद्भुत मेल हो। हमारा उद्देश्य साहू समाज के हर वर और वधू को उनके आदर्श जीवनसाथी से जोड़ना है।
                </p>
                <p className="text-slate-500 text-sm italic max-w-2xl mx-auto">
                  As a dedicated platform for the Sahu community, Sahu Parivar Matrimony provides a space where family values, traditions, and modernity blend perfectly. Our aim is to connect every bride and groom of the Sahu community with their ideal life partner.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left mt-20">
                <div className="bg-brand-accent/50 p-8 rounded-3xl border border-brand-primary/5">
                  <h3 className="text-2xl font-serif text-brand-primary mb-2">हमारी विशेषताएं</h3>
                  <p className="text-brand-secondary text-[10px] font-bold uppercase tracking-wider mb-6">Our Features</p>
                  <ul className="space-y-6 text-sm">
                    <li>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800">● सुरक्षित और विश्वसनीय प्रोफाइल:</span>
                        <span className="text-slate-600 mb-1">प्रत्येक उपयोगकर्ता की जानकारी को गहन सत्यापन प्रक्रिया से गुजारा जाता है ताकि आप निश्चिंत होकर सही निर्णय ले सकें।</span>
                        <span className="text-slate-400 text-[11px] italic">Independent verification process for every profile ensuring secure decisions.</span>
                      </div>
                    </li>
                    <li>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800">● आधुनिक तकनीकी सुविधाएं:</span>
                        <span className="text-slate-600 mb-1">हमारे पास एक उन्नत खोज प्रणाली है, जो आपके स्थान, शिक्षा, जाति, और रुचियों के अनुसार जीवनसाथी खोजने में मदद करती है।</span>
                        <span className="text-slate-400 text-[11px] italic">Advanced search system to find partners based on location, education, caste, and interests.</span>
                      </div>
                    </li>
                    <li>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800">● समुदाय का सशक्तिकरण:</span>
                        <span className="text-slate-600 mb-1">यह वेबसाइट केवल जीवनसाथी खोजने का मंच नहीं है, बल्कि साहू समाज की एकता और प्रगति को बढ़ावा देने का एक प्रयास है।</span>
                        <span className="text-slate-400 text-[11px] italic">A platform not just for matchmaking, but an effort to promote unity and progress within the Sahu community.</span>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200">
                  <h3 className="text-2xl font-serif text-slate-800 mb-2">हमारी सोच</h3>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-6">Our Vision</p>
                  <div className="space-y-4">
                    <p className="text-sm text-slate-600">
                      हमारा मानना है कि एक मजबूत परिवार समाज की नींव है। सही जीवनसाथी ढूंढना केवल एक व्यक्तिगत निर्णय नहीं है, बल्कि एक खुशहाल और स्थिर भविष्य की दिशा में एक कदम है। हम आपके इस सफर को आसान, सुरक्षित और यादगार बनाने के लिए प्रतिबद्ध हैं।
                    </p>
                    <p className="text-slate-400 text-[11px] italic border-t border-slate-200 pt-4">
                      We believe a strong family is the foundation of society. Finding the right partner is not just a personal decision but a step towards a happy and stable future. We are committed to making your journey easy, secure, and memorable.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-20">
                <h3 className="text-3xl font-serif text-slate-800 mb-2">क्यों चुनें हमारी वेबसाइट?</h3>
                <p className="text-brand-secondary text-xs font-bold uppercase tracking-widest mb-10">Why Choose Us?</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary mb-4 font-bold">1</div>
                    <h4 className="font-bold text-slate-800 mb-1">उपयोगकर्ता मित्रवत इंटरफ़ेस</h4>
                    <p className="text-[11px] text-slate-500 mb-2">हमारी वेबसाइट को इस प्रकार डिज़ाइन किया गया है कि हर आयु वर्ग के लोग इसे आसानी से उपयोग कर सकें।</p>
                    <p className="text-[10px] text-slate-400 italic">User-friendly interface designed for all age groups.</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary mb-4 font-bold">2</div>
                    <h4 className="font-bold text-slate-800 mb-1">गोपनीयता और सुरक्षा</h4>
                    <p className="text-[11px] text-slate-500 mb-2">आपकी व्यक्तिगत जानकारी की सुरक्षा हमारी प्राथमिकता है।</p>
                    <p className="text-[10px] text-slate-400 italic">Privacy and security of your personal information is our priority.</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary mb-4 font-bold">3</div>
                    <h4 className="font-bold text-slate-800 mb-1">समर्पित समर्थन</h4>
                    <p className="text-[11px] text-slate-500 mb-2">हमारी टीम हर समय आपकी सहायता के लिए उपलब्ध है।</p>
                    <p className="text-[10px] text-slate-400 italic">Dedicated support team available for your assistance.</p>
                  </div>
                </div>
              </div>

              <div className="mt-24 p-12 bg-brand-primary rounded-[3rem] text-white shadow-2xl shadow-brand-primary/30 relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-3xl font-serif mb-4 text-brand-secondary">हमारी अपील <span className="text-white/50 text-xl font-sans ml-2">/ Our Appeal</span></h3>
                  <p className="mb-4 text-lg opacity-90 leading-relaxed">
                    साहू समाज की इस डिजिटल पहल का हिस्सा बनें और अपने जीवन के सबसे महत्वपूर्ण निर्णय को सरल और प्रभावशाली बनाएं। आइए, साथ मिलकर साहू समाज को एक नई ऊंचाई पर ले चलें।
                  </p>
                  <p className="mb-8 text-sm opacity-70 italic font-light border-t border-white/10 pt-4">
                    Be a part of this digital initiative of the Sahu community and make the most important decision of your life simple and effective. Together, let's take the Sahu community to new heights.
                  </p>
                  <div className="flex flex-col gap-1">
                    <div className="text-2xl font-serif italic text-brand-secondary">"आपका भविष्य, हमारी प्रेरणा।"</div>
                    <div className="text-xs uppercase tracking-[0.2em] opacity-50">Your future, our inspiration.</div>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
              </div>
            </div>
          </div>
          
          {/* Decorative side accent */}
          <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-accent/20 -skew-x-12 translate-x-1/2"></div>
        </section>

        {/* Statistics/Trust Section */}
        <section className="bg-white py-24 px-6 border-y border-brand-primary/5">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="p-8 rounded-2xl hover:bg-brand-accent/50 transition-colors">
              <div className="text-5xl font-serif text-brand-primary mb-3">5M+</div>
              <div className="text-slate-500 font-medium tracking-wide uppercase text-sm">Verified Profiles</div>
            </div>
            <div className="p-8 rounded-2xl hover:bg-brand-accent/50 transition-colors border-x md:border-x border-slate-100">
              <div className="text-5xl font-serif text-brand-primary mb-3">10M+</div>
              <div className="text-slate-500 font-medium tracking-wide uppercase text-sm">Success Stories</div>
            </div>
            <div className="p-8 rounded-2xl hover:bg-brand-accent/50 transition-colors">
              <div className="text-5xl font-serif text-brand-primary mb-3">25 Years</div>
              <div className="text-slate-500 font-medium tracking-wide uppercase text-sm">Of Trusted Service</div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-900 text-white py-16 px-6 text-center border-t border-white/10">
         <div className="text-2xl font-serif font-bold text-brand-secondary mb-6">
          Eternal Bonds
        </div>
        <p className="text-slate-400 text-sm max-w-md mx-auto mb-10 leading-relaxed">
          Helping people find their soulmates since 2001. We believe everyone deserves to find their perfect match in a secure and respectful environment.
        </p>
        <div className="flex justify-center gap-8 text-slate-500 text-xs uppercase tracking-widest font-semibold mb-8">
          <a href="#" className="hover:text-brand-secondary transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-brand-secondary transition-colors">Terms of Use</a>
          <a href="#" className="hover:text-brand-secondary transition-colors">Contact Us</a>
        </div>
        <div className="text-[10px] text-slate-600 uppercase tracking-tighter">
          © 2026 Eternal Bonds Matrimony. All rights reserved.
        </div>
      </footer>

      {/* Auth Modals */}
      <Login 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
        onAuthSuccess={handleLoginSuccess}
      />

      <ProfileModal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
        profileData={profileData}
      />
    </div>
  )
}

export default App
