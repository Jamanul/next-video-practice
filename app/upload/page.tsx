'use client';
import React, { useState } from 'react';

export default function UploadPage() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    videoUrl: '',
    thumbnailUrl: '',
    controls: true,
    transformation: {
      height: 1920,
      width: 1080,
      quality: 80,
    },
  });

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Input styling class
  const inputClass = 'w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name in form.transformation) {
      setForm((prev) => ({
        ...prev,
        transformation: {
          ...prev.transformation,
          [name]: Number(value),
        },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setVideoFile(file);
  };

  const uploadVideoFile = async (file: File) => {
    const data = new FormData();
    data.append('file', file);

    const res = await fetch('/api/video', {
      method: 'POST',
      body: data,
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('Upload failed:', text);
      throw new Error(`Upload failed: ${res.status} ${res.statusText}`);
    }

    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await res.text();
      console.error('Non-JSON response:', text);
      throw new Error('Server returned non-JSON response');
    }

    const result = await res.json();
    return result.videoUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      let videoUrl = form.videoUrl;

      if (videoFile) {
        videoUrl = await uploadVideoFile(videoFile);
      }

      const res = await fetch('/api/video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, videoUrl }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error('API error:', text);
        alert(`Error: ${res.status} ${res.statusText}`);
        return;
      }

      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await res.text();
        console.error('Non-JSON response:', text);
        alert('Server returned invalid response');
        return;
      }

      const data = await res.json();

      if (data && data.success !== false) {
        alert('Video uploaded successfully!');
        setForm({
          title: '',
          description: '',
          videoUrl: '',
          thumbnailUrl: '',
          controls: true,
          transformation: {
            height: 1920,
            width: 1080,
            quality: 80,
          },
        });
        setVideoFile(null);
      } else {
        alert('Error: ' + (data?.error || 'Unknown error occurred'));
      }
    } catch (err: any) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Upload Video</h1>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title *
            </label>
            <input 
              name="title" 
              placeholder="Enter video title" 
              onChange={handleChange} 
              value={form.title} 
              required 
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description *
            </label>
            <textarea 
              name="description" 
              placeholder="Enter video description" 
              onChange={handleChange} 
              value={form.description} 
              required 
              rows={3}
              className={inputClass}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Upload Video File
            </label>
            <input 
              type="file" 
              accept="video/*" 
              onChange={handleFileChange} 
              className={inputClass}
            />
          </div>

          <div className="text-center text-gray-500 dark:text-gray-400">
            OR
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Video URL
            </label>
            <input 
              name="videoUrl" 
              placeholder="Paste video URL (if not uploading file)" 
              onChange={handleChange} 
              value={form.videoUrl} 
              className={inputClass}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Thumbnail URL *
            </label>
            <input 
              name="thumbnailUrl" 
              placeholder="Enter thumbnail image URL" 
              onChange={handleChange} 
              value={form.thumbnailUrl} 
              required 
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Height
              </label>
              <input 
                type="number" 
                name="height" 
                placeholder="1920" 
                value={form.transformation.height} 
                onChange={handleChange} 
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Width
              </label>
              <input 
                type="number" 
                name="width" 
                placeholder="1080" 
                value={form.transformation.width} 
                onChange={handleChange} 
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Quality (1-100)
              </label>
              <input 
                type="number" 
                name="quality" 
                placeholder="80" 
                min="1" 
                max="100"
                value={form.transformation.quality} 
                onChange={handleChange} 
                className={inputClass}
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={uploading || (!videoFile && !form.videoUrl)}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
          >
            {uploading ? 'Uploading...' : 'Upload Video'}
          </button>
        </div>
      </div>
    </div>
  );
}