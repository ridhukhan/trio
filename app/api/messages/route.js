import { dbConnect } from "@/lib/mongodb";
import Message from "@/model/message";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { senderId, receiverId, text } = await req.json();

    if (!senderId || !receiverId || !text) {
      return NextResponse.json(
        { message: "Sender, receiver, and text are required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
    });

    return NextResponse.json(
      { success: true, message: newMessage },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}