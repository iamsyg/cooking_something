// agent/app/api/login/route.ts

import { NextResponse } from "next/server";
import { supabase } from "@/app/utils/supabase/client";
import bcrypt from "bcryptjs";
import { generateAccessTokenAndRefreshToken } from "@/app/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    console.log("Login attempt for email:", email);

    // 1. Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    // 2. Fetch agent by email
    const { data: agent, error } = await supabase
      .from("agents")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !agent) {
      return NextResponse.json(
        { success: false, message: "Agent not found" },
        { status: 404 }
      );
    }

    // 3. Check if agent is active
    if (!agent.is_active) {
      return NextResponse.json(
        { success: false, message: "Agent account is disabled" },
        { status: 403 }
      );
    }

    // 4. Verify password
    const isPasswordValid = await bcrypt.compare(
      password,
      agent.password_hash
    );

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Invalid password" },
        { status: 401 }
      );
    }

    // 5. Generate tokens
    const { accessToken, refreshToken } =
      await generateAccessTokenAndRefreshToken(agent.id);

    // 6. Update last login
    await supabase
      .from("agents")
      .update({ last_login_at: new Date().toISOString() })
      .eq("id", agent.id);

    // 7. Remove sensitive fields
    const { password_hash, ...safeAgent } = agent;

    // 8. Create response with cookies
    const res = NextResponse.json(
      {
        success: true,
        message: "Agent logged in successfully",
        user: safeAgent,
        accessToken,
        refreshToken,
      },
      { status: 200 }
    );

    // Set cookies with proper configuration
    res.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", // Changed from "strict" to "lax" for better compatibility
      path: '/',
      maxAge: 60 * 15, // 15 minutes
    });

    res.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", // Changed from "strict" to "lax"
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return res;
  } catch (err: any) {
    console.error("Login error:", err);
    return NextResponse.json(
      {
        success: false,
        message: err.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}