import { Progress } from "@/components/ui/progress";

interface LevelInfo {
  name: string;
  minBalance: number;
  validDownline: number;
  dailyReviewLimit: number;
  massiveOrderRate: number;
  communityBonusRate: number;
}

const levels: LevelInfo[] = [
  {
    name: "Bronze",
    minBalance: 0,
    validDownline: 0,
    dailyReviewLimit: 15,
    massiveOrderRate: 4,
    communityBonusRate: 0,
  },
  {
    name: "Silver",
    minBalance: 500,
    validDownline: 5,
    dailyReviewLimit: 25,
    massiveOrderRate: 8,
    communityBonusRate: 1,
  },
  {
    name: "Gold",
    minBalance: 1500,
    validDownline: 11,
    dailyReviewLimit: 35,
    massiveOrderRate: 16,
    communityBonusRate: 2,
  },
  {
    name: "Crystal",
    minBalance: 4000,
    validDownline: 22,
    dailyReviewLimit: 45,
    massiveOrderRate: 32,
    communityBonusRate: 3,
  },
  {
    name: "Master",
    minBalance: 20000,
    validDownline: 60,
    dailyReviewLimit: 60,
    massiveOrderRate: 45,
    communityBonusRate: 5,
  },
];

export default function LevelProgress({ level }: { level: string }) {
  const currentLevelIndex = levels.findIndex((l) => l.name === level);
  const currentLevel = levels[currentLevelIndex];
  const nextLevel = levels[currentLevelIndex + 1];
  
  const progress = nextLevel
    ? ((currentLevel.minBalance / nextLevel.minBalance) * 100)
    : 100;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-medium">{currentLevel.name}</h3>
          <p className="text-sm text-muted-foreground">
            {nextLevel ? `Next: ${nextLevel.name}` : "Maximum level reached"}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium">{currentLevel.massiveOrderRate}% Order Rate</p>
          <p className="text-sm text-muted-foreground">
            {currentLevel.communityBonusRate}% Community Bonus
          </p>
        </div>
      </div>

      <Progress value={progress} className="h-2" />

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-muted-foreground">Daily Review Limit</p>
          <p className="font-medium">{currentLevel.dailyReviewLimit}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Required Downline</p>
          <p className="font-medium">{currentLevel.validDownline}</p>
        </div>
      </div>
    </div>
  );
}
