import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    let token = req.cookies.get("token")?.value;

    if (!token) {
      const authHeader = req.headers.get("authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }

    if (!token) {
      return NextResponse.json(
        { userdata: null },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    return NextResponse.json(
      { userdata: decoded },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { userdata: null },
      { status: 401 } 
    );
  }
}