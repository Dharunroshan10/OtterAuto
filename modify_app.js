const fs = require('fs');
let c = fs.readFileSync('App.jsx', 'utf8');

c = c.replace(
    /Home, Zap, Shield, Package, MessageCircle, TrendingUp/g,
    'Home, Zap, Shield, Package, MessageCircle, TrendingUp, BookOpen'
);

const target = '<Globe size={18} className="text-slate-400" /> About Us\\n                        </span>';
const replacement = '<Globe size={18} className="text-slate-400" /> About Us\\n                        </span>\\n                        <span onClick={() => { window.location.hash = \\'#/blog\\'; }} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl font-medium transition text-sm text-slate-600 hover:bg-slate-200/50 mt - 0.5 cursor - pointer">\\n                            <BookOpen size={18} className="text - slate - 400" /> Blog & Guides\\n                        </span>';

c = c.replace(
    /<Globe size=\{18\} className="text-slate-400" \/> About Us\s*<\/span>/g,
    '<Globe size={18} className="text-slate-400" /> About Us\n                        </span>\n                        <span onClick={() => { window.location.hash = \'#/blog\'; }} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl font-medium transition text-sm text-slate-600 hover:bg-slate-200/50 mt-0.5 cursor-pointer">\n                            <BookOpen size={18} className="text-slate-400" /> Blog & Guides\n                        </span>'
);

fs.writeFileSync('App.jsx', c);
