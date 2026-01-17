import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import InfluencersManager from './InfluencersManager';
import BrandsManager from './BrandsManager';

const AdminDashboard = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('influencers');

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/admin/login');
        } catch (error) {
            console.error('Failed to log out', error);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white flex">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
                <div className="p-6 border-b border-slate-700">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                        CollabX Admin
                    </h1>
                    <p className="text-xs text-slate-400 mt-1">Logged in as {user?.email}</p>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <button
                        onClick={() => setActiveTab('influencers')}
                        className={`w-full text-left px-4 py-3 rounded transition-colors cursor-pointer ${activeTab === 'influencers'
                            ? 'bg-purple-600/20 text-purple-400 border border-purple-600/50'
                            : 'text-slate-300 hover:bg-slate-700'
                            }`}
                    >
                        Influencers
                    </button>
                    <button
                        onClick={() => setActiveTab('brands')}
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
            <main className="flex-1 p-8 overflow-y-auto">
                <h2 className="text-3xl font-bold mb-8">
                    {activeTab === 'influencers' ? 'Manage Influencers' : 'Manage Brands'}
                </h2>

                <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 min-h-[500px]">
                    {activeTab === 'influencers' && <InfluencersManager />}
                    {activeTab === 'brands' && <BrandsManager />}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
