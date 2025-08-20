import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Clear the auth cookie by setting it to empty and expired
    const response = NextResponse.json({ message: "Logged out successfully" });
    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      expires: new Date(0), // Expire immediately
    });

    return response;
  } catch (error) {
    return NextResponse.json({ message: "Logout failed" }, { status: 500 });
  }
}
