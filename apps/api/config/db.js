import mongoose from "mongoose";

// One shared connection per server instance. On Vercel an instance serves
// many requests, so we connect once, cache the promise, and never call
// process.exit (that would kill the function for every request).
let connectionPromise = null;

const connectDB = async () => {
   if (mongoose.connection.readyState === 1) return mongoose.connection;

   if (!connectionPromise) {
      connectionPromise = mongoose
         .connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 8000 })
         .then((conn) => {
            console.log("MongoDB connected");
            return conn;
         })
         .catch((error) => {
            connectionPromise = null; // let the next request try again
            throw error;
         });
   }
   return connectionPromise;
};

export default connectDB;
