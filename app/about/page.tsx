import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { LogoButton } from "@/components/ui/logo-button";
import Link from "next/link";

export default function About() {
  return (
    // Header
    <div>
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <LogoButton />
            <nav className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" className="cursor-pointer">
                  Home
                </Button>
              </Link>
              <Link href="/compare">
                <Button variant="ghost" className="cursor-pointer">
                  Compare Cities
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="ghost" className="cursor-pointer">
                  About
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto mt-10 min-h-screen">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          About Budget.City
        </h1>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Origin</h2>
          <p className="text-gray-600 leading-relaxed">
            Budget.City is intended to make municipal finances more accessible
            for Dallas area cities. It's inspired by the{" "}
            <Link
              href="https://www.strongtowns.org/finance-decoder"
              className="text-blue-600 hover:underline"
            >
              Strong Towns Finance Decoder
            </Link>
            , which I used for several cities and then decided I wanted a way to
            add and compare them more easily.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            How it works
          </h2>
          <p className="text-gray-600 leading-relaxed">
            The majority of the information is taken directly from each city's
            Annual Comprehensive Financial Report (ACFR). You can find these
            easily by just searching [City Name] ACFR. I went through hundreds
            of pages of these documents to collect the data presented here. I
            double checked everything, but because of tedious data entry it's
            possible there are mistakes. Please contact me through github if you
            find any issues.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Contact Me
          </h2>
          <p className="text-gray-600 mb-2">
            Create an issue on my{" "}
            <Link
              href="https://github.com/CurtisGreen/city-budget"
              className="text-blue-600 hover:underline"
            >
              github page
            </Link>{" "}
            if you need to get in touch.
          </p>
          <p className="text-gray-600">
            If you have a Dallas area city you want to add, fill out the{" "}
            <Link
              href="https://www.strongtowns.org/finance-decoder"
              className="text-blue-600 hover:underline"
            >
              Strong Towns Finance Decoder
            </Link>{" "}
            and then send it to me. If you want to add a non-Dallas area city
            then feel free to fork my github repo and create a new site for your
            own region. Please make sure to credit me and link back to this site
            and github page.
          </p>
        </section>
      </div>
      <Footer />
    </div>
  );
}
