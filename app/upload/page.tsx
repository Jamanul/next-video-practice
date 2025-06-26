'use client';

import React, { useState } from 'react';
import FileUpload from '../component/FileUpload';

// export interface IVideo {
//     _id?:mongoose.Types.ObjectId;
//     title : string;
//     description: string;
//     videoUrl:string;
//     thumbnailUrl:string;
//     controls?:boolean;
//     transformation?:{
//         height:number;
//         width:number;
//         quality?:number;
//     };
// }



export default function UploadPage() {
   const [uploadProgress, setUploadProgress] = useState(0);


  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Input styling class
  const inputClass = 'w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500';






const [title,setTitle]=useState('')
const [description,setDescription]=useState('')
const [videoUrl,setVideoUrl]=useState('')
const [thumbnailUrl,setthumbnailUrl]=useState('')



const handleSubmit =async (e:any)=>{
  e.preventDefault()
  const videoObject={
    videoFile,title,description,videoUrl,thumbnailUrl
  }
  console.log(videoObject)
 const res = await fetch('/api/auth/video', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(videoObject),
});
const data = await res.json();
console.log("📦 Server response:", data);
}

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
              onChange={e=>setTitle(e.target.value)} 
              value={title} 
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
              onChange={e=>setDescription(e.target.value)} 
              value={description} 
              required 
              rows={3}
              className={inputClass}
            />
          </div>
          
        <FileUpload  fileType="video" 
        inputClass={inputClass}// or "video"
        onSuccess={(res) => {
          console.log(res)
          setVideoUrl(res.url);
        }}
        onProgress={(progress) => {
          console.log("⏳ Progress", progress);
          setUploadProgress(progress);
        }}/>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Thumbnail URL *
            </label>
            <input 
              name="thumbnailUrl" 
              placeholder="Enter thumbnail image URL" 
              onChange={e=>setthumbnailUrl(e.target.value)} 
              value={thumbnailUrl} 
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
                value={1920} 
                readOnly
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
                value={1080} 
                readOnly
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
                value={100} 
                readOnly
                className={inputClass}
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
      
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
          >
            {uploading ? 'Uploading...' : 'Upload Video'}
          </button>
        </div>
      </div>
    </div>
  );
}