import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import userService from '../services/userService';

const calculateAge = (dobString) => {
  if (!dobString) return null;
  let formattedDob = dobString;
  // Convert DD-MM-YYYY to YYYY-MM-DD for Date parsing
  if (/^\d{2}-\d{2}-\d{4}$/.test(dobString)) {
    const [day, month, year] = dobString.split('-');
    formattedDob = `${year}-${month}-${day}`;
  }
  const dob = new Date(formattedDob);
  if (isNaN(dob.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
};

const PublicProfile = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await userService.fetchUserProfile(slug);
        setProfile(data.data || data); // Depending on API response structure
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile. The user may not exist or the link is invalid.");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProfile();
    }
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Loading profile...</p>
        </div>
      </main>
    );
  }

  if (error || !profile) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white p-10 rounded-3xl shadow-xl max-w-md text-center">
          <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-serif text-slate-800 mb-2">Profile Not Found</h2>
          <p className="text-slate-500 mb-8">{error || "The profile you are looking for does not exist."}</p>
          <button 
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-brand-primary text-white rounded-xl font-bold shadow-lg shadow-brand-primary/20 hover:scale-105 transition-transform"
          >
            Back to Home
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-brand-primary transition-colors font-medium mb-4"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>

        {/* Header Profile Card */}
        <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden relative">
          <div className="h-48 bg-gradient-to-r from-brand-primary to-brand-secondary opacity-90"></div>
          
          <div className="px-8 pb-8 flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8 -mt-24 relative z-10">
            <div className="w-48 h-48 rounded-full border-8 border-white overflow-hidden bg-white shadow-xl shrink-0">
              <img 
                src={profile.profile_image || '/default-avatar.png'} 
                alt={`${profile.first_name} ${profile.last_name}`}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=" + (profile.first_name || 'U') + "+" + (profile.last_name || '') + "&background=800000&color=fff"; }}
              />
            </div>
            
            <div className="flex-1 text-center md:text-left pt-4 md:pt-0">
              <div className="inline-block px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-bold tracking-widest uppercase mb-2">Verified Profile</div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-800 mb-2">
                {profile.first_name} {profile.last_name}
              </h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-3 text-slate-500 font-medium">
                <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                  <svg className="w-4 h-4 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {profile.age || calculateAge(profile.date_of_birth || profile.dob) || 'N/A'} yrs
                </div>
                <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                  <svg className="w-4 h-4 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  {profile.gender === 'male' ? 'Groom' : profile.gender === 'female' ? 'Bride' : (profile.gender || 'Unknown')}
                </div>
                <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                  <svg className="w-4 h-4 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  {profile.city_name ? `${profile.city_name}, ` : ''}{profile.district_name}, {profile.state_name}
                </div>
              </div>
            </div>
            
            <div className="flex shrink-0 w-full md:w-auto mt-4 md:mt-0">
              <button 
                className="w-full md:w-auto px-8 py-3 bg-brand-primary text-white text-sm font-bold uppercase tracking-widest rounded-xl shadow-lg shadow-brand-primary/20 hover:bg-brand-primary-dark transition-colors flex items-center justify-center gap-2 cursor-pointer"
                onClick={async () => {
                  if (navigator.share) {
                    try {
                      await navigator.share({
                        title: `${profile.first_name} ${profile.last_name} - Eternal Bonds Matrimony`,
                        text: `Check out ${profile.first_name}'s matrimony profile on Eternal Bonds!`,
                        url: window.location.href,
                      });
                    } catch (error) {
                      console.log('Error sharing:', error);
                    }
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert("Profile link copied!");
                  }
                }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                Share
              </button>
            </div>
          </div>
        </div>

        {/* Detailed Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* About & Basic Info */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 md:col-span-2">
            <h3 className="text-xl font-serif text-brand-primary font-bold mb-6 flex items-center gap-3">
              <svg className="w-6 h-6 text-brand-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              About & Basic Details
            </h3>
            {profile.introduction && (
              <p className="text-slate-600 mb-8 italic border-l-4 border-brand-primary pl-4">{profile.introduction}</p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-slate-500">Gender</span>
                <span className="font-medium text-slate-800 capitalize">{profile.gender || 'Not Specified'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-slate-500">Date of Birth</span>
                <span className="font-medium text-slate-800">{profile.date_of_birth || profile.dob || 'Not Specified'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-slate-500">Height</span>
                <span className="font-medium text-slate-800">{profile.height ? `${profile.height} ft` : 'Not Specified'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-slate-500">Marital Status</span>
                <span className="font-medium text-slate-800 capitalize">{profile.marital_status || 'Not Specified'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-slate-500">Disability Status</span>
                <span className="font-medium text-slate-800">{profile.disability_status ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-slate-500">Complexion</span>
                <span className="font-medium text-slate-800 capitalize">{profile.color_name || 'Not Specified'}</span>
              </div>
            </div>
          </div>

          {/* Education & Career */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
            <h3 className="text-xl font-serif text-brand-primary font-bold mb-6 flex items-center gap-3">
              <svg className="w-6 h-6 text-brand-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              Education & Career
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex justify-between border-b border-slate-50 pb-3">
                <span className="text-slate-500">Education</span>
                <span className="font-medium text-slate-800 text-right">{profile.education_name || 'Not Specified'} {profile.education_detail && `(${profile.education_detail})`}</span>
              </li>
              <li className="flex justify-between border-b border-slate-50 pb-3">
                <span className="text-slate-500">Occupation</span>
                <span className="font-medium text-slate-800 text-right">{profile.occupation_name || 'Not Specified'} {profile.occupation_detail && `(${profile.occupation_detail})`}</span>
              </li>
              <li className="flex justify-between pb-3">
                <span className="text-slate-500">Monthly Income</span>
                <span className="font-medium text-slate-800">
                  {profile.monthly_salary ? `₹${profile.monthly_salary.toLocaleString()}` : 'Not Specified'}
                </span>
              </li>
            </ul>
          </div>

          {/* Location details */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
            <h3 className="text-xl font-serif text-brand-primary font-bold mb-6 flex items-center gap-3">
              <svg className="w-6 h-6 text-brand-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              Location Info
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex justify-between border-b border-slate-50 pb-3">
                <span className="text-slate-500">State</span>
                <span className="font-medium text-slate-800">{profile.state_name || 'Not Specified'}</span>
              </li>
              <li className="flex justify-between border-b border-slate-50 pb-3">
                <span className="text-slate-500">District</span>
                <span className="font-medium text-slate-800">{profile.district_name || 'Not Specified'}</span>
              </li>
              <li className="flex justify-between border-b border-slate-50 pb-3">
                <span className="text-slate-500">City</span>
                <span className="font-medium text-slate-800">{profile.city_name || 'Not Specified'}</span>
              </li>
              <li className="flex justify-between pb-3">
                <span className="text-slate-500">Village</span>
                <span className="font-medium text-slate-800">{profile.village || 'Not Specified'}</span>
              </li>
            </ul>
          </div>

          {/* Family & Astrological Background */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 md:col-span-2">
            <h3 className="text-xl font-serif text-brand-primary font-bold mb-6 flex items-center gap-3">
              <svg className="w-6 h-6 text-brand-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              Family & Astrological Background
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              
              <div>
                <h4 className="text-slate-800 font-bold mb-4 uppercase text-xs tracking-widest text-brand-primary">Family Details</h4>
                <ul className="space-y-3 text-sm">
                  <li className="flex justify-between border-b border-slate-50 pb-2">
                    <span className="text-slate-500">Father's Occupation</span>
                    <span className="font-medium text-slate-800 text-right">{profile.father_occupation || 'Not Specified'}</span>
                  </li>
                  <li className="flex justify-between border-b border-slate-50 pb-2">
                    <span className="text-slate-500">Mother's Occupation</span>
                    <span className="font-medium text-slate-800 text-right">{profile.mother_occupation || 'Not Specified'}</span>
                  </li>
                  <li className="flex justify-between border-b border-slate-50 pb-2">
                    <span className="text-slate-500">Brothers (Married/Total)</span>
                    <span className="font-medium text-slate-800">
                      {profile.number_of_married_brother || 0} / {profile.number_of_brother || 0}
                      {profile.about_brother && <span className="block text-xs text-slate-400 mt-1">{profile.about_brother}</span>}
                    </span>
                  </li>
                  <li className="flex justify-between border-b border-slate-50 pb-2">
                    <span className="text-slate-500">Sisters (Married/Total)</span>
                    <span className="font-medium text-slate-800">
                      {profile.number_of_married_sister || 0} / {profile.number_of_sister || 0}
                      {profile.about_sister && <span className="block text-xs text-slate-400 mt-1">{profile.about_sister}</span>}
                    </span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-slate-800 font-bold mb-4 uppercase text-xs tracking-widest text-brand-primary">Astrological Details</h4>
                <ul className="space-y-3 text-sm">
                  <li className="flex justify-between border-b border-slate-50 pb-2">
                    <span className="text-slate-500">Gotra</span>
                    <span className="font-medium text-slate-800 capitalize">{profile.gotr || 'Not Specified'}</span>
                  </li>
                  <li className="flex justify-between border-b border-slate-50 pb-2">
                    <span className="text-slate-500">Mama Gotra</span>
                    <span className="font-medium text-slate-800 capitalize">{profile.mama_gotr || 'Not Specified'}</span>
                  </li>
                  <li className="flex justify-between border-b border-slate-50 pb-2">
                    <span className="text-slate-500">Rashi</span>
                    <span className="font-medium text-slate-800 capitalize">{profile.rashi_name || 'Not Specified'}</span>
                  </li>
                  <li className="flex justify-between border-b border-slate-50 pb-2">
                    <span className="text-slate-500">Manglik Dosh</span>
                    <span className="font-medium text-slate-800">{profile.manglik_dosh ? 'Yes' : 'No'}</span>
                  </li>
                </ul>
              </div>

            </div>
          </div>

        </div>

        {/* Photo Gallery / Album */}
        {profile.album && profile.album.length > 0 && (
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 mt-8">
            <h3 className="text-xl font-serif text-brand-primary font-bold mb-6 flex items-center gap-3">
              <svg className="w-6 h-6 text-brand-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2-2v12a2 2 0 002 2z" /></svg>
              Photo Gallery
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {profile.album.map((photo) => (
                <div key={photo.id} className="aspect-square rounded-2xl overflow-hidden shadow-lg border border-slate-100 group">
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
        )}

      </div>
    </main>
  );
};

export default PublicProfile;
