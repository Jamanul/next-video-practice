import { Connection } from "mongoose";

declare global {
    var mongoose: {
        conn: Connection | null;
        promise: Promise<Connection> | null
    }
}
// Extends the Node.js global object with a custom mongoose property.
//TypeScript doesn’t know about custom properties on globalThis by default — this declaration informs TypeScript that you’re adding a mongoose object to global.



export {}
// This prevents TypeScript from treating the file as a script (global scope).
// By exporting something (even empty), it becomes a module, which allows the declare global {} block to work properly.