import { useState } from 'react';
import { Sun, Moon, Globe, Menu, X, MessageCircle } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useLanguage } from '../hooks/useLanguage';

export default function Navbar({ activeSection, setActiveSection }) {
    const { theme, toggleTheme } = useTheme();
    const { lang, setLang, t } = useLanguage();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navLinkClass = () => {
        return `nav-link px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer`;
    };

    const getLinkStyle = () => {
        return { color: 'var(--text-secondary)' };
    };

    return (
        <nav className="fixed w-full z-50 transition-all duration-300 glass-panel" style={{ borderBottom: '1px solid var(--border-color)' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveSection('home')}>
                        <img
                            src={theme === 'dark' ? "/logo_collabx_darkmode.png" : "/Logo_collabx.png"}
                            className="h-10 w-auto object-contain transition-opacity duration-300"
                            alt="CollabX Logo"
                        />
                    </div>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-1">
                        <button
                            onClick={() => setActiveSection('home')}
                            className={navLinkClass()}
                            style={getLinkStyle()}
                        >
                            {t('nav_home')}
                        </button>
                        <button
                            onClick={() => setActiveSection('catalog')}
                            className={navLinkClass()}
                            style={getLinkStyle()}
                        >
                            {t('nav_catalog')}
                        </button>

                        {/* Theme Toggle */}
                        <button onClick={toggleTheme} className="px-3 py-2 text-sm font-medium rounded-lg transition-colors theme-toggle-btn cursor-pointer" aria-label="Toggle theme">
                            {theme === 'dark' ? <Moon className="w-5 h-5" id="theme-icon" /> : <Sun className="w-5 h-5" id="theme-icon" />}
                        </button>

                        {/* Language Switcher */}
                        <div className="relative ml-2 group">
                            <button className="flex items-center gap-1 px-3 py-2 text-sm font-bold rounded-lg transition-colors cursor-pointer" style={{ color: 'var(--text-secondary)', backgroundColor: 'var(--bg-tertiary)' }}>
                                <Globe className="w-4 h-4" /> <span>{lang.toUpperCase()}</span>
                            </button>
                            <div className="absolute right-0 top-full mt-2 w-32 rounded-xl shadow-xl hidden group-hover:block p-1 dark-mode-dropdown" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                                <button onClick={() => setLang('fr')} className="block w-full text-left px-3 py-2 text-sm font-medium rounded-lg dark-mode-text dark-mode-hover" style={{ color: 'var(--text-secondary)' }}>Français</button>
                                <button onClick={() => setLang('en')} className="block w-full text-left px-3 py-2 text-sm font-medium rounded-lg dark-mode-text dark-mode-hover" style={{ color: 'var(--text-secondary)' }}>English</button>
                                <button onClick={() => setLang('ar')} className="block w-full text-right px-3 py-2 text-sm font-bold rounded-lg font-sans dark-mode-text dark-mode-hover" style={{ color: 'var(--text-secondary)' }}>العربية</button>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Menu Button & Join CTA */}
                    <div className="flex items-center gap-4">
                        <a href="https://wa.me/212615191083" target="_blank" className="hidden md:flex items-center gap-2 bg-[#25D366] text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-green-600 transition-all shadow-lg hover:shadow-green-500/25 hover:-translate-y-0.5">
                            <MessageCircle className="w-4 h-4" /> <span>{t('btn_join')}</span>
                        </a>
                        <button className="md:hidden mobile-menu-btn transition-colors" style={{ color: 'var(--text-secondary)' }} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                            {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" id="mobile-menu-icon" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-20 left-0 w-full p-4 shadow-xl flex flex-col gap-2 dark-mode-mobile-menu" style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
                    <button onClick={() => { setActiveSection('home'); setMobileMenuOpen(false); }} className="p-3 text-left font-bold dark-mode-text transition-colors" style={{ color: 'var(--text-primary)' }}>{t('nav_home')}</button>
                    <button onClick={() => { setActiveSection('catalog'); setMobileMenuOpen(false); }} className="p-3 text-left font-bold dark-mode-text transition-colors" style={{ color: 'var(--text-primary)' }}>{t('nav_catalog')}</button>
                    <button onClick={() => { setActiveSection('brand-form'); setMobileMenuOpen(false); }} className="p-3 text-left font-bold dark-mode-text transition-colors" style={{ color: 'var(--text-primary)' }}>{t('btn_brand')}</button>
                    <button onClick={() => { setActiveSection('creator-form'); setMobileMenuOpen(false); }} className="p-3 text-left font-bold dark-mode-text transition-colors" style={{ color: 'var(--text-primary)' }}>{t('btn_creator')}</button>
                    <div className="flex gap-2 p-3">
                        <button onClick={toggleTheme} className="px-3 py-1 rounded text-xs font-bold flex items-center gap-1 transition-colors theme-toggle-btn" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>
                            {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />} {t('theme_label')}
                        </button>
                        <button onClick={() => setLang('fr')} className="px-3 py-1 rounded text-xs font-bold transition-colors" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>FR</button>
                        <button onClick={() => setLang('en')} className="px-3 py-1 rounded text-xs font-bold transition-colors" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>EN</button>
                        <button onClick={() => setLang('ar')} className="px-3 py-1 rounded text-xs font-bold transition-colors" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>AR</button>
                    </div>
                </div>
            )}
        </nav>
    );
}
