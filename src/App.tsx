
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/ui/error-boundary";

// Enhanced loading component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-background">
    <div className="text-center space-y-4">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
      <p className="text-muted-foreground">Loading Global Quiz Game...</p>
    </div>
  </div>
);

// Error fallback for dynamic imports
const ImportErrorFallback = ({ error, resetErrorBoundary }: any) => (
  <div className="flex items-center justify-center min-h-screen bg-background">
    <div className="text-center space-y-4 max-w-md">
      <h1 className="text-2xl font-bold text-destructive">Loading Error</h1>
      <p className="text-muted-foreground">
        Failed to load page component. This might be due to a network issue or build problem.
      </p>
      <div className="space-x-2">
        <button 
          onClick={resetErrorBoundary}
          className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
        >
          Try Again
        </button>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/90"
        >
          Reload Page
        </button>
      </div>
      <details className="text-left text-sm text-muted-foreground">
        <summary>Error Details</summary>
        <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
          {error?.message || 'Unknown error'}
        </pre>
      </details>
    </div>
  </div>
);

// Lazy load components with better error handling
const lazyImport = (importFn: () => Promise<any>, componentName: string) => {
  return lazy(async () => {
    try {
      console.log(`📦 Loading component: ${componentName}`);
      const module = await importFn();
      console.log(`✅ Successfully loaded: ${componentName}`);
      return module;
    } catch (error) {
      console.error(`❌ Failed to load ${componentName}:`, error);
      // Return a fallback component
      return {
        default: () => (
          <ImportErrorFallback 
            error={error} 
            resetErrorBoundary={() => window.location.reload()} 
          />
        )
      };
    }
  });
};

// Lazy load all pages with enhanced error handling
const Index = lazyImport(() => import("./pages/Index"), "Index");
const Auth = lazyImport(() => import("./pages/Auth"), "Auth");
const Admin = lazyImport(() => import("./pages/Admin"), "Admin");
const UltimateQuiz = lazyImport(() => import("./pages/UltimateQuiz"), "UltimateQuiz");
const WeeklyChallenges = lazyImport(() => import("./pages/WeeklyChallenges"), "WeeklyChallenges");
const QuestionValidation = lazyImport(() => import("./pages/QuestionValidation"), "QuestionValidation");
const QuestionAudit = lazyImport(() => import("./pages/QuestionAudit"), "QuestionAudit");
const ComprehensiveAudit = lazyImport(() => import("./pages/ComprehensiveAudit"), "ComprehensiveAudit");
const EasyQuestions = lazyImport(() => import("./pages/EasyQuestions"), "EasyQuestions");
const MediumQuestions = lazyImport(() => import("./pages/MediumQuestions"), "MediumQuestions");
const HardQuestions = lazyImport(() => import("./pages/HardQuestions"), "HardQuestions");
const ManualHardQuestions = lazyImport(() => import("./pages/ManualHardQuestions"), "ManualHardQuestions");
const Moderation = lazyImport(() => import("./pages/Moderation"), "Moderation");
const QuizSettings = lazyImport(() => import("./pages/QuizSettings"), "QuizSettings");
const QuizPage = lazyImport(() => import("./pages/QuizPage"), "QuizPage");
const QuizResults = lazyImport(() => import("./pages/QuizResults"), "QuizResults");
const NotFound = lazyImport(() => import("./pages/NotFound"), "NotFound");

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-background font-sans antialiased">
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/quiz-settings" element={<QuizSettings />} />
                  <Route path="/quiz" element={<QuizPage />} />
                  <Route path="/quiz-results" element={<QuizResults />} />
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
    </ErrorBoundary>
  );
}

export default App;
