import mongoose from "mongoose";

export class MongoConnection {
    public versions = "^7";
    public mongoose!: typeof mongoose;

    async onStart() {
        this.mongoose = await mongoose.connect(process.env.MONGODB!);

        if (this.mongoose) {
            console.log("Connected to MongoDB database!");

        return true;
        }
    }
}

export default new MongoConnection();