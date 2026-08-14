import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 });
    }

    if (email === process.env.ADMIN_EMAIL) {
      return NextResponse.json({ error: "Cannot use admin email" }, { status: 400 });
    }

    await dbConnect();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create User
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Generate JWT
    const secret = process.env.NEXTAUTH_SECRET || "mastmagan_super_secret_key";
    const token = jwt.sign(
      { email: newUser.email, role: "user", name: newUser.name },
      secret,
      { expiresIn: "7d" }
    );

    return NextResponse.json({
      token,
      user: { email: newUser.email, role: "user", name: newUser.name }
    }, { status: 201 });

  } catch (error) {
    console.error("Mobile signup error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
