interface QuizAnalytics {
  sessionId: string;
  userId?: string;
  country: string;
  difficulty: string;
  score: number;
  timeTaken: number;
  questionsAnswered: number;
  correctAnswers: number;
  timestamp: Date;
  language: string;
}

interface UserBehavior {
  event: string;
  data: Record<string, any>;
  timestamp: Date;
  sessionId: string;
  userId?: string;
}

class AnalyticsManager {
  private sessionId: string;
  private userId?: string;
  private events: UserBehavior[] = [];

  constructor() {
    this.sessionId = this.generateSessionId();
    this.loadUserId();
  }

  private generateSessionId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private loadUserId(): void {
    const stored = localStorage.getItem('quiz_user_id');
    if (stored) {
      this.userId = stored;
    }
  }

  setUserId(userId: string): void {
    this.userId = userId;
    localStorage.setItem('quiz_user_id', userId);
  }

  trackQuizCompletion(analytics: Omit<QuizAnalytics, 'sessionId' | 'userId' | 'timestamp'>): void {
    const data: QuizAnalytics = {
      ...analytics,
      sessionId: this.sessionId,
      userId: this.userId,
      timestamp: new Date()
    };

    this.trackEvent('quiz_completed', data);
    this.sendAnalytics(data);
  }

  trackEvent(event: string, data: Record<string, any>): void {
    const behaviorEvent: UserBehavior = {
      event,
      data,
      timestamp: new Date(),
      sessionId: this.sessionId,
      userId: this.userId
    };

    this.events.push(behaviorEvent);
    
    // Store locally for offline tracking
    this.storeEventLocally(behaviorEvent);
    
    console.log('Analytics Event:', event, data);
  }

  private storeEventLocally(event: UserBehavior): void {
    const stored = localStorage.getItem('quiz_analytics_events') || '[]';
    const events = JSON.parse(stored);
    events.push(event);
    
    // Keep only last 100 events to prevent storage bloat
    if (events.length > 100) {
      events.splice(0, events.length - 100);
    }
    
    localStorage.setItem('quiz_analytics_events', JSON.stringify(events));
  }

  private sendAnalytics(data: QuizAnalytics): void {
    // In a real implementation, this would send to your analytics service
    // For now, we'll just log and store locally
    console.log('Quiz Analytics:', data);
    
    const stored = localStorage.getItem('quiz_analytics') || '[]';
    const analytics = JSON.parse(stored);
    analytics.push(data);
    localStorage.setItem('quiz_analytics', JSON.stringify(analytics));
  }

  getAnalyticsSummary(): {
    totalQuizzes: number;
    averageScore: number;
    topCountries: Array<{country: string; count: number}>;
    preferredDifficulty: string;
  } {
    const stored = localStorage.getItem('quiz_analytics') || '[]';
    const analytics: QuizAnalytics[] = JSON.parse(stored);

    if (analytics.length === 0) {
      return {
        totalQuizzes: 0,
        averageScore: 0,
        topCountries: [],
        preferredDifficulty: 'medium'
      };
    }

    const totalQuizzes = analytics.length;
    const averageScore = analytics.reduce((sum, a) => sum + a.score, 0) / totalQuizzes;
    
    const countryCount = analytics.reduce((acc, a) => {
      acc[a.country] = (acc[a.country] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topCountries = Object.entries(countryCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([country, count]) => ({ country, count }));

    const difficultyCount = analytics.reduce((acc, a) => {
      acc[a.difficulty] = (acc[a.difficulty] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const preferredDifficulty = Object.entries(difficultyCount)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'medium';

    return {
      totalQuizzes,
      averageScore: Math.round(averageScore),
      topCountries,
      preferredDifficulty
    };
  }
}

export const analytics = new AnalyticsManager();
