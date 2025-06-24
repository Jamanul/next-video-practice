import { connectToDB } from "@/lip/db";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request:NextRequest){
    try {
       const {email,password}=  await request.json();

       if(!email || !password){
        return NextResponse.json({
            error: "email not found"
            
        },{
            status:400
        })
       }
       await connectToDB();
       const existingUser = await User.findOne({email})
       if(existingUser){
         return NextResponse.json({
            error: "User already Registered"
            
        },{
            status:400
        })
       }
       await User.create({
        email,password
       })
       return NextResponse.json(
        {message:"User has been created successfully"},
        {status:200}
    )
    } catch (error) {
           return NextResponse.json(
        {error:"Something went wrong"},
        {status:400}
    )
    }
}