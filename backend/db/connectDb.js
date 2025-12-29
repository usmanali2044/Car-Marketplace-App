import mongoose from "mongoose"

export const connectDb = async () => {
    try {
        console.log("mongo_uri : ",process.env.MONGO_URI)
        const connect = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDb connected : ${connect.connection.host}`)
    } catch (error) {
        console.log("Error connection to the db ",error.message);
        process.exit(1); //failure
    }
}