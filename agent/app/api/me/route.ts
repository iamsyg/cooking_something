// agent/app/api/me/route.ts

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { supabase } from "@/app/utils/supabase/client";

const ACCESS_TOKEN_EXPIRY = "15m";

export async function GET() {
  try {

    const cookiesStore = await cookies();
    const refreshToken = cookiesStore.get("refreshToken")?.value;
    if (!refreshToken) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    const payload = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!
    ) as any;

    const agentId = payload.sub;
    console.log("Decoded refresh token payload:", payload);

    // 🔐 fetch agent
    const { data: agent } = await supabase
      .from("agents")
      .select("*")
      .eq("id", agentId)
      .single();

    console.log("Fetched agent:", agent);   

    if (!agent || !agent.is_active) {
      return NextResponse.json({ success: false }, { status: 403 });
    }

    // 🔐 verify refresh token hash
    const isValid = await bcrypt.compare(
      refreshToken,
      agent.refresh_token_hash
    );

    if (!isValid) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    // 🔁 issue new access token
    const accessToken = jwt.sign(
      { sub: agent.id, role: agent.role, type: "access" },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );

    const { password_hash, refresh_token_hash, ...safeAgent } = agent;

    console.log("Issuing new access token for agent:", safeAgent);

    const res = NextResponse.json({
      success: true,
      user: safeAgent,
      accessToken,
    });

    res.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res;
  } catch {
    return NextResponse.json({ success: false }, { status: 401 });
  }
}