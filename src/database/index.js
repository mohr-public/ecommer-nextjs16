import mongoose from "mongoose";

const configOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}

const connectToDB = async () => {

    const connectionUrl = process.env.MONGODB_URI;

    mongoose
        .connect(connectionUrl, configOptions)
        .then(() => console.log("Ecommerce database connected successfully!"))
        .catch((err) =>
        console.log(`Getting Error from DB connection ${err.message}`)
        );

    // const connectionUrl = process.env.MONGODB_URI;
    // try {
    //     await mongoose
    //         .connect(connectionUrl, configOptions)
    //         .then(() => {
    //             console.log("Ecommerce database connected successfully");
    //             mongoose.set('strictQuery', false); // Disable strict query mode
    //         })
    //         .catch((error) => {
    //             console.error("Error connecting to the database:", error);
    //             console.log(`Getting Error from DB connection: ${error.message}`);
    //             process.exit(1); // Exit the process with failure
    //         });
    // } catch (error) {
    //     console.error("MongoDB connection failed:", error);
    //     process.exit(1); // Exit the process with failure
    // }
};

export default connectToDB;