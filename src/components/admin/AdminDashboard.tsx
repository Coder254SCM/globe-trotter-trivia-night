
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RealAuditDashboard } from "./RealAuditDashboard";
import { ProjectStructure } from "./ProjectStructure";
import { PlayerDashboard } from "./PlayerDashboard";
import { DynamicQuestionDashboard } from "./DynamicQuestionDashboard";
import { ProductionDashboard } from "./ProductionDashboard";
import { ProductionDataInitializer } from "./ProductionDataInitializer";
import { Modern3DGlobe } from "../globe/Modern3DGlobe";

export const AdminDashboard = () => {
  return (
    <div className="min-h-screen p-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🌍 Global Quiz Game - Production Admin</h1>
        
        <Tabs defaultValue="initializer" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="initializer">Production Init</TabsTrigger>
            <TabsTrigger value="modern-globe">3D Globe</TabsTrigger>
            <TabsTrigger value="production">System Status</TabsTrigger>
            <TabsTrigger value="dynamic">Dynamic Storage</TabsTrigger>
            <TabsTrigger value="real-audit">Legacy Audit</TabsTrigger>
            <TabsTrigger value="structure">Project Status</TabsTrigger>
            <TabsTrigger value="player">Player Dashboard</TabsTrigger>
          </TabsList>

          <TabsContent value="initializer">
            <ProductionDataInitializer />
          </TabsContent>

          <TabsContent value="modern-globe">
            <div className="h-screen">
              <Modern3DGlobe />
            </div>
          </TabsContent>

          <TabsContent value="production">
            <ProductionDashboard />
          </TabsContent>

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
        </Tabs>
      </div>
    </div>
  );
};
