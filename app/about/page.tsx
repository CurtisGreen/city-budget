export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          About City Budget
        </h1>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Our Mission
          </h2>
          <p className="text-gray-600 leading-relaxed">
            City Budget is dedicated to providing transparent and accessible
            financial information about municipal spending and planning.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            What We Do
          </h2>
          <p className="text-gray-600 leading-relaxed">
            We help citizens understand how their tax dollars are allocated
            across various city departments and initiatives.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Contact Us
          </h2>
          <p className="text-gray-600">
            Have questions? Reach out to us at{" "}
            <a
              href="mailto:info@citybudget.local"
              className="text-blue-600 hover:underline"
            >
              info@citybudget.local
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
