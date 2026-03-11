import React, { useState, useRef, useEffect } from 'react';
import {
    Upload, Search, LayoutGrid, Settings, LogOut,
    CheckCircle, Loader2, X, Plus, Trash2,
    Calendar, DollarSign, ChevronRight,
    Sparkles, Send, Download, Copy,
    FolderPlus, ArrowUpDown, Link as LinkIcon, Globe,
    Menu, Bell, Lightbulb, Lock, FileText,
    Image as ImageIcon, Landmark, ShoppingBag, Plane, Box,
    MessageSquare, Hash, Layers, Key, Mail, FolderDown,
    Home, Zap, Shield, Package, MessageCircle, TrendingUp, BookOpen
} from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Analytics } from "@vercel/analytics/react";

// --- SUPABASE INITIALIZATION ---
import { supabase } from './supabaseClient';

// --- CONSTANTS ---
const NVIDIA_API_KEY = "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";
const API_PROXY_URL = "/api/nvidia/v1/chat/completions";
const VISION_MODEL = "meta/llama-3.2-90b-vision-instruct";       // powerful vision model
const FALLBACK_VISION_MODELS = [
    "microsoft/phi-4-multimodal-instruct",
    "nvidia/llama-3.2-nv-vision-instruct-v2"
];
const TEXT_MODEL = "moonshotai/kimi-k2.5";                        // fast text model
const apiHeaders = {
    'Authorization': `Bearer ${NVIDIA_API_KEY}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
};

// --- UTILS ---
const compressImage = (file, maxWidth = 1024, quality = 0.6) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let scaleSize = 1;
                if (img.width > maxWidth) {
                    scaleSize = maxWidth / img.width;
                }
                canvas.width = img.width * scaleSize;
                canvas.height = img.height * scaleSize;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                const dataUrl = canvas.toDataURL('image/jpeg', quality);
                resolve(dataUrl);
            };
        };
        reader.onerror = (error) => reject(error);
    });
};

const getCategoryIcon = (category, size = 18) => {
    const lower = category.toLowerCase();
    if (lower.includes('bill') || lower.includes('invoice') || lower.includes('receipt')) return <Lightbulb size={size} />;
    if (lower.includes('otp') || lower.includes('auth') || lower.includes('password')) return <Lock size={size} />;
    if (lower.includes('note') || lower.includes('text') || lower.includes('document')) return <FileText size={size} />;
    if (lower.includes('illustration') || lower.includes('art') || lower.includes('design') || lower.includes('meme')) return <ImageIcon size={size} />;
    if (lower.includes('bank') || lower.includes('finance') || lower.includes('money')) return <Landmark size={size} />;
    if (lower.includes('shop') || lower.includes('order')) return <ShoppingBag size={size} />;
    if (lower.includes('travel') || lower.includes('ticket') || lower.includes('flight')) return <Plane size={size} />;
    return <Box size={size} />;
};

const OtterLogo = ({ size = 24, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="50" cy="50" r="40" />
        <ellipse cx="50" cy="50" rx="40" ry="15" />
    </svg>
);

export default function App() {
    const [user, setUser] = useState(null);
    const [authLoaded, setAuthLoaded] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [activeTab, setActiveTab] = useState('Home');
    const [searchQuery, setSearchQuery] = useState('');
    const [screenshots, setScreenshots] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStep, setUploadStep] = useState('');
    const fileInputRef = useRef(null);
    const folderInputRef = useRef(null);
    const abortControllerRef = useRef(null);
    const cancelUploadRef = useRef(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const [isChatLoading, setIsChatLoading] = useState(false);
    const [sortBy, setSortBy] = useState('newest');
    const [showLinkModal, setShowLinkModal] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');
    const [isScanningLink, setIsScanningLink] = useState(false);
    const [showInsightsModal, setShowInsightsModal] = useState(false);
    const [insightsText, setInsightsText] = useState('');
    const [isInsightsLoading, setIsInsightsLoading] = useState(false);
    const [magicActionText, setMagicActionText] = useState('');
    const [isMagicLoading, setIsMagicLoading] = useState(false);
    const uniqueCategories = [...new Set(screenshots.map(s => s.category))].sort();
    const [copySuccess, setCopySuccess] = useState(false);
    const [showDownloadModal, setShowDownloadModal] = useState(false);
    const [downloadFolderName, setDownloadFolderName] = useState('My Otter Vault');
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState('');
    const [showPaywallModal, setShowPaywallModal] = useState(false);
    const [paywallMessage, setPaywallMessage] = useState('');

    useEffect(() => {
        // Check for existing session on load
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                setUser(session.user);
                setIsAuthenticated(true);
            }
            setAuthLoaded(true);
        });

        // Listen for auth state changes (login/logout/token refresh)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                setUser(session.user);
                setIsAuthenticated(true);
            } else {
                setUser(null);
                setIsAuthenticated(false);
            }
            setAuthLoaded(true);
        });
        return () => subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await supabase.auth.signOut();
            setIsAuthenticated(false);
            setUser(null);
            setScreenshots([]);
        } catch (error) {
            console.error("Logout Error:", error);
        }
    };

    // Load screenshots from Supabase when user logs in
    useEffect(() => {
        if (!user) return;
        const loadScreenshots = async () => {
            try {
                const { data, error } = await supabase
                    .from('screenshots')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });
                if (error) throw error;
                // Build image URLs from Supabase Storage
                const withImages = (data || []).map(row => {
                    let image_url = '';
                    if (row.image_path) {
                        const { data: urlData } = supabase.storage
                            .from('screenshots')
                            .getPublicUrl(row.image_path);
                        image_url = urlData?.publicUrl || '';
                    }
                    return { ...row, image_url };
                });
                setScreenshots(withImages);
            } catch (error) {
                console.error('Error loading screenshots:', error);
            }
        };
        loadScreenshots();
    }, [user]);


    useEffect(() => {
        setChatMessages([]);
        setChatInput('');
        setCopySuccess(false);
        setMagicActionText('');
    }, [selectedImage]);

    if (!authLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="animate-spin text-red-500 w-10 h-10" />
            </div>
        );
    }

    const requireAuth = (e, callback) => {
        if (!isAuthenticated) {
            if (e) e.preventDefault();
            window.location.hash = '#/login';
            return;
        }
        if (callback) callback();
    };


    // --- CORE APP LOGIC ---
    const processFiles = async (files) => {
        if (!isAuthenticated) { window.location.hash = '#/login'; return; }

        let fileArray = Array.from(files).filter(f => f.type.startsWith('image/'));
        if (fileArray.length === 0) return;

        // Check 35 image limit for Free Plan
        if (screenshots.length + fileArray.length > 35) {
            setPaywallMessage('You have reached the free plan limit of 35 images. Upgrade to Pro for unlimited uploads!');
            setShowPaywallModal(true);

            // Only allow them to upload up to the 35 limit
            const allowedSpace = Math.max(0, 35 - screenshots.length);
            if (allowedSpace === 0) return;
            fileArray = fileArray.slice(0, allowedSpace);
        }

        setIsUploading(true);
        cancelUploadRef.current = false;

        const CONCURRENCY = 2; // Process 2 at a time (20 RPM limit)

        const processSingleFile = async (file, index) => {
            if (cancelUploadRef.current) return;
            setUploadStep(`Analyzing image ${index + 1} of ${fileArray.length}...`);

            // Compress: smaller for AI, normal for storage — in parallel
            const [aiDataUrl, storageDataUrl] = await Promise.all([
                compressImage(file, 768, 0.5),    // Medium for AI (good detail)
                compressImage(file, 1024, 0.6)    // Normal quality for storage
            ]);
            const aiBase64 = aiDataUrl.split(',')[1];
            const storageBase64 = storageDataUrl.split(',')[1];
            const mimeType = 'image/jpeg';

            // Run AI analysis
            let aiResult = {};
            if (NVIDIA_API_KEY) {
                try {
                    const prompt = `You are a JSON-only data extractor. Analyze the provided image and respond with ONLY a raw JSON object — no explanation, no markdown, no code fences. Your entire response must be valid JSON.
Use exactly this structure:
{"category":"Bills|Receipts|OTP|Notes|Illustration|Memes|Social|Banking|Shopping|Travel|Document|Blogs|Screenshots","summary":"One concise sentence describing what this image shows","tags":["tag1","tag2","tag3"],"amount_detected":null,"date_detected":null,"otp_detected":null}
Rules: category must be ONE of the exact values listed. amount_detected is a number or null. date_detected is YYYY-MM-DD or null. otp_detected is a numeric string or null. Output ONLY the JSON object, nothing else.`;
                    const MAX_RETRIES = 3;
                    let lastErr = null;
                    let aiData = null;

                    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
                        if (cancelUploadRef.current) break;

                        if (attempt > 0) {
                            const waitSec = (attempt + 1) * 2;
                            setUploadStep(`Retrying image ${index + 1} in ${waitSec}s...`);
                            await new Promise(r => setTimeout(r, waitSec * 1000));
                            if (cancelUploadRef.current) break;
                        }

                        // Try primary model first, then fallbacks
                        const modelsToTry = attempt === 0 ? [VISION_MODEL] : [VISION_MODEL, ...FALLBACK_VISION_MODELS];
                        let succeeded = false;

                        for (const model of modelsToTry) {
                            try {
                                const controller = new AbortController();
                                const timeoutId = setTimeout(() => controller.abort(), 30000);
                                const response = await fetch(API_PROXY_URL, {
                                    method: 'POST',
                                    headers: apiHeaders,
                                    signal: controller.signal,
                                    body: JSON.stringify({
                                        model: model,
                                        messages: [{
                                            role: "user",
                                            content: [
                                                { type: "text", text: prompt },
                                                { type: "image_url", image_url: { url: `data:${mimeType};base64,${aiBase64}` } }
                                            ]
                                        }],
                                        max_tokens: 256,
                                        temperature: 0.1
                                    })
                                });
                                clearTimeout(timeoutId);

                                if (response.status === 429) {
                                    lastErr = new Error('Rate limited');
                                    continue; // Try next model
                                }
                                if (!response.ok) {
                                    if (response.status >= 500) { lastErr = new Error('Server Error'); continue; }
                                    lastErr = new Error('API Error: ' + response.status);
                                    continue; // Try next model
                                }
                                aiData = await response.json();
                                lastErr = null;
                                succeeded = true;
                                break; // Got a good response
                            } catch (fetchErr) {
                                if (fetchErr.name === 'AbortError' && cancelUploadRef.current) throw fetchErr;
                                lastErr = fetchErr;
                            }
                        }
                        if (succeeded) break; // Exit retry loop
                    }

                    if (aiData && !lastErr) {
                        const text = aiData.choices?.[0]?.message?.content || '';
                        let cleanText = text.replace(/```json/gi, '').replace(/```/g, '').trim();
                        const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
                        if (jsonMatch) cleanText = jsonMatch[0];
                        try { aiResult = JSON.parse(cleanText); } catch (e) { console.warn('JSON parse failed for image', index + 1); }
                    }
                } catch (aiErr) {
                    if (aiErr.name === 'AbortError') throw aiErr;
                    console.warn('AI analysis failed:', aiErr.message);
                }
            }

            const newShot = {
                image_url: storageDataUrl, base64: storageBase64, mimeType,
                category: aiResult.category || 'Other',
                summary: aiResult.summary || file.name || 'Uploaded screenshot',
                tags: aiResult.tags || ['uploaded'],
                amount_detected: aiResult.amount_detected || null,
                date_detected: aiResult.date_detected || null,
                otp_detected: aiResult.otp_detected || null,
                created_at: new Date().toISOString()
            };

            setUploadStep(`Saving image ${index + 1} to Vault...`);
            if (user) {
                const fileExt = 'jpg';
                const fileName = `${user.id}/${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
                const blob = await (await fetch(storageDataUrl)).blob();
                const { error: uploadError } = await supabase.storage
                    .from('screenshots')
                    .upload(fileName, blob, { contentType: 'image/jpeg', upsert: false });
                if (uploadError) { console.error('Storage upload error:', uploadError); throw uploadError; }

                const { data: urlData } = supabase.storage.from('screenshots').getPublicUrl(fileName);
                const publicUrl = urlData?.publicUrl || '';

                const { data: insertedRow, error: insertError } = await supabase
                    .from('screenshots')
                    .insert({
                        user_id: user.id,
                        category: newShot.category, summary: newShot.summary,
                        tags: newShot.tags, amount_detected: newShot.amount_detected,
                        date_detected: newShot.date_detected || null,
                        otp_detected: newShot.otp_detected,
                        image_path: fileName, created_at: newShot.created_at
                    })
                    .select().single();
                if (insertError) { console.error('DB insert error:', insertError); throw insertError; }
                const savedShot = { ...insertedRow, image_url: publicUrl };
                setScreenshots(prev => [savedShot, ...prev]);
            } else {
                newShot.id = Math.random().toString(36).substr(2, 9);
                setScreenshots(prev => [newShot, ...prev]);
            }
        };

        // Process in batches of CONCURRENCY
        for (let i = 0; i < fileArray.length; i += CONCURRENCY) {
            if (cancelUploadRef.current) break;
            const batch = fileArray.slice(i, i + CONCURRENCY);
            const results = await Promise.allSettled(
                batch.map((file, batchIdx) => processSingleFile(file, i + batchIdx))
            );
            results.forEach((r, idx) => {
                if (r.status === 'rejected') console.error(`Processing failed for image ${i + idx + 1}:`, r.reason);
            });
        }

        setIsUploading(false);
        setUploadStep('');
    };

    const handleLinkImport = async () => {
        if (!isAuthenticated) { window.location.hash = '#/login'; return; }
        if (!linkUrl.trim()) return;
        setIsScanningLink(true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        const scrapedUrls = [
            'https://images.unsplash.com/photo-1550592704-6c76defa9985?w=500&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=500&auto=format&fit=crop'
        ];
        try {
            const downloadedFiles = [];
            for (let i = 0; i < scrapedUrls.length; i++) {
                const response = await fetch(scrapedUrls[i]);
                const blob = await response.blob();
                downloadedFiles.push(new File([blob], `scraped_${i}.jpg`, { type: blob.type }));
            }
            setIsScanningLink(false); setShowLinkModal(false); setLinkUrl('');
            processFiles(downloadedFiles);
        } catch (err) { setIsScanningLink(false); alert("Simulation failed."); }
    };

    const handleAskGemini = async () => {
        if (!chatInput.trim() || !selectedImage) return;
        const userMessage = { role: 'user', content: chatInput };
        setChatMessages(prev => [...prev, userMessage]);
        setChatInput(''); setIsChatLoading(true);
        try {
            const response = await fetch(API_PROXY_URL, {
                method: 'POST',
                headers: apiHeaders,
                body: JSON.stringify({
                    model: TEXT_MODEL,
                    messages: [{ role: "user", content: `Regarding this image (Category: ${selectedImage.category}, Summary: ${selectedImage.summary}, Tags: ${selectedImage.tags?.join(', ')}): ${chatInput}` }],
                    max_tokens: 1024,
                    temperature: 0.7
                })
            });
            if (!response.ok) throw new Error('API Error');
            const data = await response.json();
            const text = data.choices?.[0]?.message?.content || "Sorry, I couldn't analyze that.";
            setChatMessages(prev => [...prev, { role: 'ai', content: text }]);
        } catch (err) {
            setChatMessages(prev => [...prev, { role: 'ai', content: "Failed to connect to AI." }]);
        } finally { setIsChatLoading(false); }
    };

    const handleVaultInsights = async () => {
        if (screenshots.length === 0) return;
        setShowInsightsModal(true); setIsInsightsLoading(true); setInsightsText('');
        const vaultData = screenshots.map(s => ({ category: s.category, summary: s.summary, amount: s.amount_detected, date: s.date_detected }));
        try {
            const prompt = `You are an intelligent assistant analyzing a user's digital vault. Here is the metadata for their saved images: ${JSON.stringify(vaultData)}. Provide a quick, friendly, and highly engaging 3-sentence insight about their stored items. Mention spending totals if applicable, or categorize their focus (e.g., travel, bills). Format nicely without markdown bolding.`;
            const response = await fetch(API_PROXY_URL, {
                method: 'POST',
                headers: apiHeaders,
                body: JSON.stringify({
                    model: TEXT_MODEL,
                    messages: [{ role: "user", content: prompt }],
                    max_tokens: 512,
                    temperature: 0.7
                })
            });
            if (!response.ok) throw new Error('API Error');
            const data = await response.json();
            setInsightsText(data.choices?.[0]?.message?.content || "No insights could be generated.");
        } catch (err) { setInsightsText("Failed to generate vault insights. Please try again."); }
        finally { setIsInsightsLoading(false); }
    };

    const handleMagicAction = async (actionType) => {
        if (!selectedImage) return;
        setIsMagicLoading(true); setMagicActionText('');
        let prompt = '';
        if (actionType === 'expense') prompt = 'Extract all line items, the vendor name, and the total tax/amount from this receipt. Format it as a clean text list.';
        if (actionType === 'social') prompt = 'Write a catchy, highly engaging Instagram caption with 5 relevant hashtags for this image.';
        if (actionType === 'summarize') prompt = 'Summarize the key text or data points in this image using 3-4 bullet points.';
        try {
            const fullPrompt = `${prompt}\n\nImage context — Category: ${selectedImage.category}, Summary: ${selectedImage.summary}, Tags: ${selectedImage.tags?.join(', ')}.`;
            const response = await fetch(API_PROXY_URL, {
                method: 'POST',
                headers: apiHeaders,
                body: JSON.stringify({
                    model: TEXT_MODEL,
                    messages: [{ role: "user", content: fullPrompt }],
                    max_tokens: 1024,
                    temperature: 0.7
                })
            });
            if (!response.ok) throw new Error('API Error');
            const data = await response.json();
            setMagicActionText(data.choices?.[0]?.message?.content || "Action failed.");
        } catch (err) { setMagicActionText("Failed to execute magic action."); }
        finally { setIsMagicLoading(false); }
    };

    const handleFileUpload = (e) => {
        if (e.target.files && e.target.files.length > 0) processFiles(e.target.files);
        if (fileInputRef.current) fileInputRef.current.value = '';
        if (folderInputRef.current) folderInputRef.current.value = '';
    };

    const handleDrop = (e) => {
        e.preventDefault(); setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) processFiles(e.dataTransfer.files);
    };

    const filteredScreenshots = screenshots.filter(s => {
        const matchesTab = activeTab === 'All' || s.category === activeTab;
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = s.summary.toLowerCase().includes(searchLower) || s.tags.some(t => t.toLowerCase().includes(searchLower)) || s.category.toLowerCase().includes(searchLower);
        return matchesTab && matchesSearch;
    }).sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.created_at) - new Date(a.created_at);
        if (sortBy === 'oldest') return new Date(a.created_at) - new Date(b.created_at);
        return 0;
    });

    const downloadScreenshot = (image) => {
        const a = document.createElement('a');
        a.href = image.image_url;
        a.download = `Otter_${image.category}_${image.id}.png`;
        a.click();
    };

    const copyScreenshot = async (image) => {
        try {
            const res = await fetch(image.image_url);
            const blob = await res.blob();
            await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) { alert("Unable to copy image. Browser restriction."); }
    };

    const deleteScreenshot = async (id) => {
        setSelectedImage(null);
        if (user) {
            try {
                // Find the screenshot to get its image_path
                const toDelete = screenshots.find(s => s.id === id);
                // Delete from database
                const { error } = await supabase
                    .from('screenshots')
                    .delete()
                    .eq('id', id)
                    .eq('user_id', user.id);
                if (error) throw error;
                // Delete from storage
                if (toDelete?.image_path) {
                    await supabase.storage
                        .from('screenshots')
                        .remove([toDelete.image_path]);
                }
                setScreenshots(prev => prev.filter(s => s.id !== id));
            } catch (error) { console.error("Error deleting document:", error); }
        } else {
            setScreenshots(prev => prev.filter(s => s.id !== id));
        }
    };

    const totalAmount = filteredScreenshots.reduce((acc, curr) => acc + (parseFloat(curr.amount_detected) || 0), 0);

    const handleDownloadAll = async () => {
        if (screenshots.length === 0) return;
        setIsDownloading(true);
        setDownloadProgress('Preparing download...');
        try {
            const zip = new JSZip();
            const rootFolder = zip.folder(downloadFolderName || 'My Otter Vault');

            // Group screenshots by category
            const byCategory = {};
            screenshots.forEach(s => {
                const cat = s.category || 'Other';
                if (!byCategory[cat]) byCategory[cat] = [];
                byCategory[cat].push(s);
            });

            let processed = 0;
            const total = screenshots.length;

            for (const [category, items] of Object.entries(byCategory)) {
                const catFolder = rootFolder.folder(category);
                for (let i = 0; i < items.length; i++) {
                    const item = items[i];
                    processed++;
                    setDownloadProgress(`Downloading ${processed}/${total} — ${category}...`);

                    try {
                        let imageData;
                        if (item.image_url && item.image_url.startsWith('data:')) {
                            // Base64 data URL
                            const base64 = item.image_url.split(',')[1];
                            imageData = base64;
                            catFolder.file(`${category}_${i + 1}.jpg`, base64, { base64: true });
                        } else if (item.image_url) {
                            // Remote URL (Supabase)
                            const response = await fetch(item.image_url);
                            const blob = await response.blob();
                            catFolder.file(`${category}_${i + 1}.jpg`, blob);
                        }
                    } catch (err) {
                        console.warn(`Failed to download image ${processed}:`, err);
                    }
                }
            }

            setDownloadProgress('Creating ZIP file...');
            const blob = await zip.generateAsync({ type: 'blob' }, (metadata) => {
                setDownloadProgress(`Compressing... ${Math.round(metadata.percent)}%`);
            });
            saveAs(blob, `${downloadFolderName || 'My_Otter_Vault'}.zip`);
            setShowDownloadModal(false);
        } catch (err) {
            console.error('Download failed:', err);
            alert('Download failed. Please try again.');
        } finally {
            setIsDownloading(false);
            setDownloadProgress('');
        }
    };

    return (
        <div
            className="flex h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-red-100 selection:text-red-900"
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
        >
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
                body { font-family: 'Inter', sans-serif; }
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>

            {isDragging && (
                <div className="fixed inset-0 bg-red-600/10 backdrop-blur-md z-50 flex items-center justify-center border-[6px] border-dashed border-red-500 m-6 rounded-[3rem]">
                    <div className="bg-white p-10 rounded-3xl shadow-2xl text-center max-w-sm">
                        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Upload className="w-10 h-10 text-red-600 animate-bounce" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">Drop to upload</h2>
                        <p className="text-slate-500 mt-2 font-medium">AI will organize your files instantly.</p>
                    </div>
                </div>
            )}

            {isUploading && (
                <div className="fixed bottom-8 right-8 z-50 bg-slate-900 text-white shadow-2xl rounded-2xl p-4 flex items-center gap-4 max-w-sm border border-slate-700">
                    <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center shrink-0">
                        <Loader2 className="w-5 h-5 text-red-400 animate-spin" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm truncate">{uploadStep}</div>
                        <div className="text-xs text-slate-400 mt-0.5">Using Llama 3.2 90B Vision</div>
                    </div>
                    <button onClick={() => { cancelUploadRef.current = true; if (abortControllerRef.current) abortControllerRef.current.abort(); setIsUploading(false); }} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
                        <X size={18} />
                    </button>
                </div>
            )}

            <input type="file" ref={fileInputRef} accept="image/*" onChange={handleFileUpload} className="hidden" multiple />
            <input type="file" ref={folderInputRef} accept="image/*" onChange={handleFileUpload} className="hidden" webkitdirectory="true" directory="true" multiple />

            {/* Sidebar */}
            <aside className="w-64 bg-[#F8FAFC] border-r border-slate-200/80 flex flex-col shrink-0 hidden md:flex">
                <div className="p-6 pb-2">
                    <div className="flex items-center gap-2.5 font-extrabold text-xl tracking-tight text-slate-900">
                        <OtterLogo className="text-red-600" size={24} /> Otter
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto px-4 py-4 hide-scrollbar space-y-6">
                    {/* Main Navigation */}
                    <div className="space-y-1">
                        <button onClick={() => setActiveTab('Home')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold transition text-sm ${activeTab === 'Home' ? 'bg-red-50 text-red-700' : 'text-slate-600 hover:bg-slate-200/50'}`}>
                            <Home size={18} /> Home
                        </button>
                        <button onClick={() => setActiveTab('All')} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold transition text-sm ${activeTab === 'All' ? 'bg-red-50 text-red-700' : 'text-slate-600 hover:bg-slate-200/50'}`}>
                            <div className="flex items-center gap-3"><LayoutGrid size={18} /> Dashboard</div>
                            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${activeTab === 'All' ? 'bg-red-100 text-red-700' : 'bg-slate-200 text-slate-500'}`}>{screenshots.length}</span>
                        </button>
                        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition text-sm text-slate-600 hover:bg-slate-200/50">
                            <Calendar size={18} /> Timeline
                        </button>
                    </div>
                    {/* Smart Folders */}
                    <div>
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 px-3">Smart Folders</div>
                        {uniqueCategories.length === 0 ? (
                            <div className="px-3 text-sm text-slate-400">Folders appear automatically</div>
                        ) : (
                            <div className="space-y-0.5">
                                {uniqueCategories.map(category => {
                                    const count = screenshots.filter(s => s.category === category).length;
                                    const isActive = activeTab === category;
                                    return (
                                        <button key={category} onClick={() => setActiveTab(category)} className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium transition text-sm ${isActive ? 'bg-red-50 text-red-700 font-semibold' : 'text-slate-600 hover:bg-slate-200/50'}`}>
                                            <div className="flex items-center gap-3">
                                                <span className={isActive ? "text-red-600" : "text-slate-400"}>{getCategoryIcon(category, 18)}</span> {category}
                                            </div>
                                            {count > 0 && <span className="text-[11px] font-semibold text-slate-400">{count}</span>}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                    {/* Import Tools */}
                    <div>
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 px-3">Import Tools</div>
                        <button onClick={(e) => requireAuth(e, () => folderInputRef.current?.click())} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl font-medium transition text-sm text-slate-600 hover:bg-slate-200/50">
                            <FolderPlus size={18} className="text-slate-400" /> Folder Import
                        </button>
                        <button onClick={(e) => requireAuth(e, () => setShowLinkModal(true))} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl font-medium transition text-sm text-slate-600 hover:bg-slate-200/50 mt-0.5">
                            <LinkIcon size={18} className="text-slate-400" /> Web Link
                        </button>
                    </div>
                    {/* Legal & Info */}
                    <div>
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 px-3">Info</div>
                        <span onClick={() => { window.location.hash = '#/about'; }} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl font-medium transition text-sm text-slate-600 hover:bg-slate-200/50 cursor-pointer">
                            <Globe size={18} className="text-slate-400" /> About Us
                        </span>
                        <span onClick={() => { window.location.hash = '#/blog'; }} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl font-medium transition text-sm text-slate-600 hover:bg-slate-200/50 mt-0.5 cursor-pointer">
                            <BookOpen size={18} className="text-slate-400" /> Blog & Guides
                        </span>
                        <span onClick={() => { window.location.hash = '#/contact'; }} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl font-medium transition text-sm text-slate-600 hover:bg-slate-200/50 mt-0.5 cursor-pointer">
                            <MessageSquare size={18} className="text-slate-400" /> Contact Us
                        </span>
                        <span onClick={() => { window.location.hash = '#/terms'; }} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl font-medium transition text-sm text-slate-600 hover:bg-slate-200/50 mt-0.5 cursor-pointer">
                            <FileText size={18} className="text-slate-400" /> Terms & Conditions
                        </span>
                        <span onClick={() => { window.location.hash = '#/privacy'; }} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl font-medium transition text-sm text-slate-600 hover:bg-slate-200/50 mt-0.5 cursor-pointer">
                            <Shield size={18} className="text-slate-400" /> Privacy Policy
                        </span>
                    </div>
                </div>
                <div className="p-4 px-4 bg-gradient-to-b from-transparent to-orange-50/30 mt-auto border-t border-slate-200/80">
                    <button onClick={() => window.location.hash = '#/pricing'} className="w-full relative py-3 rounded-xl font-bold text-center transition-all duration-300 overflow-hidden group flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 via-red-500 to-rose-500 text-white shadow-md shadow-orange-500/20 hover:shadow-lg hover:scale-[1.02] text-sm">
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
                        <span className="relative z-10 flex items-center gap-2">Upgrade to Pro <Zap size={14} className="fill-white/30" /></span>
                    </button>
                </div>
                <div className="p-4 border-t border-slate-200/80">
                    {isAuthenticated ? (
                        <div className="flex items-center gap-3 px-2 py-2 group cursor-pointer" onClick={handleLogout}>
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-red-500 to-rose-500 text-white flex items-center justify-center font-bold text-xs shadow-sm group-hover:shadow-md transition-shadow">
                                {user?.user_metadata?.full_name ? user.user_metadata.full_name.charAt(0).toUpperCase() : 'US'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-semibold text-slate-900 truncate flex items-center gap-2">
                                    {user?.user_metadata?.full_name || 'My Vault'} <LogOut size={12} className="text-slate-400 opacity-0 group-hover:opacity-100" />
                                </div>
                                <div className="text-xs text-slate-500 truncate">{screenshots.length} / 5GB used</div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3 px-2 py-2 group cursor-pointer" onClick={() => window.location.hash = '#/login'}>
                            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-xs shadow-sm group-hover:bg-slate-300 transition-colors">
                                ?
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-semibold text-slate-900 truncate flex items-center gap-2">
                                    Sign In <LogOut size={12} className="text-slate-400 opacity-0 group-hover:opacity-100 rotate-180" />
                                </div>
                                <div className="text-xs text-slate-500 truncate">Create an account</div>
                            </div>
                        </div>
                    )}
                </div>
            </aside>

            {/* Main */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
                {/* Header - different for Home vs Dashboard */}
                <header className="absolute top-0 left-0 right-0 h-20 px-8 flex items-center justify-between z-10 bg-[#F8FAFC]/80 backdrop-blur-md border-b border-slate-200/50">
                    <h1 className="text-2xl font-bold text-slate-900">
                        {activeTab === 'Home' ? 'Welcome to Otter' : activeTab === 'All' ? 'Dashboard' : activeTab}
                    </h1>
                    <div className="flex items-center gap-3">
                        <button onClick={() => window.location.hash = '#/pricing'} className="relative flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 rounded-full text-white font-bold text-xs md:text-sm shadow-md bg-gradient-to-r from-orange-500 via-red-500 to-rose-500 overflow-hidden group hover:shadow-lg hover:-translate-y-0.5 transition-all">
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
                            <span className="relative z-10 flex items-center gap-2">Upgrade <Zap size={14} className="fill-white/30" /></span>
                        </button>
                        {activeTab !== 'Home' && (
                            <>
                                <div className="relative w-72 group">
                                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-red-500 transition-colors" />
                                    <input type="text" placeholder="Search semantics..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-full outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all text-sm font-medium shadow-sm" />
                                </div>
                                <button className="p-2.5 bg-white border border-slate-200 rounded-full text-slate-500 hover:text-slate-900 hover:border-slate-300 transition-all shadow-sm"><Bell size={18} /></button>
                                <button onClick={handleVaultInsights} disabled={screenshots.length === 0} className="bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-full font-semibold shadow-sm hover:bg-slate-50 hover:-translate-y-0.5 transition-all flex items-center gap-2 text-sm disabled:opacity-50 disabled:hover:translate-y-0 ml-2">
                                    <Sparkles size={16} className="text-amber-500" /> Vault Insights
                                </button>
                                <button onClick={() => { setPaywallMessage('Bulk downloading your entire vault structure is a Pro feature.'); setShowPaywallModal(true); }} className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-5 py-2.5 rounded-full font-semibold shadow-md shadow-emerald-500/25 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2 text-sm ml-2">
                                    <FolderDown size={16} /> Download All
                                </button>
                            </>
                        )}
                        <button onClick={(e) => requireAuth(e, () => fileInputRef.current?.click())} className="bg-red-600 text-white px-5 py-2.5 rounded-full font-semibold shadow-md shadow-red-600/20 hover:bg-red-700 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2 text-sm ml-2">
                            <Upload size={16} /> Upload
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto px-8 pt-28 pb-10 hide-scrollbar">

                    {/* ═══ HOME VIEW ═══ */}
                    {activeTab === 'Home' && (
                        <div className="space-y-10 max-w-5xl mx-auto pb-8">

                            {/* ── Welcome Hero Card ── */}
                            <div className="rounded-[32px] bg-gradient-to-br from-red-500 via-rose-500 to-pink-600 p-10 md:p-14 text-white relative overflow-hidden">
                                <div className="absolute top-[-60px] right-[-40px] w-72 h-72 rounded-full bg-white/8 pointer-events-none" />
                                <div className="absolute bottom-[-50px] left-[-30px] w-52 h-52 rounded-full bg-white/5 pointer-events-none" />
                                {/* Illustration: floating cards */}
                                <div className="absolute right-8 bottom-8 hidden lg:flex flex-col gap-2 opacity-25">
                                    <div className="w-28 h-16 bg-white/20 rounded-2xl backdrop-blur-sm" />
                                    <div className="w-24 h-14 bg-white/15 rounded-2xl backdrop-blur-sm ml-6" />
                                    <div className="w-20 h-12 bg-white/10 rounded-2xl backdrop-blur-sm ml-2" />
                                </div>
                                <div className="relative z-10 max-w-lg">
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm mb-6 border border-white/10">
                                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                        <span className="text-[10px] font-bold text-white/70 uppercase tracking-wider">Online</span>
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-black mb-3 leading-tight">Welcome back{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name.split(' ')[0]}` : ''} 👋</h2>
                                    <p className="text-white/50 text-sm md:text-base font-medium mb-8 leading-relaxed">Your AI-powered screenshot vault. Upload, organize, search, and extract insights from your images effortlessly.</p>
                                    <div className="flex flex-wrap gap-3">
                                        <button onClick={() => setActiveTab('All')} className="px-6 py-3 rounded-2xl bg-white text-red-600 font-bold text-sm shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all flex items-center gap-2.5">
                                            <LayoutGrid size={16} /> Go to Dashboard
                                        </button>
                                        <button onClick={(e) => requireAuth(e, () => fileInputRef.current?.click())} className="px-6 py-3 rounded-2xl bg-white/15 text-white font-bold text-sm border border-white/20 hover:bg-white/25 transition-all flex items-center gap-2.5 backdrop-blur-sm">
                                            <Upload size={16} /> Upload Images
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* ── Quick Stats ── */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                                {[
                                    { label: 'Total Stored', value: screenshots.length, icon: <ImageIcon size={22} />, bg: 'bg-white', iconBg: 'bg-slate-100', color: 'text-slate-400', border: 'border-slate-200' },
                                    { label: 'Amount Detected', value: `₹${totalAmount > 1000 ? (totalAmount / 1000).toFixed(1) + 'k' : totalAmount}`, icon: <DollarSign size={22} />, bg: 'bg-white', iconBg: 'bg-emerald-50', color: 'text-emerald-500', border: 'border-emerald-100' },
                                    { label: 'Categories', value: uniqueCategories.length, icon: <Layers size={22} />, bg: 'bg-white', iconBg: 'bg-violet-50', color: 'text-violet-500', border: 'border-violet-100' },
                                    { label: 'AI Accuracy', value: '99%', icon: <Zap size={22} />, bg: 'bg-white', iconBg: 'bg-amber-50', color: 'text-amber-500', border: 'border-amber-100' },
                                ].map((s, i) => (
                                    <div key={i} className={`${s.bg} p-6 rounded-[24px] border ${s.border} shadow-sm hover:shadow-md transition-shadow`}>
                                        <div className={`w-12 h-12 ${s.iconBg} rounded-2xl flex items-center justify-center ${s.color} mb-4`}>{s.icon}</div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">{s.label}</div>
                                        <div className="text-3xl font-black text-slate-900">{s.value}</div>
                                    </div>
                                ))}
                            </div>

                            {/* ── Feature Cards ── */}
                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center"><Sparkles size={18} className="text-amber-500" /></div>
                                    <h3 className="text-xl font-black text-slate-900">What Otter Does</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                    {/* OCR Card */}
                                    <div className="rounded-[28px] bg-white border border-slate-200 p-8 hover:shadow-xl hover:shadow-red-500/5 transition-all group">
                                        <div className="flex items-start justify-between mb-5">
                                            <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center">
                                                <Search size={24} className="text-red-500" />
                                            </div>
                                            {/* Mini illustration: document lines */}
                                            <div className="w-24 h-16 rounded-xl bg-red-50 border border-red-100/50 p-2.5 flex flex-col gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                                                <div className="h-1.5 bg-red-200 rounded-full w-full" />
                                                <div className="h-1.5 bg-red-200/60 rounded-full w-4/5" />
                                                <div className="h-1.5 bg-red-200/40 rounded-full w-3/5" />
                                                <div className="text-[7px] font-bold text-red-400 mt-auto">₹2,450</div>
                                            </div>
                                        </div>
                                        <h4 className="text-lg font-black text-slate-900 mb-2">AI-Powered OCR</h4>
                                        <p className="text-sm text-slate-400 leading-relaxed">Instantly extract text from screenshots, receipts, and documents. Detects amounts, dates, and important data automatically.</p>
                                    </div>

                                    {/* Smart Tagging Card */}
                                    <div className="rounded-[28px] bg-white border border-slate-200 p-8 hover:shadow-xl hover:shadow-amber-500/5 transition-all group">
                                        <div className="flex items-start justify-between mb-5">
                                            <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center">
                                                <Hash size={24} className="text-amber-500" />
                                            </div>
                                            {/* Mini illustration: tags */}
                                            <div className="flex gap-1.5 flex-wrap max-w-[120px] opacity-60 group-hover:opacity-100 transition-opacity">
                                                {['receipt', 'food', 'bill', 'shopping'].map(t => (
                                                    <span key={t} className="px-2 py-1 bg-amber-50 border border-amber-100 rounded-lg text-[8px] font-bold text-amber-500 uppercase">{t}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <h4 className="text-lg font-black text-slate-900 mb-2">Smart Tagging</h4>
                                        <p className="text-sm text-slate-400 leading-relaxed">Every image is auto-tagged with AI-generated keywords. Search your vault by content, not filenames.</p>
                                    </div>

                                    {/* Smart Folders Card */}
                                    <div className="rounded-[28px] bg-white border border-slate-200 p-8 hover:shadow-xl hover:shadow-violet-500/5 transition-all group">
                                        <div className="flex items-start justify-between mb-5">
                                            <div className="w-14 h-14 rounded-2xl bg-violet-50 border border-violet-100 flex items-center justify-center">
                                                <Layers size={24} className="text-violet-500" />
                                            </div>
                                            {/* Mini illustration: folder chips */}
                                            <div className="flex flex-col gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                                {['Bills', 'Travel', 'Shopping'].map(f => (
                                                    <div key={f} className="flex items-center gap-1.5 px-2.5 py-1 bg-violet-50 border border-violet-100/60 rounded-lg">
                                                        <div className="w-2 h-2 rounded-sm bg-violet-300" />
                                                        <span className="text-[8px] font-bold text-violet-500">{f}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <h4 className="text-lg font-black text-slate-900 mb-2">Smart Folders</h4>
                                        <p className="text-sm text-slate-400 leading-relaxed">Images auto-sort into categories like Bills, Travel, Shopping, and Banking — no manual work needed.</p>
                                    </div>

                                    {/* AI Chat Card */}
                                    <div className="rounded-[28px] bg-white border border-slate-200 p-8 hover:shadow-xl hover:shadow-sky-500/5 transition-all group">
                                        <div className="flex items-start justify-between mb-5">
                                            <div className="w-14 h-14 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center">
                                                <MessageSquare size={24} className="text-sky-500" />
                                            </div>
                                            {/* Mini illustration: chat bubbles */}
                                            <div className="flex flex-col gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                                                <div className="px-2.5 py-1.5 bg-sky-50 border border-sky-100 rounded-xl rounded-tl-sm max-w-[100px]">
                                                    <span className="text-[8px] font-medium text-sky-600">What's the total?</span>
                                                </div>
                                                <div className="px-2.5 py-1.5 bg-slate-100 border border-slate-200 rounded-xl rounded-tr-sm max-w-[90px] self-end">
                                                    <span className="text-[8px] font-medium text-slate-500">₹2,450.00</span>
                                                </div>
                                            </div>
                                        </div>
                                        <h4 className="text-lg font-black text-slate-900 mb-2">AI Chat Assistant</h4>
                                        <p className="text-sm text-slate-400 leading-relaxed">Ask questions about any image in natural language. Get instant, accurate answers from our AI engine.</p>
                                    </div>

                                    {/* Amount Detection - Full Width */}
                                    <div className="md:col-span-2 rounded-[28px] bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 p-8 hover:shadow-xl hover:shadow-emerald-500/5 transition-all group">
                                        <div className="flex items-start justify-between mb-5">
                                            <div className="w-14 h-14 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center">
                                                <DollarSign size={24} className="text-emerald-600" />
                                            </div>
                                            {/* Mini illustration: bar chart */}
                                            <div className="flex items-end gap-2 h-14 opacity-60 group-hover:opacity-100 transition-opacity">
                                                {[40, 65, 35, 80, 55, 70, 50].map((h, i) => (
                                                    <div key={i} className="w-4 rounded-t-md bg-emerald-200" style={{ height: `${h}%` }} />
                                                ))}
                                            </div>
                                        </div>
                                        <h4 className="text-lg font-black text-slate-900 mb-2">Amount & OTP Detection</h4>
                                        <p className="text-sm text-slate-400 leading-relaxed max-w-lg">Automatically detect monetary amounts (₹), dates, and OTP codes from your screenshots. Track spending across all your receipts and bills.</p>
                                    </div>

                                    {/* Bulk Export Card */}
                                    <div className="md:col-span-2 rounded-[28px] bg-white border border-slate-200 p-8 hover:shadow-xl hover:shadow-orange-500/5 transition-all group">
                                        <div className="flex items-start justify-between mb-5">
                                            <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center">
                                                <FolderDown size={24} className="text-orange-500" />
                                            </div>
                                            {/* Mini illustration: zip file */}
                                            <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                                <div className="px-3 py-2 bg-orange-50 border border-orange-100 rounded-xl flex items-center gap-2">
                                                    <div className="w-6 h-7 bg-orange-200 rounded-md flex items-center justify-center">
                                                        <span className="text-[6px] font-black text-orange-600">ZIP</span>
                                                    </div>
                                                    <div>
                                                        <div className="text-[8px] font-bold text-orange-600">vault-export.zip</div>
                                                        <div className="text-[7px] text-orange-400">12 files • 24 MB</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <h4 className="text-lg font-black text-slate-900 mb-2">Bulk Export</h4>
                                        <p className="text-sm text-slate-400 leading-relaxed max-w-lg">Download your entire vault as a neatly organized ZIP file with category subfolders. Your data, your way.</p>
                                    </div>
                                </div>
                            </div>

                            {/* ── Pricing ── */}
                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center"><TrendingUp size={18} className="text-emerald-500" /></div>
                                    <h3 className="text-xl font-black text-slate-900">Choose Your Plan</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {/* Free Plan */}
                                    <div className="rounded-[28px] bg-white border border-slate-200 p-8 hover:shadow-lg transition-shadow">
                                        <div className="inline-flex px-3 py-1 rounded-full bg-slate-100 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Free</div>
                                        <div className="text-4xl font-black text-slate-900 mb-1">$0 <span className="text-base font-medium text-slate-300">/forever</span></div>
                                        <p className="text-sm text-slate-400 mb-6">Perfect for getting started.</p>
                                        <ul className="space-y-3">
                                            {['35 image uploads limit', 'AI tagging & OCR', 'Smart Folders', 'Search only'].map((f, i) => (
                                                <li key={i} className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                                                    <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0"><svg className="w-3 h-3 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg></div>
                                                    {f}
                                                </li>
                                            ))}
                                        </ul>
                                        <button className="mt-8 w-full py-3.5 rounded-xl font-bold text-slate-900 bg-slate-100 hover:bg-slate-200 transition-all pointer-events-none">Current Plan</button>
                                    </div>

                                    {/* Premium Plan */}
                                    <div className="rounded-[28px] bg-gradient-to-br from-red-500 via-rose-500 to-pink-600 p-8 text-white relative overflow-hidden">
                                        <div className="absolute top-[-30px] right-[-30px] w-40 h-40 rounded-full bg-white/8 pointer-events-none" />
                                        <div className="absolute bottom-[-20px] left-[-20px] w-28 h-28 rounded-full bg-white/5 pointer-events-none" />
                                        <div className="relative z-10">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="inline-flex px-3 py-1 rounded-full bg-white/15 text-[10px] font-black text-white/70 uppercase tracking-widest">Premium</div>
                                                <span className="text-[9px] font-bold px-2.5 py-1 rounded-full bg-white/20 text-white/80">⭐ Popular</span>
                                            </div>
                                            <div className="text-4xl font-black mb-1">$1 <span className="text-base font-medium text-white/40">/month</span></div>
                                            <p className="text-sm text-white/40 mb-6">Unlock the full power of Otter.</p>
                                            <ul className="space-y-3">
                                                {['Unlimited uploads', 'Bulk ZIP Export Download', 'Advanced AI search', 'Priority processing', 'Magic Actions'].map((f, i) => (
                                                    <li key={i} className="flex items-center gap-3 text-sm text-white/70 font-medium">
                                                        <div className="w-5 h-5 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0"><svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg></div>
                                                        {f}
                                                    </li>
                                                ))}
                                            </ul>
                                            <button onClick={() => window.location.hash = '#/pricing'} className="mt-8 relative w-full py-3.5 rounded-xl font-bold text-center transition-all duration-300 overflow-hidden group flex items-center justify-center gap-2 bg-gradient-to-r from-orange-400 to-rose-500 text-white shadow-xl shadow-red-500/30 hover:shadow-2xl hover:scale-[1.02]">
                                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
                                                <span className="relative z-10 flex items-center gap-2">Upgrade to Pro <Zap size={18} className="fill-white/30" /></span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ── How to Use Otter ── */}
                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center"><BookOpen size={18} className="text-blue-500" /></div>
                                    <h3 className="text-xl font-black text-slate-900">How to Use Otter</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                    <div className="rounded-[24px] bg-white border border-slate-200 p-8 shadow-sm">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-900 font-black text-lg flex items-center justify-center mb-5">1</div>
                                        <h4 className="text-lg font-black text-slate-900 mb-2">Upload Images</h4>
                                        <p className="text-sm text-slate-500 leading-relaxed">Drag and drop your messy screenshots, receipts, bills, and random notes directly into the vault. No sorting required.</p>
                                    </div>
                                    <div className="rounded-[24px] bg-white border border-slate-200 p-8 shadow-sm">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-900 font-black text-lg flex items-center justify-center mb-5">2</div>
                                        <h4 className="text-lg font-black text-slate-900 mb-2">AI Analyzes Data</h4>
                                        <p className="text-sm text-slate-500 leading-relaxed">Our advanced vision models instantly extract all text, detect total amounts and dates, and organize your images into smart folders.</p>
                                    </div>
                                    <div className="rounded-[24px] bg-white border border-slate-200 p-8 shadow-sm">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-900 font-black text-lg flex items-center justify-center mb-5">3</div>
                                        <h4 className="text-lg font-black text-slate-900 mb-2">Search & Chat</h4>
                                        <p className="text-sm text-slate-500 leading-relaxed">Need to find an old bill? Just search for what it looks like, or chat directly with your vault to get instant answers from your documents.</p>
                                    </div>
                                </div>
                            </div>

                            {/* ── FAQ Section ── */}
                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center"><MessageCircle size={18} className="text-slate-600" /></div>
                                    <h3 className="text-xl font-black text-slate-900">Frequently Asked Questions</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="rounded-[24px] bg-white border border-slate-200 p-8 shadow-sm">
                                        <h4 className="text-base font-bold text-slate-900 mb-3">Is Otter free to use?</h4>
                                        <p className="text-sm text-slate-500 leading-relaxed">Yes, our base version is completely free forever. It supports up to 35 image uploads and includes full AI tagging and OCR capabilities for searching. If you need unlimited uploads and bulk ZIP downloading, we offer a $1/month Premium subscription.</p>
                                    </div>
                                    <div className="rounded-[24px] bg-white border border-slate-200 p-8 shadow-sm">
                                        <h4 className="text-base font-bold text-slate-900 mb-3">How does the AI text extraction work?</h4>
                                        <p className="text-sm text-slate-500 leading-relaxed">We utilize state-of-the-art vision models (like Llama 3.2 90B Vision) to 'read' your screenshots intuitively. This allows us to accurately capture complex receipt layouts, decode handwritten notes, and tag images based on visual context.</p>
                                    </div>
                                    <div className="rounded-[24px] bg-white border border-slate-200 p-8 shadow-sm">
                                        <h4 className="text-base font-bold text-slate-900 mb-3">Is my personal data secure?</h4>
                                        <p className="text-sm text-slate-500 leading-relaxed">Absolutely. Your uploads are secured using enterprise-grade encryption via Supabase. We do not use your private and personal documents to train our public AI models. Learn more in our Privacy Policy.</p>
                                    </div>
                                    <div className="rounded-[24px] bg-white border border-slate-200 p-8 shadow-sm">
                                        <h4 className="text-base font-bold text-slate-900 mb-3">Can I export my data easily?</h4>
                                        <p className="text-sm text-slate-500 leading-relaxed">Yes. We believe you should always own your data. You can utilize our one-click Bulk Export feature at any time to download a deeply categorized ZIP file containing all your uploaded images.</p>
                                    </div>
                                </div>
                            </div>

                            {/* ── Footer ── */}
                            <div className="rounded-[28px] bg-white border border-slate-200 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-500/15">
                                        <OtterLogo className="text-white" size={18} />
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-900 text-sm">Otter</div>
                                        <div className="text-[10px] text-slate-400">© 2025–2026 Otter Inc.</div>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-5">
                                    <span onClick={() => { window.location.hash = '#/about'; }} className="text-xs text-slate-400 hover:text-slate-900 cursor-pointer transition-colors font-semibold">About Us</span>
                                    <span onClick={() => { window.location.hash = '#/contact'; }} className="text-xs text-slate-400 hover:text-slate-900 cursor-pointer transition-colors font-semibold">Contact</span>
                                    <span onClick={() => { window.location.hash = '#/terms'; }} className="text-xs text-slate-400 hover:text-slate-900 cursor-pointer transition-colors font-semibold">Terms</span>
                                    <span onClick={() => { window.location.hash = '#/privacy'; }} className="text-xs text-slate-400 hover:text-slate-900 cursor-pointer transition-colors font-semibold">Privacy</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ═══ DASHBOARD / CATEGORY VIEW ═══ */}
                    {activeTab !== 'Home' && (
                        <>
                            {/* Horizontal Category Cards like Pinterest-style */}
                            <div className="mb-6 -mx-2">
                                <div className="flex gap-3 overflow-x-auto pb-2 px-2 hide-scrollbar">
                                    {/* All Items */}
                                    <button
                                        onClick={() => setActiveTab('All')}
                                        className={`flex items-center gap-2 px-4 py-2.5 rounded-full border whitespace-nowrap transition-all flex-shrink-0 font-semibold text-sm shadow-sm ${activeTab === 'All'
                                            ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'}`}
                                    >
                                        <span>All Items</span>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${activeTab === 'All' ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-500'}`}>{screenshots.length}</span>
                                    </button>

                                    {/* Dynamic Categories */}
                                    {uniqueCategories.map(category => {
                                        const count = screenshots.filter(s => s.category === category).length;
                                        const isActive = activeTab === category;
                                        return (
                                            <button
                                                key={category}
                                                onClick={() => setActiveTab(category)}
                                                className={`flex items-center gap-2 px-4 py-2.5 rounded-full border whitespace-nowrap transition-all flex-shrink-0 font-semibold text-sm shadow-sm ${isActive
                                                    ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                                                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'}`}
                                            >
                                                <span>{category}</span>
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full ${isActive ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-500'}`}>{count}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                <div className="bg-white p-5 rounded-[22px] border border-slate-200 shadow-sm flex items-center justify-between">
                                    <div><div className="text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Total Stored</div><div className="text-3xl font-bold text-slate-900">{filteredScreenshots.length}</div></div>
                                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400"><ImageIcon size={20} /></div>
                                </div>
                                <div className="bg-white p-5 rounded-[22px] border border-slate-200 shadow-sm flex items-center justify-between">
                                    <div><div className="text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Amount Detected</div><div className="text-3xl font-bold text-slate-900">₹{totalAmount > 1000 ? (totalAmount / 1000).toFixed(1) + 'k' : totalAmount}</div></div>
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500"><DollarSign size={20} /></div>
                                </div>
                                <div className="bg-white p-5 rounded-[22px] border border-slate-200 shadow-sm flex items-center justify-between">
                                    <div><div className="text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Active Reminders</div><div className="text-3xl font-bold text-slate-900">2</div></div>
                                    <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500"><Calendar size={20} /></div>
                                </div>
                            </div>

                            {filteredScreenshots.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-slate-200 rounded-[28px] bg-slate-50/50">
                                    <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6"><OtterLogo className="w-8 h-8 text-red-400" /></div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-3">Build your visual memory</h3>
                                    <p className="text-slate-500 text-sm mb-10 max-w-md text-center font-medium leading-relaxed">Choose how you want to add images to your vault. Our AI will automatically tag, categorize, and extract data from everything you upload.</p>
                                    <div className="flex flex-col sm:flex-row items-center gap-4">
                                        <button onClick={(e) => requireAuth(e, () => fileInputRef.current?.click())} className="bg-red-600 text-white px-6 py-3 rounded-2xl font-semibold shadow-md shadow-red-600/20 hover:bg-red-700 hover:-translate-y-0.5 transition-all flex items-center gap-2"><Upload size={18} /> Upload Image</button>
                                        <button onClick={(e) => requireAuth(e, () => folderInputRef.current?.click())} className="bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-2xl font-semibold shadow-sm hover:border-slate-300 hover:bg-slate-50 hover:-translate-y-0.5 transition-all flex items-center gap-2"><FolderPlus size={18} className="text-slate-400" /> Import Directory</button>
                                        <button onClick={(e) => requireAuth(e, () => setShowLinkModal(true))} className="bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-2xl font-semibold shadow-sm hover:border-slate-300 hover:bg-slate-50 hover:-translate-y-0.5 transition-all flex items-center gap-2"><Globe size={18} className="text-slate-400" /> Import from URL</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                                    {filteredScreenshots.map((item) => (
                                        <div key={item.id} className="group bg-white rounded-[22px] border border-slate-200 overflow-hidden hover:shadow-xl hover:shadow-red-500/10 hover:border-red-200 transition-all duration-300 cursor-pointer flex flex-col h-[320px]" onClick={() => setSelectedImage(item)}>
                                            <div className="h-44 bg-slate-100 relative overflow-hidden shrink-0 border-b border-slate-100 flex items-center justify-center">
                                                <img src={item.image_url} alt="Thumbnail" loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors"></div>
                                                <div className="absolute top-3 left-3 flex gap-2">
                                                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wider uppercase bg-white/90 backdrop-blur-md text-slate-800 shadow-sm flex items-center gap-1.5">{getCategoryIcon(item.category, 12)} {item.category}</span>
                                                </div>
                                            </div>
                                            <div className="p-5 flex flex-col flex-1 bg-white">
                                                <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 leading-snug mb-3">{item.summary}</h3>
                                                <div className="flex gap-1.5 flex-wrap mb-auto">
                                                    {item.tags.slice(0, 3).map((tag, i) => (<span key={i} className="px-2 py-0.5 bg-slate-50 text-slate-500 border border-slate-100 text-[10px] font-bold uppercase tracking-wider rounded-md">{tag}</span>))}
                                                </div>
                                                <div className="flex items-center justify-between pt-4 mt-2">
                                                    <div className="text-sm font-bold text-slate-900">
                                                        {item.amount_detected ? (<span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">₹{item.amount_detected}</span>) : (item.otp_detected ? (<span className="font-mono text-red-600 bg-red-50 px-2 py-0.5 rounded-md tracking-wider">{item.otp_detected}</span>) : '')}
                                                    </div>
                                                    <div className="text-xs font-medium text-slate-400">
                                                        {item.date_detected ? new Date(item.date_detected).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Dashboard Global Footer to satisfy requirement */}
                <footer className="mt-12 pt-8 border-t border-slate-200/50 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-500 pb-12 sm:pb-6">
                    <div className="flex items-center gap-2 px-4 md:px-0">
                        <span className="font-extrabold text-slate-800">Otter Vault</span>
                        <span>© {new Date().getFullYear()}</span>
                    </div>
                    <div className="flex flex-wrap gap-4 md:gap-6 justify-center px-4 md:px-0">
                        <span onClick={() => window.location.hash = '#/about'} className="hover:text-slate-900 cursor-pointer transition-colors">About Us</span>
                        <span onClick={() => window.location.hash = '#/blog'} className="hover:text-slate-900 cursor-pointer transition-colors">Blog</span>
                        <span onClick={() => window.location.hash = '#/contact'} className="hover:text-slate-900 cursor-pointer transition-colors">Contact</span>
                        <span onClick={() => window.location.hash = '#/privacy'} className="hover:text-slate-900 cursor-pointer transition-colors">Privacy Policy</span>
                        <span onClick={() => window.location.hash = '#/terms'} className="hover:text-slate-900 cursor-pointer transition-colors">Terms of Service</span>
                    </div>
                </footer>
            </main>

            {/* Slide-over Drawer */}
            {selectedImage && (
                <>
                    <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50 transition-opacity" onClick={() => setSelectedImage(null)}></div>
                    <div className="fixed inset-y-0 right-0 w-full max-w-md md:max-w-2xl bg-white shadow-2xl z-50 flex flex-col sm:rounded-l-3xl border-l border-slate-200">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-md z-10 absolute top-0 w-full rounded-tl-3xl">
                            <div className="flex items-center gap-3">
                                <span className="px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase bg-slate-100 text-slate-600 flex items-center gap-1.5">{getCategoryIcon(selectedImage.category, 14)} {selectedImage.category}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => deleteScreenshot(selectedImage.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"><Trash2 size={18} /></button>
                                <div className="w-px h-5 bg-slate-200 mx-1"></div>
                                <button onClick={() => setSelectedImage(null)} className="p-2 bg-slate-100 text-slate-500 hover:text-slate-900 rounded-full transition-colors"><X size={18} /></button>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto mt-[72px] pb-6 hide-scrollbar flex flex-col md:flex-row">
                            <div className="w-full md:w-1/2 p-6 bg-slate-50/50 flex items-start justify-center border-b md:border-b-0 md:border-r border-slate-100">
                                <div className="sticky top-6 rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-white">
                                    <img src={selectedImage.image_url} alt="Full" loading="lazy" className="w-full h-auto object-contain" />
                                </div>
                            </div>
                            <div className="w-full md:w-1/2 flex flex-col bg-white px-8 py-6">
                                <h2 className="text-xl font-bold text-slate-900 mb-6 leading-snug">{selectedImage.summary}</h2>
                                <div className="grid grid-cols-2 gap-3 mb-8">
                                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100/50">
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><Calendar size={12} /> Date</div>
                                        <div className="font-semibold text-slate-900">{selectedImage.date_detected || 'None'}</div>
                                    </div>
                                    <div className="bg-emerald-50/50 rounded-xl p-4 border border-emerald-100/50">
                                        <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><DollarSign size={12} /> Amount</div>
                                        <div className="font-bold text-emerald-700 text-lg leading-none">{selectedImage.amount_detected ? `₹${selectedImage.amount_detected}` : 'None'}</div>
                                    </div>
                                </div>
                                {selectedImage.otp_detected && (
                                    <div className="bg-red-50 border border-red-100/50 rounded-2xl p-5 mb-8 flex items-center justify-between group">
                                        <div>
                                            <div className="text-[10px] font-bold text-red-500 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Key size={12} /> Auth Code</div>
                                            <div className="text-2xl font-mono font-black tracking-widest text-red-700">{selectedImage.otp_detected}</div>
                                        </div>
                                        <button onClick={() => copyScreenshot(selectedImage)} className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-red-600 shadow-sm border border-red-200 hover:bg-red-600 hover:text-white transition-all"><Copy size={16} /></button>
                                    </div>
                                )}
                                <div className="mb-8">
                                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5"><Hash size={12} /> Semantic Tags</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedImage.tags.map((tag, i) => (<span key={i} className="px-3 py-1.5 bg-slate-50 border border-slate-100 text-slate-600 text-[12px] rounded-lg font-medium">{tag}</span>))}
                                    </div>
                                </div>
                                <div className="mb-8">
                                    <h4 className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-3 flex items-center gap-1.5"><Sparkles size={12} /> Magic Actions</h4>
                                    <div className="flex gap-2 flex-wrap">
                                        <button onClick={() => handleMagicAction('summarize')} className="text-xs font-semibold bg-amber-50 text-amber-700 px-3 py-1.5 rounded-lg border border-amber-100 hover:bg-amber-100 transition-colors flex items-center gap-1">✨ Summarize</button>
                                        <button onClick={() => handleMagicAction('expense')} className="text-xs font-semibold bg-amber-50 text-amber-700 px-3 py-1.5 rounded-lg border border-amber-100 hover:bg-amber-100 transition-colors flex items-center gap-1">✨ Extract Line Items</button>
                                        <button onClick={() => handleMagicAction('social')} className="text-xs font-semibold bg-amber-50 text-amber-700 px-3 py-1.5 rounded-lg border border-amber-100 hover:bg-amber-100 transition-colors flex items-center gap-1">✨ Draft Caption</button>
                                    </div>
                                    {isMagicLoading && <div className="mt-3 text-xs font-medium text-amber-600 flex items-center gap-2"><Loader2 size={12} className="animate-spin" /> Channeling AI magic...</div>}
                                    {magicActionText && (
                                        <div className="mt-3 p-4 bg-amber-50/50 border border-amber-100 rounded-xl text-sm text-slate-700 whitespace-pre-wrap leading-relaxed shadow-sm relative group">
                                            {magicActionText}
                                            <button onClick={() => setMagicActionText('')} className="absolute top-2 right-2 p-1 text-slate-400 hover:text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-md shadow-sm border border-slate-200"><X size={12} /></button>
                                        </div>
                                    )}
                                </div>
                                <div className="mt-auto">
                                    <h4 className="text-[10px] font-bold text-red-500 uppercase tracking-widest mb-3 flex items-center gap-1.5"><Sparkles size={12} /> AI Analysis</h4>
                                    <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 h-64 flex flex-col">
                                        <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 hide-scrollbar flex flex-col">
                                            {chatMessages.length === 0 ? (
                                                <div className="m-auto text-center text-slate-400 text-sm"><MessageSquare className="mx-auto mb-2 opacity-30" size={24} /><p>Ask questions about this image.</p></div>
                                            ) : (
                                                chatMessages.map((msg, i) => (
                                                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                                        <div className={`text-[13px] px-4 py-2.5 rounded-2xl max-w-[90%] ${msg.role === 'user' ? 'bg-red-600 text-white rounded-br-sm shadow-sm' : 'bg-white border border-slate-200 text-slate-700 rounded-bl-sm shadow-sm leading-relaxed'}`}>{msg.content}</div>
                                                    </div>
                                                ))
                                            )}
                                            {isChatLoading && (<div className="flex justify-start"><div className="bg-white border border-slate-200 text-slate-500 text-[13px] px-4 py-2.5 rounded-2xl rounded-bl-sm shadow-sm flex items-center gap-2"><Loader2 size={14} className="animate-spin" /> Analyzing...</div></div>)}
                                        </div>
                                        <div className="relative shrink-0">
                                            <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAskGemini()} placeholder="E.g. What is the total tax?" className="w-full bg-white border border-slate-200 rounded-xl pl-4 pr-12 py-3 text-[13px] outline-none focus:border-red-500 focus:ring-1 transition shadow-sm" />
                                            <button onClick={handleAskGemini} disabled={isChatLoading || !chatInput.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-slate-900 text-white rounded-lg disabled:opacity-50 hover:bg-red-600 transition-colors"><Send size={14} /></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center sm:rounded-bl-3xl">
                            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Added {new Date(selectedImage.created_at).toLocaleDateString()}</div>
                            <div className="flex gap-2">
                                <button onClick={() => downloadScreenshot(selectedImage)} className="text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-2 shadow-sm"><Download size={16} /></button>
                                <button onClick={() => copyScreenshot(selectedImage)} className="text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-2 shadow-sm w-24 justify-center">
                                    {copySuccess ? <CheckCircle size={16} className="text-emerald-500" /> : <Copy size={16} />}
                                    {copySuccess ? 'Copied' : 'Copy'}
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Link Import Modal */}
            {showLinkModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-100">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2"><Globe className="text-red-500" size={20} /> Web Import</h3>
                            <button onClick={() => !isScanningLink && setShowLinkModal(false)} className="text-slate-400 hover:text-slate-900 transition"><X size={20} /></button>
                        </div>
                        <div className="p-6">
                            <p className="text-sm text-slate-500 mb-6 leading-relaxed">Paste a link to a Pinterest Board, Telegram Web link, or any gallery. Our AI will download and organize the images automatically.</p>
                            <div className="space-y-4">
                                <input type="url" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://pinterest.com/..." disabled={isScanningLink} autoFocus className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-red-500 focus:bg-white transition disabled:opacity-50 font-medium" />
                                {isScanningLink && (<div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center gap-3 animate-pulse"><Loader2 className="animate-spin text-red-600 shrink-0" size={20} /><div><div className="text-sm font-bold text-red-900">Scanning Webpage...</div><div className="text-[11px] font-medium text-red-600 mt-0.5">Locating media files for processing</div></div></div>)}
                            </div>
                        </div>
                        <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                            <button onClick={() => setShowLinkModal(false)} disabled={isScanningLink} className="px-5 py-2.5 rounded-xl text-slate-600 font-semibold hover:bg-slate-200 transition disabled:opacity-50 text-sm">Cancel</button>
                            <button onClick={handleLinkImport} disabled={!linkUrl.trim() || isScanningLink} className="px-6 py-2.5 bg-red-600 text-white rounded-xl font-semibold shadow-md hover:bg-red-700 transition disabled:opacity-50 text-sm">{isScanningLink ? 'Importing...' : 'Scan & Import'}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Vault Insights Modal */}
            {showInsightsModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-100">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-amber-50 to-orange-50">
                            <h3 className="font-bold text-lg text-amber-800 flex items-center gap-2"><Sparkles className="text-amber-500" size={20} /> Vault Insights</h3>
                            <button onClick={() => setShowInsightsModal(false)} className="text-amber-600 hover:text-amber-900 transition bg-white/50 p-1.5 rounded-full"><X size={20} /></button>
                        </div>
                        <div className="p-8">
                            {isInsightsLoading ? (
                                <div className="flex flex-col items-center justify-center py-8 gap-4">
                                    <div className="w-16 h-16 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center animate-pulse"><Sparkles size={28} /></div>
                                    <p className="text-amber-700 font-medium text-sm">Analyzing your digital vault...</p>
                                </div>
                            ) : (<div className="text-slate-700 text-[15px] leading-relaxed font-medium">{insightsText}</div>)}
                        </div>
                        <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end">
                            <button onClick={() => setShowInsightsModal(false)} className="px-6 py-2.5 bg-amber-500 text-white rounded-xl font-semibold shadow-md hover:bg-amber-600 transition text-sm">Got it</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Download All Modal */}
            {showDownloadModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-100">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-emerald-50 to-teal-50">
                            <h3 className="font-bold text-lg text-emerald-800 flex items-center gap-2"><FolderDown className="text-emerald-500" size={20} /> Download All</h3>
                            <button onClick={() => !isDownloading && setShowDownloadModal(false)} className="text-emerald-600 hover:text-emerald-900 transition bg-white/50 p-1.5 rounded-full"><X size={20} /></button>
                        </div>
                        <div className="p-6">
                            <p className="text-sm text-slate-500 mb-1">All <strong>{screenshots.length}</strong> images will be downloaded as a ZIP file, organized into category subfolders.</p>
                            <div className="flex flex-wrap gap-1.5 my-4">
                                {uniqueCategories.map(cat => (
                                    <span key={cat} className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                                        {cat} ({screenshots.filter(s => s.category === cat).length})
                                    </span>
                                ))}
                            </div>
                            <label className="text-sm font-semibold text-slate-700 mb-2 block">Folder Name</label>
                            <input
                                type="text"
                                value={downloadFolderName}
                                onChange={(e) => setDownloadFolderName(e.target.value)}
                                placeholder="My Otter Vault"
                                disabled={isDownloading}
                                autoFocus
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:bg-white transition disabled:opacity-50 font-medium"
                            />
                            {isDownloading && (
                                <div className="mt-4 bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-center gap-3">
                                    <Loader2 className="animate-spin text-emerald-600 shrink-0" size={20} />
                                    <div className="text-sm font-semibold text-emerald-800">{downloadProgress}</div>
                                </div>
                            )}
                        </div>
                        <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                            <button onClick={() => setShowDownloadModal(false)} disabled={isDownloading} className="px-5 py-2.5 rounded-xl text-slate-600 font-semibold hover:bg-slate-200 transition disabled:opacity-50 text-sm">Cancel</button>
                            <button onClick={handleDownloadAll} disabled={isDownloading || !downloadFolderName.trim()} className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition disabled:opacity-50 text-sm flex items-center gap-2">
                                {isDownloading ? 'Downloading...' : <><Download size={16} /> Download ZIP</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Paywall Modal */}
            {showPaywallModal && (
                <div onClick={(e) => { if (e.target === e.currentTarget) setShowPaywallModal(false); }} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2rem] w-full max-w-sm overflow-hidden shadow-2xl border border-slate-100 flex flex-col relative scale-[0.95] sm:scale-100 origin-center animate-fade-up">

                        {/* Hero Header */}
                        <div className="bg-gradient-to-br from-red-500 via-rose-500 to-pink-600 p-6 text-white relative flex flex-col items-center text-center">
                            <button onClick={() => setShowPaywallModal(false)} className="absolute top-4 left-4 text-white/80 hover:text-white transition bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-sm flex items-center gap-1.5 text-xs font-bold">
                                &larr; Back
                            </button>

                            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 shadow-inner border border-white/20 mt-6">
                                <Sparkles size={24} className="text-white drop-shadow-md" />
                            </div>

                            <h2 className="text-2xl font-black mb-2 text-white drop-shadow-sm tracking-tight">Upgrade to Pro</h2>
                            <p className="text-white/90 text-xs font-medium leading-relaxed max-w-[240px]">
                                {paywallMessage}
                            </p>
                        </div>

                        {/* Content */}
                        <div className="p-6 bg-slate-50/50 flex flex-col">

                            {/* Zip Illustration */}
                            <div className="bg-white border text-left border-slate-200 rounded-xl p-4 mb-5 shadow-sm">
                                <div className="flex items-center gap-2.5 mb-3 pb-3 border-b border-slate-100">
                                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center"><FolderDown size={20} className="text-orange-500" /></div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-sm">Vault Export Format</h4>
                                        <p className="text-xs text-slate-500">How your bulk download arrives</p>
                                    </div>
                                </div>
                                <div className="space-y-3 font-mono text-xs flex flex-col pl-2">
                                    <div className="flex items-center gap-2 text-slate-700"><FolderDown size={14} className="text-orange-400" /> <strong>My_Otter_Vault.zip</strong></div>
                                    <div className="flex items-center gap-2 text-slate-600 ml-4"><div className="w-px h-full border-l border-dashed border-slate-300"></div><Layers size={14} className="text-violet-400" /> 📂 Bills/</div>
                                    <div className="flex items-center gap-2 text-slate-500 ml-8"><div className="w-px h-full border-l border-dashed border-slate-300"></div><ImageIcon size={12} className="text-slate-300" /> receipt_starbucks.jpg</div>
                                    <div className="flex items-center gap-2 text-slate-600 ml-4"><div className="w-px h-full border-l border-dashed border-slate-300"></div><Layers size={14} className="text-emerald-400" /> 📂 Tax_Documents/</div>
                                    <div className="flex items-center gap-2 text-slate-500 ml-8"><div className="w-px h-full border-l border-dashed border-slate-300"></div><ImageIcon size={12} className="text-slate-300" /> w2_form_2026.jpg</div>
                                </div>
                            </div>

                            {/* Features list */}
                            <div className="space-y-3 mb-6">
                                <div className="flex items-start gap-2.5">
                                    <div className="mt-0.5 bg-emerald-100 text-emerald-600 p-1 rounded-full"><CheckCircle size={12} /></div>
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-900">Unlimited Uploads</h4>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2.5">
                                    <div className="mt-0.5 bg-emerald-100 text-emerald-600 p-1 rounded-full"><CheckCircle size={12} /></div>
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-900">Bulk ZIP Downloads</h4>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2.5">
                                    <div className="mt-0.5 bg-emerald-100 text-emerald-600 p-1 rounded-full"><CheckCircle size={12} /></div>
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-900">Full Data Extraction</h4>
                                    </div>
                                </div>
                            </div>

                            {/* CTA */}
                            <button onClick={() => { window.location.hash = '#/pricing'; setShowPaywallModal(false); }} className="w-full relative py-4 rounded-xl font-bold text-center transition-all duration-300 overflow-hidden group flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 via-red-500 to-rose-500 text-white shadow-xl shadow-red-500/30 hover:shadow-2xl hover:scale-[1.02] text-sm md:text-base">
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
                                <span className="relative z-10 flex items-center gap-2">Upgrade for $1 / month <Zap size={18} className="fill-white/30" /></span>
                            </button>
                            <button onClick={() => setShowPaywallModal(false)} className="mt-4 text-xs font-bold text-slate-400 hover:text-slate-600 text-center mx-auto block">No thanks, I'll stay on free</button>
                        </div>
                    </div>
                </div>
            )}
            <Analytics />
        </div>
    );
}




