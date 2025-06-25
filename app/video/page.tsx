'use client';
import React, { useEffect, useState } from 'react';

interface Video {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  transformation?: {
    height: number;
    width: number;
    quality?: number;
  };
}

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    const fetchVideos = async () => {
      const res = await fetch('/api/videos');
      const data = await res.json();
      setVideos(data);
    };
    fetchVideos();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">All Videos</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {videos.map((video) => (
            <div key={video._id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <img src={video.thumbnailUrl} alt={video.title} className="w-full h-48 object-cover rounded" />
              <h2 className="text-xl font-semibold mt-2 text-gray-900 dark:text-white">{video.title}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">{video.description}</p>
              <video
                controls
                className="mt-2 w-full rounded"
                width={video.transformation?.width}
                height={video.transformation?.height}
              >
                <source src={video.videoUrl} type="video/mp4" />
              </video>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
