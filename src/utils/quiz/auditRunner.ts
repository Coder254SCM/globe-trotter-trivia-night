
import { performGlobalAudit } from "./questionAudit";

// Run audit on startup to log current state
let auditCompleted = false;

export const runStartupAudit = async () => {
  if (auditCompleted) return;
  
  try {
    console.log("🔍 Running question database audit...");
    const audit = await performGlobalAudit();
    
    console.log(`📊 Audit Results:
    - Total Countries: ${audit.totalCountries}
    - Countries with Questions: ${audit.countriesWithQuestions}
    - Total Questions: ${audit.totalQuestions}
    - Overall Relevance: ${audit.overallRelevanceScore.toFixed(1)}%
    - Broken Images: ${audit.brokenImages}
    - Duplicates: ${audit.duplicateQuestions}`);
    
    if (audit.recommendations.length > 0) {
      console.warn("⚠️ Recommendations:", audit.recommendations);
    }
    
    // Log countries with poor relevance scores
    const poorRelevance = audit.countryResults
      .filter(c => c.totalQuestions > 0 && c.relevanceScore < 70)
      .sort((a, b) => a.relevanceScore - b.relevanceScore);
    
    if (poorRelevance.length > 0) {
      console.warn("🚨 Countries with poor question relevance:");
      poorRelevance.slice(0, 5).forEach(c => {
        console.warn(`  - ${c.countryName}: ${c.relevanceScore.toFixed(1)}% relevant`);
      });
    }
    
    auditCompleted = true;
  } catch (error) {
    console.error("Failed to run question audit:", error);
  }
};

export const isAuditCompleted = (): boolean => auditCompleted;
