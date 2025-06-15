
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ComprehensiveQuestionAudit } from "../components/admin/ComprehensiveQuestionAudit";

const ComprehensiveAudit = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Question Quality Management</h1>
          <p className="text-muted-foreground">
            Comprehensive tools for analyzing questions in your Supabase database
          </p>
        </div>
        
        <Tabs defaultValue="audit" className="space-y-6">
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="audit">Live Audit</TabsTrigger>
          </TabsList>
          
          <TabsContent value="audit">
            <ComprehensiveQuestionAudit />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ComprehensiveAudit;
