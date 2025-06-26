import { authOpions } from "@/lip/auth";
import { connectToDB } from "@/lip/db";
import Video, { IVideo } from "@/models/Video";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

 export async function GET(){
    try{
        await connectToDB();
        const videos = await Video.find({}).sort({createdAt:-1}).lean();
        if(!videos || videos.length ===0){
            return NextResponse.json([],{
              status :200
            })
        }
        return NextResponse.json(videos)
    }
    catch(error){
        return NextResponse.json({
            error:"Fetching not possible"
        },{
            status:500
        })
    }
 }

 export async function POST (request:NextRequest){
    try {
      const session = await getServerSession(authOpions);
      if(!session){
        return NextResponse.json({
            error:"Unauthorised"
        },{
            status:401
        })
      }
      await connectToDB();
      const body:IVideo = await request.json();
      if(!body.title || !body.description || !body.videoUrl || !body.thumbnailUrl){
        return NextResponse.json({error: "Missing required fields"},
            {status:500}
        )
      }
      const videoData:IVideo ={
        ...body,
        controls:body?.controls ?? true,
        transformation: {
          height:1920,
        width:1080,
        quality:body.transformation?.quality ?? 100
        }
      }
      const newVideo = await Video.create(videoData)
      return NextResponse.json(newVideo);
    } catch (error) {
  console.error("❌ Error creating video:", error);
  return NextResponse.json({
    error: error instanceof Error ? error.message : "Unknown error",
    status: 500
  });
}
 }