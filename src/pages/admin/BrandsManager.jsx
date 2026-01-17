import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import ImageUpload from '../../components/ImageUpload';

const BrandsManager = () => {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '', handle: '', image: '', is_hidden: false
    });
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchBrands();
    }, []);

    const fetchBrands = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('brands')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) console.error('Error fetching brands:', error);
        else setBrands(data);
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
                .from('brands')
                .update(formData)
                .eq('id', editingId);
            if (!error) fetchBrands();
        } else {
            const { error } = await supabase
                .from('brands')
                .insert([formData]);
            if (!error) fetchBrands();
        }
        closeModal();
    };

    const deleteBrand = async (id) => {
        if (window.confirm('Are you sure you want to delete this brand?')) {
            const { error } = await supabase.from('brands').delete().eq('id', id);
            if (!error) fetchBrands();
        }
    };

    const toggleVisibility = async (id, currentStatus) => {
        const { error } = await supabase
            .from('brands')
            .update({ is_hidden: !currentStatus })
            .eq('id', id);
        if (!error) fetchBrands();
    };

    const openModal = (brand = null) => {
        if (brand) {
            setEditingId(brand.id);
            setFormData({
                name: brand.name,
                handle: brand.handle,
                image: brand.image,
                is_hidden: brand.is_hidden
            });
        } else {
            setEditingId(null);
            setFormData({ name: '', handle: '', image: '', is_hidden: false });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
    };

    const filteredBrands = brands.filter(brand =>
        brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        brand.handle.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Brands List</h3>
                <button
                    onClick={() => openModal()}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded text-white font-medium transition-colors cursor-pointer"
                >
                    Add New Brand
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
                <div className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-700 text-slate-300">
                            <tr>
                                <th className="p-4 border-b border-slate-600">Name</th>
                                <th className="p-4 border-b border-slate-600">Handle</th>
                                <th className="p-4 border-b border-slate-600">Image</th>
                                <th className="p-4 border-b border-slate-600">Status</th>
                                <th className="p-4 border-b border-slate-600 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBrands.length > 0 ? (
                                filteredBrands.map(brand => (
                                    <tr key={brand.id} className="hover:bg-slate-750 border-b border-slate-700/50">
                                        <td className="p-4 font-medium">{brand.name}</td>
                                        <td className="p-4 text-slate-400">@{brand.handle}</td>
                                        <td className="p-4">
                                            <div className="w-10 h-10 rounded-full bg-slate-700 overflow-hidden">
                                                {brand.image && <img src={brand.image} alt={brand.name} className="w-full h-full object-cover" />}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <button
                                                onClick={() => toggleVisibility(brand.id, brand.is_hidden)}
                                                className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer ${brand.is_hidden ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}`}
                                            >
                                                {brand.is_hidden ? 'Hidden' : 'Visible'}
                                            </button>
                                        </td>
                                        <td className="p-4 text-right space-x-2">
                                            <button
                                                onClick={() => openModal(brand)}
                                                className="text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => deleteBrand(brand.id)}
                                                className="text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-slate-500">
                                        No brands found matching "{searchTerm}"
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-slate-800 rounded-lg p-6 w-full max-w-lg border border-slate-700 shadow-2xl">
                        <h3 className="text-2xl font-bold mb-4">{editingId ? 'Edit Brand' : 'Add Brand'}</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Name</label>
                                <input name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 focus:border-purple-500 outline-none" required />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Handle (no @)</label>
                                <input name="handle" value={formData.handle} onChange={handleInputChange} className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 focus:border-purple-500 outline-none" required />
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

                            <label className="flex items-center gap-2 text-slate-400">
                                <input type="checkbox" name="is_hidden" checked={formData.is_hidden} onChange={handleInputChange} className="w-4 h-4 rounded bg-slate-700 border-slate-600 text-purple-600 focus:ring-purple-500" />
                                Hide from public site
                            </label>

                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={closeModal} className="px-4 py-2 hover:bg-slate-700 rounded text-slate-300 cursor-pointer">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded text-white font-bold cursor-pointer">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BrandsManager;
