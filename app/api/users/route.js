import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb"; 
import User from "@/model/user"; 

export async function GET() {
  try {
    await dbConnect();
    
    const users = await User.find({}).select("-password");
    
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch users", error: error.message },
      { status: 500 }
    );
  }
}