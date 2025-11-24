import connectToDB from "@/database";
import Address from "@/models/address";
import { NextResponse } from "next/server";
import AuthUser from "@/middleware/AuthUser";

export const dynamic = 'force-dynamic';


export async function DELETE(req) {
    try {
        await connectToDB();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({
                success: false,
                message: "Address Id is required."
            }, { status: 401 });
        }

        const isAuthUser = await AuthUser(req);

        if (isAuthUser) {
            const deletedAddresses = await Address.findByIdAndDelete(id);

            if (deletedAddresses) {
                return NextResponse.json({
                    success: true,
                    message: "Address is deleted successfully."
                }, { status: 200 });
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