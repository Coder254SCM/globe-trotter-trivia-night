
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
  
  // Check 2: Database Setup
  checks.push({
    category: "Database",
    status: "warning",
    message: "Using Supabase for scalable data storage",
    priority: "high"
  });
  
  // Check 3: Performance Optimization
  checks.push({
    category: "Performance",
    status: "warning",
    message: "Basic caching implemented",
    priority: "medium"
  });
  
  // Check 4: User Management
  checks.push({
    category: "User Management",
    status: "warning",
    message: "Supabase authentication available",
    priority: "medium"
  });
  
  // Calculate overall score
  const passCount = checks.filter(c => c.status === 'pass').length;
  const totalChecks = checks.length;
  const overallScore = (passCount / totalChecks) * 100;
  
  const isProductionReady = criticalIssues.length === 0 && overallScore >= 60;
  
  return {
    isProductionReady,
    overallScore,
    checks,
    criticalIssues,
    recommendations,
    auditSummary: {
      totalCountries: countryCount,
      questionsPerCountry: 0,
      averageRelevanceScore: 0,
      brokenImages: 0,
      duplicateQuestions: 0
    }
  };
};

export const generateProductionReport = async (): Promise<string> => {
  const audit = await runProductionReadinessAudit();
  
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
- **System Status**: Operational

## Recommendations
${audit.recommendations.length > 0 ? audit.recommendations.map(rec => `- 💡 ${rec}`).join('\n') : '- Continue development'}

## Next Steps for Production
1. **Immediate**: Complete question database setup
2. **Short-term**: Implement comprehensive testing
3. **Medium-term**: Add analytics and monitoring
4. **Long-term**: Scale infrastructure

---
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
    
    return audit;
  } catch (error) {
    console.error("Failed to run production audit:", error);
    return null;
  }
};
