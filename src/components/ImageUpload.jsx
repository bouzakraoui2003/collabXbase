import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const ImageUpload = ({ onUpload, existingImage }) => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [preview, setPreview] = useState(existingImage || '');

    const uploadImage = async (event) => {
        try {
            setUploading(true);
            setError('');

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.');
            }

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            let { error: uploadError } = await supabase.storage
                .from('collabx-assets')
                .upload(filePath, file);

            if (uploadError) {
                if (uploadError.message.includes("The resource was not found")) {
                    setError("Buckets might not exist yet. Please run the updated setup SQL script.");
                }
                throw uploadError;
            }

            const { data } = supabase.storage
                .from('collabx-assets')
                .getPublicUrl(filePath);

            if (data) {
                setPreview(data.publicUrl);
                onUpload(data.publicUrl);
            }

        } catch (error) {
            setError(error.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
                {preview ? (
                    <div className="w-20 h-20 rounded-lg overflow-hidden border border-slate-600">
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                        />
                    </div>
                ) : (
                    <div className="w-20 h-20 rounded-lg bg-slate-700 flex items-center justify-center text-slate-400 text-xs text-center border border-slate-600">
                        No Image
                    </div>
                )}
                <div className="flex-1">
                    <label className="block w-full text-sm text-slate-400 cursor-pointer">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={uploadImage}
                            disabled={uploading}
                            className="block w-full text-sm text-slate-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-purple-50 file:text-purple-700
                                hover:file:bg-purple-100
                                file:cursor-pointer cursor-pointer
                            "
                        />
                    </label>
                    {uploading && <p className="text-xs text-blue-400 mt-2">Uploading...</p>}
                    {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
                </div>
            </div>
        </div>
    );
};

export default ImageUpload;
