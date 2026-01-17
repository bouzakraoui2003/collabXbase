import { useEffect, useRef } from 'react';
import VanillaTilt from 'vanilla-tilt';
import { Instagram } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

export default function InfluencerCard({ influencer, variant = 'catalog', onClick }) {
    const tiltRef = useRef(null);
    const { t } = useLanguage();
    const { name, handle, followers, niche, count, image, tier } = influencer;

    useEffect(() => {
        if (tiltRef.current) {
            const options = variant === 'home'
                ? { max: 10, speed: 400 }
                : { max: 5, speed: 400, glare: true, "max-glare": 0.2 };
            VanillaTilt.init(tiltRef.current, options);
        }
    }, [variant]);

    const tierColor = tier === 'Mega' ? 'bg-purple-600' :
        tier === 'Macro' ? 'bg-blue-600' :
            tier === 'Micro' ? 'bg-green-600' : 'bg-slate-600';

    if (variant === 'home') {
        // Sneak Peek Vertical Card
        return (
            <div
                ref={tiltRef}
                className="relative rounded-2xl overflow-hidden aspect-[3/4] bg-slate-100 group cursor-pointer"
                onClick={onClick}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 z-10"></div>
                <img
                    src={image}
                    onError={(e) => e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name).replace(/'/g, '%27')}`}
                    alt={name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover-scale"
                />

                <div className="absolute bottom-4 left-4 right-4 z-20 text-white transform transition-transform duration-300 group-hover:-translate-y-2">
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20">
                        <h4 className="font-bold text-lg leading-tight mb-1 truncate">{name}</h4>
                        <p className="text-slate-200 text-xs font-mono">+{followers} {t('followers')}</p>
                    </div>
                </div>
            </div>
        );
    }

    // Catalog Card
    return (
        <div
            ref={tiltRef}
            className="rounded-2xl overflow-hidden shadow-lg border group relative transition-colors duration-300"
            style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
        >
            <div className="aspect-square relative overflow-hidden" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                <img
                    src={image}
                    onError={(e) => e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name).replace(/'/g, '%27')}`}
                    alt={name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover-scale"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                <div className={`absolute top-3 right-3 ${tierColor} text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-sm`}>
                    {t(`badge_tier_${tier.toLowerCase()}`)}
                </div>

                <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-bold text-lg leading-tight mb-0.5 truncate pr-4" title={name}>{name}</h3>
                    <p className="text-slate-300 text-xs font-mono">@{handle}</p>
                </div>
            </div>
            <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>{t('followers')}</p>
                        <p className="font-bold" style={{ color: 'var(--text-primary)' }}>{followers}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>{t('niche')}</p>
                        <p className="font-medium text-sm px-2 py-0.5 rounded-md inline-block" style={{ color: 'var(--text-secondary)', backgroundColor: 'var(--bg-tertiary)' }}>
                            {niche.split('/').map(part => {
                                const key = `niche_${part.trim().toLowerCase().replace(/[\s-]/g, '_')}`;
                                const translated = t(key);
                                // If translated value equals the key, it means translation is missing, so use original part
                                return translated !== key ? translated : part;
                            }).join('/')}
                        </p>
                    </div>
                </div>
                <a href={`https://instagram.com/${handle}`} target="_blank" className="block w-full text-center py-2.5 rounded-xl text-sm font-bold bg-[var(--text-primary)] text-[var(--bg-primary)] hover:bg-purple-600 hover:text-white transition-colors flex items-center justify-center gap-2">
                    <Instagram className="w-4 h-4" /> {t('view_profile')}
                </a>
            </div>
        </div>
    );
}
