// components/AuthBootstrap.tsx
"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/store/hook";
import { loadAgent } from "@/store/slices/agentSlice";

export default function AuthBootstrap() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadAgent());
  }, [dispatch]);

  return null;
}