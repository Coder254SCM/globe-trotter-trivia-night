
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const CategoryInfo = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Medium Question Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-semibold">Geography</h4>
            <p className="text-sm text-muted-foreground">
              Land area, population density, borders, climate zones, natural resources
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">History</h4>
            <p className="text-sm text-muted-foreground">
              Independence dates, colonial history, major wars, constitutions, treaties
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">Culture</h4>
            <p className="text-sm text-muted-foreground">
              Traditional dress, languages, festivals, art forms, customs
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">Economy</h4>
            <p className="text-sm text-muted-foreground">
              GDP, main industries, exports, trade agreements, economic indicators
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">Politics</h4>
            <p className="text-sm text-muted-foreground">
              Government systems, political parties, international relations, rights
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
