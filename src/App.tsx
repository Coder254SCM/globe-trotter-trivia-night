
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Lazy load components for better performance
const Index = lazy(() => import("./pages/Index"));
const Auth = lazy(() => import("./pages/Auth"));
const Admin = lazy(() => import("./pages/Admin"));
const UltimateQuiz = lazy(() => import("./pages/UltimateQuiz"));
const WeeklyChallenges = lazy(() => import("./pages/WeeklyChallenges"));
const QuestionValidation = lazy(() => import("./pages/QuestionValidation"));
const QuestionAudit = lazy(() => import("./pages/QuestionAudit"));
const ComprehensiveAudit = lazy(() => import("./pages/ComprehensiveAudit"));
const EasyQuestions = lazy(() => import("./pages/EasyQuestions"));
const MediumQuestions = lazy(() => import("./pages/MediumQuestions"));
const HardQuestions = lazy(() => import("./pages/HardQuestions"));
const ManualHardQuestions = lazy(() => import("./pages/ManualHardQuestions"));
const Moderation = lazy(() => import("./pages/Moderation"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-background font-sans antialiased">
            <Suspense fallback={
              <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
              </div>
            }>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/ultimate-quiz" element={<UltimateQuiz />} />
                <Route path="/weekly-challenges" element={<WeeklyChallenges />} />
                <Route path="/question-validation" element={<QuestionValidation />} />
                <Route path="/question-audit" element={<QuestionAudit />} />
                <Route path="/comprehensive-audit" element={<ComprehensiveAudit />} />
                <Route path="/easy-questions" element={<EasyQuestions />} />
                <Route path="/medium-questions" element={<MediumQuestions />} />
                <Route path="/hard-questions" element={<HardQuestions />} />
                <Route path="/manual-hard-questions" element={<ManualHardQuestions />} />
                <Route path="/moderation" element={<Moderation />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
            <Toaster />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
