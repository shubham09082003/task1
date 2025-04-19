import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button"
import { UserAuth } from "../context/AuthContext"
import Todo from "../components/Todo"
import { useEffect } from "react";

export default function DashboardPage() {
  const { session , signOut } = UserAuth();
  const navigate = useNavigate()
  console.log(session);
  useEffect (() => {
    if (!session) {
      navigate("/login");
    }
  }, [session, navigate]);

  const handleSignOut = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      await signOut();
      navigate("/login");
    }
    catch(err){
      console.log(err);
    }
  }

  if(session === null) return null;

  return (
    <div className="min-h-screen p-8">
      <div className="flex justify-end mb-4">
        <Button onClick={handleSignOut} className="bg-black" variant="outline">
          SignOut
        </Button>
      </div>
      <Todo />
    </div>
  )
}

