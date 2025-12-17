import { BarChart3 } from "lucide-react";
import { ImageResponse } from "next/og";

export async function GET() {
  return new ImageResponse(<BarChart3 className="h-16 w-16" />, {
    width: 1200,
    height: 630,
  });
}
