import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from '../services/userService';

const Home = ({ fetchProfile, isLoggedIn, loadingProfile }) => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFiltered, setIsFiltered] = useState(false);

  const [filters, setFilters] = useState({
    gender: 'female',
    min_age: 21,
    max_age: 30
  });

  const fetchUsers = async (currentFilters) => {
    try {
      setLoading(true);
      const data = await userService.fetchUsers(currentFilters);
      setUsers(data.paginatedResults || []);
    } catch (err) {
      setError('Failed to load profiles. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch all default profiles initially without applying the search filters
    fetchUsers();
  }, []);

  const handleSearch = () => {
    fetchUsers(filters);
    setIsFiltered(true);
    const element = document.getElementById('featured-profiles');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const clearFilters = () => {
    fetchUsers();
    setIsFiltered(false);
    setFilters({ gender: 'female', min_age: 21, max_age: 30 });
  };

  return (
    <main>
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-serif text-slate-800 mb-2 leading-tight">
            Begin Your Journey to <br />
            <span className="italic text-brand-primary font-light">Everlasting Love</span>
          </h1>
          <h2 className="text-xl md:text-2xl font-serif text-brand-primary/80 mb-6">
            अनंत प्रेम की अपनी यात्रा शुरू करें
          </h2>
          <p className="text-lg md:text-xl text-slate-600 mb-2 max-w-2xl mx-auto">
            The world's most trusted matrimony site.
          </p>
          <p className="hidden md:block text-base text-slate-500 mb-10 max-w-2xl mx-auto italic">
            दुनिया की सबसे भरोसेमंद मैट्रिमोनी साइट।
          </p>
          
          {/* Quick Search Bar */}
          <div className="bg-white p-4 rounded-2xl shadow-2xl shadow-brand-primary/10 flex flex-wrap gap-4 items-center justify-center border border-brand-primary/5">
            <div className="flex flex-col items-start px-4 md:border-r border-slate-100">
              <label className="text-[10px] font-bold uppercase text-slate-400 mb-1">Looking for</label>
              <select 
                value={filters.gender}
                onChange={(e) => setFilters(prev => ({ ...prev, gender: e.target.value }))}
                className="bg-transparent font-medium text-slate-700 outline-none cursor-pointer"
              >
                <option value="female">Bride</option>
                <option value="male">Groom</option>
              </select>
            </div>
            <div className="flex flex-col items-start px-4">
              <label className="text-[10px] font-bold uppercase text-slate-400 mb-1">Age</label>
              <div className="flex gap-2">
                <select 
                  value={filters.min_age}
                  onChange={(e) => setFilters(prev => ({ ...prev, min_age: Number(e.target.value) }))}
                  className="bg-transparent font-medium text-slate-700 outline-none cursor-pointer"
                >
                  <option value={18}>18</option>
                  <option value={20}>20</option>
                  <option value={21}>21</option>
                  <option value={25}>25</option>
                  <option value={30}>30</option>
                </select>
                <span className="text-slate-300">to</span>
                <select 
                  value={filters.max_age}
                  onChange={(e) => setFilters(prev => ({ ...prev, max_age: Number(e.target.value) }))}
                  className="bg-transparent font-medium text-slate-700 outline-none cursor-pointer"
                >
                  <option value={25}>25</option>
                  <option value={30}>30</option>
                  <option value={35}>35</option>
                  <option value={40}>40</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>
            <button 
              onClick={handleSearch}
              className="bg-brand-primary text-white px-10 py-4 rounded-xl font-bold hover:bg-opacity-90 transition-all shadow-xl shadow-brand-primary/20 cursor-pointer"
            >
              Search
            </button>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-brand-secondary/10 rounded-full blur-3xl animate-pulse delay-700"></div>
      </section>
      
      {/* Featured Profiles Section */}
      <section id="featured-profiles" className="py-24 px-6 bg-brand-accent/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif text-slate-800 mb-4">Featured Profiles</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Discover our most premium profiles. Handpicked for excellence and compatibility.</p>
          </div>
          
          {/* Active Filter Status indicator */}
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8 pb-4 border-b border-brand-primary/10">
            <h3 className="text-lg font-serif text-slate-700 font-bold mb-4 sm:mb-0">
              {isFiltered 
                ? `Showing results for: ${filters.gender === 'female' ? 'Brides' : 'Grooms'} (Age ${filters.min_age}-${filters.max_age})` 
                : "Showing All Profiles"}
            </h3>
            {isFiltered && (
              <button 
                onClick={clearFilters}
                className="px-4 py-2 bg-white text-slate-500 text-xs font-bold uppercase tracking-widest rounded-lg border border-slate-200 hover:bg-slate-50 hover:text-slate-800 transition-colors shadow-sm cursor-pointer flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                Clear Filters
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {loading ? (
              // Loading Skeletons
              [...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-xl border border-brand-primary/5 animate-pulse">
                  <div className="h-80 bg-slate-200" />
                  <div className="p-6 space-y-3">
                    <div className="h-6 bg-slate-200 rounded w-3/4" />
                    <div className="h-4 bg-slate-200 rounded w-1/2" />
                    <div className="h-10 bg-slate-200 rounded-xl w-full" />
                  </div>
                </div>
              ))
            ) : error ? (
              <div className="col-span-full text-center py-10">
                <p className="text-red-500 font-medium">{error}</p>
              </div>
            ) : users.length > 0 ? (
              users.map((user) => (
                <div key={user.id} className="group bg-white rounded-3xl overflow-hidden shadow-xl shadow-brand-primary/5 hover:shadow-2xl hover:shadow-brand-primary/10 transition-all border border-brand-primary/5">
                  <div className="relative h-80 overflow-hidden">
                    <img 
                      src={user.profile_image || '/default-avatar.png'} 
                      alt={`${user.first_name} ${user.last_name}`} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=" + user.first_name + "+" + user.last_name + "&background=800000&color=fff"; }}
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-brand-primary uppercase tracking-widest">Verified</div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-xs font-medium">{user.district_name}, {user.state_name}</p>
                    </div>
                  </div>
                  <div className="p-6 text-left">
                    <h3 className="text-xl font-serif text-slate-800 mb-1">{user.first_name} {user.last_name}, {user.age}</h3>
                    <div className="flex items-center gap-1.5 text-slate-500 mb-4">
                      <svg className="w-4 h-4 text-brand-primary opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <p className="text-sm italic truncate">
                        {user.city_name ? `${user.city_name}, ` : ''}{user.district_name}, {user.state_name}
                      </p>
                    </div>
                    <button 
                      onClick={() => navigate(`/user/${user.slug}`)}
                      className="w-full py-3 rounded-xl border border-brand-primary/20 text-brand-primary font-semibold text-sm hover:bg-brand-primary hover:text-white transition-all cursor-pointer"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-slate-500">No profiles found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Trust Stats */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          <div>
            <div className="text-4xl font-serif text-brand-primary mb-2">1M+</div>
            <div className="text-slate-500 text-sm font-medium uppercase tracking-widest">Happy Couples</div>
          </div>
          <div>
            <div className="text-4xl font-serif text-brand-primary mb-2">25Yrs</div>
            <div className="text-slate-500 text-sm font-medium uppercase tracking-widest">Legacy of Trust</div>
          </div>
          <div>
            <div className="text-4xl font-serif text-brand-primary mb-2">100%</div>
            <div className="text-slate-500 text-sm font-medium uppercase tracking-widest">Verified Profiles</div>
          </div>
          <div>
            <div className="text-4xl font-serif text-brand-primary mb-2">Private</div>
            <div className="text-slate-500 text-sm font-medium uppercase tracking-widest">Secure Messaging</div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-24 px-6 bg-slate-50 relative overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="w-full md:w-1/2">
            <div className="inline-block px-4 py-1.5 bg-brand-primary/10 text-brand-primary rounded-full text-[10px] font-bold tracking-[0.2em] uppercase mb-6">
              हमारे बारे में / About Us
            </div>
            <h2 className="text-4xl md:text-5xl font-serif text-slate-800 mb-8 leading-tight">
              Sahu Parivar Matrimony <br />
              <span className="text-brand-primary italic">Trusted by Sahu Society</span>
            </h2>
            <div className="space-y-8 text-slate-600 leading-relaxed">
              <p className="text-lg">
                <span className="font-bold text-slate-800 block mb-2">Sahu Parivar Matrimony साहू समाज के लिए एक समर्पित मंच है।</span>
                We are a dedicated platform for the Sahu community, where familial values, traditions, and modernity blend seamlessly.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                <div>
                  <h3 className="text-brand-primary font-bold mb-2 flex items-center gap-2 uppercase text-xs tracking-widest">
                    <span>हमारी विशेषताएं / Our Features</span>
                  </h3>
                  <p className="text-sm">
                    सुरक्षित और विश्वसनीय प्रोफाइल: गहन सत्यापन प्रक्रिया। <br />
                    <span className="text-slate-400 italic text-xs">Secure and Trusted Profiles: Rigorous verification process for every user.</span>
                  </p>
                </div>
                
                <div>
                  <h3 className="text-brand-primary font-bold mb-2 flex items-center gap-2 uppercase text-xs tracking-widest">
                    <span>हमारा उद्देश्य / Our Vision</span>
                  </h3>
                  <p className="text-sm">
                    हमारा उद्देश्य समाज के हर वर-वधू को उनके आदर्श जीवनसाथी से जोड़ना है। <br />
                    <span className="text-slate-400 italic text-xs">Our goal is to connect every groom and bride of the community with their ideal life partner.</span>
                  </p>
                </div>
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
          
          <div className="w-full md:w-1/2 relative bg-white p-4 rounded-[2.5rem] shadow-2xl border border-brand-primary/5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4 pt-12">
                <div className="aspect-[4/5] bg-slate-100 rounded-2xl overflow-hidden shadow-inner">
                  <img src="/bride_ avatar_1_1774869909415.png" className="w-full h-full object-cover" onError={(e) => { e.target.src = "https://ui-avatars.com/api/?background=800000&color=fff"; }} />
                </div>
                <div className="aspect-square bg-slate-100 rounded-2xl overflow-hidden shadow-inner">
                  <img src="/groom_ avatar_1_1774869926498.png" className="w-full h-full object-cover" onError={(e) => { e.target.src = "https://ui-avatars.com/api/?background=f5f5dc&color=800000"; }} />
                </div>
              </div>
              <div className="space-y-4">
                <div className="aspect-square bg-slate-100 rounded-2xl overflow-hidden shadow-inner">
                  <img src="/bride_ avatar_2_1774869945651.png" className="w-full h-full object-cover" onError={(e) => { e.target.src = "https://ui-avatars.com/api/?background=ffd700&color=000"; }} />
                </div>
                <div className="aspect-[4/5] bg-slate-100 rounded-2xl overflow-hidden shadow-inner">
                   <img src="/groom_ avatar_2_1774869963243.png" className="w-full h-full object-cover" onError={(e) => { e.target.src = "https://ui-avatars.com/api/?background=800000&color=fff"; }} />
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-3xl shadow-xl border border-slate-50 flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-0.5">Community Verified</div>
                <div className="text-sm text-slate-700 font-bold">Authorized Platform</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;

