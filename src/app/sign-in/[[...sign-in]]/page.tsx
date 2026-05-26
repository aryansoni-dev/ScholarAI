import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-transparent to-indigo-900/10 pointer-events-none" />
      <SignIn />
    </div>
  );
}
