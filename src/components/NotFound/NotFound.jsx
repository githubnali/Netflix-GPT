import { Link } from "react-router-dom";
import useDocumentTitle from "../../hooks/useDocumentTitle";

const NotFound = () => {
  useDocumentTitle("Netflix+GPT | Page Not Found");

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-black px-4 text-center text-white">
      <p className="text-2xl font-bold text-red-600 sm:text-3xl">Netflix+GPT</p>
      <h1 className="text-lg font-semibold sm:text-xl">Lost your way?</h1>
      <p className="max-w-sm text-sm text-white/70 sm:text-base">
        Sorry, we can't find that page. You'll find lots to explore back on the home page.
      </p>
      <Link
        to="/"
        className="mt-2 cursor-pointer rounded bg-red-600 px-6 py-2.5 font-semibold text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
      >
        Netflix+GPT Home
      </Link>
    </div>
  )
}

export default NotFound
