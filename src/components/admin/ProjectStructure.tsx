
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Folder, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

interface FileStatus {
  name: string;
  status: 'complete' | 'partial' | 'missing';
  description: string;
}

interface FolderStructure {
  name: string;
  files: FileStatus[];
  subfolders?: FolderStructure[];
}

export const ProjectStructure = () => {
  const projectStructure: FolderStructure[] = [
    {
      name: "src/components",
      files: [
        { name: "Globe.tsx", status: "partial", description: "Missing some countries/regions" },
        { name: "Quiz.tsx", status: "partial", description: "Question relevance issues" },
        { name: "QuizResult.tsx", status: "complete", description: "Working properly" },
        { name: "LanguageSelector.tsx", status: "complete", description: "Multi-language support" },
        { name: "InviteSystem.tsx", status: "complete", description: "User invites working" },
        { name: "MonetizationStrategy.tsx", status: "complete", description: "Revenue strategies defined" }
      ],
      subfolders: [
        {
          name: "globe",
          files: [
            { name: "GlobeHeader.tsx", status: "complete", description: "Header with controls" },
            { name: "GlobeFilters.tsx", status: "complete", description: "Country filtering" },
            { name: "CountryCard.tsx", status: "complete", description: "Country info display" },
            { name: "StarsBackground.tsx", status: "partial", description: "Could be enhanced" }
          ]
        },
        {
          name: "admin",
          files: [
            { name: "QuestionAuditDashboard.tsx", status: "complete", description: "Question quality monitoring" },
            { name: "ProjectStructure.tsx", status: "complete", description: "Current file" },
            { name: "PlayerDashboard.tsx", status: "missing", description: "Group challenges missing" }
          ]
        }
      ]
    },
    {
      name: "src/data",
      files: [
        { name: "countries.ts", status: "partial", description: "195 countries but some missing data" },
        { name: "globalQuestions.ts", status: "partial", description: "Has irrelevant questions" },
        { name: "easyGlobalQuestions.ts", status: "partial", description: "Needs quality check" }
      ],
      subfolders: [
        {
          name: "questions/countries",
          files: [
            { name: "Various country files", status: "partial", description: "Many have irrelevant questions" }
          ]
        }
      ]
    },
    {
      name: "src/utils/quiz",
      files: [
        { name: "questionFetcher.ts", status: "partial", description: "Not filtering irrelevant questions properly" },
        { name: "analytics.ts", status: "complete", description: "User behavior tracking" },
        { name: "languages.ts", status: "complete", description: "Multi-language support" }
      ],
      subfolders: [
        {
          name: "audit",
          files: [
            { name: "comprehensiveAudit.ts", status: "complete", description: "Question quality analysis" },
            { name: "Various audit files", status: "complete", description: "Monitoring tools" }
          ]
        }
      ]
    },
    {
      name: "Missing/Incomplete Features",
      files: [
        { name: "Group Challenge System", status: "missing", description: "No multiplayer challenges yet" },
        { name: "Player Dashboard", status: "missing", description: "No stats/progress tracking" },
        { name: "Database Integration", status: "missing", description: "Still using static data" },
        { name: "User Authentication", status: "missing", description: "No user accounts yet" },
        { name: "Globe Rendering Fix", status: "partial", description: "Missing continents/regions" },
        { name: "Question Quality Fix", status: "partial", description: "Many irrelevant questions remain" }
      ]
    }
  ];

  const getStatusIcon = (status: FileStatus['status']) => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'partial':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'missing':
        return <XCircle className="h-4 w-4 text-red-600" />;
    }
  };

  const getStatusBadge = (status: FileStatus['status']) => {
    const variants = {
      complete: "bg-green-100 text-green-800",
      partial: "bg-yellow-100 text-yellow-800", 
      missing: "bg-red-100 text-red-800"
    };
    
    return (
      <Badge variant="secondary" className={variants[status]}>
        {status}
      </Badge>
    );
  };

  const renderFolder = (folder: FolderStructure, depth = 0) => (
    <div key={folder.name} className={`${depth > 0 ? 'ml-4 border-l pl-4' : ''}`}>
      <div className="flex items-center gap-2 mb-2">
        <Folder className="h-4 w-4 text-blue-600" />
        <span className="font-medium">{folder.name}</span>
      </div>
      
      <div className="space-y-2">
        {folder.files.map((file) => (
          <div key={file.name} className="flex items-center justify-between p-2 bg-muted/50 rounded">
            <div className="flex items-center gap-2">
              {getStatusIcon(file.status)}
              <FileText className="h-4 w-4" />
              <span className="text-sm">{file.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{file.description}</span>
              {getStatusBadge(file.status)}
            </div>
          </div>
        ))}
      </div>
      
      {folder.subfolders && (
        <div className="mt-3">
          {folder.subfolders.map(subfolder => renderFolder(subfolder, depth + 1))}
        </div>
      )}
    </div>
  );

  const totalFiles = projectStructure.reduce((acc, folder) => {
    const folderFiles = folder.files.length;
    const subfolderFiles = folder.subfolders?.reduce((subAcc, sub) => subAcc + sub.files.length, 0) || 0;
    return acc + folderFiles + subfolderFiles;
  }, 0);

  const completeFiles = projectStructure.reduce((acc, folder) => {
    const folderComplete = folder.files.filter(f => f.status === 'complete').length;
    const subfolderComplete = folder.subfolders?.reduce((subAcc, sub) => 
      subAcc + sub.files.filter(f => f.status === 'complete').length, 0) || 0;
    return acc + folderComplete + subfolderComplete;
  }, 0);

  const completionRate = Math.round((completeFiles / totalFiles) * 100);

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Project Structure & Status</h2>
        <div className="flex items-center gap-4">
          <span>Overall Completion: <strong>{completionRate}%</strong></span>
          <span>Files: {completeFiles}/{totalFiles}</span>
        </div>
      </div>

      <div className="space-y-6">
        {projectStructure.map(folder => renderFolder(folder))}
      </div>

      <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded">
        <h3 className="font-semibold text-red-800 mb-2">Critical Issues to Fix:</h3>
        <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
          <li>Question relevance: Many questions are assigned to wrong countries</li>
          <li>Globe rendering: Missing continents and regions</li>
          <li>No group challenge system or player dashboard</li>
          <li>No database integration - still using static files</li>
          <li>No user authentication system</li>
        </ul>
      </div>
    </Card>
  );
};
