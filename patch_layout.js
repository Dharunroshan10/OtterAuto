const fs = require('fs');
let c = fs.readFileSync('components/PublicLayout.jsx', 'utf8');

c = c.replace(
    /onClick=\{\(\) => handleNavigation\('#\/features'\)\} className="hover:text-orange-500 transition-colors">Features<\/button>/,
    'onClick={() => handleNavigation(\'#/features\')} className="hover:text-orange-500 transition-colors">Features</button>\n                    <button onClick={() => handleNavigation(\'#/blog\')} className="hover:text-orange-500 transition-colors">Blog</button>'
);

c = c.replace(
    /onClick=\{\(\) => handleNavigation\('#\/about'\)\} className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">About Us<\/button>/,
    'onClick={() => handleNavigation(\'#/about\')} className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">About Us</button>\n                        <button onClick={() => handleNavigation(\'#/blog\')} className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">Blog</button>'
);

fs.writeFileSync('components/PublicLayout.jsx', c);
