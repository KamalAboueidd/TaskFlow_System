import { useNavigate } from "react-router-dom";
import usePageTitle from "../hooks/usePageTitle";

function NotFound() {
  const navigate = useNavigate();
  usePageTitle("404 Not Found");

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold">404</h1>

      <button
        onClick={() => navigate("/app/dashboard")}
        className="mt-4 bg-primary px-4 py-2 rounded-xl"
      >
        Go Back
      </button>
    </div>
  );
}

export default NotFound;