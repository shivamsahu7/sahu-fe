import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfileDetails } from '../services/profileService';
import { isAuthenticated } from '../services/authService';
import EditProfileModal from '../components/profile/EditProfileModal';

const ProfilePage = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const navigate = useNavigate();

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

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/');
      return;
    }

    fetchProfile();
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
          <div className="absolute -bottom-16 left-12 p-1 bg-white rounded-full shadow-xl">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white bg-slate-100">
              <img 
                src={profile.profileImage || profile.profile_image || "/uploads/profiles/default-profile.png"} 
                alt={`${profile.first_name} ${profile.last_name}`}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=" + profile.first_name + "+" + profile.last_name + "&background=800000&color=fff"; }}
              />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="pt-20 px-12 pb-12">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h2 className="text-4xl font-serif text-slate-800 mb-1">{profile.first_name} {profile.last_name}</h2>
              <p className="text-brand-primary font-semibold tracking-wide uppercase text-xs">Sahu Community Member</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setIsEditModalOpen(true)}
                className="px-6 py-2.5 bg-brand-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-brand-primary/20 hover:scale-105 transition-all"
              >
                Edit Profile
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Left Column: Personal Info */}
            <div className="space-y-8">
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Personal Details</h3>
                <ul className="space-y-4">
                  <li className="flex flex-col">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Gender</span>
                    <span className="text-slate-700 font-medium capitalize">{profile.gender || 'Not specified'}</span>
                  </li>
                  <li className="flex flex-col">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Date of Birth</span>
                    <span className="text-slate-700 font-medium">{profile.date_of_birth ? profile.date_of_birth.replace(/-/g, '/') : 'Not specified'}</span>
                  </li>
                  <li className="flex flex-col">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Rashi</span>
                    <span className="text-slate-700 font-medium">{profile.rashi_name || 'Not specified'}</span>
                  </li>
                  <li className="flex flex-col">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Complexion</span>
                    <span className="text-slate-700 font-medium">{profile.color_name || 'Not specified'}</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Contact Info</h3>
                <ul className="space-y-4">
                  <li className="flex flex-col">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Location</span>
                    <span className="text-slate-700 font-medium text-sm leading-relaxed">
                      {profile.city_name}, {profile.district_name}, {profile.state_name}
                    </span>
                  </li>
                  <li className="flex flex-col">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Village & Address</span>
                    <span className="text-slate-700 font-medium text-xs">
                      {profile.village}, {profile.address}
                    </span>
                  </li>
                  <li className="flex flex-col pt-2">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Phone</span>
                    <span className="text-slate-700 font-medium font-mono">{profile.phone}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Middle Column: Family Details */}
            <div className="space-y-8">
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Family Background</h3>
                <ul className="space-y-4">
                  <li className="flex flex-col">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Father's Name</span>
                    <span className="text-slate-700 font-medium">{profile.father_name || 'Not provided'}</span>
                  </li>
                  <li className="flex flex-col">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Mother's Name</span>
                    <span className="text-slate-700 font-medium">{profile.mother_name || 'Not provided'}</span>
                  </li>
                  <li className="flex flex-col">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Gotr / Clan</span>
                    <span className="text-brand-primary font-bold">{profile.gotr || 'Sahu'}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Column: Professional */}
            <div className="space-y-8">
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Education & Career</h3>
                <ul className="space-y-4">
                  <li className="flex flex-col">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Education</span>
                    <span className="text-slate-700 font-medium">{profile.education_name || 'Graduate'}</span>
                    <span className="text-[10px] text-slate-500">{profile.education_detail}</span>
                  </li>
                  <li className="flex flex-col">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Occupation</span>
                    <span className="text-slate-700 font-medium">{profile.occupation_name || 'Professional'}</span>
                    <span className="text-[10px] text-slate-500">{profile.occupation_detail}</span>
                  </li>
                  <li className="flex flex-col">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Monthly Income</span>
                    <span className="text-brand-primary font-bold">{profile.monthly_salary ? `₹${profile.monthly_salary}` : 'Private'}</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <h4 className="text-sm font-serif text-brand-primary mb-3">About {profile.first_name}</h4>
                <p className="text-xs text-slate-500 leading-relaxed italic">
                  {profile.introduction || "A proud member of the Sahu community looking for a meaningful connection based on traditions and modern values."}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer actions */}
        <div className="p-8 border-t border-slate-100 bg-white shrink-0 text-center">
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Profiles verified with Eternal Bonds Matrimony</p>
        </div>
      </div>

      <EditProfileModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        initialData={profileData}
        onUpdateSuccess={fetchProfile}
      />
    </div>
  );
};

export default ProfilePage;
