import fs from 'fs';
let code = fs.readFileSync('src/components/profile/EditProfileModal.jsx', 'utf8');
code = code.replace(/className=\{\\\`/g, 'className={`');
code = code.replace(/\\\`\}/g, '`}');
fs.writeFileSync('src/components/profile/EditProfileModal.jsx', code);
