
import { performGlobalAudit, generateAuditReport } from './questionAudit';
import countries from '../../data/countries';

interface ProductionReadinessCheck {
  category: string;
  status: 'pass' | 'warning' | 'fail';
  message: string;
  priority: 'high' | 'medium' | 'low';
}

interface ProductionAuditResult {
  isProductionReady: boolean;
  overallScore: number;
  checks: ProductionReadinessCheck[];
  criticalIssues: string[];
  recommendations: string[];
  auditSummary: {
    totalCountries: number;
    questionsPerCountry: number;
    averageRelevanceScore: number;
    brokenImages: number;
    duplicateQuestions: number;
  };
}

export const runProductionReadinessAudit = async (): Promise<ProductionAuditResult> => {
  console.log("🚀 Running production readiness audit...");
  
  const checks: ProductionReadinessCheck[] = [];
  const criticalIssues: string[] = [];
  const recommendations: string[] = [];
  
  // Run question audit first
  const questionAudit = await performGlobalAudit();
  
  // Check 1: Country Coverage
  const countryCount = countries.length;
  const expectedMinCountries = 195; // UN recognized countries
  
  if (countryCount >= expectedMinCountries) {
    checks.push({
      category: "Country Coverage",
      status: "pass",
      message: `${countryCount} countries available (target: ${expectedMinCountries})`,
      priority: "high"
    });
  } else {
    checks.push({
      category: "Country Coverage",
      status: "fail",
      message: `Only ${countryCount} countries available, need ${expectedMinCountries}`,
      priority: "high"
    });
    criticalIssues.push(`Missing ${expectedMinCountries - countryCount} countries`);
  }
  
  // Check 2: Question Quality
  const relevanceThreshold = 80;
  if (questionAudit.overallRelevanceScore >= relevanceThreshold) {
    checks.push({
      category: "Question Relevance",
      status: "pass",
      message: `${questionAudit.overallRelevanceScore.toFixed(1)}% relevance score (target: ${relevanceThreshold}%)`,
      priority: "high"
    });
  } else {
    checks.push({
      category: "Question Relevance",
      status: "fail",
      message: `${questionAudit.overallRelevanceScore.toFixed(1)}% relevance score, below ${relevanceThreshold}%`,
      priority: "high"
    });
    criticalIssues.push("Poor question relevance scores");
  }
  
  // Check 3: Question Coverage
  const minQuestionsPerCountry = 5;
  const avgQuestionsPerCountry = questionAudit.totalQuestions / questionAudit.countriesWithQuestions;
  
  if (avgQuestionsPerCountry >= minQuestionsPerCountry) {
    checks.push({
      category: "Question Coverage",
      status: "pass",
      message: `${avgQuestionsPerCountry.toFixed(1)} questions per country on average`,
      priority: "medium"
    });
  } else {
    checks.push({
      category: "Question Coverage",
      status: "warning",
      message: `Only ${avgQuestionsPerCountry.toFixed(1)} questions per country, need ${minQuestionsPerCountry}`,
      priority: "medium"
    });
    recommendations.push("Generate more questions for countries with low coverage");
  }
  
  // Check 4: Broken Images
  if (questionAudit.brokenImages === 0) {
    checks.push({
      category: "Image Assets",
      status: "pass",
      message: "All question images are accessible",
      priority: "medium"
    });
  } else {
    checks.push({
      category: "Image Assets",
      status: "warning",
      message: `${questionAudit.brokenImages} broken image references found`,
      priority: "medium"
    });
    recommendations.push(`Fix ${questionAudit.brokenImages} broken image URLs`);
  }
  
  // Check 5: Duplicate Questions
  if (questionAudit.duplicateQuestions === 0) {
    checks.push({
      category: "Content Uniqueness",
      status: "pass",
      message: "No duplicate questions detected",
      priority: "low"
    });
  } else {
    checks.push({
      category: "Content Uniqueness",
      status: "warning",
      message: `${questionAudit.duplicateQuestions} duplicate questions found`,
      priority: "low"
    });
    recommendations.push("Remove duplicate questions to improve variety");
  }
  
  // Check 6: Category Distribution
  const categoryDistribution = questionAudit.categoryResults;
  const poorCategories = categoryDistribution.filter(cat => cat.accuracy < 70);
  
  if (poorCategories.length === 0) {
    checks.push({
      category: "Category Quality",
      status: "pass",
      message: "All categories have good question accuracy",
      priority: "medium"
    });
  } else {
    checks.push({
      category: "Category Quality",
      status: "warning",
      message: `${poorCategories.length} categories have poor accuracy`,
      priority: "medium"
    });
    recommendations.push(`Improve questions for categories: ${poorCategories.map(c => c.category).join(', ')}`);
  }
  
  // Check 7: Database Setup
  checks.push({
    category: "Database",
    status: "fail",
    message: "Using static files instead of scalable database",
    priority: "high"
  });
  criticalIssues.push("No database setup for production scalability");
  recommendations.push("Integrate Supabase for scalable data storage");
  
  // Check 8: Performance Optimization
  checks.push({
    category: "Performance",
    status: "warning",
    message: "No caching layer implemented",
    priority: "medium"
  });
  recommendations.push("Implement question caching for better performance");
  
  // Check 9: User Management
  checks.push({
    category: "User Management",
    status: "fail",
    message: "No user authentication system",
    priority: "high"
  });
  criticalIssues.push("No user management system for production use");
  
  // Check 10: Analytics
  checks.push({
    category: "Analytics",
    status: "warning",
    message: "Basic console logging only",
    priority: "low"
  });
  recommendations.push("Implement comprehensive analytics tracking");
  
  // Calculate overall score
  const passCount = checks.filter(c => c.status === 'pass').length;
  const totalChecks = checks.length;
  const overallScore = (passCount / totalChecks) * 100;
  
  const isProductionReady = criticalIssues.length === 0 && overallScore >= 80;
  
  return {
    isProductionReady,
    overallScore,
    checks,
    criticalIssues,
    recommendations,
    auditSummary: {
      totalCountries: questionAudit.totalCountries,
      questionsPerCountry: Math.round(avgQuestionsPerCountry),
      averageRelevanceScore: questionAudit.overallRelevanceScore,
      brokenImages: questionAudit.brokenImages,
      duplicateQuestions: questionAudit.duplicateQuestions
    }
  };
};

export const generateProductionReport = async (): Promise<string> => {
  const audit = await runProductionReadinessAudit();
  const questionReport = await generateAuditReport();
  
  const statusEmoji = (status: string) => {
    switch (status) {
      case 'pass': return '✅';
      case 'warning': return '⚠️';
      case 'fail': return '❌';
      default: return '❔';
    }
  };
  
  let report = `
# Production Readiness Report
Generated: ${new Date().toISOString()}

## Overall Status: ${audit.isProductionReady ? '🚀 READY' : '🚧 NOT READY'}
**Score: ${audit.overallScore.toFixed(1)}/100**

## Critical Issues
${audit.criticalIssues.length > 0 ? 
  audit.criticalIssues.map(issue => `- ❌ ${issue}`).join('\n') : 
  '✅ No critical issues found'
}

## Detailed Checks
${audit.checks.map(check => 
  `${statusEmoji(check.status)} **${check.category}** (${check.priority} priority)\n   ${check.message}`
).join('\n\n')}

## Data Summary
- **Countries**: ${audit.auditSummary.totalCountries}
- **Questions per Country**: ${audit.auditSummary.questionsPerCountry}
- **Average Relevance**: ${audit.auditSummary.averageRelevanceScore.toFixed(1)}%
- **Broken Images**: ${audit.auditSummary.brokenImages}
- **Duplicate Questions**: ${audit.auditSummary.duplicateQuestions}

## Recommendations
${audit.recommendations.map(rec => `- 💡 ${rec}`).join('\n')}

## Next Steps for Production
1. **Immediate**: ${audit.criticalIssues.slice(0, 3).join(', ')}
2. **Short-term**: Set up Supabase database integration
3. **Medium-term**: Implement user authentication and analytics
4. **Long-term**: Add AI-powered question generation

---

${questionReport}
`;

  return report;
};

// Auto-run audit and log results
export const logProductionStatus = async () => {
  try {
    const audit = await runProductionReadinessAudit();
    
    console.log(`🏗️ Production Readiness: ${audit.isProductionReady ? 'READY' : 'NOT READY'}`);
    console.log(`📊 Overall Score: ${audit.overallScore.toFixed(1)}/100`);
    
    if (audit.criticalIssues.length > 0) {
      console.error("🚨 Critical Issues:");
      audit.criticalIssues.forEach(issue => console.error(`  - ${issue}`));
    }
    
    if (audit.recommendations.length > 0) {
      console.warn("💡 Recommendations:");
      audit.recommendations.slice(0, 3).forEach(rec => console.warn(`  - ${rec}`));
    }
    
    return audit;
  } catch (error) {
    console.error("Failed to run production audit:", error);
    return null;
  }
};
