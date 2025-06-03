
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QuestionAuditDashboard } from "./QuestionAuditDashboard";
import { ProjectStructure } from "./ProjectStructure";
import { PlayerDashboard } from "./PlayerDashboard";

export const AdminDashboard = () => {
  return (
    <div className="min-h-screen p-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Global Night Out - Admin Dashboard</h1>
        
        <Tabs defaultValue="audit" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="audit">Question Audit</TabsTrigger>
            <TabsTrigger value="structure">Project Structure</TabsTrigger>
            <TabsTrigger value="player">Player Dashboard</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="audit">
            <QuestionAuditDashboard />
          </TabsContent>

          <TabsContent value="structure">
            <ProjectStructure />
          </TabsContent>

          <TabsContent value="player">
            <PlayerDashboard />
          </TabsContent>

          <TabsContent value="analytics">
            <div className="text-center p-12">
              <h3 className="text-lg font-semibold mb-2">Analytics Dashboard</h3>
              <p className="text-muted-foreground">
                Coming soon - requires database integration to track real user data
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
