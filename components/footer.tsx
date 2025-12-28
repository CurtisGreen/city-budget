import Link from "next/link";

export const Footer = () => {
  return (
    <div className="border-t py-8 bg-card">
      <footer className="flex flex-col gap-4 py-6 w-full shrink-0 items-center px-4 md:px-6">
        <div className="flex justify-center space-x-4">
          <Link
            href="/about"
            className="text-sm text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
            prefetch={false}
          >
            About
          </Link>
          <Link
            href="/compare"
            className="text-sm text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
            prefetch={false}
          >
            Compare
          </Link>
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
            prefetch={false}
          >
            Home
          </Link>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500">
          © 2025 Budget.City - Making municipal finances easy and accessible
        </p>
        <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
          Thanks to Strong Towns and their Finance Decoder for inspiring this
          site
        </p>
        <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
          Data sourced from Annual Comprehensive Financial Reports (ACFR),
          budgets, and other audited statements
        </p>
      </footer>
    </div>
  );
};
