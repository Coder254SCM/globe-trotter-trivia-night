
import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { SystemMonitor, SystemStatus, GenerationMetrics } from '../../services/monitoring/systemMonitor';
import { Activity, Database, Clock, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';

export const MonitoringDashboard = () => {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [metrics, setMetrics] = useState<GenerationMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [systemStatus, generationMetrics] = await Promise.all([
        SystemMonitor.getSystemStatus(),
        Promise.resolve(SystemMonitor.getMetrics())
      ]);
      
      setStatus(systemStatus);
      setMetrics(generationMetrics);
    } catch (error) {
      console.error('Failed to load monitoring data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'operational':
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
      case 'degraded':
      case 'slow':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-red-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'operational':
      case 'connected':
        return 'default';
      case 'warning':
      case 'degraded':
      case 'slow':
        return 'secondary';
      default:
        return 'destructive';
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!status || !metrics) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-500">
          Failed to load monitoring data
          <Button onClick={loadData} className="ml-2" size="sm">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Activity className="h-6 w-6" />
          System Monitoring
        </h2>
        <Badge variant={getStatusColor(status.overall)}>
          {status.overall.toUpperCase()}
        </Badge>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Question Generation</h3>
            {getStatusIcon(status.questionGeneration.status)}
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Success Rate</span>
              <span className="font-medium">{status.questionGeneration.successRate.toFixed(1)}%</span>
            </div>
            <Progress value={status.questionGeneration.successRate} className="h-2" />
            <div className="text-xs text-gray-600">
              Avg: {status.questionGeneration.averageTime.toFixed(0)}ms
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Database</h3>
            {getStatusIcon(status.database.status)}
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Total Questions</span>
              <span className="font-medium">{status.database.totalQuestions.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Generated Today</span>
              <span className="font-medium">{status.database.questionsToday}</span>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Generation Methods</h3>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Template</span>
              <span className="font-medium text-green-600">{metrics.methodBreakdown.template}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Fallback</span>
              <span className="font-medium text-yellow-600">{metrics.methodBreakdown.fallback}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Failed</span>
              <span className="font-medium text-red-600">{metrics.methodBreakdown.failed}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-4">
        <h3 className="font-semibold mb-4">Quick Actions</h3>
        <div className="flex gap-2 flex-wrap">
          <Button onClick={loadData} size="sm" variant="outline">
            Refresh Data
          </Button>
          <Button onClick={() => SystemMonitor.reset()} size="sm" variant="outline">
            Reset Metrics
          </Button>
        </div>
      </Card>

      {/* Last Updated */}
      <div className="text-center text-sm text-gray-500">
        Last updated: {status.lastUpdated.toLocaleTimeString()}
      </div>
    </div>
  );
};
