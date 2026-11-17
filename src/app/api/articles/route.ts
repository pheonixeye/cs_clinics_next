import { NextResponse } from "next/server";
import { getArticles } from "@/lib/pocketbase";

export async function GET() {
  const articles = await getArticles();
  return NextResponse.json({ articles });
}
