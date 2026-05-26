import Link from "next/link";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Brain,
  Sparkles,
  MessageSquare,
  FileText,
  Zap,
  ArrowRight,
  Star,
} from "lucide-react";

export default async function LandingPage() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-surface text-on-surface overflow-x-hidden selection:bg-primary/30 selection:text-white">
      {/* ── Nav ── */}
      <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-4 md:px-6 py-3 md:py-4 bg-surface-container-low/80 backdrop-blur-md border-b border-white/[0.06]">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-container to-secondary-container flex items-center justify-center shadow-lg shadow-primary/20 transition-transform duration-200 group-hover:scale-110">
            <Brain className="w-4 h-4 text-on-primary" />
          </div>
          <span className="font-bold text-lg tracking-tight text-on-surface">ScholarAI</span>
        </Link>
        <div className="flex items-center gap-2 md:gap-3">
          <SignInButton mode="modal">
            <button className="text-on-surface-variant hover:text-on-surface text-xs md:text-sm px-2.5 md:px-4 font-medium transition-colors">
              Sign in
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="btn-primary-glow text-white text-xs md:text-sm px-4 md:px-5 py-2 rounded-xl font-medium">
              Get Started<span className="hidden sm:inline"> Free</span>
            </button>
          </SignUpButton>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative flex flex-col items-center justify-center text-center pt-32 sm:pt-40 pb-20 sm:pb-24 px-4 animate-fade-up">
        {/* Background glow */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[90%] sm:w-[700px] h-[300px] sm:h-[400px] bg-primary/20 rounded-full blur-[100px] sm:blur-[120px] pointer-events-none animate-glow-pulse" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs sm:text-sm font-semibold tracking-wide uppercase mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          Powered by Google Gemini AI
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl mx-auto leading-tight text-on-surface">
          Study Smarter with{" "}
          <span className="text-gradient-hero">
            AI at Your Side
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
          Upload your PDFs, notes, and slides. Ask questions, get instant
          summaries, generate quizzes and flashcards — all powered by AI.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto px-4 sm:px-0 relative z-10">
          <SignUpButton mode="modal">
            <button className="btn-primary-glow flex items-center justify-center gap-2 text-white px-8 py-3.5 rounded-xl text-base font-semibold w-full sm:w-auto transition-transform hover:-translate-y-0.5">
              Start Studying Free <ArrowRight className="w-4 h-4" />
            </button>
          </SignUpButton>
          <SignInButton mode="modal">
            <button className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-base font-semibold w-full sm:w-auto text-on-surface-variant border border-white/[0.08] hover:bg-white/[0.04] hover:text-on-surface transition-all">
              Sign In
            </button>
          </SignInButton>
        </div>

        {/* Trust badges */}
        <div className="mt-14 flex flex-wrap justify-center items-center gap-x-6 gap-y-3 text-on-surface-variant/70 text-xs sm:text-sm font-medium">
          {["No credit card required", "Free forever plan", "Built with Gemini"].map((item) => (
            <div key={item} className="flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 fill-primary text-primary" />
              {item}
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-24 px-4 bg-surface-container-lowest/50 relative border-y border-white/[0.02]">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="text-3xl sm:text-4xl font-bold text-on-surface">
              Everything you need to learn faster
            </h2>
            <p className="mt-4 text-on-surface-variant max-w-xl mx-auto">
              One platform to manage all your study materials and leverage AI to
              understand them deeply.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: MessageSquare,
                color: "bg-gradient-feature-1",
                title: "AI Chat Q&A",
                desc: "Ask any question about your materials and get instant, accurate answers with context.",
              },
              {
                icon: FileText,
                color: "bg-gradient-feature-2",
                title: "Summarization",
                desc: "Get concise, structured summaries of long documents in seconds.",
              },
              {
                icon: Zap,
                color: "bg-gradient-feature-3",
                title: "Quiz Generator",
                desc: "Auto-generate MCQ quizzes from any material to test your knowledge.",
              },
              {
                icon: BookOpen,
                color: "bg-gradient-feature-4",
                title: "Flashcards",
                desc: "Create study flashcards instantly from key concepts in your documents.",
              },
            ].map(({ icon: Icon, color, title, desc }, i) => (
              <div
                key={title}
                className="glass-interactive rounded-2xl p-6 group animate-fade-up"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div
                  className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-5 shadow-[0_4px_16px_rgba(0,0,0,0.4)] group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-on-surface mb-2.5 text-lg">{title}</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-24 px-4 bg-surface">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-on-surface">
            Get started in 3 simple steps
          </h2>
          <p className="text-on-surface-variant mb-16">No setup, no complexity — just results.</p>

          <div className="grid sm:grid-cols-3 gap-10 sm:gap-8 relative">
            {/* Connecting line (desktop) */}
            <div className="hidden sm:block absolute top-12 left-1/6 right-1/6 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent z-0" />
            
            {[
              { step: "01", title: "Create an account", desc: "Sign up for free with your email or social account." },
              { step: "02", title: "Upload materials", desc: "Add your PDFs, notes, slides, and diagrams to your knowledge base." },
              { step: "03", title: "Start learning", desc: "Chat, quiz yourself, get summaries and flashcards with one click." },
            ].map(({ step, title, desc }, i) => (
              <div key={step} className="flex flex-col items-center text-center relative z-10 animate-fade-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="w-24 h-24 rounded-full glass-pane flex items-center justify-center mb-6 shadow-xl relative overflow-hidden group">
                  <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="text-3xl font-bold text-gradient-step">
                    {step}
                  </span>
                </div>
                <h3 className="font-semibold text-on-surface mb-2 text-lg">{title}</h3>
                <p className="text-sm text-on-surface-variant max-w-[200px]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 sm:py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-pane rounded-3xl p-10 sm:p-16 relative overflow-hidden group">
            {/* Ambient inner glows */}
            <div className="absolute -top-32 -left-32 w-64 h-64 bg-primary/20 rounded-full blur-[80px] pointer-events-none group-hover:bg-primary/30 transition-colors duration-500" />
            <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-secondary/20 rounded-full blur-[80px] pointer-events-none group-hover:bg-secondary/30 transition-colors duration-500" />
            
            <h2 className="text-3xl sm:text-4xl font-bold mb-5 relative z-10 text-on-surface">
              Ready to level up your studies?
            </h2>
            <p className="text-on-surface-variant text-base sm:text-lg mb-10 relative z-10 max-w-xl mx-auto">
              Join students who are already studying smarter with AI. Connect your materials and unlock your learning potential.
            </p>
            <div className="relative z-10 flex justify-center">
              <SignUpButton mode="modal">
                <button className="btn-primary-glow flex items-center justify-center gap-2 text-white px-10 py-4 rounded-xl text-lg font-semibold w-full sm:w-auto transition-transform hover:-translate-y-0.5 shadow-2xl">
                  Get Started — It&apos;s Free <ArrowRight className="w-5 h-5" />
                </button>
              </SignUpButton>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/[0.04] py-10 px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-4 opacity-50 hover:opacity-100 transition-opacity">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-primary-container to-secondary-container flex items-center justify-center">
            <Brain className="w-3.5 h-3.5 text-on-primary" />
          </div>
          <span className="font-semibold text-on-surface text-sm tracking-wide">ScholarAI</span>
        </div>
        <p className="text-on-surface-variant/40 text-xs font-medium">© 2026 ScholarAI. All rights reserved.</p>
      </footer>
    </div>
  );
}
