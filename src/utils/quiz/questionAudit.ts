// Re-export all audit functionality from the refactored modules
export * from "./audit/countryAudit";
export * from "./audit/categoryAudit";
export * from "./audit/duplicateDetection";
export * from "./audit/globalAudit";
export * from "./audit/reportGeneration";

// Keep the main interface for backward compatibility
export { performGlobalAudit, generateAuditReport } from "./audit/globalAudit";
export { auditCountryQuestions } from "./audit/countryAudit";
export { auditQuestionsByCategory } from "./audit/categoryAudit";
