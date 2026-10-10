import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-950">
      <div className="text-center">
        <div className="p-4 rounded-xl bg-primary-600 text-white inline-block mb-4">
          <BookOpen size={32} />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          404
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          The page you're looking for doesn't exist.
        </p>
        <Link to="/" className="btn-primary">
          Go Home
        </Link>
      </div>
    </div>
  );
}
