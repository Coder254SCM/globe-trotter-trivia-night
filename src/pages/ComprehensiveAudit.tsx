
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ComprehensiveQuestionAudit } from "../components/admin/ComprehensiveQuestionAudit";
import { QuestionPreCheckDashboard } from "../components/admin/QuestionPreCheckDashboard";
import { ManualQuestionDeletion } from "../components/admin/ManualQuestionDeletion";

const ComprehensiveAudit = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Question Quality Management</h1>
          <p className="text-muted-foreground">
            Comprehensive tools for analyzing, pre-checking, and managing questions in your Supabase database
          </p>
        </div>
        
        <Tabs defaultValue="precheck" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="precheck">Pre-Check Analysis</TabsTrigger>
            <TabsTrigger value="audit">Live Audit</TabsTrigger>
            <TabsTrigger value="delete">Manual Deletion</TabsTrigger>
          </TabsList>
          
          <TabsContent value="precheck">
            <QuestionPreCheckDashboard />
          </TabsContent>
          
          <TabsContent value="audit">
            <ComprehensiveQuestionAudit />
          </TabsContent>
          
          <TabsContent value="delete">
            <ManualQuestionDeletion />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ComprehensiveAudit;
