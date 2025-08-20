import { Link } from "react-router-dom";

const NotFound = ({ link }) => {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh] bg-gray-100">
      <h1 className="text-4xl font-extrabold mb-4">404 - Page Not Found</h1>
      <p className="text-gray-600 mb-4">
        Sorry, the page you're looking for doesn't exist.
      </p>
      <Link to={link} className="text-blue-500 underline">
        Go Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
