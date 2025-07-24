import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import Index from "./pages/Index";
import QuizPage from "./pages/QuizPage";
import QuizSettings from "./pages/QuizSettings";
import QuizResults from "./pages/QuizResults";
import WeeklyChallenges from "./pages/WeeklyChallenges";
import UltimateQuiz from "./pages/UltimateQuiz";
import QuestionValidation from "./pages/QuestionValidation";
import ProductionDashboard from "./pages/ProductionDashboard";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import Moderation from "./pages/Moderation";
import QuestionAudit from "./pages/QuestionAudit";
import EasyQuestions from "./pages/EasyQuestions";
import MediumQuestions from "./pages/MediumQuestions";
import ManualHardQuestions from "./pages/ManualHardQuestions";
import ComprehensiveAudit from "./pages/ComprehensiveAudit";
import { AutoInitializer } from "./components/initialization/AutoInitializer";
import { useAuth } from "./hooks/useAuth";
import { AdminGuard, ModeratorGuard } from "./components/auth/AuthGuard";

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <div className="min-h-screen bg-background">
        {/* Auto-initialize database on app start */}
        <AutoInitializer />
        
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/quiz-settings" element={<QuizSettings />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/quiz-results" element={<QuizResults />} />
          <Route path="/weekly-challenges" element={<WeeklyChallenges />} />
          <Route path="/ultimate-quiz" element={<UltimateQuiz />} />
          
          {/* Admin Protected Routes */}
          <Route path="/admin" element={<AdminGuard><Admin /></AdminGuard>} />
          <Route path="/admin/easy-questions" element={<AdminGuard><EasyQuestions /></AdminGuard>} />
          <Route path="/admin/medium-questions" element={<AdminGuard><MediumQuestions /></AdminGuard>} />
          <Route path="/admin/manual-hard-questions" element={<AdminGuard><ManualHardQuestions /></AdminGuard>} />
          <Route path="/admin/question-audit" element={<AdminGuard><QuestionAudit /></AdminGuard>} />
          <Route path="/admin/comprehensive-audit" element={<AdminGuard><ComprehensiveAudit /></AdminGuard>} />
          <Route path="/question-validation" element={<AdminGuard><QuestionValidation /></AdminGuard>} />
          <Route path="/production-dashboard" element={<AdminGuard><ProductionDashboard /></AdminGuard>} />
          
          {/* Moderator Protected Routes */}
          <Route path="/admin/moderation" element={<ModeratorGuard><Moderation /></ModeratorGuard>} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;