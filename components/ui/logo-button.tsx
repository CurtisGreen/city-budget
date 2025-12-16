import { BarChart3 } from "lucide-react";
import Link from "next/link";

export const LogoButton = () => (
  <Link
    href="/"
    className="flex items-center gap-2 hover:bg-accent hover:text-accent-foreground rounded-md p-1 transition-all cursor-pointer"
  >
    <BarChart3 className="h-8 w-8" />
    <h1 className="text-2xl font-bold">Budget.City</h1>
  </Link>
);
