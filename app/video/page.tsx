'use client';

import React, { useEffect, useState } from 'react';

interface Video {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  controls?: boolean;
  transformation?: {
    height: number;
    width: number;
    quality?: number;
  };
}

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch('/api/auth/video');
        if (!res.ok) throw new Error("Failed to fetch videos");
        const data = await res.json();
        setVideos(data);
      } catch (err: any) {
        console.error("❌ Error fetching videos:", err);
        setError("Could not load videos. Please try again.");
      }
    };

    fetchVideos();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">All Videos</h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
            {error}
          </div>
        )}

        {videos.length === 0 && !error && (
          <p className="text-gray-600 dark:text-gray-300">No videos uploaded yet.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {videos.map((video) => (
            <div key={video._id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="w-full h-48 object-cover rounded"
              />

              <h2 className="text-xl font-semibold mt-2 text-gray-900 dark:text-white">
                {video.title}
              </h2>

              <p className="text-sm text-gray-600 dark:text-gray-300">{video.description}</p>

              {video.videoUrl && (
                <video
                  controls={video.controls ?? true}
                  className="mt-3 w-full rounded aspect-video"
                  width={video.transformation?.width || 1080}
                  height={video.transformation?.height || 720}
                >
                  <source src={video.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
