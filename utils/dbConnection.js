import mongoose from "mongoose";
export default async function dbConnection() {
    try {
        mongoose.connection.on('connected', () => {
            console.log('database connected successfully !');
        })
        mongoose.connection.on('error', (error) => {
            console.log("🚀 ~ file: dbConnection.js:9 ~ error:", error.message);

        })


        await mongoose.connect(process.env.MONGODB_URI);

    } catch (error) {
        console.log("🚀 ~ file: dbConnection.js:9 ~ error:", error.message);
        process.exit(1);

    }

}
