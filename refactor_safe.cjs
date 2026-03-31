const fs = require('fs');
let code = fs.readFileSync('src/components/profile/EditProfileModal.jsx', 'utf8');

// 1. Add state
code = code.replace(
  "const [error, setError] = useState('');",
  "const [error, setError] = useState('');\n  const [fieldErrors, setFieldErrors] = useState({});"
);

// 2. Update handleChange
code = code.replace(
  "    setFormData(prev => ({\n      ...prev,\n      [name]: val\n    }));\n  };",
  "    setFormData(prev => ({\n      ...prev,\n      [name]: val\n    }));\n\n    if (fieldErrors[name]) {\n      setFieldErrors(prev => ({ ...prev, [name]: false }));\n    }\n  };"
);

// 3. Update validation logic
code = code.replace(
  /const missing = requiredFields\[step\]\?\.filter\(f => !formData\[f\]\);\s+if \(missing && missing\.length > 0\) {[\s\S]*?throw new Error[^}]*}/,
  `const missing = requiredFields[step]?.filter(f => !formData[f]);
      if (missing && missing.length > 0) {
        const errors = {};
        missing.forEach(f => { errors[f] = true; });
        setFieldErrors(errors);
        
        throw new Error(\`Please fill all required fields highlighted below.\`);
      }`
);

// 4. Clear field errors on next
code = code.replace(
  "    setLoading(true);\n\n    try {\n      // Validate current step",
  "    setFieldErrors({});\n    setLoading(true);\n\n    try {\n      // Validate current step"
);

// 5. Replace inputs with string concatenation for className to avoid JSX compiler bugs
code = code.replace(/<div className="flex flex-col gap-1">([\s\S]*?)<\/div>/g, (match, inner) => {
  if (inner.indexOf('<div') !== -1) return match;

  const nameMatch = inner.match(/name="([^"]+)"/);
  if (!nameMatch) return match;
  const name = nameMatch[1];
  
  const labelMatch = inner.match(/<label[^>]*>([^<]+)<\/label>/);
  if (!labelMatch) return match;
  let label = labelMatch[1].split('/')[0].trim();
  if (label.includes('(')) label = label.split('(')[0].trim();

  let newInner = inner.replace(/className="([^"]*border-slate-100[^"]*)"/, (clsMatch, clsGrp) => {
    let baseClass = clsGrp.replace('border-slate-100', '').trim();
    return `className={"${baseClass} " + (fieldErrors['${name}'] ? "border-red-500 bg-red-50" : "border-slate-100")}`;
  });

  return `<div className="flex flex-col gap-1">${newInner}\n                {fieldErrors['${name}'] && <p className="text-[10px] text-red-500 font-bold mt-1">${label} is required</p>}\n              </div>`;
});

fs.writeFileSync('src/components/profile/EditProfileModal.jsx', code);
