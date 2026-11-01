import { dbConnect } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import User from "@/model/user";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    let { username, email, password } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json(
        { message: "Please fill every input" },
        { status: 400 }
      );
    }

    if (/\s/.test(username)) {
      return NextResponse.json(
        { message: "Username cannot contain spaces" },
        { status: 400 }
      );
    }

    username = username.toLowerCase().trim();

    if (password.length !== 8) {
      return NextResponse.json(
        { message: "Password must be exactly 8 characters" },
        { status: 400 }
      );
    }

    await dbConnect();

    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      const message = existingUser.email === email 
        ? "Email already taken" 
        : "Username already taken";
      return NextResponse.json(
        { message },
        { status: 400 }
      );
    }

    const hashedPass = await bcrypt.hash(password, 10);
    await User.create({
      username,
      email,
      password: hashedPass,
    });

    return NextResponse.json(
      { message: "User created successfully done" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}