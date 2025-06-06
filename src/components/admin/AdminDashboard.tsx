
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RealAuditDashboard } from "./RealAuditDashboard";
import { ProjectStructure } from "./ProjectStructure";
import { PlayerDashboard } from "./PlayerDashboard";
import { DynamicQuestionDashboard } from "./DynamicQuestionDashboard";
import { Enhanced3DGlobe } from "../globe/Enhanced3DGlobe";

export const AdminDashboard = () => {
  return (
    <div className="min-h-screen p-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Global Quiz Game - Admin Dashboard</h1>
        
        <Tabs defaultValue="dynamic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dynamic">Dynamic Storage</TabsTrigger>
            <TabsTrigger value="real-audit">Legacy Audit</TabsTrigger>
            <TabsTrigger value="structure">Project Status</TabsTrigger>
            <TabsTrigger value="player">Player Dashboard</TabsTrigger>
            <TabsTrigger value="globe">Enhanced Globe</TabsTrigger>
          </TabsList>

          <TabsContent value="dynamic">
            <DynamicQuestionDashboard />
          </TabsContent>

          <TabsContent value="real-audit">
            <RealAuditDashboard />
          </TabsContent>

          <TabsContent value="structure">
            <ProjectStructure />
          </TabsContent>

          <TabsContent value="player">
            <PlayerDashboard />
          </TabsContent>

          <TabsContent value="globe">
            <div className="h-screen">
              <Enhanced3DGlobe />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
