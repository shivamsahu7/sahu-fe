import React from 'react';

const ProfileModal = ({ isOpen, onClose, profileData }) => {
  if (!isOpen || !profileData) return null;

  const { data: profile } = profileData;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-300 flex flex-col">
        {/* Header/Banner Area */}
        <div className="relative h-48 bg-gradient-to-r from-brand-primary to-brand-primary-dark shrink-0">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/20 hover:bg-white/40 transition-colors z-10 text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="absolute -bottom-16 left-12 p-1 bg-white rounded-full shadow-xl">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white bg-slate-100">
              <img 
                src={profile.profile_image || "/uploads/profiles/default-profile.png"} 
                alt={`${profile.first_name} ${profile.last_name}`}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=" + profile.first_name + "+" + profile.last_name + "&background=800000&color=fff"; }}
              />
            </div>
          </div>
        </div>

        {/* Content Area - Scrollable */}
        <div className="flex-1 overflow-y-auto pt-20 px-12 pb-12 custom-scrollbar">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h2 className="text-4xl font-serif text-slate-800 mb-1">{profile.first_name} {profile.last_name}</h2>
              <p className="text-brand-primary font-semibold tracking-wide uppercase text-xs">Sahu Community Member</p>
            </div>
            <div className="flex gap-3">
              <button className="px-6 py-2.5 bg-brand-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-brand-primary/20 hover:scale-105 transition-all">Edit Profile</button>
              <button className="px-6 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all">Settings</button>
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
                    <span className="text-slate-700 font-medium">{profile.date_of_birth || 'Not specified'}</span>
                  </li>
                  <li className="flex flex-col">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Phone Number</span>
                    <span className="text-slate-700 font-medium font-mono">{profile.phone || 'Not specified'}</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Contact Info</h3>
                <ul className="space-y-4">
                  <li className="flex flex-col">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Address</span>
                    <span className="text-slate-700 font-medium text-sm leading-relaxed">{profile.address || 'Not specified'}</span>
                  </li>
                  <li className="flex flex-col">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Village</span>
                    <span className="text-slate-700 font-medium">{profile.village || 'Not specified'}</span>
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
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Occupation</span>
                    <span className="text-slate-700 font-medium">{profile.occupation_detail || 'Self Employed / Professional'}</span>
                  </li>
                  <li className="flex flex-col">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Monthly Income</span>
                    <span className="text-slate-700 font-medium">{profile.monthly_salary ? `₹${profile.monthly_salary}` : 'Private'}</span>
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
    </div>
  );
};

export default ProfileModal;
