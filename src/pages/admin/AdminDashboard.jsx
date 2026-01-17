import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import InfluencersManager from './InfluencersManager';
import BrandsManager from './BrandsManager';

const AdminDashboard = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('influencers');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/admin/login');
        } catch (error) {
            console.error('Failed to log out', error);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white flex relative">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed md:relative inset-y-0 left-0 z-50 w-64 bg-slate-800 border-r border-slate-700 flex flex-col transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <div className="p-6 border-b border-slate-700 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                            CollabX Admin
                        </h1>
                        <p className="text-xs text-slate-400 mt-1">Logged in as {user?.email}</p>
                    </div>
                    {/* Close button for mobile */}
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="md:hidden text-slate-400 hover:text-white"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <button
                        onClick={() => { setActiveTab('influencers'); setIsSidebarOpen(false); }}
                        className={`w-full text-left px-4 py-3 rounded transition-colors cursor-pointer ${activeTab === 'influencers'
                            ? 'bg-purple-600/20 text-purple-400 border border-purple-600/50'
                            : 'text-slate-300 hover:bg-slate-700'
                            }`}
                    >
                        Influencers
                    </button>
                    <button
                        onClick={() => { setActiveTab('brands'); setIsSidebarOpen(false); }}
                        className={`w-full text-left px-4 py-3 rounded transition-colors cursor-pointer ${activeTab === 'brands'
                            ? 'bg-purple-600/20 text-purple-400 border border-purple-600/50'
                            : 'text-slate-300 hover:bg-slate-700'
                            }`}
                    >
                        Brands
                    </button>
                </nav>

                <div className="p-4 border-t border-slate-700">
                    <button
                        onClick={() => navigate('/')}
                        className="w-full text-left px-4 py-3 rounded text-slate-300 hover:bg-slate-700 mb-2 cursor-pointer"
                    >
                        Back to Site
                    </button>
                    <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-500 border border-red-600/50 rounded transition-colors cursor-pointer"
                    >
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full">
                <div className="flex items-center gap-4 mb-8">
                    {/* Hamburger Button */}
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="md:hidden p-2 bg-slate-800 rounded text-slate-300 hover:text-white border border-slate-700"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    <h2 className="text-2xl md:text-3xl font-bold">
                        {activeTab === 'influencers' ? 'Manage Influencers' : 'Manage Brands'}
                    </h2>
                </div>

                <div className="bg-slate-800 rounded-lg p-4 md:p-6 border border-slate-700 min-h-[500px]">
                    {activeTab === 'influencers' && <InfluencersManager />}
                    {activeTab === 'brands' && <BrandsManager />}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
