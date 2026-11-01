import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb"; // আপনার ডাটাবেজ কানেকশন ফাইলের পাথ
import User from "@/model/user"; // আপনার ইউজার মডেলের পাথ

export async function GET() {
  try {
    await connectDB();
    
    const users = await User.find({}).select("-password");
    
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch users", error: error.message },
      { status: 500 }
    );
  }
}