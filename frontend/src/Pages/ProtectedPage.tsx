import { useEffect, useState, type ReactNode} from "react";
import { useNavigate } from "react-router";

type ProtectedPageProps = {
  children: ReactNode;
};

export function ProtectedPage({ children }: ProtectedPageProps) {
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/authentication", { replace: true });
    } else {
      setChecking(false);
    }
  }, [navigate]);

  if (checking) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50 text-gray-600">
        <span className="text-lg font-medium">Checking authentication...</span>
      </div>
    );
  }

  return <>{children}</>;
}