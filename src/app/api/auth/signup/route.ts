import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const runtime = "nodejs"; // bcrypt requires Node.js runtime

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    // 1. Basic validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Name, email and password are required" },
        { status: 400 }
      );
    }
    if (password.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // 2. Connect to DB
    await dbConnect();

    // 3. Check if email exists
    const existing = await User.findOne({ email }).exec(); // fixed
    if (existing) {
      return NextResponse.json(
        { message: "Email already in use" },
        { status: 409 }
      );
    }

    // 4. Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // 5. Create user
    const user = await User.create({ name, email, passwordHash }); // fixed

    // 6. Success response
    return NextResponse.json(
      {
        message: "Signup successful",
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
