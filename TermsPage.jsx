import React, { useEffect } from 'react';
import PublicLayout from './components/PublicLayout';

export default function TermsPage() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <PublicLayout>
            <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-8 md:p-16 w-full max-w-4xl flex flex-col mx-auto">
                <div className="mb-10 pb-8 border-b border-slate-100">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-100 shadow-sm mb-6">
                        <span className="flex h-2 w-2 rounded-full bg-orange-500"></span>
                        <span className="text-xs font-bold text-orange-700 uppercase tracking-wider">Legal</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight text-slate-900">Terms and Conditions</h1>
                    <p className="text-slate-500 font-medium">Last Updated: March 6, 2026</p>
                </div>

                <div className="prose max-w-none space-y-8 text-[15px] leading-relaxed text-slate-600">
                    <section>
                        <h2 className="text-xl font-bold mb-3 text-slate-900">1. Introduction</h2>
                        <p>Welcome to <strong>Otter</strong> ("we," "our," or "us"). Otter is an AI-powered screenshot vault and smart application that helps users process, categorize, and gain insights from uploaded images using Optical Character Recognition (OCR), automated tagging, and AI analysis.</p>
                        <p>By accessing or using our Service at <strong>otter-app.com</strong> (the "Website") or any related applications, you agree to be bound by these Terms and Conditions ("Terms"). If you do not agree, please do not use Otter.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3 text-slate-900">2. User Accounts</h2>
                        <p>To use Otter, you must create an account using a valid Google account via our secure authentication provider (Supabase Auth). You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account.</p>
                        <p>You must be at least 13 years of age to use Otter. By using the Service, you warrant that you meet this age requirement.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3 text-slate-900">3. User Content &amp; Ownership</h2>
                        <p><strong>You retain 100% ownership of all images, screenshots, and digital content you upload to Otter.</strong> We do not claim ownership over any of your uploaded materials.</p>
                        <p>By uploading content to Otter, you grant us a <strong>limited, non-exclusive, royalty-free license</strong> solely to host, store, display, and apply AI analysis (including OCR, automated tagging, categorization, and data extraction) to your content for the sole purpose of providing and improving the Otter service to you.</p>
                        <p>This license terminates when you delete your content or your account, except where copies are retained in backups for a limited period as required for operational integrity.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3 text-slate-900">4. Prohibited Content &amp; Acceptable Use</h2>
                        <p>You agree <strong>not</strong> to upload, store, or share any content that:</p>
                        <ul className="list-disc pl-6 space-y-1.5 mt-2 marker:text-orange-500">
                            <li>Is illegal, obscene, defamatory, or threatening.</li>
                            <li>Infringes on copyrights, trademarks, or other intellectual property rights of third parties.</li>
                            <li>Contains malware, viruses, or any code designed to disrupt or harm our systems or other users.</li>
                            <li>Contains personal data of others without their consent (e.g., identity documents, private photographs).</li>
                            <li>Violates any applicable local, national, or international law or regulation.</li>
                        </ul>
                        <p className="mt-3">We reserve the right to remove any content that violates these Terms without prior notice.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3 text-slate-900">5. Premium Features &amp; Subscriptions</h2>
                        <p>Otter offers certain enhanced features under a <strong>"Premium"</strong> subscription, which may include but is not limited to: advanced AI-powered search, bulk text extraction, priority processing, increased vault storage, and exclusive analytical tools.</p>
                        <h3 className="text-lg font-semibold mt-4 mb-2 text-slate-900">5.1 Billing</h3>
                        <p>Premium subscriptions are billed on a recurring basis (monthly or annually) at the price displayed at the time of purchase. Payments are processed through our third-party payment provider. By subscribing, you authorize us to charge the applicable fees to your chosen payment method.</p>
                        <h3 className="text-lg font-semibold mt-4 mb-2 text-slate-900">5.2 Cancellation &amp; Refunds</h3>
                        <p>You may cancel your Premium subscription at any time from your account settings. Upon cancellation, you will continue to have access to Premium features until the end of your current billing cycle. <strong>No prorated refunds</strong> will be issued for partially used subscription periods, unless required by applicable law.</p>
                        <h3 className="text-lg font-semibold mt-4 mb-2 text-slate-900">5.3 Free Tier</h3>
                        <p>Users on the free plan will have access to core features including image upload, basic AI tagging, categorization, and limited vault storage. Feature availability may change as the service evolves.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3 text-slate-900">6. AI-Powered Services Disclaimer</h2>
                        <p>Otter uses third-party AI models for image analysis, OCR, tagging, and content categorization. While we strive for accuracy, AI-generated results (such as detected amounts, dates, categories, and text extraction) are provided on an <strong>"as-is"</strong> basis and may contain errors.</p>
                        <p>You should independently verify any critical data extracted by Otter's AI, especially financial amounts, dates, and OTP codes, before relying on them for any important decisions.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3 text-slate-900">7. Account Termination &amp; Suspension</h2>
                        <p>Otter reserves the right to <strong>suspend or terminate</strong> your account at our sole discretion, without prior notice, if:</p>
                        <ul className="list-disc pl-6 space-y-1.5 mt-2 marker:text-orange-500">
                            <li>You violate any provision of these Terms.</li>
                            <li>You upload prohibited or illegal content.</li>
                            <li>Your account is used for fraudulent, abusive, or unauthorized purposes.</li>
                            <li>Continued operation of your account poses a risk to other users or the integrity of the Service.</li>
                        </ul>
                        <p className="mt-3">Upon termination, your right to use Otter ceases immediately. We may, at our discretion, allow you to download your content before deletion, but are not obligated to do so.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3 text-slate-900">8. Intellectual Property</h2>
                        <p>All trademarks, logos, service marks, UI design, code, and other intellectual property displayed on Otter (excluding user-uploaded content) are the property of Otter and its licensors. You may not copy, reproduce, distribute, or create derivative works from our intellectual property without explicit written consent.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3 text-slate-900">9. Limitation of Liability</h2>
                        <p>To the maximum extent permitted by applicable law, Otter and its affiliates shall not be liable for any indirect, incidental, consequential, special, or punitive damages, including but not limited to loss of data, loss of profits, or business interruption, arising out of or in connection with your use of the Service.</p>
                        <p>Our total aggregate liability to you for any claim arising under these Terms shall not exceed the amount you have paid to us in the twelve (12) months preceding the claim.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3 text-slate-900">10. Indemnification</h2>
                        <p>You agree to indemnify and hold harmless Otter, its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising out of your use of the Service, your content, or your violation of these Terms.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3 text-slate-900">11. Changes to Terms</h2>
                        <p>We reserve the right to modify these Terms at any time. When we do, we will update the "Last Updated" date at the top of this page and, for material changes, notify you via email or a prominent notice within the Service. Your continued use of Otter after such changes constitutes acceptance of the updated Terms.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3 text-slate-900">12. Governing Law</h2>
                        <p>These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising from these Terms shall be resolved exclusively in the courts of competent jurisdiction in India.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3 text-slate-900">13. Contact Us</h2>
                        <p>If you have any questions about these Terms, please contact us at:</p>
                        <div className="mt-3 rounded-xl p-5 border bg-orange-50/50 border-orange-100">
                            <p className="font-bold text-slate-900">Otter Support</p>
                            <p>Email: <a href="mailto:support@otter-app.com" className="text-orange-600 hover:text-orange-500 font-bold transition-colors">support@otter-app.com</a></p>
                        </div>
                    </section>
                </div>
            </div>
        </PublicLayout>
    );
}
