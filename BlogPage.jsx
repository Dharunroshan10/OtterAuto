import React, { useEffect, useState } from 'react';
import PublicLayout from './components/PublicLayout';
import { ArrowLeft, Clock, BookOpen } from 'lucide-react';

const ARTICLES = [
    {
        id: 'organize-digital-receipts',
        title: 'How to Organize Digital Receipts and Never Lose Track Again',
        date: 'March 8, 2026',
        readTime: '4 min read',
        category: 'Productivity',
        excerpt: 'Managing a chaotic folder of digital receipts is overwhelming. Learn how modern AI tools can automatically sort, tag, and extract essential data from your invoice screenshots.',
        content: `
            <p className="mb-6">Every professional struggles with the chaos of digital receipts. You snap a screenshot of a flight confirmation, download a PDF invoice for software, and quickly save an Uber receipt to your phone gallery. Before you know it, tax season arrives, and you're forced to search through thousands of unrelated photos just to find proof of your business expenses.</p>
            
            <h3 className="text-xl font-bold text-slate-900 mb-4 mt-8">The Problem with Traditional Folders</h3>
            <p className="mb-6">Historically, the solution has been to create manual folders on your computer named "2026 Expenses" or "Tax Receipts." However, this approach relies on your memory and discipline. If you forget to move a screenshot immediately, it gets lost in the abyss of your camera roll. Furthermore, standard folders cannot read the text inside your images, making search impossible unless you manually rename every single file with the vendor name, amount, and date.</p>

            <h3 className="text-xl font-bold text-slate-900 mb-4 mt-8">Enter Intelligent Organization</h3>
            <p className="mb-6">Modern solutions, like intelligent digital vaults, flip this paradigm. Instead of relying on manual data entry, platforms now use advanced Vision AI to scan your images the moment you upload them. The artificial intelligence acts as a digital assistant, looking at the pixels and understanding the context.</p>

            <ul className="list-disc pl-6 space-y-3 mb-6 text-slate-700">
                <li><strong>Automatic Categorization:</strong> The AI knows the difference between a coffee receipt and a boarding pass, sorting them into Smart Folders instantly.</li>
                <li><strong>Text Extraction:</strong> Using high-accuracy Optical Character Recognition (OCR), every word on the receipt becomes searchable.</li>
                <li><strong>Amount Detection:</strong> The system automatically extracts the total transaction amount, saving you hours of manual spreadsheet entry.</li>
            </ul>

            <h3 className="text-xl font-bold text-slate-900 mb-4 mt-8">Establishing a Routine</h3>
            <p className="mb-6">The best way to stay organized is to integrate uploading into your daily workflow. At the end of each workday, drag and drop your daily screenshots into your intelligent vault. The AI handles the heavy lifting, ensuring that when the end of the month arrives, your expense reports practically write themselves.</p>
        `
    },
    {
        id: 'ai-in-expense-tracking',
        title: 'AI in Expense Tracking: Categorizing Transactions Automatically',
        date: 'March 5, 2026',
        readTime: '5 min read',
        category: 'Technology',
        excerpt: 'Artificial intelligence is reshaping how freelancers and small businesses track their expenses. Discover the technology behind automated receipt processing.',
        content: `
            <p className="mb-6">For freelancers and small business owners, tracking expenses is often the most dreaded administrative task. It traditionally involves shoeboxes full of faded thermal paper receipts, confusing spreadsheets, and hours of mind-numbing data entry. However, artificial intelligence is rapidly transforming this landscape, turning expense tracking from a manual chore into an automated, invisible process.</p>
            
            <h3 className="text-xl font-bold text-slate-900 mb-4 mt-8">How AI Understands Financial Data</h3>
            <p className="mb-6">When you upload a picture of a receipt, modern AI models do much more than simply read the text. They perform contextual analysis. For example, if a receipt says "Starbucks" at the top and "$4.50" at the bottom, the AI understands the vendor is a coffee shop and the amount is a business meal expense. It doesn't just see letters and numbers; it understands the semantic relationship between them.</p>

            <h3 className="text-xl font-bold text-slate-900 mb-4 mt-8">The Power of Semantic Tagging</h3>
            <p className="mb-6">Instead of rigid folder structures, AI applies semantic tags. A single receipt for a business lunch might be tagged automatically with <em>#food</em>, <em>#client_meeting</em>, <em>#restaurant</em>, and <em>#travel</em>. This multi-dimensional tagging means you can search your visual vault using natural language. If you search for "food expenses from last week," the AI intuitively pulls up the relevant images, regardless of their filenames.</p>

            <h3 className="text-xl font-bold text-slate-900 mb-4 mt-8">Reducing Human Error</h3>
            <p className="mb-6">Manual data entry is notoriously error-prone. Transposing numbers or miscategorizing an expense can lead to significant discrepancies during tax time. Machine learning algorithms, particularly those based on Large Vision Models (LVMs), boast an accuracy rate that far surpasses human manual entry, particularly when dealing with bulk uploads of hundreds of documents simultaneously.</p>
            
            <p className="mb-6">By embracing AI-powered expense tracking, professionals reclaim valuable hours every month, allowing them to focus on growing their business rather than acting as a part-time bookkeeper.</p>
        `
    },
    {
        id: 'hidden-cost-of-digital-clutter',
        title: 'The Hidden Cost of Digital Clutter: Turning Screenshots into Data',
        date: 'March 2, 2026',
        readTime: '3 min read',
        category: 'Productivity',
        excerpt: 'Your smartphone gallery is likely a graveyard of forgotten information. Learn why digital clutter is harming your productivity and how to fix it.',
        content: `
            <p className="mb-6">We take screenshots of everything. A fascinating quote from an article, a confirmation barcode for an upcoming event, a recipe we want to try, or a funny meme to send to a friend. But what happens to these digital snippets? More often than not, they sink to the bottom of our camera rolls, effectively lost forever in a sea of cat photos and selfies.</p>

            <h3 className="text-xl font-bold text-slate-900 mb-4 mt-8">The Cognitive Load of Clutter</h3>
            <p className="mb-6">Digital clutter operates similarly to physical clutter. Even if you can't see the thousands of unsorted screenshots taking up gigabytes of cloud storage, the knowledge that your digital life is disorganized creates a subtle, persistent cognitive load. When you actually need that specific insurance document screenshot from six months ago, the resulting panic and frantic scrolling wastes time and spikes stress levels.</p>

            <h3 className="text-xl font-bold text-slate-900 mb-4 mt-8">Unlocking "Trapped" Data</h3>
            <p className="mb-6">A screenshot is essentially trapped data. It is a visual representation of text that your computer cannot search, edit, or copy. By routing your screenshots through an intelligent vault equipped with OCR (Optical Character Recognition), you liberate this data. The text becomes selectable, searchable, and actionable.</p>

            <ul className="list-disc pl-6 space-y-3 mb-6 text-slate-700">
                <li><strong>Searchability:</strong> Find an image instantly by typing a word you know was visible in it.</li>
                <li><strong>Copy and Paste:</strong> Extract Wi-Fi passwords, addresses, or serial numbers directly from the image without typing them out manually.</li>
                <li><strong>Categorization:</strong> Group visual information logically without manual folder management.</li>
            </ul>

            <p className="mb-6">The transition from a cluttered gallery to an organized, searchable vault represents a shift from data hoarding to active knowledge management. Your screenshots evolve from digital debris into a highly personalized, instantly accessible reference library.</p>
        `
    },
    {
        id: 'ocr-how-it-works',
        title: 'Optical Character Recognition (OCR): How AI Reads Your Images',
        date: 'February 28, 2026',
        readTime: '4 min read',
        category: 'Deep Dive',
        excerpt: 'Dive deep into the mechanics of OCR and discover how modern neural networks have revolutionized text extraction from images.',
        content: `
            <p className="mb-6">Optical Character Recognition, or OCR, is the technology that bridges the gap between the physical and digital worlds. It allows computers to "read" the text embedded within an image or scanned document. While OCR has existed for decades, recent advancements in deep learning and neural networks have skyrocketed its accuracy and capabilities.</p>

            <h3 className="text-xl font-bold text-slate-900 mb-4 mt-8">The Evolution of OCR</h3>
            <p className="mb-6">Early OCR systems relied on pattern matching. They compared the shapes of letters in an image to a stored library of fonts. If you fed the system a standard, typed document in Arial font, it worked moderately well. However, if the text was handwritten, blurry, or formatted uniquely, the system would fail completely, producing garbled output.</p>
            <p className="mb-6">Modern OCR, driven by Large Vision Models (LVMs), doesn't just look at shapes; it understands context. By utilizing recurrent neural networks (RNNs) and transformer architectures, the AI analyzes the entire sequence of characters, predicting the most likely word based on the surrounding sentence structure. This means the AI can accurately extract text even if water spilled on the receipt or the image is taken at a slanted angle.</p>

            <h3 className="text-xl font-bold text-slate-900 mb-4 mt-8">Practical Applications in Daily Life</h3>
            <p className="mb-6">The seamless integration of high-powered OCR into consumer applications has profound implications for productivity:</p>
            <ul className="list-disc pl-6 space-y-3 mb-6 text-slate-700">
                <li><strong>Instant Data Entry:</strong> Automatically populate spreadsheets with financial data extracted from invoice images.</li>
                <li><strong>Language Translation:</strong> Read signs in foreign countries by simply pointing your camera at them.</li>
                <li><strong>Accessibility:</strong> Convert text in images to spoken audio for visually impaired users.</li>
            </ul>

            <p className="mb-6">As visual AI continues to advance, the distinction between a text document and an image document will completely disappear. Your entire visual library will become just as searchable and malleable as a simple text file, unlocking unprecedented workflow efficiencies.</p>
        `
    },
    {
        id: 'single-source-of-truth',
        title: 'Why You Need a Single Source of Truth for Visual Assets',
        date: 'February 24, 2026',
        readTime: '3 min read',
        category: 'Business',
        excerpt: 'Distributed data causes workflow friction. Learn why centralizing your visual assets into a single, intelligent vault is critical for success.',
        content: `
            <p className="mb-6">In modern workflows, our visual assets are scattered across dozens of platforms. You might have design inspiration saved in an Instagram collection, PDF invoices in your email inbox, software license keys in your phone's camera roll, and whiteboard meeting notes trapped in a Slack channel. This fragmentation creates immense friction when you actually need to retrieve information.</p>

            <h3 className="text-xl font-bold text-slate-900 mb-4 mt-8">The Fragmentation Penalty</h3>
            <p className="mb-6">Every time you have to pause your creative or analytical work to hunt down a specific image across five different apps, you incur a "context switching" penalty. Studies show it can take up to 23 minutes to fully regain deep focus after an interruption. If you spend 10 minutes looking for a reference screenshot, the actual cost to your productivity is exponentially higher.</p>

            <h3 className="text-xl font-bold text-slate-900 mb-4 mt-8">Building the Intelligent Vault</h3>
            <p className="mb-6">The solution is establishing a "Single Source of Truth" (SSOT) for all visual knowledge. By adopting a dedicated vault application, you create a central repository where all screenshots, receipts, and references live. The key to making an SSOT work is minimizing the friction of adding to it.</p>

            <p className="mb-6">This is where automation becomes vital. A true intelligent vault doesn't require you to manually tag or organize incoming files. You simply drop the files in, and the AI handles the routing. It reads the text, applies semantic tags, and places the asset into dynamic Smart Folders. When you need the information later, you know exactly where to go, and you know the powerful search engine will find it instantly based on the visual contents.</p>

            <p className="mb-6">Consolidating your visual assets isn't just about being tidy; it's a strategic move to protect your attention span and ensure your ideas and records are always highly available the moment inspiration strikes or duty calls.</p>
        `
    }
];

export default function BlogPage() {
    const [selectedArticleId, setSelectedArticleId] = useState(null);

    useEffect(() => {
        // Parse URL params or hash to see if an article is selected
        const hash = window.location.hash;
        if (hash.includes('?article=')) {
            const id = hash.split('?article=')[1];
            setSelectedArticleId(id);
        } else {
            setSelectedArticleId(null);
        }
        window.scrollTo(0, 0);
    }, []);

    // Also listen to hash changes to update the view dynamically
    useEffect(() => {
        const onHashChange = () => {
            const hash = window.location.hash;
            if (hash.includes('?article=')) {
                const id = hash.split('?article=')[1];
                setSelectedArticleId(id);
                window.scrollTo(0, 0);
            } else {
                setSelectedArticleId(null);
            }
        };
        window.addEventListener('hashchange', onHashChange);
        return () => window.removeEventListener('hashchange', onHashChange);
    }, []);

    const activeArticle = ARTICLES.find(a => a.id === selectedArticleId);

    return (
        <PublicLayout>
            <div className="w-full flex justify-center">
                {!activeArticle ? (
                    <div className="w-full">
                        <div className="text-center mb-12 max-w-2xl mx-auto">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-100 shadow-sm mb-6">
                                <span className="flex h-2 w-2 rounded-full bg-orange-500"></span>
                                <span className="text-xs font-bold text-orange-700 uppercase tracking-wider">Otter Insights</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
                                The Resource Hub
                            </h1>
                            <p className="text-lg text-slate-600 font-medium leading-relaxed">
                                Expert guides, deep dives into artificial intelligence, and strategies for organizing your digital chaos into a structured knowledge base.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {ARTICLES.map((article) => (
                                <div
                                    key={article.id}
                                    onClick={() => window.location.hash = `#/blog?article=${article.id}`}
                                    className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-orange-200 transition-all cursor-pointer flex flex-col group"
                                >
                                    <div className="flex items-center gap-3 mb-6">
                                        <span className="px-3 py-1 rounded-full bg-slate-100 text-xs font-bold text-slate-600 tracking-wide group-hover:bg-orange-50 group-hover:text-orange-600 transition-colors">
                                            {article.category}
                                        </span>
                                        <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                                            <Clock size={12} /> {article.readTime}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-orange-600 transition-colors leading-snug">
                                        {article.title}
                                    </h3>
                                    <p className="text-sm text-slate-500 leading-relaxed mb-8 flex-1">
                                        {article.excerpt}
                                    </p>
                                    <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between text-sm font-semibold text-slate-400 group-hover:text-slate-900 transition-colors">
                                        <span>{article.date}</span>
                                        <span className="flex items-center gap-1 group-hover:text-orange-500 transition-colors">
                                            Read Article <ArrowLeft className="w-4 h-4 rotate-180" />
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="w-full max-w-3xl bg-white rounded-[3rem] shadow-xl border border-slate-100 p-8 md:p-16 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500 rounded-full mix-blend-multiply filter blur-[80px] opacity-10 pointer-events-none"></div>

                        <button
                            onClick={() => window.location.hash = '#/blog'}
                            className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-orange-600 transition-colors mb-10 bg-slate-50 px-4 py-2 rounded-full w-fit hover:bg-orange-50 border border-slate-100 hover:border-orange-100"
                        >
                            <ArrowLeft size={16} /> Back to Library
                        </button>

                        <div className="flex flex-wrap items-center gap-4 mb-6">
                            <span className="px-3 py-1 rounded-full bg-slate-100 text-xs font-bold text-slate-600 tracking-wide uppercase">
                                {activeArticle.category}
                            </span>
                            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                                <Clock size={14} /> {activeArticle.readTime}
                            </span>
                            <span className="text-xs font-semibold text-slate-400">• {activeArticle.date}</span>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.15] mb-8">
                            {activeArticle.title}
                        </h1>

                        <div className="w-full h-px bg-slate-100 mb-10"></div>

                        <div
                            className="text-lg text-slate-600 leading-loose prose-p:mb-6 prose-strong:text-slate-900 prose-ul:mb-6 prose-li:mb-2 prose-h3:text-2xl prose-h3:font-bold prose-h3:text-slate-900 prose-h3:mt-10 prose-h3:mb-4"
                            dangerouslySetInnerHTML={{ __html: activeArticle.content }}
                        />

                        <div className="mt-16 pt-8 border-t border-slate-200 flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-orange-500/20">
                                <BookOpen size={28} />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-3">Ready to organize your chaos?</h3>
                            <p className="text-slate-500 mb-8 max-w-md">Join thousands of professionals using Otter Vault to instantly organize, search, and extract data from their visual assets.</p>
                            <button onClick={() => window.location.hash = '#/'} className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all text-sm">
                                Create your free Vault
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </PublicLayout >
    );
}
