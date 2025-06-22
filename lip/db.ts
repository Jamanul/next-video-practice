import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!
// The exclamation mark (!) at the end is called the non-null assertion operator in TypeScript.
// It tells TypeScript:
// “I’m sure process.env.MONGODB_URI is not null or undefined, so don’t complain about it.”


// declare global {
//     var mongoose: {
//         conn: Connection | null;
//         promise: Promise<Connection> | null
//     }
// }


if(!MONGODB_URI){
    throw new Error("please define mongo_uri in env file")
}

let cached = global.mongoose;

if(!cached){
    cached = global.mongoose ={conn:null,promise:null}
}

// cached stores the DB connection across hot reloads.
// If global.mongoose doesn't exist yet, it's initialized.
// This avoids reconnecting on every file reload (e.g., in development).


export async function connectToDB (){
    if(cached.conn){
        return cached.conn;
    }
    if(!cached.promise){
        const opts ={
            bufferCommands:true,
            maxPoolSize:10 
        }
    // mongoose.connect(MONGODB_URI,opts).then(()=>mongoose.connection)
      cached.promise = mongoose.connect(MONGODB_URI,opts).then(()=>mongoose.connection)
    }

    try {
        cached.conn = await cached.promise
    } catch (error){
        cached.promise = null;
        throw error
    }
    return cached.conn
}





  