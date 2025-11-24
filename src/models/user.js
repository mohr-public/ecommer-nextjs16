import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        name: String,
        email: String,
        password: String,
        role: String
    }
);

const User = mongoose.models.Users || mongoose.model("Users", UserSchema);

export default User;