import { useMemo, useState } from 'react';
import { AppHeader } from '@/components/layout/AppHeader';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { PICTURE_PACKS, PicturePack, PictureItem } from '@/data/picturePacks';
import { ArrowLeft, Check, X, Trophy, ChevronRight } from 'lucide-react';

const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

const ROUNDS_PER_GAME = 10;

interface Round {
  item: PictureItem;
  options: string[];
}

const buildRounds = (pack: PicturePack): Round[] =>
  shuffle(pack.items)
    .slice(0, ROUNDS_PER_GAME)
    .map((item) => ({
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

  // ---------- Hub ----------
  if (!pack) {
    return (
      <>
        <AppHeader countriesCount={195} />
        <main className="mx-auto max-w-4xl px-5 py-12 sm:py-20">
          <header className="mb-12 sm:mb-16">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Picture rounds
            </p>
            <h1 className="max-w-xl text-3xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
              Do You Know These?
            </h1>
            <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
              Ten pictures, four answers each. No timer — just how much you recognise.
            </p>
          </header>

          <ul className="divide-y divide-border/60 border-y border-border/60">
            {PICTURE_PACKS.map((p) => (
              <li key={p.id}>
                <button
                  onClick={() => startPack(p)}
                  className="group flex w-full items-center gap-5 py-6 text-left transition-colors hover:bg-muted/40 focus-visible:bg-muted/40 focus-visible:outline-none"
                >
                  <span
                    aria-hidden
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-muted text-2xl transition-transform duration-300 ease-out group-hover:scale-[1.06]"
                  >
                    {p.emoji}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-lg font-medium tracking-tight">{p.title}</span>
                    <span className="mt-0.5 block text-sm text-muted-foreground">{p.description}</span>
                  </span>
                  <span className="hidden shrink-0 text-sm tabular-nums text-muted-foreground sm:block">
                    {p.items.length} pictures
                  </span>
                  <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 ease-out group-hover:translate-x-1" />
                </button>
              </li>
            ))}
          </ul>
        </main>
      </>
    );
  }

  // ---------- Results ----------
  if (finished) {
    const pct = Math.round((score / rounds.length) * 100);
    return (
      <>
        <AppHeader countriesCount={195} />
        <main className="mx-auto max-w-md px-5 py-16 text-center sm:py-24">
          <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Trophy className="h-7 w-7 text-primary" />
          </div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            {pack.title}
          </p>
          <p className="mt-6 text-6xl font-semibold tracking-tight tabular-nums">
            {score}
            <span className="text-muted-foreground">/{rounds.length}</span>
          </p>
          <p className="mt-3 text-base text-muted-foreground">{pct}% correct</p>
          <div className="mt-10 flex flex-col gap-3">
            <Button size="lg" className="h-12 rounded-full text-base" onClick={() => startPack(pack)}>
              Play again
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="h-12 rounded-full text-base"
              onClick={resetHub}
            >
              Choose another pack
            </Button>
          </div>
        </main>
      </>
    );
  }

  // ---------- Gameplay ----------
  return (
    <>
      <AppHeader countriesCount={195} />
      <main className="mx-auto max-w-lg px-5 py-6 sm:py-12">
        <div className="mb-5 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={resetHub}
            className="-ml-2 h-11 rounded-full px-3 text-muted-foreground"
          >
            <ArrowLeft className="mr-1.5 h-4 w-4" /> Packs
          </Button>
          <span className="text-sm tabular-nums text-muted-foreground">
            {index + 1} of {rounds.length}
          </span>
        </div>

        <Progress value={progress} className="mb-8 h-1" />

        <div key={current.item.id} className="animate-fade-in">
          <h2 className="mb-6 text-center text-xl font-semibold tracking-tight sm:text-2xl">
            Which one is this?
          </h2>

          <div
            className={`mb-8 flex min-h-[240px] items-center justify-center rounded-3xl p-8 ring-1 ring-inset ring-border/60 ${
              pack.lightTile ? 'bg-zinc-50' : 'bg-muted'
            }`}
          >
            <img
              src={current.item.imageUrl}
              alt="Identify this picture"
              loading="eager"
              className="max-h-44 w-auto max-w-full object-contain sm:max-h-52"
            />
          </div>

          <div className="grid gap-3">
            {current.options.map((opt) => {
              const isCorrect = opt === current.item.answer;
              const isPicked = selected === opt;
              const revealed = !!selected;

              let tone = 'border-border/70 bg-card hover:border-border hover:bg-muted/50';
              if (revealed && isCorrect) tone = 'border-emerald-500/60 bg-emerald-500/10';
              else if (revealed && isPicked) tone = 'border-destructive/60 bg-destructive/10';
              else if (revealed) tone = 'border-border/40 bg-card opacity-50';

              return (
                <button
                  key={opt}
                  disabled={revealed}
                  onClick={() => pickAnswer(opt)}
                  className={`flex min-h-[56px] items-center justify-between gap-3 rounded-2xl border px-5 py-3.5 text-left text-base font-medium transition-all duration-200 ease-out active:scale-[0.985] disabled:cursor-default ${tone}`}
                >
                  <span>{opt}</span>
                  {revealed && isCorrect && <Check className="h-5 w-5 shrink-0 text-emerald-500" />}
                  {revealed && isPicked && !isCorrect && (
                    <X className="h-5 w-5 shrink-0 text-destructive" />
                  )}
                </button>
              );
            })}
          </div>

          {selected && (
            <Button
              size="lg"
              onClick={nextRound}
              className="mt-8 h-12 w-full rounded-full text-base animate-fade-in"
            >
              {index + 1 >= rounds.length ? 'See results' : 'Next picture'}
            </Button>
          )}
        </div>
      </main>
    </>
  );
};

export default PictureQuiz;
