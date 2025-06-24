import { NextAuthOptions } from "next-auth";
import bcrypt from 'bcrypt'
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDB } from "./db";
import User from "@/models/User";

export const authOpions:NextAuthOptions ={
    providers:[
        CredentialsProvider({
            name:"Credentials",
            credentials:{
                email:{label:"email",type:"text"},
                password:{label:"password",type:"text"}
            },
            async authorize(credentials){
                if(!credentials?.email|| !credentials.password){
                    throw new Error ('missing email or password')
                }
                try {
                    await connectToDB();
                    const user =await User.findOne({email:credentials.email})
                    if(!user){
                           throw new Error ('no user found')
                    }
                    const isvalid =await bcrypt.compare(
                        credentials.password,
                        user.password
                    )
                     if(!isvalid){
                           throw new Error ('password not matched')
                    }
                    return {
                        id: user._id.toString(),
                        email:user.email
                    }
                } catch (error) {
                    console.error('console auth error')
                    throw Error
                }
            }
        })
    ]
}