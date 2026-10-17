import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center bg-white text-gray-900">
      <div className="space-y-4 max-w-md">
        <span className="text-6xl font-black text-red-600 block">404</span>
        <h1 className="text-2xl font-extrabold text-gray-950">Page Not Found</h1>
        <p className="text-sm text-gray-600 leading-relaxed">
          The lighting fixture, category, or page you are looking for does not exist or has been moved to a new catalog location.
        </p>
        <div className="pt-4 flex items-center justify-center gap-3">
          <Link
            href="/"
            className="bg-black hover:bg-neutral-800 text-white font-bold px-6 py-2.5 rounded-lg text-sm transition-colors shadow-xs"
          >
            Back to Home
          </Link>
          <Link
            href="/collections/all"
            className="border border-gray-300 hover:border-gray-900 text-gray-900 font-bold px-6 py-2.5 rounded-lg text-sm transition-colors"
          >
            Browse All Products
          </Link>
        </div>
      </div>
    </div>
  );
}
