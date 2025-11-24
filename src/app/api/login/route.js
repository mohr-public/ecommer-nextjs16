import connectToDB from "@/database";
import User from "@/models/user";
import { compare } from "bcryptjs";
import { NextResponse } from "next/server";
import Joi from "joi";
import jwt from "jsonwebtoken";


const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(30).required()
});

export const dynamic = "force-dynamic";

export async function POST(req) {
    console.log("Login API endpoint called");
    await connectToDB();

    const {email, password} = await req.json();

    const {error} = schema.validate({ email, password });

    if(error){
        console.log(error);
        return NextResponse.json({
            success : false,
            message : error.details[0].message,
        });
    }

    try {
        const checkUser = await User.findOne({email});

        if(!checkUser) {
            return NextResponse.json({
                success: false,
                message: 'Accont not found with this email.'
            });
        }

        const checkPassword = await compare(password, checkUser.password);

        if(!checkPassword) {
            return NextResponse.json({
                success: false,
                message: 'Invalid password. Please try again.'
            });
        }

        // const token = jwt.sign(
        //     {
        //         userId: checkUser._id,
        //         email: checkUser?.email,
        //         name: checkUser?.name,
        //         role: checkUser?.role
        //     },
        //     process.env.JWT_SECRET,
        //     { expiresIn: '1d' }
        // );
        const token = jwt.sign(
            {
                id: checkUser._id,
                email: checkUser?.email,
                role: checkUser?.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        // const finalData = {
        //     name: checkUser?.name,
        //     email: checkUser?.email,
        //     role: checkUser?.role,
        //     token: token
        // }
        const finalData = {
            token: token,
            user: {
                email: checkUser?.email,
                name: checkUser?.name,
                _id: checkUser?._id,
                role: checkUser?.role,
            }
        }

        return NextResponse.json({
            success: true,
            message: 'Login successful.',
            finalData
        });

    }
    catch (error) {
        console.log("Error while loogin In. Please try again", error);
        return NextResponse.json({
            success: false,
            message: 'Something went wrong. Please try again later.'
        });
    }

    return NextResponse.json({ success: true, message: "Login API is working" });
}
