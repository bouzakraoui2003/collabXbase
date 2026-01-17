import { useState, useMemo, useEffect } from 'react';
import { Search, User, SearchX, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import InfluencerCard from '../components/InfluencerCard';
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

export default function Catalog() {
    const { t } = useLanguage();
    const [searchTerm, setSearchTerm] = useState('');
    const [currentGender, setCurrentGender] = useState('all');
    const [currentTier, setCurrentTier] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [influencersData, setInfluencersData] = useState([]);
    const [loading, setLoading] = useState(true);
    const itemsPerPage = 20;

    useEffect(() => {
        const fetchInfluencers = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('influencers')
                .select('*')
                .eq('is_hidden', false);

            if (error) console.error('Error fetching influencers:', error);
            else {
                const processed = data.map(processInfluencer).sort((a, b) => b.count - a.count);
                setInfluencersData(processed);
            }
            setLoading(false);
        };
        fetchInfluencers();
    }, []);

    const filteredInfluencers = useMemo(() => {
        const query = searchTerm.toLowerCase();
        return influencersData.filter(inf => {
            const matchesSearch = inf.name.toLowerCase().includes(query) || inf.niche.toLowerCase().includes(query);
            const matchesTier = currentTier === 'all' || inf.tier === currentTier;
            let matchesGender = true;
            if (currentGender === 'Femmes') matchesGender = inf.gender === 'F';
            if (currentGender === 'Hommes') matchesGender = inf.gender === 'M';
            return matchesSearch && matchesTier && matchesGender;
        });
    }, [searchTerm, currentGender, currentTier, influencersData]);

    // Reset pagination when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, currentGender, currentTier]);

    // Scroll to top when page changes
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentPage]);

    const totalPages = Math.ceil(filteredInfluencers.length / itemsPerPage);
    const paginatedInfluencers = filteredInfluencers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const getBtnStyle = (isActive) => {
        if (isActive) {
            return {
                backgroundColor: 'var(--text-primary)',
                color: 'var(--bg-primary)',
                borderColor: 'var(--text-primary)'
            };
        }
        return {
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-secondary)',
            borderColor: 'var(--border-color)'
        };
    };

    return (
        <section id="catalog-view" className="min-h-screen relative z-20 backdrop-blur-sm transition-colors duration-300" style={{ backgroundColor: 'var(--bg-primary)' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                    <div>
                        <h2 className="section-heading text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{t('catalog_title')}</h2>
                        <p className="section-subheading" style={{ color: 'var(--text-secondary)' }}>{t('catalog_desc')}</p>
                    </div>

                    {/* Search Bar */}
                    <div className="w-full md:w-96 relative">
                        <Search className="absolute left-4 top-3.5 w-5 h-5" style={{ color: 'var(--text-tertiary)' }} />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder={t('search_placeholder')}
                            className="search-input w-full pl-12 pr-4 py-3 rounded-xl border focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none shadow-sm transition-all duration-300"
                            style={{
                                backgroundColor: 'var(--bg-secondary)',
                                color: 'var(--text-primary)',
                                borderColor: 'var(--border-color)'
                            }}
                        />
                    </div>
                </div>

                {/* Advanced Filters */}
                <div className="mb-8 space-y-6">

                    {/* Gender Filter */}
                    <div className="flex flex-col gap-3">
                        <span className="section-subheading text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>{t('filter_gender')}</span>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setCurrentGender('all')}
                                className="filter-btn px-5 py-2.5 rounded-xl text-sm font-bold border transition-all duration-300 shadow-sm"
                                style={getBtnStyle(currentGender === 'all')}
                            >
                                {t('filter_all')}
                            </button>
                            <button
                                onClick={() => setCurrentGender('Femmes')}
                                className="filter-btn px-5 py-2.5 rounded-xl text-sm font-bold border transition-all duration-300 flex items-center gap-2"
                                style={getBtnStyle(currentGender === 'Femmes')}
                            >
                                <User className="w-4 h-4 text-pink-500" /> <span>{t('filter_female')}</span>
                            </button>
                            <button
                                onClick={() => setCurrentGender('Hommes')}
                                className="filter-btn px-5 py-2.5 rounded-xl text-sm font-bold border transition-all duration-300 flex items-center gap-2"
                                style={getBtnStyle(currentGender === 'Hommes')}
                            >
                                <User className="w-4 h-4 text-blue-500" /> <span>{t('filter_male')}</span>
                            </button>
                        </div>
                    </div>

                    {/* Tier Filter */}
                    <div className="flex flex-col gap-3">
                        <span className="section-subheading text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>{t('filter_tier')}</span>
                        <div className="flex flex-wrap gap-2">
                            {['all', 'Mega', 'Macro', 'Micro', 'Nano'].map(tier => (
                                <button
                                    key={tier}
                                    onClick={() => setCurrentTier(tier)}
                                    className="filter-btn px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-300 shadow-sm"
                                    style={getBtnStyle(currentTier === tier)}
                                >
                                    {tier === 'all' ? t('filter_all') :
                                        tier === 'Mega' ? t('tier_mega') :
                                            tier === 'Macro' ? t('tier_macro') :
                                                tier === 'Micro' ? t('tier_micro') : t('tier_nano')}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                    </div>
                ) : paginatedInfluencers.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
                            {paginatedInfluencers.map((inf, idx) => (
                                <InfluencerCard key={idx} influencer={inf} variant="catalog" />
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2 mt-8 pb-8">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                    style={{
                                        backgroundColor: 'var(--bg-secondary)',
                                        color: 'var(--text-primary)',
                                        borderColor: 'var(--border-color)'
                                    }}
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>

                                <div className="flex gap-1">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`w-8 h-8 rounded-lg text-sm font-bold flex items-center justify-center transition-colors cursor-pointer ${currentPage === page ? 'ring-2 ring-purple-500' : ''}`}
                                            style={getBtnStyle(currentPage === page)}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="p-2 rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                    style={{
                                        backgroundColor: 'var(--bg-secondary)',
                                        color: 'var(--text-primary)',
                                        borderColor: 'var(--border-color)'
                                    }}
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-20">
                        <div className="inline-flex p-4 rounded-full mb-4" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                            <SearchX className="w-8 h-8 text-purple-500" />
                        </div>
                        <h3 className="section-heading text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{t('no_results')}</h3>
                    </div>
                )}
            </div>
        </section>
    );
}
