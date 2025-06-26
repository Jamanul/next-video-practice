"use client" // This component must be a client component

import {
    ImageKitAbortError,
    ImageKitInvalidRequestError,
    ImageKitServerError,
    ImageKitUploadNetworkError,
    upload,
} from "@imagekit/next";
import { useRef, useState } from "react";
interface FileUploadProps {
    onSuccess:(res:any)=> void;
    onProgress:(progress:number)=>void;
    fileType?: "image" | "video";
    inputClass?:string;
}
// UploadExample component demonstrates file uploading using ImageKit's Next.js SDK.
const FileUpload = ({onSuccess,onProgress,fileType,inputClass}:FileUploadProps) => {
    const [uploading,setUploading]= useState(false);
    const [error,setError]= useState<string | null>(null);
    //optional validation 
  const validateFile = (file: File) => {
  if (fileType === "video") {
    if (!file.type.startsWith("video/mp4")) {
      setError("Please upload a valid MP4 video");
      return false;
    }
    if (file.size > 100 * 1024 * 1024) {
      setError("File must be less than 100MB");
      return false;
    }
  }
  return true;
};


    const handleFileChange =async(e:React.ChangeEvent<HTMLInputElement>)=>{
        const file = e.target.files?.[0];
        if(!file || !validateFile(file) ) return

        setUploading(true)
        setError(null)
        try{
          const authRes =  await fetch("/api/auth/imagekit")
          const auth = await authRes.json();
          console.log(auth)
         const res = await upload({
              fileName: file.name, 
              publicKey :process.env.NEXT_PUBLIC_PUBLIC_KEY!,
              expire:auth.authenticationParameters.expire,
                token:auth.authenticationParameters.token,
                signature:auth.authenticationParameters.signature,
                file,
                onProgress: (event) => {
                   if(event.lengthComputable && onProgress!){
                    const percent = (event.loaded / event.total) * 100
                    onProgress(Math.round(percent))
                   }
                },
          })
          console.log(res)
          onSuccess(res)
        }
        catch (err: any) {
  console.error("upload failed", err);
  if (err instanceof ImageKitInvalidRequestError) {
    setError("Invalid request. Please check your credentials.");
  } else if (err instanceof ImageKitUploadNetworkError) {
    setError("Network error. Check your connection.");
  } else if (err instanceof ImageKitServerError) {
    setError("Server error from ImageKit.");
  } else {
    setError("Something went wrong while uploading.");
  }
}
 finally{
            setUploading(false)
        }
    }

    return (
        <>
            <input 
            type="file"
            accept={fileType === "video" ? "video/*":"image/*"}
            onChange={handleFileChange}
            className={inputClass}
            />
            {uploading && "loading"}
        </>
    );
};

export default FileUpload;