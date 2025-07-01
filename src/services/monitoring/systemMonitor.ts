
export interface SystemStatus {
  overall: 'healthy' | 'warning' | 'critical';
  questionGeneration: {
    status: 'operational' | 'degraded' | 'offline';
    successRate: number;
    averageTime: number;
    errorsLast24h: number;
  };
  database: {
    status: 'connected' | 'slow' | 'disconnected';
    totalQuestions: number;
    questionsToday: number;
    validationErrors: number;
  };
  lastUpdated: Date;
}

export interface GenerationMetrics {
  totalGenerated: number;
  successfulGenerations: number;
  failedGenerations: number;
  averageGenerationTime: number;
  methodBreakdown: {
    template: number;
    fallback: number;
    failed: number;
  };
}

export class SystemMonitor {
  private static metrics: GenerationMetrics = {
    totalGenerated: 0,
    successfulGenerations: 0,
    failedGenerations: 0,
    averageGenerationTime: 0,
    methodBreakdown: {
      template: 0,
      fallback: 0,
      failed: 0
    }
  };

  static recordGeneration(
    method: 'template' | 'fallback' | 'failed',
    timeTaken: number,
    questionsGenerated: number
  ): void {
    this.metrics.totalGenerated += questionsGenerated;
    this.metrics.methodBreakdown[method] += questionsGenerated;
    
    if (method !== 'failed') {
      this.metrics.successfulGenerations += questionsGenerated;
      // Update rolling average
      const totalTime = this.metrics.averageGenerationTime * (this.metrics.successfulGenerations - questionsGenerated);
      this.metrics.averageGenerationTime = (totalTime + timeTaken) / this.metrics.successfulGenerations;
    } else {
      this.metrics.failedGenerations += 1;
    }
  }

  static getMetrics(): GenerationMetrics {
    return { ...this.metrics };
  }

  static async getSystemStatus(): Promise<SystemStatus> {
    const successRate = this.metrics.totalGenerated > 0 
      ? (this.metrics.successfulGenerations / this.metrics.totalGenerated) * 100 
      : 100;

    return {
      overall: successRate > 90 ? 'healthy' : successRate > 70 ? 'warning' : 'critical',
      questionGeneration: {
        status: successRate > 95 ? 'operational' : successRate > 80 ? 'degraded' : 'offline',
        successRate,
        averageTime: this.metrics.averageGenerationTime,
        errorsLast24h: this.metrics.failedGenerations
      },
      database: {
        status: 'connected', // Would check actual DB status in production
        totalQuestions: this.metrics.totalGenerated,
        questionsToday: this.metrics.successfulGenerations,
        validationErrors: this.metrics.failedGenerations
      },
      lastUpdated: new Date()
    };
  }

  static reset(): void {
    this.metrics = {
      totalGenerated: 0,
      successfulGenerations: 0,
      failedGenerations: 0,
      averageGenerationTime: 0,
      methodBreakdown: {
        template: 0,
        fallback: 0,
        failed: 0
      }
    };
  }
}
