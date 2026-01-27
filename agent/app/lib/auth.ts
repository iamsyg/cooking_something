// agent/app/lib/auth.ts

import jwt from 'jsonwebtoken'
import bcrypt from "bcryptjs";
import { supabase } from "@/app/utils/supabase/client";

const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";

export const generateAccessTokenAndRefreshToken = async (
  agentId: string
) => {
  try {
    // 1. Verify agent exists
    const { data: agent, error } = await supabase
      .from("agents")
      .select("id, role")
      .eq("id", agentId)
      .single();

    if (!agent || error) {
      throw new Error("Agent not found");
    }

    // 2. Generate tokens
    const accessToken = jwt.sign(
      {
        sub: agent.id,
        role: agent.role,
        type: "access",
      },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );

    const refreshToken = jwt.sign(
      {
        sub: agent.id,
        type: "refresh",
      },
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: REFRESH_TOKEN_EXPIRY }
    );

    // 3. Hash refresh token before storing
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

    // 4. Store hashed refresh token
    await supabase
      .from("agents")
      .update({ refresh_token_hash: refreshTokenHash })
      .eq("id", agent.id);

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Token generation error:", error);
    throw new Error(
      "Something went wrong while generating access and refresh tokens"
    );
  }
};