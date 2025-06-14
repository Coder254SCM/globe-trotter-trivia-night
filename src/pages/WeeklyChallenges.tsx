
import { useState } from 'react';
import { WeeklyChallenges } from '@/components/quiz/WeeklyChallenges';
import Quiz from '@/components/Quiz';
import QuizResult from '@/components/QuizResult';

export default function WeeklyChallengePage() {
  const [challengeState, setChallengeState] = useState<{
    mode: 'list' | 'quiz' | 'result';
    questions?: any[];
    challengeId?: string;
    result?: any;
  }>({ mode: 'list' });

  const handleStartChallenge = (questions: any[], challengeId: string) => {
    setChallengeState({
      mode: 'quiz',
      questions,
      challengeId
    });
  };

  const handleQuizComplete = (result: any) => {
    setChallengeState({
      mode: 'result',
      result
    });
  };

  const handleBackToList = () => {
    setChallengeState({ mode: 'list' });
  };

  if (challengeState.mode === 'quiz' && challengeState.questions) {
    return (
      <Quiz
        country={null}
        questions={challengeState.questions}
        onFinish={handleQuizComplete}
        onBack={handleBackToList}
        isWeeklyChallenge={true}
        challengeId={challengeState.challengeId}
      />
    );
  }

  if (challengeState.mode === 'result' && challengeState.result) {
    return (
      <QuizResult
        result={challengeState.result}
        countryName="Weekly Challenge"
        onRestart={handleBackToList}
        onBackToGlobe={handleBackToList}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <WeeklyChallenges onStartChallenge={handleStartChallenge} />
      </div>
    </div>
  );
}
