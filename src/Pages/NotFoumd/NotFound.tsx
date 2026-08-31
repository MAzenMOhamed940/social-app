import { Link } from "react-router";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full bg-[#E8F5E9] flex flex-col items-center justify-center px-4 font-sans">
      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="text-9xl font-black text-main-color tracking-tight animate-bounce">
          404
        </h1>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight sm:text-3xl">
            Page not found
          </h2>
          <p className="text-base text-gray-500 max-w-xs mx-auto leading-relaxed">
            Sorry, we couldn’t find the page you’re looking for. It might have been moved or deleted.
          </p>
        </div>

        <div>
          <Link to="/posts" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-bold rounded-xl text-white bg-main-color hover:bg-green-500 shadow-sm transition-colors duration-200">
            Go back home
          </Link>
        </div>
      </div>
    </div>
  )
}
