
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RealAuditDashboard } from "./RealAuditDashboard";
import { ProjectStructure } from "./ProjectStructure";
import { PlayerDashboard } from "./PlayerDashboard";

export const AdminDashboard = () => {
  return (
    <div className="min-h-screen p-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Global Quiz Game - REAL Admin Dashboard</h1>
        
        <Tabs defaultValue="real-audit" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="real-audit">REAL Audit</TabsTrigger>
            <TabsTrigger value="structure">Project Status</TabsTrigger>
            <TabsTrigger value="player">Player Dashboard</TabsTrigger>
            <TabsTrigger value="globe">Enhanced Globe</TabsTrigger>
          </TabsList>

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
            <div className="text-center p-12">
              <h3 className="text-lg font-semibold mb-4">Enhanced 3D Globe Preview</h3>
              <p className="text-muted-foreground mb-4">
                The new Enhanced3DGlobe component with better Three.js rendering is now available.
                It uses @react-three/fiber and @react-three/drei for improved performance and visuals.
              </p>
              <div className="text-sm text-muted-foreground">
                To replace the current globe, update the Globe.tsx component to use Enhanced3DGlobe instead.
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
