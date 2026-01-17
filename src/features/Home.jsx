import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import BrandMarquee from '../components/BrandMarquee';
import InfluencerCard from '../components/InfluencerCard';
import { useTheme } from '../hooks/useTheme';
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const processInfluencer = (inf) => {
    const numStr = inf.followers.toUpperCase().replace('+', '');
    let count = 0;
    if (numStr.includes('M')) count = parseFloat(numStr) * 1000000;
    else if (numStr.includes('K')) count = parseFloat(numStr) * 1000;
    else count = parseFloat(numStr);

    let tier = "Nano";
    if (count >= 1000000) tier = "Mega";
    else if (count >= 100000) tier = "Macro";
    else if (count >= 10000) tier = "Micro";

    return { ...inf, count, tier };
};

export default function Home({ setActiveSection }) {
    const { t } = useLanguage();
    const { theme } = useTheme();
    const [topTalents, setTopTalents] = useState([]);

    useEffect(() => {
        const fetchTopTalents = async () => {
            // Fetch specific top talents by name (as per original logic) or just top 4 by followers
            const topNames = ["HBIRKOUSAFAE OFFICIEL", "FATIJAMALIOFFICIEL", "NOUHAILA BARBIE", "ZOUHAIRZAIR"];
            const { data, error } = await supabase
                .from('influencers')
                .select('*')
                .in('name', topNames)
                .eq('is_hidden', false);

            if (error) console.error('Error fetching filtered influencers:', error);
            else {
                // Determine missing count to fill up to 4 if needed, or just use what we found
                let processed = data.map(processInfluencer).sort((a, b) => b.count - a.count);

                // Fallback: if we didn't find them (names might vary), fetch top 4 by default
                if (processed.length < 4) {
                    const { data: allData } = await supabase
                        .from('influencers')
                        .select('*')
                        .eq('is_hidden', false);
                    if (allData) {
                        processed = allData.map(processInfluencer).sort((a, b) => b.count - a.count).slice(0, 4);
                    }
                }
                setTopTalents(processed);
            }
        };
        fetchTopTalents();
    }, []);

    return (
        <section id="home-view" className="relative" style={{ background: 'transparent' }}>
            {/* Hero Section */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 flex flex-col items-center text-center">

                <div className="hero-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full backdrop-blur-md text-xs font-bold mb-6 shadow-sm animate-fade-in-up" style={{ backgroundColor: 'var(--glass-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
                    <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                    </span>
                    {t('hero_badge')}
                </div>

                <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-5 leading-tight" style={{ color: 'var(--text-primary)' }}>
                    <span>{t('hero_title_1')}</span> <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600">{t('hero_title_2')}</span><br />
                    <span>{t('hero_title_3')}</span>
                </h1>

                <p className="hero-text max-w-xl text-lg mb-8 leading-relaxed font-light" style={{ color: 'var(--text-secondary)' }}>
                    {t('hero_desc')}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <button
                        onClick={() => setActiveSection('brand-form')}
                        className="btn-primary px-8 py-3.5 rounded-2xl font-bold transition-all shadow-xl shadow-purple-900/20 flex items-center justify-center gap-2 group hover:-translate-y-0.5 hover:shadow-purple-900/40 cursor-pointer"
                        style={{ backgroundColor: 'var(--text-primary)', color: 'var(--bg-primary)' }}
                    >
                        <span>{t('btn_brand')}</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform rtl:rotate-180" />
                    </button>
                    <button
                        onClick={() => setActiveSection('creator-form')}
                        className="btn-secondary px-8 py-3.5 rounded-2xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 hover:-translate-y-0.5 hover:shadow-xl cursor-pointer"
                        style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
                    >
                        <span>{t('btn_creator')}</span>
                    </button>
                </div>

                {/* Floating Cards Stats */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-4xl">
                    <div className="glass-panel p-5 rounded-2xl text-center floating-anim" style={{ animationDelay: '0s' }}>
                        <div className="stats-card-number text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>100+</div>
                        <div className="stats-card-label text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{t('stat_creators')}</div>
                    </div>
                    <div className="glass-panel p-5 rounded-2xl text-center floating-anim" style={{ animationDelay: '1s' }}>
                        <div className="stats-card-number text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{t('stat_4_tiers')}</div>
                        <div className="stats-card-label text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{t('stat_tiers')}</div>
                    </div>
                    <div className="glass-panel p-5 rounded-2xl text-center floating-anim" style={{ animationDelay: '2s' }}>
                        <div className="stats-card-number text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{t('stat_ai')}</div>
                        <div className="stats-card-label text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{t('stat_matching')}</div>
                    </div>
                </div>
            </div>

            {/* Trusted By Section (Marquee) */}
            <BrandMarquee />

            {/* Top Talents Section */}
            <section className="py-12 relative z-10 backdrop-blur-sm" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10">
                        <h2 className="text-xs font-bold text-purple-600 uppercase tracking-widest mb-2">{t('sneak_peek')}</h2>
                        <h3 className="section-heading text-3xl md:text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>{t('top_talents')}</h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {topTalents.map((inf, idx) => (
                            <InfluencerCard key={idx} influencer={inf} variant="home" onClick={() => setActiveSection('catalog')} />
                        ))}
                    </div>
                    <div className="text-center">
                        <button
                            onClick={() => setActiveSection('catalog')}
                            className="view-all-link inline-flex items-center gap-2 font-bold border-b-2 transition-all pb-1 text-sm cursor-pointer"
                            style={{ color: 'var(--text-primary)', borderBottomColor: 'var(--text-primary)' }}
                        >
                            <span>{t('view_all')}</span> <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                        </button>
                    </div>
                </div>
            </section>
        </section>
    );
}

// Add animation styles in index.css or here
