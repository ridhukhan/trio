import { dbConnect } from "@/lib/mongodb";
import Message from "@/model/message";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { userId } = params; 
    const currentUrl = new URL(req.url);
    const currentUserId = currentUrl.searchParams.get("currentUserId"); // নিজের আইডি (Query parameter থেকে আসছে)

    if (!currentUserId || !userId) {
      return NextResponse.json(
        { message: "Missing user IDs" },
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

    return NextResponse.json(
      { success: true, messages },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}