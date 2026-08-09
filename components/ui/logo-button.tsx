import Link from "next/link";

export const GraphLogo = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-8 w-8"
    aria-hidden="true"
  >
    <path d="M3 3v16a2 2 0 0 0 2 2h16"></path>
    <path d="M18 17V9" className="text-green-700"></path>
    <path d="M13 17V5" className="text-green-700"></path>
    <path d="M8 17v-3" className="text-green-700"></path>
  </svg>
);

export const LogoButton = () => (
  <Link
    href="/"
    className="flex items-center gap-2 hover:bg-accent hover:text-accent-foreground rounded-md p-1 transition-all cursor-pointer"
  >
    <GraphLogo />
    <h1 className="text-2xl font-bold">Budget.City</h1>
  </Link>
);
