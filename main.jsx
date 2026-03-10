import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import LandingPage from './LandingPage.jsx'
import TermsPage from './TermsPage.jsx'
import PrivacyPage from './PrivacyPage.jsx'
import AboutPage from './AboutPage.jsx'
import ContactPage from './ContactPage.jsx'
import FeaturesPage from './FeaturesPage.jsx'
import PricingPage from './PricingPage.jsx'
import LoginPage from './LoginPage.jsx'
import BlogPage from './BlogPage.jsx'
import CookieBanner from './CookieBanner.jsx'
import './index.css'

function Router() {
    const [route, setRoute] = useState(window.location.hash || '#/')

    useEffect(() => {
        const onHashChange = () => setRoute(window.location.hash || '#/')
        window.addEventListener('hashchange', onHashChange)
        return () => window.removeEventListener('hashchange', onHashChange)
    }, [])

    const goHome = () => {
        window.location.hash = '#/'
        window.scrollTo(0, 0)
    }

    if (route === '#/landing') return <LandingPage />
    if (route === '#/terms') return <TermsPage onBack={goHome} />
    if (route === '#/privacy') return <PrivacyPage onBack={goHome} />
    if (route === '#/about') return <AboutPage onBack={goHome} />
    if (route === '#/contact') return <ContactPage onBack={goHome} />
    if (route === '#/features') return <FeaturesPage onBack={goHome} />
    if (route === '#/pricing') return <PricingPage onBack={goHome} />
    if (route === '#/blog') return <BlogPage onBack={goHome} />
    if (route === '#/login') return <LoginPage />
    return <App />
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Router />
        <CookieBanner />
    </React.StrictMode>
)
