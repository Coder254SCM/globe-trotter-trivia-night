
import { performGlobalAudit } from "./globalAudit";

// Generate a detailed audit report
export const generateAuditReport = async (): Promise<string> => {
  const audit = await performGlobalAudit();
  
  let report = `
# Question Database Audit Report
Generated: ${new Date().toISOString()}

## Executive Summary
- **Total Countries**: ${audit.totalCountries}
- **Countries with Questions**: ${audit.countriesWithQuestions}
- **Total Questions**: ${audit.totalQuestions}
- **Overall Relevance Score**: ${audit.overallRelevanceScore.toFixed(1)}%
- **Broken Images**: ${audit.brokenImages}
- **Duplicate Questions**: ${audit.duplicateQuestions}

## Category Performance
${audit.categoryResults.map(cat => 
  `- **${cat.category}**: ${cat.accuracy.toFixed(1)}% accuracy (${cat.correctlyPlaced}/${cat.totalQuestions} correct)`
).join('\n')}

## Countries with Lowest Relevance Scores
${audit.countryResults
  .filter(c => c.totalQuestions > 0)
  .sort((a, b) => a.relevanceScore - b.relevanceScore)
  .slice(0, 10)
  .map(c => `- **${c.countryName}**: ${c.relevanceScore.toFixed(1)}% (${c.relevantQuestions}/${c.totalQuestions} relevant)`)
  .join('\n')}

## Recommendations
${audit.recommendations.map(rec => `- ${rec}`).join('\n')}

## Detailed Issues
${audit.countryResults
  .filter(c => c.issues.length > 0)
  .map(c => `\n### ${c.countryName}\n${c.issues.map(issue => `- ${issue}`).join('\n')}`)
  .join('\n')}
`;

  return report;
};
