import React, { useRef, useState } from 'react';
import { FiUpload, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import axios from 'axios';

const SimpleImageUpload = ({ image, setImage, label = "Upload Image" }) => {
  const fileInputRef = useRef();
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are allowed');
      return;
    }

    // Upload
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/upload/single',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        setImage(response.data.imageUrl);
        toast.success('Image uploaded successfully!');
      } else {
        toast.error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setImage('');
    toast.success('Image removed');
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {!image ? (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-full py-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-primary-500 transition-colors flex flex-col items-center justify-center space-y-2 bg-gray-50 dark:bg-gray-800/50 hover:bg-primary-50 dark:hover:bg-primary-900/20 disabled:opacity-50"
        >
          <FiUpload className="text-3xl text-gray-400" />
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {uploading ? 'Uploading...' : label}
          </span>
          <span className="text-xs text-gray-500">
            PNG, JPG, GIF up to 5MB
          </span>
        </button>
      ) : (
        <div className="relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
          <img
            src={`http://localhost:5000${image}`}
            alt="Uploaded"
            className="w-full h-48 object-cover"
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default SimpleImageUpload;