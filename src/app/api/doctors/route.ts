import { NextResponse } from "next/server";
import { getDoctors } from "@/lib/pocketbase";

export async function GET() {
  const doctors = await getDoctors();
  return NextResponse.json({ doctors });
}
