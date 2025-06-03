
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Zap, Target, TrendingUp, Globe, Users } from "lucide-react";

export const MonetizationStrategy = () => {
  const strategies = [
    {
      icon: <Crown className="text-amber-500" />,
      title: "Premium Subscription",
      description: "Monthly/yearly plans with exclusive features",
      features: [
        "Advanced analytics and progress tracking",
        "All language packs included",
        "Unlimited quiz attempts",
        "Custom difficulty settings",
        "Ad-free experience"
      ],
      pricing: "$4.99/month or $39.99/year",
      potential: "High recurring revenue"
    },
    {
      icon: <Zap className="text-blue-500" />,
      title: "In-App Purchases",
      description: "One-time purchases for specific features",
      features: [
        "Hint packs (50 hints for $1.99)",
        "Special country quiz collections",
        "Power-ups (extra time, 50/50 help)",
        "Custom avatar and themes",
        "Premium difficulty levels"
      ],
      pricing: "$0.99 - $9.99 per item",
      potential: "Impulse purchases"
    },
    {
      icon: <Target className="text-green-500" />,
      title: "Advertisement Revenue",
      description: "Non-intrusive ads with premium ad-free option",
      features: [
        "Banner ads between quizzes",
        "Optional video ads for extra hints",
        "Sponsored country content",
        "Interstitial ads (limited frequency)",
        "Reward-based advertising"
      ],
      pricing: "Revenue per 1000 impressions",
      potential: "Passive income stream"
    },
    {
      icon: <TrendingUp className="text-purple-500" />,
      title: "Educational Partnerships",
      description: "B2B sales to educational institutions",
      features: [
        "School/university licenses",
        "Classroom management tools",
        "Student progress tracking",
        "Custom curriculum integration",
        "Bulk discount pricing"
      ],
      pricing: "$100-500 per institution/year",
      potential: "High-value contracts"
    },
    {
      icon: <Globe className="text-indigo-500" />,
      title: "Language Pack DLC",
      description: "Premium language content and cultural quizzes",
      features: [
        "Native language quiz packs",
        "Cultural immersion content",
        "Local history and traditions",
        "Regional quiz variants",
        "Voice narration in native languages"
      ],
      pricing: "$2.99 per language pack",
      potential: "Global market expansion"
    },
    {
      icon: <Users className="text-rose-500" />,
      title: "Corporate Training",
      description: "Enterprise solutions for team building",
      features: [
        "Corporate culture quizzes",
        "Team competition modes",
        "Branded company versions",
        "Employee engagement analytics",
        "Custom company content"
      ],
      pricing: "$50-200 per employee/year",
      potential: "Enterprise contracts"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Monetization Strategy</h2>
        <p className="text-muted-foreground">Multiple revenue streams for sustainable growth</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {strategies.map((strategy, index) => (
          <Card key={index} className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              {strategy.icon}
              <div>
                <h3 className="font-semibold">{strategy.title}</h3>
                <p className="text-sm text-muted-foreground">{strategy.description}</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Key Features:</h4>
              <ul className="text-xs space-y-1">
                {strategy.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 border-t space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Pricing:</span>
                <Badge variant="outline" className="text-xs">{strategy.pricing}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Potential:</span>
                <Badge variant="secondary" className="text-xs">{strategy.potential}</Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Implementation Roadmap</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <h4 className="font-medium mb-2 text-green-600">Phase 1: Foundation (Month 1-2)</h4>
            <ul className="text-sm space-y-1">
              <li>• Implement user authentication</li>
              <li>• Add basic analytics tracking</li>
              <li>• Set up payment processing</li>
              <li>• Launch freemium model</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2 text-blue-600">Phase 2: Growth (Month 3-4)</h4>
            <ul className="text-sm space-y-1">
              <li>• Premium subscriptions</li>
              <li>• Language pack marketplace</li>
              <li>• Advertisement integration</li>
              <li>• Referral program launch</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2 text-purple-600">Phase 3: Scale (Month 5-6)</h4>
            <ul className="text-sm space-y-1">
              <li>• Enterprise partnerships</li>
              <li>• Educational licensing</li>
              <li>• Advanced analytics dashboard</li>
              <li>• International expansion</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};
