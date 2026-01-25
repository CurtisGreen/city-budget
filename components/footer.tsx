import Link from "next/link";

export const Footer = () => {
  return (
    <div className="border-t py-8 bg-card">
      <footer className="flex flex-col gap-4 py-6 w-full shrink-0 items-center px-4 md:px-6">
        <div className="flex justify-center space-x-4">
          <Link
            href="/about"
            className="text-sm text-gray-500 hover:text-gray-600"
            prefetch={false}
          >
            About
          </Link>
          <Link
            href="/compare"
            className="text-sm text-gray-500 hover:text-gray-600"
            prefetch={false}
          >
            Compare
          </Link>
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-gray-600"
            prefetch={false}
          >
            Home
          </Link>
          <Link
            href="https://docs.google.com/forms/d/e/1FAIpQLScMDDshJD5WTaYiHanzhJ_uUnqaRlkiaCSj-eCiGTFcL1-_9g/viewform?usp=dialog"
            className="text-sm text-gray-500 hover:text-gray-600"
            prefetch={false}
          >
            Feedback
          </Link>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500">
          © 2025 Budget.City - Making municipal finances easy and accessible
        </p>
        <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
          Thanks to{" "}
          <Link
            href="https://www.strongtowns.org"
            className="hover:text-gray-600 underline"
            prefetch={false}
          >
            Strong Towns
          </Link>{" "}
          and their{" "}
          <Link
            href="https://www.strongtowns.org/decoder-resources"
            className="hover:text-gray-600 underline"
            prefetch={false}
          >
            Finance Decoder
          </Link>{" "}
          for inspiring this site
        </p>
        <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
          Data sourced from Annual Comprehensive Financial Reports (ACFR),
          budgets, and other audited statements
        </p>
      </footer>
    </div>
  );
};
