"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { QUESTIONS, Category, Sport, Question } from "@/data/questions";

const FOOTBALL_CATEGORIES: Category[] = [
  "Geography",
  "History",
  "Top5",
  "PlayerID",
  "Logo",
  "ClubCombo",
  "GeorgesQuestion",
  "PhotoQuiz",
  "FiftyFifty",
];

const BASKET_CATEGORIES: Category[] = [
  "Geography",
  "History",
  "Top5",
  "PlayerID",
  "Logo",
  "ClubCombo",
  "GeorgesQuestion",
  "PhotoQuiz",
  "FiftyFifty",
];

const BOARD_LAYOUT: Record<Category, (1 | 2 | 3)[]> = {
  Geography: [1, 2, 3],
  History: [1, 2, 3],
  Top5: [3, 3, 3],
  PlayerID: [2, 3, 3],
  Logo: [1, 2, 3],
  ClubCombo: [1, 2, 3],
  GeorgesQuestion: [1, 2, 3],
  PhotoQuiz: [2, 3], // 2 κουμπιά
  FiftyFifty: [1, 1, 1], // x1 x1 x1
};


function pickQuestion(
  sport: Sport,
  category: Category,
  difficulty: 1 | 2 | 3,
  usedIds: Set<string>
): Question | null {
  const pool = QUESTIONS.filter(
    (q) =>
      q.sport === sport &&
      q.category === category &&
      q.difficulty === difficulty &&
      !usedIds.has(q.id)
  );
  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

function normalizeGreek(s: string) {
  return s
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ");
}

function isNumericLike(s: string) {
  const t = s.trim();
  return /^-?\d+(\.\d+)?$/.test(t);
}

function answersMatch(user: string, correct: string) {
  const u = user.trim();
  const c = correct.trim();

  if (isNumericLike(u) && isNumericLike(c)) {
    const nu = Number(u);
    const nc = Number(c);
    return Number.isFinite(nu) && Number.isFinite(nc) && Math.abs(nu - nc) < 1e-9;
  }

  return normalizeGreek(u) === normalizeGreek(c);
}

export default function GamePage() {
  // ✅ COIN FLIP state (πριν ξεκινήσει το παιχνίδι)
const [phase, setPhase] = useState<"coin" | "game">("coin");

const [teamASide, setTeamASide] = useState<"heads" | "tails" | null>(null);
const [flipResult, setFlipResult] = useState<"heads" | "tails" | null>(null);
const [flipWinner, setFlipWinner] = useState<"A" | "B" | null>(null);
  const params = useSearchParams();
  const sport = (params.get("sport") ?? "football") as Sport;
  const teamA = params.get("teamA") ?? "Team A";
  const teamB = params.get("teamB") ?? "Team B";

  const categories = useMemo(
    () => (sport === "football" ? FOOTBALL_CATEGORIES : BASKET_CATEGORIES),
    [sport]
  );

  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [turn, setTurn] = useState<"A" | "B">("A");
  const [questionsPlayed, setQuestionsPlayed] = useState(0);

  const [used5050A, setUsed5050A] = useState(false);
  const [used5050B, setUsed5050B] = useState(false);

  const [usedQuestionIds, setUsedQuestionIds] = useState<Set<string>>(() => new Set());
  const [usedCells, setUsedCells] = useState<Set<string>>(() => new Set());

  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [activePoints, setActivePoints] = useState<1 | 2 | 3>(1);

  const [userAnswer, setUserAnswer] = useState("");
  const [result, setResult] = useState<null | { isCorrect: boolean; correct: string }>(
    null
  );

  const [hintOptions, setHintOptions] = useState<number[] | null>(null);

  const [activeCell, setActiveCell] = useState<{
    category: Category;
    points: 1 | 2 | 3;
    idx: number;
  } | null>(null);

  // ✅ TOP5 state
  const [top5Found, setTop5Found] = useState<boolean[]>([false, false, false, false, false]);
  const [top5Strikes, setTop5Strikes] = useState(0); // 0..2
  const [top5Message, setTop5Message] = useState<string | null>(null);
  const [top5AllowStop, setTop5AllowStop] = useState(false); // STOP/CONTINUE

  const currentTeamName = turn === "A" ? teamA : teamB;

  function cellKey(category: Category, points: 1 | 2 | 3, idx: number) {
    return `${category}-${points}-${idx}`;
  }

  function nextTurn() {
    setTurn((t) => (t === "A" ? "B" : "A"));
  }

  function award(points: number) {
    if (turn === "A") setScoreA((s) => s + points);
    else setScoreB((s) => s + points);
  }

  // ✅ κοινό finalize (καίει κελί/ερώτηση ΜΟΝΟ όταν τελειώσει)
  function finalizeRound(wonPoints: number, correctTextForResult: string) {
    // used question
    setUsedQuestionIds((prev) => {
      const next = new Set(prev);
      if (activeQuestion) next.add(activeQuestion.id);
      return next;
    });

    // burn cell
    setUsedCells((prev) => {
      const next = new Set(prev);
      if (activeCell) {
        next.add(cellKey(activeCell.category, activeCell.points, activeCell.idx));
      }
      return next;
    });

    if (wonPoints > 0) award(wonPoints);
let finalCorrectText = correctTextForResult;

// ✅ αν είναι Top5, στο result δείχνουμε όλες τις σωστές
if (activeQuestion?.kind === "top5") {
  const list = activeQuestion.top5 ?? [];
  finalCorrectText = list
    .map((ans, i) => `${top5Found[i] ? "✅" : "👀"} #${i + 1}: ${ans}`)
    .join("\n");
}

setResult({ isCorrect: wonPoints > 0, correct: finalCorrectText });

    // counter
    setQuestionsPlayed((n) => n + 1);
  }

  function closeModal() {
    setActiveQuestion(null);
    setUserAnswer("");
    setResult(null);
    setHintOptions(null);
    setActivePoints(1);
    setActiveCell(null);

    // reset top5
    setTop5Found([false, false, false, false, false]);
    setTop5Strikes(0);
    setTop5Message(null);
    setTop5AllowStop(false);
  }

  function onPick(category: Category, points: 1 | 2 | 3, idx: number) {
    const q = pickQuestion(sport, category, points, usedQuestionIds);
    if (!q) {
      alert("Δεν υπάρχουν άλλες ερωτήσεις γι' αυτή την επιλογή ακόμα.");
      return;
    }

    setActiveQuestion(q);
    setActivePoints(points);
    setUserAnswer("");
    setResult(null);
    setHintOptions(null);
    setActiveCell({ category, points, idx });

    // ✅ init top5 όταν ανοίγει top5 ερώτηση
    if (q.kind === "top5") {
      setTop5Found([false, false, false, false, false]);
      setTop5Strikes(0);
      setTop5Message(null);
      setTop5AllowStop(false);
    }
  }

  function use5050() {
    if (!activeQuestion) return;
    if (result) return;

    // ❌ όχι 50/50 σε Top5
    if (activeQuestion.kind === "top5") return;

    // ❌ όχι 50/50 στην κατηγορία FiftyFifty
    if (activeQuestion.category === "FiftyFifty") return;

    if (turn === "A" && used5050A) return;
    if (turn === "B" && used5050B) return;

    // κλειδώνει σε 1 πόντο
    setActivePoints(1);

    const correct = activeQuestion.correctIndex!;
    const all = [0, 1, 2, 3];
    const wrongOptions = all.filter((i) => i !== correct);
    const randomWrong = wrongOptions[Math.floor(Math.random() * wrongOptions.length)];

    const keep = [correct, randomWrong].sort((a, b) => a - b);
    setHintOptions(keep);

    if (turn === "A") setUsed5050A(true);
    else setUsed5050B(true);
  }

  function top5StopAndTake1() {
    finalizeRound(1, "Σταμάτησες στο 4/5 και πήρες 1 πόντο.");
  }

  function top5Continue() {
    setTop5AllowStop(false);
    setTop5Message(`Συνεχίζεις για τους ${activePoints} πόντους!`);
  }

  function submitAnswer() {
    if (!activeQuestion) return;
    if (result) return;

    // =========================
    // ✅ TOP5 MODE
    // =========================
    if (activeQuestion.kind === "top5") {
      const guess = userAnswer.trim();
      if (!guess) return;

      const list = activeQuestion.top5 ?? [];
      if (list.length !== 5) {
        setTop5Message("Σφάλμα: αυτό το Top5 δεν έχει 5 απαντήσεις στο questions.ts");
        return;
      }

      const matchPos = list.findIndex((correct, pos) => {
        if (top5Found[pos]) return false;

        const accepted = [
          correct,
          ...((activeQuestion.acceptedTop5?.[pos] ?? []) as string[]),
        ];

        return accepted.some((a) => answersMatch(guess, a));
      });

      // ✅ σωστό
      if (matchPos !== -1) {
        const nextFound = [...top5Found];
        nextFound[matchPos] = true;
        setTop5Found(nextFound);

        const foundCount = nextFound.filter(Boolean).length;
        setTop5Message(`✅ Σωστό! (${foundCount}/5)`);
        setUserAnswer("");

        // βρέθηκαν και τα 5 -> παίρνει activePoints (x3)
        if (foundCount === 5) {
          finalizeRound(activePoints, "Βρήκες και τις 5 σωστές απαντήσεις!");
          return;
        }

        // αν βρει 4/5 -> STOP/CONTINUE
        if (foundCount >= 4 && top5Strikes < 2) {
          setTop5AllowStop(true);
        }

        return;
      }

      // ❌ λάθος
      const nextStrikes = top5Strikes + 1;
      setTop5Strikes(nextStrikes);
      setTop5Message(`❌ Λάθος! (${nextStrikes}/2)`);
      setUserAnswer("");

      // 2ο λάθος -> χάνει (0)
      if (nextStrikes >= 2) {
        finalizeRound(0, "2 λάθη — χάνεις την ερώτηση.");
        return;
      }

      // αν έχει ήδη 4/5 και έκανε λάθος -> ξαναδείξε STOP/CONTINUE
      const foundCountNow = top5Found.filter(Boolean).length;
      if (foundCountNow >= 4) {
        setTop5AllowStop(true);
      }

      return;
    }

    // =========================
    // ✅ NORMAL MCQ MODE
    // =========================
    const correctText = activeQuestion.answers![activeQuestion.correctIndex!];
    const accepted = [correctText, ...(activeQuestion.acceptedAnswers ?? [])];
    const isCorrect = accepted.some((a) => answersMatch(userAnswer, a));

    finalizeRound(isCorrect ? activePoints : 0, correctText);
  }

  function continueAfterResult() {
    if (!result) return;
    closeModal();
    nextTurn();
  }
  function setSideA(side: "heads" | "tails") {
  setTeamASide(side);
  setFlipResult(null);
  setFlipWinner(null);
}


function flipCoin() {
  if (!teamASide) return;

  const result: "heads" | "tails" = Math.random() < 0.5 ? "heads" : "tails";
  setFlipResult(result);

  const winner: "A" | "B" = result === teamASide ? "A" : "B";
  setFlipWinner(winner);
}

function chooseStarter(choice: "winner" | "other") {
  if (!flipWinner) return;

  const starter =
    choice === "winner"
      ? flipWinner
      : flipWinner === "A"
      ? "B"
      : "A";

  setTurn(starter);
  setPhase("game");
}

if (phase === "coin") {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white p-6 flex items-center justify-center">
      <div className="w-full max-w-xl bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="text-2xl font-bold mb-2">🪙 Coin Flip</div>
        <div className="text-gray-300 mb-6">
          {teamA} διαλέγει πλευρά. Μετά γίνεται flip και ο νικητής διαλέγει ποιος ξεκινάει.
        </div>

        {/* επιλογή πλευράς */}
        <div className="mb-4">
          <div className="text-sm text-gray-300 mb-2">
            {teamA} διάλεξε:
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setSideA("heads")}
              className={[
                "px-4 py-2 rounded-xl border transition font-semibold",
                teamASide === "heads"
                  ? "bg-white/20 border-white/30"
                  : "bg-white/5 border-white/10 hover:bg-white/10",
              ].join(" ")}
            >
              Heads
            </button>
            <button
              onClick={() => setSideA("tails")}
              className={[
                "px-4 py-2 rounded-xl border transition font-semibold",
                teamASide === "tails"
                  ? "bg-white/20 border-white/30"
                  : "bg-white/5 border-white/10 hover:bg-white/10",
              ].join(" ")}
            >
              Tails
            </button>
          </div>

          {teamASide && (
            <div className="mt-2 text-sm text-gray-400">
              {teamA} = {teamASide.toUpperCase()} • {teamB} ={" "}
              {(teamASide === "heads" ? "tails" : "heads").toUpperCase()}
            </div>
          )}
        </div>

        {/* flip */}
        <div className="mb-4">
          <button
            onClick={flipCoin}
            disabled={!teamASide || !!flipResult}
            className="px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 transition font-semibold"
          >
            Flip Coin
          </button>

          {flipResult && (
            <div className="mt-3 p-4 rounded-xl border border-white/10 bg-white/5">
              <div className="text-lg">
                Αποτέλεσμα: <span className="font-bold">{flipResult.toUpperCase()}</span>
              </div>
              <div className="text-lg mt-1">
                Νικητής:{" "}
                <span className="font-bold">
                  {flipWinner === "A" ? teamA : teamB}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* επιλογή starter */}
        {flipWinner && (
          <div className="mt-4 p-4 rounded-xl border border-white/10 bg-white/5">
            <div className="text-sm text-gray-300 mb-3">
              {flipWinner === "A" ? teamA : teamB} κέρδισε. Ποιος ξεκινάει;
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => chooseStarter("winner")}
                className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 transition font-semibold"
              >
                Ξεκινάω εγώ
              </button>
              <button
                onClick={() => chooseStarter("other")}
                className="px-4 py-2 rounded-xl bg-zinc-700 hover:bg-zinc-600 transition font-semibold"
              >
                Ξεκινάει ο άλλος
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="text-2xl font-bold">
          {sport === "football" ? "⚽ Football Quizball" : "🏀 Basketball Quizball"}
        </div>

        <div className="flex gap-6 text-lg">
          <div>
            <span className="text-gray-300">{teamA}:</span>{" "}
            <span className="font-bold">{scoreA}</span>{" "}
            <span className="text-sm text-gray-400">
              (50/50: {used5050A ? "used" : "ready"})
            </span>
          </div>

          <div>
            <span className="text-gray-300">{teamB}:</span>{" "}
            <span className="font-bold">{scoreB}</span>{" "}
            <span className="text-sm text-gray-400">
              (50/50: {used5050B ? "used" : "ready"})
            </span>
          </div>

          <div>
            <span className="text-gray-300">Ερωτήσεις:</span>{" "}
            <span className="font-bold">{questionsPlayed}</span>
          </div>
        </div>

        <div className="text-lg">
          Σειρά: <span className="font-bold">{currentTeamName}</span>
        </div>
      </div>

      {/* Board */}
      <div className="mt-8 grid grid-cols-4 gap-4">
        <div className="col-span-1 text-gray-300 font-semibold">Κατηγορίες</div>

        <div />
        <div />
        <div />

        {categories.map((cat) => {
          const layout = BOARD_LAYOUT[cat] ?? [1, 2, 3];
          const missing = 3 - layout.length;

          // PhotoQuiz (2 κουμπιά) -> βάζουμε 1 κενό αριστερά για να πάει λίγο δεξιά/κέντρο
          const leftPads = missing;
          const rightPads = 0;

          return (
            <div key={cat} className="contents">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                {cat}
              </div>

              {Array.from({ length: leftPads }).map((_, i) => (
                <div key={`ph-left-${cat}-${i}`} />
              ))}

              {layout.map((p, idx) => {
                const key = cellKey(cat, p, idx);
                const disabled = usedCells.has(key);

                return (
                  <button
                    key={key}
                    onClick={() => onPick(cat, p, idx)}
                    disabled={disabled}
                    className={[
                      "p-4 rounded-xl border text-xl font-bold transition",
                      disabled
                        ? "bg-white/5 border-white/10 opacity-30 cursor-not-allowed"
                        : "bg-white/5 border-white/10 hover:bg-white/10",
                    ].join(" ")}
                  >
                    x{p}
                  </button>
                );
              })}

              {Array.from({ length: rightPads }).map((_, i) => (
                <div key={`ph-right-${cat}-${i}`} />
              ))}
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {activeQuestion && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-6">
          <div className="w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-2xl p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm text-gray-300">
                  {activeQuestion.category} • {sport} • για{" "}
                  <span className="font-semibold">{currentTeamName}</span>
                </div>
                <h2 className="text-2xl font-bold mt-2">
                  ({activePoints} πόντοι) {activeQuestion.question}
                </h2>
              </div>

              <button
                onClick={closeModal}
                className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20"
                title="Κλείσιμο"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={use5050}
                disabled={
                  activeQuestion.kind === "top5" ||
                  activeQuestion.category === "FiftyFifty" ||
                  (turn === "A" && used5050A) ||
                  (turn === "B" && used5050B) ||
                  !!result
                }
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:hover:bg-blue-600 transition font-semibold"
              >
                50/50 (κάνει 1 πόντο)
              </button>

              {activeQuestion.kind === "top5" ? (
                <div className="text-sm text-gray-400">
                  Σε Top5 δεν επιτρέπεται βοήθεια 50/50.
                </div>
              ) : activeQuestion.category === "FiftyFifty" ? (
                <div className="text-sm text-gray-400">
                  Σε αυτή την κατηγορία δεν επιτρέπεται βοήθεια 50/50.
                </div>
              ) : (
                <div className="text-sm text-gray-400">
                  Αν είναι λάθος: 0 πόντοι και αλλάζει σειρά.
                </div>
              )}
            </div>

            {/* Hint options (μόνο για MCQ) */}
            {hintOptions && activeQuestion.kind !== "top5" && (
              <div className="mt-4 flex flex-wrap gap-2">
                {hintOptions.map((i) => (
                  <button
                    key={i}
                    onClick={() => setUserAnswer(activeQuestion.answers![i])}
                    disabled={!!result}
                    className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition disabled:opacity-60"
                    title="Πάτα για auto-fill"
                  >
                    {activeQuestion.answers![i]}
                  </button>
                ))}
              </div>
            )}

            {/* Answer Area */}
            <div className="mt-6">
              {activeQuestion.kind === "top5" ? (
                <>
                  <div className="text-sm text-gray-300 mb-2">
                    Δώσε 5 απαντήσεις. Έχεις 2 λάθη max.
                  </div>

                  <div className="grid grid-cols-1 gap-2 mb-4">
                    {(activeQuestion.top5 ?? Array(5).fill("")).map((_, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl border border-white/10 bg-white/5 flex items-center justify-between"
                      >
                        <span className="text-gray-300">#{i + 1}</span>
                        <span className="font-semibold">
                          {top5Found[i] || !!result ? activeQuestion.top5?.[i] : "—"}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="text-sm text-gray-400 mb-3">
                    Λάθη: <span className="font-bold">{top5Strikes}</span>/2
                    {top5Message ? <span className="ml-3">{top5Message}</span> : null}
                  </div>

                  {top5AllowStop && !result && (
                    <div className="mb-4 p-4 rounded-xl border border-white/10 bg-white/5">
                      <div className="text-sm text-gray-200 mb-3">
                        Θες να σταματήσεις και να πάρεις <b>1 πόντο</b> ή συνεχίζεις για{" "}
                        <b>{activePoints} πόντους</b>;
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={top5StopAndTake1}
                          className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 transition font-semibold"
                        >
                          Stop (1 πόντος)
                        </button>
                        <button
                          onClick={top5Continue}
                          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 transition font-semibold"
                        >
                          Continue ({activePoints} πόντοι)
                        </button>
                      </div>
                    </div>
                  )}

                  <label className="block text-sm text-gray-300 mb-2">
                    Γράψε μία απάντηση:
                  </label>

                  <input
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") submitAnswer();
                    }}
                    disabled={!!result}
                    className="w-full p-3 rounded-xl bg-white text-black placeholder-gray-500 outline-none focus:ring-4 focus:ring-blue-500/40 disabled:opacity-60"
                  />

                  <div className="mt-3 flex gap-3">
                    <button
                      onClick={submitAnswer}
                      disabled={!userAnswer.trim() || !!result}
                      className="px-4 py-3 rounded-xl bg-green-600 hover:bg-green-700 disabled:opacity-40 disabled:hover:bg-green-600 transition font-semibold"
                    >
                      Submit
                    </button>

                    {result && (
                      <button
                        onClick={continueAfterResult}
                        className="px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition font-semibold"
                      >
                        Continue
                      </button>
                    )}
                  </div>

                  {result && (
                    <div className="mt-4 p-4 rounded-xl border border-white/10 bg-white/5">
                      <div className="text-2xl font-bold">
                        {result.isCorrect ? "✅ Correct" : "❌ False"}
                      </div>
                      <div className="mt-2 text-gray-200 whitespace-pre-line">
  {result.correct}
</div>

                    </div>
                  )}
                </>
              ) : (
                <>
                  <label className="block text-sm text-gray-300 mb-2">
                    Γράψε την απάντηση:
                  </label>

                  <input
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") submitAnswer();
                    }}
                    disabled={!!result}
                    className="w-full p-3 rounded-xl bg-white text-black placeholder-gray-500 outline-none focus:ring-4 focus:ring-blue-500/40 disabled:opacity-60"
                  />

                  <div className="mt-3 flex gap-3">
                    <button
                      onClick={submitAnswer}
                      disabled={!userAnswer.trim() || !!result}
                      className="px-4 py-3 rounded-xl bg-green-600 hover:bg-green-700 disabled:opacity-40 disabled:hover:bg-green-600 transition font-semibold"
                    >
                      Submit
                    </button>

                    {result && (
                      <button
                        onClick={continueAfterResult}
                        className="px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition font-semibold"
                      >
                        Continue
                      </button>
                    )}
                  </div>

                  {result && (
                    <div className="mt-4 p-4 rounded-xl border border-white/10 bg-white/5">
                      <div className="text-2xl font-bold">
                        {result.isCorrect ? "✅ Correct" : "❌ False"}
                      </div>
                      <div className="mt-2 text-gray-200">
                        Σωστή απάντηση:{" "}
                        <span className="font-semibold">{result.correct}</span>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
