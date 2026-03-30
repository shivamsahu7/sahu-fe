import React, { useState, useEffect } from 'react';
import { updateProfile } from '../../services/profileService';
import { 
  getLocations, 
  getEducations, 
  getOccupations, 
  getRashis, 
  getColors 
} from '../../services/commonService';

const EditProfileModal = ({ isOpen, onClose, initialData, onUpdateSuccess }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Location states
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  
  // Lookup states
  const [rashis, setRashis] = useState([]);
  const [colors, setColors] = useState([]);
  const [educations, setEducations] = useState([]);
  const [occupations, setOccupations] = useState([]);

  useEffect(() => {
    if (initialData && initialData.data) {
      setFormData(initialData.data);
      // Fetch initial lists if IDs exist
      if (initialData.data.state_id) fetchDistricts(initialData.data.state_id);
      if (initialData.data.state_id && initialData.data.district_id) fetchCities(initialData.data.state_id, initialData.data.district_id);
    }
    fetchStates();
    fetchLookups();
  }, [initialData]);

  const fetchLookups = async () => {
    try {
      const [r, c, e, o] = await Promise.all([
        getRashis(),
        getColors(),
        getEducations(),
        getOccupations()
      ]);
      setRashis(r.data || []);
      setColors(c.data || []);
      setEducations(e.data || []);
      setOccupations(o.data || []);
    } catch (err) {
      console.error('Failed to fetch lookup data');
    }
  };

  const fetchStates = async () => {
    try {
      const data = await getLocations();
      setStates(data.data || []);
    } catch (err) {
      console.error('Failed to fetch states');
    }
  };

  const fetchDistricts = async (stateId) => {
    try {
      const data = await getLocations(stateId);
      setDistricts(data.data || []);
    } catch (err) {
      console.error('Failed to fetch districts');
    }
  };

  const fetchCities = async (stateId, districtId) => {
    try {
      const data = await getLocations(stateId, districtId);
      setCities(data.data || []);
    } catch (err) {
      console.error('Failed to fetch cities');
    }
  };

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let val = type === 'checkbox' ? checked : value;

    // Cast to number if it's an ID field or a numeric input
    if (name.endsWith('_id') || name === 'media_id' || type === 'number') {
      if (value === '') {
        val = '';
      } else {
        val = name === 'height' ? parseFloat(value) : parseInt(value, 10);
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: val
    }));

    // Handle special formatting
    if (name === 'state_id') {
      setDistricts([]);
      setCities([]);
      setFormData(prev => ({ ...prev, district_id: '', city_id: '' }));
      if (val) fetchDistricts(val);
    } else if (name === 'district_id') {
      setCities([]);
      setFormData(prev => ({ ...prev, city_id: '' }));
      if (val) fetchCities(formData.state_id, val);
    } else if (name === 'date_of_birth') {
      // Convert YYYY-MM-DD from picker to DD-MM-YYYY for state (and eventually API)
      if (val && val.includes('-') && val.split('-')[0].length === 4) {
        val = val.split('-').reverse().join('-');
      }
    }

    setFormData(prev => ({
      ...prev,
      [name]: val
    }));
  };

  const handleNext = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate current step
      const requiredFields = {
        1: ['first_name', 'last_name', 'phone', 'state_id', 'district_id', 'city_id', 'village', 'address', 'permanent_address'],
        2: ['gender', 'date_of_birth', 'birth_time', 'height', 'rashi_id', 'color_id', 'gotr', 'mama_gotr'],
        3: ['father_name', 'mother_name'], // Minimal family validation
        4: ['education_id', 'occupation_id'], // Minimal career validation
        5: ['introduction']
      };

      const missing = requiredFields[step]?.filter(f => !formData[f]);
      if (missing && missing.length > 0) {
        throw new Error(`Please fill all required fields: ${missing.map(f => f.replace(/_/g, ' ')).join(', ')}`);
      }

      setLoading(true);
      // Filter data for the current step
      const stepData = { step };
      
      if (step === 1) {
        const fields = ['media_id', 'first_name', 'last_name', 'phone', 'state_id', 'district_id', 'city_id', 'village', 'address', 'permanent_address'];
        fields.forEach(f => {
          const val = formData[f];
          if (f === 'media_id' || f.endsWith('_id')) {
            stepData[f] = val ? Number(val) : 1;
          } else {
            stepData[f] = val || '';
          }
        });
      } else if (step === 2) {
        const fields = ['gender', 'date_of_birth', 'birth_time', 'height', 'rashi_id', 'color_id', 'gotr', 'mama_gotr'];
        fields.forEach(f => {
          const val = formData[f];
          if (f.endsWith('_id')) {
            stepData[f] = val ? Number(val) : 1;
          } else if (f === 'height') {
            stepData[f] = val ? Number(val) : 5.8;
          } else {
            stepData[f] = val || '';
          }
        });
      } else if (step === 3) {
        const fields = ['father_name', 'mother_name', 'father_occupation', 'mother_occupation', 'father_phone_number', 'number_of_brother', 'number_of_married_brother', 'about_brother', 'number_of_sister', 'number_of_married_sister', 'about_sister'];
        fields.forEach(f => {
          const val = formData[f];
          if (f.startsWith('number_')) {
            stepData[f] = val ? Number(val) : 0;
          } else {
            stepData[f] = val || '';
          }
        });
      } else if (step === 4) {
        const fields = ['education_id', 'education_detail', 'occupation_id', 'occupation_detail', 'monthly_salary'];
        fields.forEach(f => {
          const val = formData[f];
          if (f.endsWith('_id')) {
            stepData[f] = val ? Number(val) : 1;
          } else if (f === 'monthly_salary') {
            stepData[f] = val ? Number(val) : 0;
          } else {
            stepData[f] = val || '';
          }
        });
      } else if (step === 5) {
        const fields = ['introduction', 'manglik_dosh', 'disability_status'];
        fields.forEach(f => {
          if (f === 'introduction') {
            stepData[f] = formData[f] || '';
          } else {
            // Ensure boolean fields are always true/false, never null/undefined
            stepData[f] = !!formData[f];
          }
        });
      }

      await updateProfile(stepData);
      
      if (step < 5) {
        setStep(step + 1);
      } else {
        onUpdateSuccess();
        onClose();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-serif text-brand-primary">Step 1: Basic Info & Address</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">First Name</label>
                <input name="first_name" maxLength={50} value={formData.first_name || ''} onChange={handleChange} className="p-3 bg-slate-50 rounded-xl border border-slate-100 outline-none focus:border-brand-primary/30 transition-all text-sm" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">Last Name</label>
                <input name="last_name" maxLength={50} value={formData.last_name || ''} onChange={handleChange} className="p-3 bg-slate-50 rounded-xl border border-slate-100 outline-none focus:border-brand-primary/30 transition-all text-sm" />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase text-slate-400">Phone</label>
              <input name="phone" maxLength={20} value={formData.phone || ''} onChange={handleChange} className="p-3 bg-slate-50 rounded-xl border border-slate-100 outline-none focus:border-brand-primary/30 transition-all text-sm" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">State</label>
                <select 
                  name="state_id" 
                  value={formData.state_id || ''} 
                  onChange={handleChange} 
                  className="p-3 bg-slate-50 rounded-xl border border-slate-100 outline-none focus:border-brand-primary/30 transition-all text-sm appearance-none"
                >
                  <option value="">Select State</option>
                  {states.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">District</label>
                <select 
                  name="district_id" 
                  value={formData.district_id || ''} 
                  onChange={handleChange} 
                  disabled={!formData.state_id}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-100 outline-none focus:border-brand-primary/30 transition-all text-sm appearance-none disabled:opacity-50"
                >
                  <option value="">Select District</option>
                  {districts.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">City</label>
                <select 
                  name="city_id" 
                  value={formData.city_id || ''} 
                  onChange={handleChange} 
                  disabled={!formData.district_id}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-100 outline-none focus:border-brand-primary/30 transition-all text-sm appearance-none disabled:opacity-50"
                >
                  <option value="">Select City</option>
                  {cities.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase text-slate-400">Village</label>
              <input name="village" maxLength={30} value={formData.village || ''} onChange={handleChange} className="p-3 bg-slate-50 rounded-xl border border-slate-100 outline-none focus:border-brand-primary/30 transition-all text-sm" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase text-slate-400">Current Address</label>
              <textarea name="address" maxLength={255} value={formData.address || ''} onChange={handleChange} className="p-3 bg-slate-50 rounded-xl border border-slate-100 outline-none focus:border-brand-primary/30 transition-all text-sm h-20" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase text-slate-400">Permanent Address</label>
              <textarea name="permanent_address" maxLength={255} value={formData.permanent_address || ''} onChange={handleChange} className="p-3 bg-slate-50 rounded-xl border border-slate-100 outline-none focus:border-brand-primary/30 transition-all text-sm h-20" />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-serif text-brand-primary">Step 2: Personal Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">Gender</label>
                <select name="gender" value={formData.gender || 'male'} onChange={handleChange} className="p-3 bg-slate-50 rounded-xl border border-slate-100 outline-none focus:border-brand-primary/30 transition-all text-sm">
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">Date of Birth</label>
                <input 
                  type="date"
                  name="date_of_birth" 
                  value={formData.date_of_birth ? (formData.date_of_birth.includes('-') && formData.date_of_birth.split('-')[0].length === 2 ? formData.date_of_birth.split('-').reverse().join('-') : formData.date_of_birth) : ''} 
                  onChange={handleChange} 
                  className="p-3 bg-slate-50 rounded-xl border border-slate-100 outline-none focus:border-brand-primary/30 transition-all text-sm" 
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">Birth Time</label>
                <input type="time" name="birth_time" step="1" value={formData.birth_time || ''} onChange={handleChange} className="p-3 bg-slate-50 rounded-xl border border-slate-100 outline-none focus:border-brand-primary/30 transition-all text-sm" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">Height (ft)</label>
                <input type="number" step="0.1" name="height" value={formData.height || 5.8} onChange={handleChange} className="p-3 bg-slate-50 rounded-xl border border-slate-100 outline-none focus:border-brand-primary/30 transition-all text-sm" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">Rashi</label>
                <select 
                  name="rashi_id" 
                  value={formData.rashi_id || ''} 
                  onChange={handleChange} 
                  className="p-3 bg-slate-50 rounded-xl border border-slate-100 outline-none focus:border-brand-primary/30 transition-all text-sm appearance-none"
                >
                  <option value="">Select Rashi</option>
                  {rashis.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">Color / Complexion</label>
                <select 
                  name="color_id" 
                  value={formData.color_id || ''} 
                  onChange={handleChange} 
                  className="p-3 bg-slate-50 rounded-xl border border-slate-100 outline-none focus:border-brand-primary/30 transition-all text-sm appearance-none"
                >
                  <option value="">Select Color</option>
                  {colors.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">Gotr (Self)</label>
                <input name="gotr" maxLength={30} value={formData.gotr || ''} onChange={handleChange} className="p-3 bg-slate-50 rounded-xl border border-slate-100 outline-none focus:border-brand-primary/30 transition-all text-sm" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">Mama Gotr</label>
                <input name="mama_gotr" maxLength={30} value={formData.mama_gotr || ''} onChange={handleChange} className="p-3 bg-slate-50 rounded-xl border border-slate-100 outline-none focus:border-brand-primary/30 transition-all text-sm" />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto px-1">
            <h3 className="text-lg font-serif text-brand-primary">Step 3: Family Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">Father's Name</label>
                <input name="father_name" maxLength={50} value={formData.father_name || ''} onChange={handleChange} className="p-3 bg-slate-50 rounded-xl border border-slate-100 outline-none focus:border-brand-primary/30 transition-all text-sm" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">Mother's Name</label>
                <input name="mother_name" maxLength={50} value={formData.mother_name || ''} onChange={handleChange} className="p-3 bg-slate-50 rounded-xl border border-slate-100 outline-none focus:border-brand-primary/30 transition-all text-sm" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">Father's Job</label>
                <input name="father_occupation" maxLength={50} value={formData.father_occupation || ''} onChange={handleChange} className="p-3 bg-slate-50 rounded-xl border border-slate-100 outline-none focus:border-brand-primary/30 transition-all text-sm" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">Mother's Job</label>
                <input name="mother_occupation" maxLength={50} value={formData.mother_occupation || ''} onChange={handleChange} className="p-3 bg-slate-50 rounded-xl border border-slate-100 outline-none focus:border-brand-primary/30 transition-all text-sm" />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase text-slate-400">Father's Phone</label>
              <input name="father_phone_number" maxLength={20} value={formData.father_phone_number || ''} onChange={handleChange} className="p-3 bg-slate-50 rounded-xl border border-slate-100 outline-none focus:border-brand-primary/30 transition-all text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-4 border-t pt-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">Brothers</label>
                <input type="number" name="number_of_brother" value={formData.number_of_brother || 0} onChange={handleChange} className="p-3 bg-slate-50 rounded-xl border border-slate-100 outline-none focus:border-brand-primary/30 transition-all text-sm" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">Married Brothers</label>
                <input type="number" name="number_of_married_brother" value={formData.number_of_married_brother || 0} onChange={handleChange} className="p-3 bg-slate-50 rounded-xl border border-slate-100 outline-none focus:border-brand-primary/30 transition-all text-sm" />
              </div>
            </div>
             <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase text-slate-400">About Brothers</label>
              <input name="about_brother" maxLength={255} value={formData.about_brother || ''} onChange={handleChange} className="p-3 bg-slate-50 rounded-xl border border-slate-100 outline-none focus:border-brand-primary/30 transition-all text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-4 border-t pt-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">Sisters</label>
                <input type="number" name="number_of_sister" value={formData.number_of_sister || 0} onChange={handleChange} className="p-3 bg-slate-50 rounded-xl border border-slate-100 outline-none focus:border-brand-primary/30 transition-all text-sm" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">Married Sisters</label>
                <input type="number" name="number_of_married_sister" value={formData.number_of_married_sister || 0} onChange={handleChange} className="p-3 bg-slate-50 rounded-xl border border-slate-100 outline-none focus:border-brand-primary/30 transition-all text-sm" />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase text-slate-400">About Sisters</label>
              <input name="about_sister" maxLength={255} value={formData.about_sister || ''} onChange={handleChange} className="p-3 bg-slate-50 rounded-xl border border-slate-100 outline-none focus:border-brand-primary/30 transition-all text-sm" />
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-serif text-brand-primary">Step 4: Education & Career</h3>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase text-slate-400">Education</label>
              <select 
                name="education_id" 
                value={formData.education_id || ''} 
                onChange={handleChange} 
                className="p-3 bg-slate-50 rounded-xl border border-slate-100 outline-none focus:border-brand-primary/30 transition-all text-sm appearance-none"
              >
                <option value="">Select Education</option>
                {educations.map(e => (
                  <option key={e.id} value={e.id}>{e.name}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase text-slate-400">Education Details</label>
              <input name="education_detail" maxLength={255} value={formData.education_detail || ''} onChange={handleChange} className="p-3 bg-slate-50 rounded-xl border border-slate-100 outline-none focus:border-brand-primary/30 transition-all text-sm" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase text-slate-400">Occupation</label>
              <select 
                name="occupation_id" 
                value={formData.occupation_id || ''} 
                onChange={handleChange} 
                className="p-3 bg-slate-50 rounded-xl border border-slate-100 outline-none focus:border-brand-primary/30 transition-all text-sm appearance-none"
              >
                <option value="">Select Occupation</option>
                {occupations.map(o => (
                  <option key={o.id} value={o.id}>{o.name}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase text-slate-400">Occupation Details</label>
              <input name="occupation_detail" maxLength={255} value={formData.occupation_detail || ''} onChange={handleChange} className="p-3 bg-slate-50 rounded-xl border border-slate-100 outline-none focus:border-brand-primary/30 transition-all text-sm" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase text-slate-400">Monthly Salary (₹)</label>
              <input type="number" name="monthly_salary" value={formData.monthly_salary || 0} onChange={handleChange} className="p-3 bg-slate-50 rounded-xl border border-slate-100 outline-none focus:border-brand-primary/30 transition-all text-sm" />
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-serif text-brand-primary">Step 5: Final Touches</h3>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase text-slate-400">Brief Introduction</label>
              <textarea name="introduction" maxLength={255} value={formData.introduction || ''} onChange={handleChange} className="p-3 bg-slate-50 rounded-xl border border-slate-100 outline-none focus:border-brand-primary/30 transition-all text-sm h-32" />
            </div>
            <div className="flex items-center gap-4 py-4">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="manglik_dosh" name="manglik_dosh" checked={formData.manglik_dosh || false} onChange={handleChange} className="w-5 h-5 text-brand-primary outline-none accent-brand-primary" />
                <label htmlFor="manglik_dosh" className="text-sm font-medium text-slate-700">Manglik Dosh?</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="disability_status" name="disability_status" checked={formData.disability_status || false} onChange={handleChange} className="w-5 h-5 text-brand-primary outline-none accent-brand-primary" />
                <label htmlFor="disability_status" className="text-sm font-medium text-slate-700">Any Disability?</label>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl relative flex flex-col animate-in fade-in zoom-in duration-300">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-serif text-slate-800">Update Profile</h2>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(s => (
                  <div key={s} className={`h-1 w-8 rounded-full ${s <= step ? 'bg-brand-primary' : 'bg-slate-100'}`}></div>
                ))}
              </div>
              <span className="text-[10px] font-bold text-brand-primary uppercase tracking-widest ml-2">Step {step} of 5</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors font-bold text-slate-400 tracking-widest uppercase text-xs">Close</button>
        </div>

        <form onSubmit={handleNext} className="p-8 flex-1 overflow-y-auto">
          {error && (
            <div className="mb-6 p-4 bg-red-50 rounded-2xl border border-red-100 flex items-center gap-3">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-red-500 shadow-sm shrink-0">!</div>
              <p className="text-xs text-red-600 font-medium">{error}</p>
            </div>
          )}

          {renderStep()}

          <div className="mt-10 flex gap-4">
            {step > 1 && (
              <button 
                type="button" 
                onClick={() => setStep(step - 1)}
                className="flex-1 py-4 rounded-xl border border-slate-200 text-slate-500 font-bold uppercase tracking-widest text-xs hover:bg-slate-50 transition-all font-sans"
              >
                Back
              </button>
            )}
            <button 
              type="submit" 
              disabled={loading}
              className="flex-[2] bg-brand-primary text-white py-4 rounded-xl font-bold uppercase tracking-[0.2em] text-xs shadow-xl shadow-brand-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 font-sans"
            >
              {loading ? 'Updating...' : (step === 5 ? 'Finalize Profile' : 'Save & Continue')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
