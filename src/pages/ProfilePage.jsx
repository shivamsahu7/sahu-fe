import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { getProfileDetails } from '../services/profileService';
import { isAuthenticated } from '../services/authService';
import EditProfileModal from '../components/profile/EditProfileModal';

const ProfilePage = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('full');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('edit') === 'true') {
      setIsEditModalOpen(true);
      // Clean up URL so it doesn't re-open on refresh
      navigate('/profile', { replace: true });
    }
  }, [location.search, navigate]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const data = await getProfileDetails();
      setProfileData(data);
    } catch (error) {
      console.error("Failed to load profile:", error);
    } finally {
      setLoading(false);
    }
  };
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/');
      return;
    }

    if (!hasFetched.current) {
      fetchProfile();
      hasFetched.current = true;
    }
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-accent">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-10 w-10 text-brand-primary" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-slate-500 font-medium animate-pulse uppercase tracking-[0.2em] text-xs">Loading Profile...</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-accent">
        <p className="text-slate-500">Failed to load profile details.</p>
      </div>
    );
  }

  const { data: profile } = profileData;

  return (
    <div className="min-h-screen bg-brand-accent py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-[2.5rem] overflow-hidden shadow-2xl relative flex flex-col">
        {/* Header/Banner Area */}
        <div className="relative h-48 bg-gradient-to-r from-brand-primary to-brand-primary-dark shrink-0">
          <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 p-1 bg-white rounded-full shadow-xl group/avatar">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white bg-slate-100 relative">
              <img 
                src={profile.profile_image || profile.profileImage || "/uploads/profiles/default-profile.png"} 
                alt={`${profile.first_name} ${profile.last_name}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover/avatar:scale-110"
                onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=" + profile.first_name + "+" + profile.last_name + "&background=800000&color=fff"; }}
              />
              <div 
                onClick={() => {
                  setModalMode('image-only');
                  setIsEditModalOpen(true);
                }}
                className="absolute inset-0 bg-black/20 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
              >
                <div className="bg-white/20 backdrop-blur-md p-2 rounded-full border border-white/30">
                   <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
            </div>
            {/* Quick Edit Badge */}
            <button 
              onClick={() => {
                setModalMode('image-only');
                setIsEditModalOpen(true);
              }}
              className="absolute bottom-2 right-2 w-8 h-8 bg-brand-primary text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white hover:scale-110 active:scale-95 transition-all cursor-pointer z-10"
              title="Change Photo"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="pt-20 px-12 pb-12">
          <div className="flex flex-col items-center text-center mb-10">
            <h2 className="text-4xl font-serif text-slate-800 mb-1">{profile.first_name} {profile.last_name}</h2>
            <p className="text-brand-primary font-semibold tracking-[0.2em] uppercase text-[10px] mb-6">Sahu Community Member</p>
            
            {profile.is_approved === false && (
              <div className="mb-8 w-full bg-amber-50 border border-amber-200 rounded-2xl p-4 md:p-6 text-left shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="bg-amber-100 p-2 rounded-full mt-1 shrink-0">
                    <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-amber-800 mb-1 italic">Profile Verification Pending / प्रोफाइल सत्यापन लंबित</h4>
                    <p className="text-amber-700 text-sm leading-relaxed">
                      Your profile is in progress to verify. Please update your profile; in the next 2 days, it will be verified. Please wait.
                    </p>
                    <p className="text-amber-700 text-sm mt-1 leading-relaxed font-hindi">
                      आपका प्रोफाइल सत्यापन की प्रक्रिया में है। कृपया अपना प्रोफाइल अपडेट करें; अगले 2 दिनों में इसे सत्यापित कर दिया जाएगा। कृपया प्रतीक्षा करें।
                    </p>
                  </div>
                </div>
              </div>
            )}

            {profile.is_approved === true && (
              <div className="mb-8 w-full bg-emerald-50 border border-emerald-200 rounded-2xl p-4 md:p-6 text-left">
                <div className="flex items-start gap-4">
                  <div className="bg-emerald-100 p-2 rounded-full mt-1 shrink-0">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-emerald-800 mb-1 italic">Profile Verified / प्रोफाइल सत्यापित</h4>
                    <p className="text-emerald-700 text-sm leading-relaxed">
                      Your profile has been verified.
                    </p>
                    <p className="text-emerald-700 text-sm mt-1 leading-relaxed font-hindi">
                      आपका प्रोफाइल सत्यापित हो गया है।
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <button 
              onClick={() => {
                setModalMode('full');
                setIsEditModalOpen(true);
              }}
              className="px-8 py-3 bg-brand-primary text-white rounded-full font-bold text-xs uppercase tracking-widest shadow-xl shadow-brand-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Profile
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Section: Personal & Religious */}
            <div className="space-y-6">
              <section className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100">
                <h3 className="text-[10px] font-bold text-brand-primary uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-primary"></span>
                  Personal & Religious Details
                </h3>
                <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                  <DetailItem label="Gender" value={profile.gender} />
                  <DetailItem label="Height" value={profile.height ? `${profile.height} ft` : ''} />
                  <DetailItem label="Date of Birth" value={profile.date_of_birth?.replace(/-/g, '/')} />
                  <DetailItem label="Time of Birth" value={profile.birth_time} />
                  <DetailItem label="Rashi" value={profile.rashi_name} />
                  <DetailItem label="Complexion" value={profile.color_name} />
                  <DetailItem label="Gotr" value={profile.gotr} highlight />
                  <DetailItem label="Mama Gotr" value={profile.mama_gotr} highlight />
                  <DetailItem label="Manglik" value={profile.manglik_dosh ? 'Yes' : 'No'} />
                  <DetailItem label="Physical Disability" value={profile.disability_status ? 'Yes' : 'No'} />
                </div>
              </section>

              <section className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100">
                <h3 className="text-[10px] font-bold text-brand-primary uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-primary"></span>
                  Education & Career
                </h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <DetailItem label="Highest Education" value={profile.education_name} />
                    <DetailItem label="Monthly Salary" value={profile.monthly_salary ? `₹${profile.monthly_salary}` : 'Private'} />
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider mb-1 block">Education Details</span>
                    <p className="text-slate-700 font-medium text-sm">{profile.education_detail || 'Not provided'}</p>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider mb-1 block">Occupation</span>
                    <p className="text-slate-700 font-medium text-sm">{profile.occupation_name}</p>
                    <p className="text-xs text-slate-500 mt-1">{profile.occupation_detail}</p>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Section: Family & Location */}
            <div className="space-y-6">
              <section className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100">
                <h3 className="text-[10px] font-bold text-brand-primary uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-primary"></span>
                  Family Background
                </h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                    <DetailItem label="Father's Name" value={profile.father_name} />
                    <DetailItem label="Father's Occupation" value={profile.father_occupation} />
                    <DetailItem label="Mother's Name" value={profile.mother_name} />
                    <DetailItem label="Mother's Occupation" value={profile.mother_occupation} />
                  </div>
                  <div className="pt-4 border-t border-slate-100 flex items-center gap-8">
                    <div className="text-center">
                      <span className="text-[9px] text-slate-400 uppercase font-bold block mb-1">Brothers</span>
                      <p className="text-sm font-bold text-slate-700">{profile.number_of_brother || 0} Total / {profile.number_of_married_brother || 0} Married</p>
                    </div>
                    <div className="text-center">
                      <span className="text-[9px] text-slate-400 uppercase font-bold block mb-1">Sisters</span>
                      <p className="text-sm font-bold text-slate-700">{profile.number_of_sister || 0} Total / {profile.number_of_married_sister || 0} Married</p>
                    </div>
                  </div>
                  {(profile.about_brother || profile.about_sister) && (
                    <div className="text-xs text-slate-500 bg-white/50 p-3 rounded-xl italic">
                      {profile.about_brother && <p>Brothers: {profile.about_brother}</p>}
                      {profile.about_sister && <p className="mt-1">Sisters: {profile.about_sister}</p>}
                    </div>
                  )}
                </div>
              </section>

              <section className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100">
                <h3 className="text-[10px] font-bold text-brand-primary uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-primary"></span>
                  Location & Address
                </h3>
                <div className="space-y-4">
                  <DetailItem label="Current City" value={[profile.city_name, profile.state_name].filter(Boolean).join(', ')} />
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider mb-1 block">Full Address</span>
                    <p className="text-slate-700 font-medium text-sm leading-relaxed">
                      {profile.village && `${profile.village}, `}{profile.address}
                    </p>
                  </div>
                  {profile.permanent_address && (
                    <div className="pt-3 border-t border-zinc-100">
                      <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider mb-1 block">Permanent Address</span>
                      <p className="text-slate-700 font-medium text-sm leading-relaxed">
                        {profile.permanent_address}
                      </p>
                    </div>
                  )}
                </div>
              </section>

              <div className="bg-brand-primary/5 p-6 rounded-[2rem] border border-brand-primary/10">
                <h4 className="text-xs font-bold text-brand-primary uppercase tracking-widest mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Introduction
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed italic">
                  "{profile.introduction || "A meaningful introduction will help others understand you better. Edit your profile to add more details about yourself and your expectations."}"
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Photo Gallery / Album */}
        {profile.album && profile.album.length > 0 && (
          <div className="px-6 md:px-12 pb-12">
            <div className="bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100">
              <h3 className="text-sm font-bold text-brand-primary uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2-2v12a2 2 0 002 2z" /></svg>
                My Photo Gallery
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {profile.album.map((photo) => (
                  <div key={photo.id} className="aspect-square rounded-2xl overflow-hidden shadow-sm border border-slate-200 group relative">
                    <img 
                      src={photo.url} 
                      alt="Gallery item"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 cursor-pointer"
                      onClick={() => window.open(photo.url, '_blank', 'noopener,noreferrer')}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Support CTA */}
        <div className="px-6 md:px-12 pb-12">
          <div className="bg-brand-primary/5 p-6 rounded-[2rem] border border-brand-primary/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-center md:text-left">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                <svg className="w-6 h-6 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">Facing any problem? / कोई समस्या आ रही है?</h4>
                <p className="text-xs text-slate-500">Please let us know if you encounter any issues. / यदि आपको कोई समस्या आती है तो कृपया हमें बताएं।</p>
              </div>
            </div>
            <Link 
              to="/contact" 
              className="px-8 py-3 bg-white text-brand-primary border border-brand-primary/20 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-brand-primary hover:text-white transition-all shadow-sm"
            >
              Write Message / यहाँ लिखें
            </Link>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-8 border-t border-slate-100 bg-white shrink-0 text-center">
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Profiles verified with SahuSaathi</p>
        </div>
      </div>

      <EditProfileModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        initialData={profileData}
        onUpdateSuccess={fetchProfile}
        mode={modalMode}
      />
    </div>
  );
};

const DetailItem = ({ label, value, highlight }) => (
  <div className="flex flex-col">
    <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">{label}</span>
    <span className={`text-sm font-medium ${highlight ? 'text-brand-primary font-bold' : 'text-slate-700'}`}>
      {value || 'Not provided'}
    </span>
  </div>
);

export default ProfilePage;
