
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import Auth from "./pages/Auth";
import HardQuestions from "./pages/HardQuestions";
import MediumQuestions from "./pages/MediumQuestions";
import ManualHardQuestions from "./pages/ManualHardQuestions";
import QuestionAudit from "./pages/QuestionAudit";
import ComprehensiveAudit from "./pages/ComprehensiveAudit";
import Moderation from "./pages/Moderation";
import WeeklyChallenges from "./pages/WeeklyChallenges";
import UltimateQuiz from "./pages/UltimateQuiz";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/medium-questions" element={<MediumQuestions />} />
              <Route path="/admin/hard-questions" element={<HardQuestions />} />
              <Route path="/admin/manual-hard-questions" element={<ManualHardQuestions />} />
              <Route path="/admin/question-audit" element={<QuestionAudit />} />
              <Route path="/comprehensive-audit" element={<ComprehensiveAudit />} />
              <Route path="/admin/moderation" element={<Moderation />} />
              <Route path="/weekly-challenges" element={<WeeklyChallenges />} />
              <Route path="/ultimate-quiz" element={<UltimateQuiz />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
