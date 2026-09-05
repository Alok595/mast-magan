import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    let userRole = "user";
    let userName = "User";
    let authEmail = email;
    let valid = false;

    // 1. Check Admin Credentials
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      valid = true;
      userRole = "admin";
      userName = "Admin";
      // Override email to match web app's hardcoded admin email
      authEmail = "admin@dhun.com";
    } else {
      // 2. Check Database Users
      await dbConnect();
      const user = await User.findOne({ email });
      if (user && user.password) {
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (isPasswordMatch) {
          valid = true;
          userRole = "user";
          userName = user.name || "User";
        }
      }
    }

    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Generate JWT
    const secret = process.env.NEXTAUTH_SECRET || "dhun_super_secret_key";
    const token = jwt.sign(
      { email: authEmail, role: userRole, name: userName },
      secret,
      { expiresIn: "7d" }
    );

    return NextResponse.json({
      token,
      user: { email: authEmail, role: userRole, name: userName }
    }, { status: 200 });

  } catch (error) {
    console.error("Mobile login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
