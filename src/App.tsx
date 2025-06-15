
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

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/quiz-settings" element={<QuizSettings />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/quiz-results" element={<QuizResults />} />
          <Route path="/weekly-challenges" element={<WeeklyChallenges />} />
          <Route path="/ultimate-quiz" element={<UltimateQuiz />} />
          <Route path="/question-validation" element={<QuestionValidation />} />
          <Route path="/production-dashboard" element={<ProductionDashboard />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
