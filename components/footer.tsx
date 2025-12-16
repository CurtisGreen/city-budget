import Link from "next/link";

export const Footer = () => (
  <footer className="border-t py-8 bg-card">
    <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
      <p>Budget.City - Making municipal finances easy and accessible</p>
      <p className="mt-2">
        Thanks to Strong Towns and their Finance Decoder for inspiring this site
      </p>
      <p className="mt-2">
        Data sourced from Annual Comprehensive Financial Reports and other
        audited statements
      </p>
    </div>
  </footer>
);

export const TestFooter = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
      <footer className="flex flex-col gap-4 py-6 w-full shrink-0 items-center px-4 md:px-6">
        {/* <div className="flex justify-center space-x-6">
          <Link
            href="#"
            className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
            prefetch={false}
          >
            <FacebookIcon className="h-6 w-6" />
          </Link>
          <Link
            href="#"
            className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
            prefetch={false}
          >
            <TwitterIcon className="h-6 w-6" />
          </Link>
          <Link
            href="#"
            className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
            prefetch={false}
          >
            <InstagramIcon className="h-6 w-6" />
          </Link>
        </div> */}
        <div className="flex justify-center space-x-4">
          <Link
            href="#"
            className="text-sm text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
            prefetch={false}
          >
            About
          </Link>
          <Link
            href="#"
            className="text-sm text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
            prefetch={false}
          >
            Contact
          </Link>
          <Link
            href="#"
            className="text-sm text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
            prefetch={false}
          >
            Careers
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
          Data sourced from Annual Comprehensive Financial Reports and other
          audited statements
        </p>
      </footer>
    </div>
  );
};
