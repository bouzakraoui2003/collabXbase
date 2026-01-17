import { useTheme } from '../hooks/useTheme';
import Navbar from './Navbar';
import Footer from './Footer';
import ThreeBackground from './ThreeBackground';

export default function Layout({ children, activeSection, setActiveSection }) {
    const { theme } = useTheme();

    return (
        <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
            <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />

            <main className="relative pt-20 min-h-screen">
                {/* 3D Background only shows on home? Or all? Original text says "HOME SECTION ... <div id="canvas-container">" within home-view. 
                   But canvas-container was fixed position. 
                   If we want it global, put it here. If mostly for Home, maybe just Home.
                   Original css: #canvas-container { position: fixed ... z-index: 0 }
                   So it is visible everywhere if nothing covers it. 
                   Other sections have backgrounds (bg-white etc) which cover it.
                   We'll place it here as fixed background.
                */}
                <ThreeBackground />

                <div className="relative z-10">
                    {children}
                </div>
            </main>

            <Footer />

            {/* Footer is part of Home section in original? 
               In original HTML, Footer was INSIDE <section id="home-view">.
               But usually Footer is global.
               However, check original: 
               <section id="home-view"> ... <footer ...> ... </section>
               <section id="catalog-view" class="hidden ..."> ... </section>
               So Footer ONLY appeared on Home View!
               
               User said "THE SAME website". So footer should only appear on Home?
               If I click Catalog, do I see footer?
               Original: catalog-view takes 100vh usually or scroll?
               Catalog has no footer inside it in original code.
               So Footer is indeed Home-specific.
               
               BUT, typically a website implies footer everywhere.
               Let's check if Catalog view has a footer.
               Lines 663-721 (Catalog) does NOT have footer.
               
               However, for a better "From A to Z" React implementation, should I keep it global?
               If I keep it global, it appears on Catalog too.
               If I want EXACT copy, I should put it in Home.jsx.
               But "Layout" implies global structure.
               
               Let's put Footer in Home.jsx for now to be "EXACT".
               OR, I can make it conditional in Layout.
            */}
        </div>
    );
}
