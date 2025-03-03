import { useAuth } from "./provider/authProvider";
import { useRouter } from "next/navigation";

const LogOutButton = () => {
  const { logout } = useAuth(); 
  const router = useRouter();

  const handleLogout = () => {
    logout(); // ✅ Clear authentication
    console.log("📦 Token after logout:", localStorage.getItem("token"));
    router.push("/");
  };

  return (
    <button
      onClick={handleLogout}
      style={{ backgroundColor: "lightskyblue", color: "white" }}
      className="px-6 py-3 text-lg font-semibold rounded-lg shadow-md transition-all duration-300 hover:bg-blue-500 hover:scale-105 active:scale-95 drop-shadow-lg"
    >
      ← Log Out
    </button>
  );
};

export default LogOutButton;