import connectToDB from "@/database";
import AuthUser from "@/middleware/AuthUser";
import Address from "@/models/address";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';


export async function GET(req) {
    try {
        await connectToDB();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({
                success: false,
                message: "You are not logged In."
            }, { status: 401 });
        }

        const isAuthUser = await AuthUser(req);

        if (isAuthUser) {
            const getAllAddresses = await Address.find({ userId: id });

            if (getAllAddresses) {
                return NextResponse.json({
                    success: true,
                    data: getAllAddresses
                })
            } else {
                return NextResponse.json({
                    success: false,
                    message: "Failed to get addresses! Please try again."
                }, { status: 401 });
            }

        } else {
            return NextResponse.json({
                success: false,
                message: "You are not authenticated."
            }, { status: 401 });
        }

    } catch (error) {
        console.error("Error getting address:", error);
        return NextResponse.json({
            success: false,
            message: "Something went wrong! Please try asan later"
        }, { status: 500 });
    }
}