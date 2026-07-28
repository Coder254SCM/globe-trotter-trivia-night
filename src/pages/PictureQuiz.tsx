import { useMemo, useState } from 'react';
import { AppHeader } from '@/components/layout/AppHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PICTURE_PACKS, PicturePack, PictureItem } from '@/data/picturePacks';
import { ArrowLeft, Check, X, Trophy } from 'lucide-react';

const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

interface Round {
  item: PictureItem;
  options: string[];
}

const buildRounds = (pack: PicturePack): Round[] =>
  shuffle(pack.items).map((item) => ({
    item,
    options: shuffle([item.answer, ...item.distractors]),
  }));

const PictureQuiz = () => {
  const [pack, setPack] = useState<PicturePack | null>(null);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const startPack = (p: PicturePack) => {
    setPack(p);
    setRounds(buildRounds(p));
    setIndex(0);
    setScore(0);
    setSelected(null);
    setFinished(false);
  };

  const resetHub = () => {
    setPack(null);
    setRounds([]);
    setFinished(false);
  };

  const current = rounds[index];
  const progress = useMemo(
    () => (rounds.length ? ((index + (selected ? 1 : 0)) / rounds.length) * 100 : 0),
    [index, selected, rounds.length]
  );

  const pickAnswer = (choice: string) => {
    if (selected) return;
    setSelected(choice);
    if (choice === current.item.answer) setScore((s) => s + 1);
  };

  const nextRound = () => {
    if (index + 1 >= rounds.length) {
      setFinished(true);
    } else {
      setIndex((i) => i + 1);
      setSelected(null);
    }
  };

  // ---------- Hub view ----------
  if (!pack) {
    return (
      <>
        <AppHeader countriesCount={195} />
        <main className="max-w-5xl mx-auto px-4 py-6 sm:py-10">
          <header className="text-center mb-8">
            <h1 className="text-2xl sm:text-4xl font-bold mb-2">Do You Know These?</h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Picture-based global quizzes. Tap a pack to play.
            </p>
          </header>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PICTURE_PACKS.map((p) => (
              <Card
                key={p.id}
                className="hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => startPack(p)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
                    <span className="text-3xl sm:text-4xl">{p.emoji}</span>
                    {p.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{p.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{p.items.length} pictures</span>
                    <Button size="sm" className="min-h-11">Play</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </>
    );
  }

  // ---------- Results view ----------
  if (finished) {
    const pct = Math.round((score / rounds.length) * 100);
    return (
      <>
        <AppHeader countriesCount={195} />
        <main className="max-w-xl mx-auto px-4 py-10">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <Trophy className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">{pack.title} — Done!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-4xl font-bold">{score} / {rounds.length}</p>
              <p className="text-muted-foreground">{pct}% correct</p>
              <div className="flex gap-3 justify-center pt-2">
                <Button variant="outline" onClick={resetHub} className="min-h-11">
                  <ArrowLeft className="h-4 w-4 mr-1" /> Packs
                </Button>
                <Button onClick={() => startPack(pack)} className="min-h-11">Play again</Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </>
    );
  }

  // ---------- Gameplay view ----------
  return (
    <>
      <AppHeader countriesCount={195} />
      <main className="max-w-2xl mx-auto px-4 py-4 sm:py-8">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="sm" onClick={resetHub} className="min-h-11">
            <ArrowLeft className="h-4 w-4 mr-1" /> Packs
          </Button>
          <div className="text-sm text-muted-foreground">
            {index + 1} / {rounds.length} · Score {score}
          </div>
        </div>
        <Progress value={progress} className="mb-6" />

        <Card>
          <CardHeader>
            <CardTitle className="text-center text-lg sm:text-xl">
              {pack.emoji} Which one is this?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center bg-muted rounded-lg p-6 mb-6 min-h-[220px]">
              <img
                src={current.item.imageUrl}
                alt="Guess this"
                loading="lazy"
                className="max-h-48 sm:max-h-56 w-auto object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.opacity = '0.3';
                }}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {current.options.map((opt) => {
                const isCorrect = opt === current.item.answer;
                const isPicked = selected === opt;
                let variant: 'default' | 'outline' | 'destructive' | 'secondary' = 'outline';
                if (selected) {
                  if (isCorrect) variant = 'default';
                  else if (isPicked) variant = 'destructive';
                }
                return (
                  <Button
                    key={opt}
                    variant={variant}
                    disabled={!!selected}
                    onClick={() => pickAnswer(opt)}
                    className="min-h-14 text-sm sm:text-base justify-between whitespace-normal text-left"
                  >
                    <span>{opt}</span>
                    {selected && isCorrect && <Check className="h-4 w-4 flex-shrink-0" />}
                    {selected && isPicked && !isCorrect && <X className="h-4 w-4 flex-shrink-0" />}
                  </Button>
                );
              })}
            </div>

            {selected && (
              <div className="mt-6 flex justify-end">
                <Button onClick={nextRound} className="min-h-11">
                  {index + 1 >= rounds.length ? 'See results' : 'Next'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </>
  );
};

export default PictureQuiz;
