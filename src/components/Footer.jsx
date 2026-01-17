import { MessageCircle, Instagram } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useLanguage } from '../hooks/useLanguage';

export default function Footer() {
    const { theme } = useTheme();
    const { t } = useLanguage();

    return (
        <footer className="pt-12 pb-6 relative z-10" style={{ backgroundColor: theme === 'dark' ? '#0F172A' : 'var(--bg-primary)', color: 'var(--text-primary)' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">

                    {/* About / Services */}
                    <div className="col-span-1 lg:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <img
                                src={theme === 'dark' ? "/logo_collabx_darkmode.png" : "/Logo_collabx.png"}
                                className="h-6 w-auto object-contain"
                                alt="CollabX Logo"
                            />
                        </div>
                        <p className="leading-relaxed mb-4 max-w-md text-sm" style={{ color: 'var(--text-secondary)' }}>
                            {t('footer_desc')}
                        </p>
                    </div>

                    {/* Contacts: Ahmed */}
                    <div>
                        <h4 className="font-bold text-base mb-4" style={{ color: 'var(--text-primary)' }}>{t('footer_direction')}</h4>
                        <div className="space-y-3">
                            <div>
                                <p className="text-[10px] text-purple-400 font-bold uppercase tracking-wider mb-1">{t('role_ceo')}</p>
                                <h5 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Ahmed Tayane</h5>
                                <a href="https://wa.me/212615191083" target="_blank" className="flex items-center gap-2 hover:text-[#25D366] transition-colors mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                                    <MessageCircle className="w-3.5 h-3.5" /> +212 615-191083
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Contacts: Reda */}
                    <div>
                        <h4 className="font-bold text-base mb-4" style={{ color: 'var(--text-primary)' }}>{t('footer_partnership')}</h4>
                        <div className="space-y-3">
                            <div>
                                <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider mb-1">{t('role_cofounder')}</p>
                                <h5 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Reda Ouchettou</h5>
                                <a href="https://wa.me/212690163816" target="_blank" className="flex items-center gap-2 hover:text-[#25D366] transition-colors mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                                    <MessageCircle className="w-3.5 h-3.5" /> +212 690-163816
                                </a>
                            </div>
                            <div>
                                <p className="text-[10px] text-green-400 font-bold uppercase tracking-wider mb-1">{t('role_helper')}</p>
                                <h5 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Mohamed Bouzakraoui</h5>
                                <a href="https://wa.me/212638632121" target="_blank" className="flex items-center gap-2 hover:text-[#25D366] transition-colors mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                                    <MessageCircle className="w-3.5 h-3.5" /> +212 638-632121
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t pt-6 flex flex-col md:flex-row justify-between items-center gap-4 border-slate-200" style={{ borderColor: 'var(--border-color)' }}>
                    <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{t('copyright')}</p>
                    <div className="flex gap-4">
                        <a href="https://instagram.com/collabx.ma" target="_blank" className="hover:text-[#25D366] transition-colors flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--text-tertiary)' }}>
                            <Instagram className="w-4 h-4" /> @collabx.ma
                        </a>
                    </div>
                </div>
            </div>

            {/* Bottom Image */}
            <div className="w-full py-8 flex justify-center" style={{ backgroundColor: theme === 'dark' ? '#0F172A' : 'var(--bg-primary)' }}>
                <img
                    src={theme === 'dark' ? "/logo_collabx_darkmode.png" : "https://image2url.com/r2/default/images/1767451458351-960b5df2-c9bd-4ecc-8343-0c4f56e5ce5e.png"}
                    style={{ opacity: 0.9 }}
                    className="max-w-2xl w-full h-auto object-contain"
                    alt="CollabX Footer Art"
                />
            </div>
        </footer>
    );
}
