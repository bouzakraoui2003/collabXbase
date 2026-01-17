import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useLanguage } from '../hooks/useLanguage';

export default function BrandMarquee() {
    const { t } = useLanguage();
    const [brands, setBrands] = useState([]);

    useEffect(() => {
        const fetchBrands = async () => {
            const { data, error } = await supabase
                .from('brands')
                .select('*')
                .eq('is_hidden', false)
                .order('created_at', { ascending: false });

            if (error) console.error('Error fetching brands:', error);
            else setBrands(data);
        };
        fetchBrands();
    }, []);

    // Duplicate brands for infinite loop (only if we have brands)
    const infiniteBrands = brands.length > 0 ? [...brands, ...brands] : [];

    if (brands.length === 0) return null;

    return (
        <section id="brands" className="py-10 overflow-hidden relative z-10 transition-colors" style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
                <h2 className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>{t('trusted_by')}</h2>
            </div>

            <div className="marquee-container overflow-hidden whitespace-nowrap relative">
                <div className="inline-flex animate-marquee hover:pause">
                    {infiniteBrands.map((brand, index) => (
                        <a
                            key={`${brand.name}-${index}`}
                            href={brand.handle.startsWith('http') ? brand.handle : `https://instagram.com/${brand.handle}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex flex-col items-center justify-center mx-8 group cursor-pointer"
                        >
                            <div className="w-20 h-20 rounded-full overflow-hidden mb-3 transition-all" style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
                                <img src={brand.image} alt={brand.name} className="w-full h-full object-cover" />
                            </div>
                            <span className="font-bold text-sm transition-colors" style={{ color: 'var(--text-secondary)' }}>{brand.name}</span>
                        </a>
                    ))}
                </div>
            </div>

            <style jsx>{`
                .animate-marquee {
                    animation: marquee 40s linear infinite;
                }
                .hover\\:pause:hover {
                    animation-play-state: paused;
                }
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
            `}</style>
        </section>
    );
}
