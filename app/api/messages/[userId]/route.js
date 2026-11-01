import { dbConnect } from "@/lib/mongodb";
import Message from "@/model/message";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req, { params }) {
  try {
    const { userId } = await params;
    const currentUserId = new URL(req.url).searchParams.get("currentUserId");

    if (!currentUserId || !userId) {
      return NextResponse.json(
        { success: false, message: "Missing user IDs" },
        { status: 400 }
      );
    }

    await dbConnect();

    const messages = await Message.find({
      $or: [
        { senderId: currentUserId, receiverId: userId },
        { senderId: userId, receiverId: currentUserId },
      ],
    }).sort({ createdAt: 1 });

    return NextResponse.json({ success: true, messages }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}