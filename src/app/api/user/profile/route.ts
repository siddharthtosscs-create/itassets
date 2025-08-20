import { NextResponse } from "next/server";
import { getUserFromCookie } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  const payload = await getUserFromCookie();
  if (!payload) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const user = await User.findById(payload.id).select("-passwordHash");

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ user });
}
