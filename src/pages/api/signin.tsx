/* import { useEffect } from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { app } from "@/lib/firebase"; // this might be '@/firebase' or '@/utils/firebase'
import { useRouter } from "next/router";

export default function SignInPage() {
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      const auth = getAuth(app);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push("/"); // after login, go to homepage
    } catch (error) {
      console.error("Sign-in error:", error);
    }
  };

  useEffect(() => {
    handleSignIn();
  }, []);

  return <p>Signing you in with Google...</p>;
}
\
