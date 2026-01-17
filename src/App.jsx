import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './hooks/useTheme';
import { LanguageProvider } from './hooks/useLanguage';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import Home from './features/Home';
import Catalog from './features/Catalog';
import BrandForm from './features/BrandForm';
import CreatorForm from './features/CreatorForm';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';

const MainSite = () => {
  const [activeSection, setActiveSection] = useState('home');

  return (
    <Layout activeSection={activeSection} setActiveSection={setActiveSection}>
      {activeSection === 'home' && <Home setActiveSection={setActiveSection} />}
      {activeSection === 'catalog' && <Catalog />}
      {activeSection === 'brand-form' && <BrandForm />}
      {activeSection === 'creator-form' && <CreatorForm />}
    </Layout>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <LanguageProvider>
            <Routes>
              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route element={<ProtectedAdminRoute />}>
                <Route path="/admin" element={<AdminDashboard />} />
              </Route>

              {/* Catch-all for Main Site */}
              <Route path="/*" element={<MainSite />} />
            </Routes>
          </LanguageProvider>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
