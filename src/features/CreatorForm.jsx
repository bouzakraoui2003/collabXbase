import { Phone, Send } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

export default function CreatorForm() {
    const { t } = useLanguage();

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());

        const message = `*Nouvelle Candidature CRÉATEUR*%0A%0A` +
            `👤 *Nom:* ${data.name}%0A` +
            `📸 *Instagram:* ${data.insta}%0A` +
            `👥 *Followers:* ${data.followers}%0A` +
            (data.tiktok ? `🎵 *TikTok:* ${data.tiktok}%0A` : '') +
            `🏷️ *Niche:* ${data.niche}`;

        const phone = "212615191083";
        window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
    };

    const inputClass = "w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none transition-all";
    const labelClass = "block text-xs font-bold uppercase tracking-wider mb-1";

    // Style objects to match precise original implementation
    const getStyles = () => ({
        section: { backgroundColor: 'var(--bg-primary)' },
        tag: { backgroundColor: 'var(--bg-tertiary)' },
        textPrimary: { color: 'var(--text-primary)' },
        textSecondary: { color: 'var(--text-secondary)' },
        card: { backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' },
        input: { backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', borderColor: 'var(--border-color)' },
        border: { borderColor: 'var(--border-color)' },
        backgroundSecondary: { backgroundColor: 'var(--bg-secondary)' }
    });

    const styles = getStyles();

    return (
        <section id="creator-form-view" className="min-h-screen relative z-20 transition-colors" style={styles.section}>
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

                <div className="grid md:grid-cols-2 gap-16 items-start">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-blue-600 text-xs font-bold mb-6" style={styles.tag}>
                            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                            <span>{t('tag_creator')}</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight" style={styles.textPrimary}>{t('creator_title')}</h2>
                        <p className="text-lg mb-8 leading-relaxed" style={styles.textSecondary}>
                            {t('creator_desc')}
                        </p>

                        <div className="space-y-6">
                            <div className="p-6 rounded-2xl border" style={{ ...styles.tag, ...styles.border }}>
                                <h3 className="font-bold mb-4" style={styles.textPrimary}>{t('direct_contacts')}</h3>
                                <div className="space-y-4">
                                    <a href="https://wa.me/212615191083" target="_blank" className="flex items-center gap-4 group transition-colors">
                                        <div className="p-3 rounded-xl border group-hover:border-green-500 transition-colors" style={{ ...styles.backgroundSecondary, ...styles.border }}>
                                            <Phone className="w-5 h-5 text-green-500" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold" style={styles.textPrimary}>Ahmed</h4>
                                            <p className="text-sm" style={styles.textSecondary}>+212 615-191083</p>
                                        </div>
                                    </a>
                                    <a href="https://wa.me/212690163816" target="_blank" className="flex items-center gap-4 group transition-colors">
                                        <div className="p-3 rounded-xl border group-hover:border-green-500 transition-colors" style={{ ...styles.backgroundSecondary, ...styles.border }}>
                                            <Phone className="w-5 h-5 text-green-500" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold" style={styles.textPrimary}>Reda</h4>
                                            <p className="text-sm" style={styles.textSecondary}>+212 690-163816</p>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CREATOR FORM */}
                    <div className="rounded-3xl p-8 shadow-2xl border" style={styles.card}>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className={labelClass} style={styles.textSecondary}>{t('label_full_name')}</label>
                                <input type="text" name="name" required className={inputClass} style={styles.input} placeholder={t('placeholder_name')} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass} style={styles.textSecondary}>{t('label_instagram_username')}</label>
                                    <input type="text" name="insta" required className={inputClass} style={styles.input} placeholder={t('placeholder_insta_username')} />
                                </div>
                                <div>
                                    <label className={labelClass} style={styles.textSecondary}>{t('label_followers')}</label>
                                    <input type="text" name="followers" required className={inputClass} style={styles.input} placeholder={t('placeholder_followers')} />
                                </div>
                            </div>

                            <div>
                                <label className={labelClass} style={styles.textSecondary}>{t('label_tiktok')}</label>
                                <input type="url" name="tiktok" className={inputClass} style={styles.input} placeholder={t('placeholder_tiktok')} />
                            </div>

                            <div>
                                <label className={labelClass} style={styles.textSecondary}>{t('label_niche')}</label>
                                <select name="niche" className={inputClass} style={styles.input}>
                                    <option>{t('niche_lifestyle')}</option>
                                    <option>{t('niche_fashion')}</option>
                                    <option>{t('niche_beauty')}</option>
                                    <option>{t('niche_tech')}</option>
                                    <option>{t('niche_food')}</option>
                                    <option>{t('niche_humor')}</option>
                                    <option>{t('niche_other')}</option>
                                </select>
                            </div>

                            <button type="submit" className="w-full py-4 bg-[#25D366] text-white rounded-xl font-bold hover:bg-green-600 transition-all flex items-center justify-center gap-2 group shadow-lg hover:shadow-green-500/25">
                                <span>{t('btn_whatsapp_apply')}</span> <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform rtl:rotate-180" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
