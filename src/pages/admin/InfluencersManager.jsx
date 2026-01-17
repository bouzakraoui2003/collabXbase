import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import ImageUpload from '../../components/ImageUpload';

const InfluencersManager = () => {
    const [influencers, setInfluencers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '', handle: '', followers: '', image: '', niche: '', gender: 'F', is_hidden: false
    });
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchInfluencers();
    }, []);

    const fetchInfluencers = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('influencers')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) console.error('Error fetching influencers:', error);
        else setInfluencers(data);
        setLoading(false);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageUpload = (url) => {
        setFormData(prev => ({ ...prev, image: url }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editingId) {
            const { error } = await supabase
                .from('influencers')
                .update(formData)
                .eq('id', editingId);
            if (!error) fetchInfluencers();
        } else {
            const { error } = await supabase
                .from('influencers')
                .insert([formData]);
            if (!error) fetchInfluencers();
        }
        closeModal();
    };

    const deleteInfluencer = async (id) => {
        if (window.confirm('Are you sure you want to delete this influencer?')) {
            const { error } = await supabase.from('influencers').delete().eq('id', id);
            if (!error) fetchInfluencers();
        }
    };

    const toggleVisibility = async (id, currentStatus) => {
        const { error } = await supabase
            .from('influencers')
            .update({ is_hidden: !currentStatus })
            .eq('id', id);
        if (!error) fetchInfluencers();
    };

    const openModal = (influencer = null) => {
        if (influencer) {
            setEditingId(influencer.id);
            setFormData({
                name: influencer.name,
                handle: influencer.handle,
                followers: influencer.followers,
                image: influencer.image,
                niche: influencer.niche,
                gender: influencer.gender,
                is_hidden: influencer.is_hidden
            });
        } else {
            setEditingId(null);
            setFormData({ name: '', handle: '', followers: '', image: '', niche: '', gender: 'F', is_hidden: false });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
    };

    const filteredInfluencers = influencers.filter(inf =>
        inf.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inf.handle.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Influencers List</h3>
                <button
                    onClick={() => openModal()}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded text-white font-medium transition-colors cursor-pointer"
                >
                    Add New Influencer
                </button>
            </div>

            <div className="mb-6 relative">
                <input
                    type="text"
                    placeholder="Search by name or handle..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-200 px-4 py-3 pl-10 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                />
                <svg className="w-5 h-5 text-slate-500 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>

            {loading ? (
                <div className="text-center py-10">Loading...</div>
            ) : (
                <>
                    {/* Desktop Table View */}
                    <div className="hidden md:block bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-700 text-slate-300">
                                <tr>
                                    <th className="p-4 border-b border-slate-600">Name</th>
                                    <th className="p-4 border-b border-slate-600">Handle</th>
                                    <th className="p-4 border-b border-slate-600">Stats</th>
                                    <th className="p-4 border-b border-slate-600">Image</th>
                                    <th className="p-4 border-b border-slate-600">Status</th>
                                    <th className="p-4 border-b border-slate-600 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredInfluencers.length > 0 ? (
                                    filteredInfluencers.map(inf => (
                                        <tr key={inf.id} className="hover:bg-slate-750 border-b border-slate-700/50">
                                            <td className="p-4 font-medium">{inf.name}</td>
                                            <td className="p-4 text-slate-400">@{inf.handle}</td>
                                            <td className="p-4">{inf.followers}</td>
                                            <td className="p-4">
                                                <div className="w-10 h-10 rounded-full bg-slate-700 overflow-hidden">
                                                    {inf.image && <img src={inf.image} alt={inf.name} className="w-full h-full object-cover" />}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <button
                                                    onClick={() => toggleVisibility(inf.id, inf.is_hidden)}
                                                    className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer ${inf.is_hidden ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}`}
                                                >
                                                    {inf.is_hidden ? 'Hidden' : 'Visible'}
                                                </button>
                                            </td>
                                            <td className="p-4 text-right space-x-2">
                                                <button
                                                    onClick={() => openModal(inf)}
                                                    className="text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => deleteInfluencer(inf.id)}
                                                    className="text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="p-8 text-center text-slate-500">
                                            No influencers found matching "{searchTerm}"
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4">
                        {filteredInfluencers.length > 0 ? (
                            filteredInfluencers.map(inf => (
                                <div key={inf.id} className="bg-slate-800 rounded-lg p-4 border border-slate-700 shadow-sm flex flex-col gap-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-slate-700 overflow-hidden flex-shrink-0">
                                                {inf.image && <img src={inf.image} alt={inf.name} className="w-full h-full object-cover" />}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-lg">{inf.name}</h4>
                                                <p className="text-slate-400 text-sm">@{inf.handle}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => toggleVisibility(inf.id, inf.is_hidden)}
                                            className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${inf.is_hidden ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'}`}
                                        >
                                            {inf.is_hidden ? 'Hidden' : 'Visible'}
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-4 text-sm text-slate-300 bg-slate-750 p-2 rounded">
                                        <div><span className="text-slate-500">Followers:</span> {inf.followers}</div>
                                        <div><span className="text-slate-500">Niche:</span> {inf.niche || 'N/A'}</div>
                                    </div>

                                    <div className="flex gap-2 mt-1">
                                        <button
                                            onClick={() => openModal(inf)}
                                            className="flex-1 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-600/50 rounded transition-colors font-medium text-sm flex items-center justify-center gap-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => deleteInfluencer(inf.id)}
                                            className="flex-1 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/50 rounded transition-colors font-medium text-sm flex items-center justify-center gap-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-slate-500 bg-slate-800 rounded-lg border border-slate-700">
                                No influencers found matching "{searchTerm}"
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-slate-800 rounded-lg w-full max-w-lg border border-slate-700 shadow-2xl flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-slate-700">
                            <h3 className="text-2xl font-bold">{editingId ? 'Edit Influencer' : 'Add Influencer'}</h3>
                        </div>

                        <div className="p-6 overflow-y-auto custom-scrollbar">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-slate-400 mb-1">Name</label>
                                        <input name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 focus:border-purple-500 outline-none" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-slate-400 mb-1">Handle (no @)</label>
                                        <input name="handle" value={formData.handle} onChange={handleInputChange} className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 focus:border-purple-500 outline-none" required />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-slate-400 mb-1">Followers (e.g. 1M)</label>
                                        <input name="followers" value={formData.followers} onChange={handleInputChange} className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 focus:border-purple-500 outline-none" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-slate-400 mb-1">Niche</label>
                                        <input name="niche" value={formData.niche} onChange={handleInputChange} className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 focus:border-purple-500 outline-none" required />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Image</label>
                                    <ImageUpload
                                        onUpload={handleImageUpload}
                                        existingImage={formData.image}
                                    />
                                    <input
                                        type="hidden"
                                        name="image"
                                        value={formData.image}
                                        required
                                    />
                                </div>

                                <div className="flex gap-4">
                                    <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${formData.gender === 'F' ? 'bg-purple-600/20 border-purple-500 text-purple-400' : 'bg-slate-700 border-slate-600 text-slate-400 hover:bg-slate-600'}`}>
                                        <input type="radio" name="gender" value="F" checked={formData.gender === 'F'} onChange={handleInputChange} className="hidden" />
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                        Female
                                    </label>
                                    <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${formData.gender === 'M' ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'bg-slate-700 border-slate-600 text-slate-400 hover:bg-slate-600'}`}>
                                        <input type="radio" name="gender" value="M" checked={formData.gender === 'M'} onChange={handleInputChange} className="hidden" />
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                        Male
                                    </label>
                                </div>
                                <label className="flex items-center gap-3 text-slate-400 cursor-pointer p-2 rounded hover:bg-slate-700/50 transition-colors">
                                    <input type="checkbox" name="is_hidden" checked={formData.is_hidden} onChange={handleInputChange} className="w-5 h-5 rounded bg-slate-700 border-slate-600 text-purple-600 focus:ring-purple-500 cursor-pointer" />
                                    <span className="select-none">Hide from public site</span>
                                </label>

                                <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
                                    <button type="button" onClick={closeModal} className="px-4 py-2 hover:bg-slate-700 rounded text-slate-300 cursor-pointer">Cancel</button>
                                    <button type="submit" className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded text-white font-bold cursor-pointer">Save</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InfluencersManager;
