import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Pause,
  Play,
  RefreshCw,
  Volume2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

// --------------- Constants ---------------

const GRID_SIZE = 12;
const MAX_SPEED_INTERVAL = 900;
const MIN_SPEED_INTERVAL = 150;
const SPEED_STEP = 75;
const SPEED_DECREASE_STEP = 20;
const SCORE_PER_LETTER = 10;
const MEI_SERIES_COUNT = 18;

const LETTER_SETS = [
  {
    name: "க வரிசை",
    short: "க",
    isEnglish: false,
    letters: [
      "க",
      "கா",
      "கி",
      "கீ",
      "கு",
      "கூ",
      "கெ",
      "கே",
      "கை",
      "கொ",
      "கோ",
      "கௌ",
    ],
  },
  {
    name: "ங வரிசை",
    short: "ங",
    isEnglish: false,
    letters: [
      "ங",
      "ஙா",
      "ஙி",
      "ஙீ",
      "ஙு",
      "ஙூ",
      "ஙெ",
      "ஙே",
      "ஙை",
      "ஙொ",
      "ஙோ",
      "ஙௌ",
    ],
  },
  {
    name: "ச வரிசை",
    short: "ச",
    isEnglish: false,
    letters: [
      "ச",
      "சா",
      "சி",
      "சீ",
      "சு",
      "சூ",
      "செ",
      "சே",
      "சை",
      "சொ",
      "சோ",
      "சௌ",
    ],
  },
  {
    name: "ஞ வரிசை",
    short: "ஞ",
    isEnglish: false,
    letters: [
      "ஞ",
      "ஞா",
      "ஞி",
      "ஞீ",
      "ஞு",
      "ஞூ",
      "ஞெ",
      "ஞே",
      "ஞை",
      "ஞொ",
      "ஞோ",
      "ஞௌ",
    ],
  },
  {
    name: "ட வரிசை",
    short: "ட",
    isEnglish: false,
    letters: [
      "ட",
      "டா",
      "டி",
      "டீ",
      "டு",
      "டூ",
      "டெ",
      "டே",
      "டை",
      "டொ",
      "டோ",
      "டௌ",
    ],
  },
  {
    name: "ண வரிசை",
    short: "ண",
    isEnglish: false,
    letters: [
      "ண",
      "ணா",
      "ணி",
      "ணீ",
      "ணு",
      "ணூ",
      "ணெ",
      "ணே",
      "ணை",
      "ணொ",
      "ணோ",
      "ணௌ",
    ],
  },
  {
    name: "த வரிசை",
    short: "த",
    isEnglish: false,
    letters: [
      "த",
      "தா",
      "தி",
      "தீ",
      "து",
      "தூ",
      "தெ",
      "தே",
      "தை",
      "தொ",
      "தோ",
      "தௌ",
    ],
  },
  {
    name: "ந வரிசை",
    short: "ந",
    isEnglish: false,
    letters: [
      "ந",
      "நா",
      "நி",
      "நீ",
      "நு",
      "நூ",
      "நெ",
      "நே",
      "நை",
      "நொ",
      "நோ",
      "நௌ",
    ],
  },
  {
    name: "ப வரிசை",
    short: "ப",
    isEnglish: false,
    letters: [
      "ப",
      "பா",
      "பி",
      "பீ",
      "பு",
      "பூ",
      "பெ",
      "பே",
      "பை",
      "பொ",
      "போ",
      "பௌ",
    ],
  },
  {
    name: "ம வரிசை",
    short: "ம",
    isEnglish: false,
    letters: [
      "ம",
      "மா",
      "மி",
      "மீ",
      "மு",
      "மூ",
      "மெ",
      "மே",
      "மை",
      "மொ",
      "மோ",
      "மௌ",
    ],
  },
  {
    name: "ய வரிசை",
    short: "ய",
    isEnglish: false,
    letters: [
      "ய",
      "யா",
      "யி",
      "யீ",
      "யு",
      "யூ",
      "யெ",
      "யே",
      "யை",
      "யொ",
      "யோ",
      "யௌ",
    ],
  },
  {
    name: "ர வரிசை",
    short: "ர",
    isEnglish: false,
    letters: [
      "ர",
      "ரா",
      "ரி",
      "ரீ",
      "ரு",
      "ரூ",
      "ரெ",
      "ரே",
      "ரை",
      "ரொ",
      "ரோ",
      "ரௌ",
    ],
  },
  {
    name: "ல வரிசை",
    short: "ல",
    isEnglish: false,
    letters: [
      "ல",
      "லா",
      "லி",
      "லீ",
      "லு",
      "லூ",
      "லெ",
      "லே",
      "லை",
      "லொ",
      "லோ",
      "லௌ",
    ],
  },
  {
    name: "வ வரிசை",
    short: "வ",
    isEnglish: false,
    letters: [
      "வ",
      "வா",
      "வி",
      "வீ",
      "வு",
      "வூ",
      "வெ",
      "வே",
      "வை",
      "வொ",
      "வோ",
      "வௌ",
    ],
  },
  {
    name: "ழ வரிசை",
    short: "ழ",
    isEnglish: false,
    letters: [
      "ழ",
      "ழா",
      "ழி",
      "ழீ",
      "ழு",
      "ழூ",
      "ழெ",
      "ழே",
      "ழை",
      "ழொ",
      "ழோ",
      "ழௌ",
    ],
  },
  {
    name: "ள வரிசை",
    short: "ள",
    isEnglish: false,
    letters: [
      "ள",
      "ளா",
      "ளி",
      "ளீ",
      "ளு",
      "ளூ",
      "ளெ",
      "ளே",
      "ளை",
      "ளொ",
      "ளோ",
      "ளௌ",
    ],
  },
  {
    name: "ற வரிசை",
    short: "ற",
    isEnglish: false,
    letters: [
      "ற",
      "றா",
      "றி",
      "றீ",
      "று",
      "றூ",
      "றெ",
      "றே",
      "றை",
      "றொ",
      "றோ",
      "றௌ",
    ],
  },
  {
    name: "ன வரிசை",
    short: "ன",
    isEnglish: false,
    letters: [
      "ன",
      "னா",
      "னி",
      "னீ",
      "னு",
      "னூ",
      "னெ",
      "னே",
      "னை",
      "னொ",
      "னோ",
      "னௌ",
    ],
  },
  {
    name: "உயிர் எழுத்து",
    short: "உயிர்",
    isEnglish: false,
    letters: ["அ", "ஆ", "இ", "ஈ", "உ", "ஊ", "எ", "ஏ", "ஐ", "ஒ", "ஓ", "ஔ"],
  },
  {
    name: "ABC Part 1",
    short: "ABC1",
    isEnglish: true,
    letters: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"],
  },
  {
    name: "ABC Part 2",
    short: "ABC2",
    isEnglish: true,
    letters: ["M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X"],
  },
  {
    name: "ABC Part 3",
    short: "ABC3",
    isEnglish: true,
    letters: ["Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j"],
  },
];

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
type GameStatus =
  | "idle"
  | "playing"
  | "paused"
  | "gameover"
  | "levelcomplete"
  | "allcomplete";
type GameOverReason = "wall" | "self" | "wrong" | null;

interface Position {
  x: number;
  y: number;
}

interface GameState {
  snake: Position[];
  foodPositions: Map<string, number>;
  direction: Direction;
  status: GameStatus;
  score: number;
  level: number;
  targetLetterIndex: number;
  setIndex: number;
  lettersEaten: number;
  speedInterval: number;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j] as T, a[i] as T];
  }
  return a;
}

function placeAllLetters(
  snake: Position[],
  count: number,
): Map<string, number> {
  const occupied = new Set(snake.map((p) => `${p.x},${p.y}`));
  const empty: Position[] = [];
  for (let y = 0; y < GRID_SIZE; y++)
    for (let x = 0; x < GRID_SIZE; x++)
      if (!occupied.has(`${x},${y}`)) empty.push({ x, y });
  const chosen = shuffle(empty).slice(0, count);
  const map = new Map<string, number>();
  chosen.forEach((pos, i) => map.set(`${pos.x},${pos.y}`, i));
  return map;
}

function getLetterToSpeak(letter: string, setIndex: number): string {
  if (setIndex === 1) {
    return letter
      .replace(/ஙௌ/g, "ஞௌ")
      .replace(/ஙோ/g, "ஞோ")
      .replace(/ஙொ/g, "ஞொ")
      .replace(/ஙை/g, "ஞை")
      .replace(/ஙே/g, "ஞே")
      .replace(/ஙெ/g, "ஞெ")
      .replace(/ஙூ/g, "ஞூ")
      .replace(/ஙு/g, "ஞு")
      .replace(/ஙீ/g, "ஞீ")
      .replace(/ஙி/g, "ஞி")
      .replace(/ஙா/g, "ஞா")
      .replace(/ங/g, "ஞ");
  }
  return letter;
}

function speakLetter(letter: string, isEnglish: boolean, setIndex: number) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(
    getLetterToSpeak(letter, setIndex),
  );
  utterance.lang = isEnglish ? "en-US" : "ta-IN";
  utterance.rate = 0.8;
  window.speechSynthesis.speak(utterance);
}

function getOpposite(dir: Direction): Direction {
  return { UP: "DOWN", DOWN: "UP", LEFT: "RIGHT", RIGHT: "LEFT" }[
    dir
  ] as Direction;
}

function buildInitialState(
  setIndex: number,
  score = 0,
  level = 1,
  speedInterval = 750,
): GameState {
  const cx = Math.floor(GRID_SIZE / 2);
  const cy = Math.floor(GRID_SIZE / 2);
  const snake: Position[] = [
    { x: cx, y: cy },
    { x: cx - 1, y: cy },
    { x: cx - 2, y: cy },
  ];
  return {
    snake,
    foodPositions: placeAllLetters(snake, LETTER_SETS[setIndex].letters.length),
    direction: "RIGHT",
    status: "idle",
    score,
    level,
    targetLetterIndex: 0,
    setIndex,
    lettersEaten: 0,
    speedInterval,
  };
}

export default function SnakeGame() {
  const [displayState, setDisplayState] = useState<GameState>(() =>
    buildInitialState(0),
  );
  const [gameOverReason, setGameOverReason] = useState<GameOverReason>(null);

  const stateRef = useRef<GameState>(displayState);
  const nextDirRef = useRef<Direction>("RIGHT");
  const boardRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const levelTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const syncState = useCallback((s: GameState) => {
    stateRef.current = s;
    setDisplayState(s);
  }, []);

  const tickRef = useRef<() => void>(() => {});
  tickRef.current = () => {
    const s = stateRef.current;
    if (s.status !== "playing") return;

    const dir = nextDirRef.current;
    const head = s.snake[0];
    let nx = head.x;
    let ny = head.y;

    if (dir === "UP") ny -= 1;
    else if (dir === "DOWN") ny += 1;
    else if (dir === "LEFT") nx -= 1;
    else nx += 1;

    if (nx < 0 || nx >= GRID_SIZE || ny < 0 || ny >= GRID_SIZE) {
      setGameOverReason("wall");
      syncState({ ...s, direction: dir, status: "gameover" });
      return;
    }
    if (s.snake.some((seg) => seg.x === nx && seg.y === ny)) {
      setGameOverReason("self");
      syncState({ ...s, direction: dir, status: "gameover" });
      return;
    }

    const newHead = { x: nx, y: ny };
    const headKey = `${nx},${ny}`;
    const foodLetterIdx = s.foodPositions.get(headKey);
    const isAnyFood = foodLetterIdx !== undefined;
    const isCorrectFood = isAnyFood && foodLetterIdx === s.targetLetterIndex;

    if (isAnyFood && !isCorrectFood) {
      setGameOverReason("wrong");
      syncState({ ...s, direction: dir, status: "gameover" });
      return;
    }

    const newSnake = isCorrectFood
      ? [newHead, ...s.snake]
      : [newHead, ...s.snake.slice(0, -1)];

    if (!isCorrectFood) {
      syncState({ ...s, snake: newSnake, direction: dir });
      return;
    }

    const currentSet = LETTER_SETS[s.setIndex];
    const eatenLetter = currentSet.letters[s.targetLetterIndex] ?? "";
    speakLetter(eatenLetter, currentSet.isEnglish, s.setIndex);

    const newFoodPositions = new Map(s.foodPositions);
    newFoodPositions.delete(headKey);

    const newTargetIndex = s.targetLetterIndex + 1;
    const newLettersEaten = s.lettersEaten + 1;
    const newScore = s.score + SCORE_PER_LETTER;
    let newSpeedInterval = s.speedInterval;
    if (newLettersEaten % 3 === 0)
      newSpeedInterval = Math.max(
        MIN_SPEED_INTERVAL,
        s.speedInterval - SPEED_DECREASE_STEP,
      );

    if (newTargetIndex >= currentSet.letters.length) {
      const isMeiSeries = s.setIndex < MEI_SERIES_COUNT;
      const isLastMei = s.setIndex === MEI_SERIES_COUNT - 1;
      const status: GameStatus =
        isMeiSeries && isLastMei ? "allcomplete" : "levelcomplete";

      syncState({
        ...s,
        snake: newSnake,
        foodPositions: new Map(),
        direction: dir,
        score: newScore,
        level: s.level + 1,
        targetLetterIndex: 0,
        lettersEaten: newLettersEaten,
        speedInterval: newSpeedInterval,
        status,
      });

      if (status === "levelcomplete") {
        if (levelTimerRef.current) clearTimeout(levelTimerRef.current);
        levelTimerRef.current = setTimeout(() => {
          const cur = stateRef.current;
          if (cur.status !== "levelcomplete") return;
          const nextSetIndex = isMeiSeries ? s.setIndex + 1 : s.setIndex;
          const nextState = buildInitialState(
            nextSetIndex,
            newScore,
            cur.level,
            newSpeedInterval,
          );
          const playing: GameState = { ...nextState, status: "playing" };
          stateRef.current = playing;
          setDisplayState(playing);
          nextDirRef.current = "RIGHT";
        }, 2200);
      }
      return;
    }

    syncState({
      ...s,
      snake: newSnake,
      foodPositions: newFoodPositions,
      direction: dir,
      score: newScore,
      targetLetterIndex: newTargetIndex,
      lettersEaten: newLettersEaten,
      speedInterval: newSpeedInterval,
    });
  };

  useEffect(() => {
    if (displayState.status !== "playing") return;
    const id = setInterval(() => tickRef.current(), displayState.speedInterval);
    return () => clearInterval(id);
  }, [displayState.status, displayState.speedInterval]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      let dir: Direction | null = null;
      if (e.key === "ArrowUp") dir = "UP";
      else if (e.key === "ArrowDown") dir = "DOWN";
      else if (e.key === "ArrowLeft") dir = "LEFT";
      else if (e.key === "ArrowRight") dir = "RIGHT";
      else return;
      e.preventDefault();
      const s = stateRef.current;
      if (dir === getOpposite(s.direction)) return;
      nextDirRef.current = dir;
      if (s.status === "idle") {
        const started: GameState = { ...s, status: "playing" };
        stateRef.current = started;
        setDisplayState(started);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const board = boardRef.current;
    if (!board) return;
    const prevent = (e: TouchEvent) => e.preventDefault();
    board.addEventListener("touchmove", prevent, { passive: false });
    return () => board.removeEventListener("touchmove", prevent);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
    const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
    touchStartRef.current = null;
    if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;
    const s = stateRef.current;
    let dir: Direction;
    if (Math.abs(dx) > Math.abs(dy)) dir = dx > 0 ? "RIGHT" : "LEFT";
    else dir = dy > 0 ? "DOWN" : "UP";
    if (dir === getOpposite(s.direction)) return;
    nextDirRef.current = dir;
    if (s.status === "idle" || s.status === "paused") {
      const started: GameState = { ...s, status: "playing" };
      stateRef.current = started;
      setDisplayState(started);
    }
  }, []);

  const handleDpad = useCallback((dir: Direction) => {
    const s = stateRef.current;
    if (dir === getOpposite(s.direction)) return;
    nextDirRef.current = dir;
    if (s.status === "idle" || s.status === "paused") {
      const started: GameState = { ...s, status: "playing" };
      stateRef.current = started;
      setDisplayState(started);
    }
  }, []);

  const handleNewGame = useCallback(
    (setIndex?: number) => {
      const idx = setIndex !== undefined ? setIndex : stateRef.current.setIndex;
      if (levelTimerRef.current) clearTimeout(levelTimerRef.current);
      nextDirRef.current = "RIGHT";
      setGameOverReason(null);
      syncState(buildInitialState(idx, 0, 1, stateRef.current.speedInterval));
    },
    [syncState],
  );

  const handleSpeedChange = useCallback(
    (delta: number) => {
      const s = stateRef.current;
      const newInterval = Math.min(
        MAX_SPEED_INTERVAL,
        Math.max(MIN_SPEED_INTERVAL, s.speedInterval + delta),
      );
      syncState({ ...s, speedInterval: newInterval });
    },
    [syncState],
  );

  const handlePause = useCallback(() => {
    const s = stateRef.current;
    if (s.status === "playing") syncState({ ...s, status: "paused" });
    else if (s.status === "paused") syncState({ ...s, status: "playing" });
  }, [syncState]);

  const handleReplay = useCallback(() => {
    const s = stateRef.current;
    const set = LETTER_SETS[s.setIndex];
    speakLetter(
      set.letters[s.targetLetterIndex] ?? "",
      set.isEnglish,
      s.setIndex,
    );
  }, []);

  const s = displayState;
  const currentSet = LETTER_SETS[s.setIndex];
  const tamilFont = "'Noto Sans Tamil', 'Latha', sans-serif";
  const isMeiSeries = s.setIndex < MEI_SERIES_COUNT;
  const seriesLabel = isMeiSeries
    ? `${s.setIndex + 1}/18: ${currentSet.short}`
    : currentSet.short;
  const snakeHeadKey =
    s.snake.length > 0 ? `${s.snake[0].x},${s.snake[0].y}` : "";
  const snakeBodySet = new Set(s.snake.slice(1).map((p) => `${p.x},${p.y}`));
  const nextSeriesIndex = (s.setIndex + 1) % LETTER_SETS.length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Tamil:wght@400;700&display=swap');

        * { box-sizing: border-box; }

        .snake-root {
          width: 100vw;
          height: 100dvh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          background: linear-gradient(135deg, #071829 0%, #0B2A45 100%);
        }

        /* ---------- HEADER ---------- */
        .snake-header {
          flex: 0 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 4px 10px;
          background: #071829;
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }

        /* ---------- MAIN ---------- */
        .snake-main {
          flex: 1 1 0;
          min-height: 0;
          display: flex;
          flex-direction: column;
          padding: 4px;
          gap: 4px;
          overflow: hidden;
        }

        .snake-infobar {
          flex: 0 0 auto;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 4px 10px;
          background: rgba(255,255,255,0.04);
          border-radius: 10px;
        }

        /* ---------- GAME AREA ---------- */
        .snake-game-area {
          flex: 1 1 0;
          min-height: 0;
          display: flex;
          flex-direction: row;
          gap: 6px;
          overflow: hidden;
        }

        /* BOARD: always square, fills available height */
        .snake-board-col {
          flex: 0 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          /* square based on height */
          height: 100%;
          aspect-ratio: 1;
          min-width: 0;
        }

        .rainbow-border {
          width: 100%;
          height: 100%;
          border: 3px solid #ec4899;
          border-radius: 10px;
          animation: rainbow-border 2s linear infinite;
          overflow: hidden;
        }

        .snake-board-grid {
          width: 100%;
          height: 100%;
          display: grid;
          grid-template-columns: repeat(${GRID_SIZE}, 1fr);
          gap: 1px;
          background: #0a3d1e;
          border-radius: 8px;
          overflow: hidden;
        }

        .board-cell {
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          position: relative;
        }

        /* SIDE PANEL */
        .snake-side-col {
          flex: 1 1 0;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 6px;
          overflow: hidden;
        }

        /* D-pad */
        .dpad-btn {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #1FA3E0;
          color: white;
          font-weight: bold;
          cursor: pointer;
          user-select: none;
          border: none;
          transition: transform 0.1s;
        }
        .dpad-btn:active { transform: scale(0.92); }

        @keyframes rainbow-border {
          0%   { border-color: #ec4899; }
          16%  { border-color: #f97316; }
          33%  { border-color: #eab308; }
          50%  { border-color: #22c55e; }
          66%  { border-color: #06b6d4; }
          83%  { border-color: #8b5cf6; }
          100% { border-color: #ec4899; }
        }

        .food-other  { background: #2a4a6a !important; }
        .food-target { background: #ff8c00 !important; }
        .snake-head  { background: #88ff99 !important; border-radius: 3px; }
        .snake-body  { background: #33cc55 !important; border-radius: 3px; }

        /* Mobile portrait: board takes full width, side below */
        @media (orientation: portrait) {
          .snake-game-area {
            flex-direction: column;
          }
          .snake-board-col {
            height: auto;
            width: 100%;
            aspect-ratio: 1;
            max-height: 55dvh;
          }
          .snake-side-col {
            flex: 1 1 auto;
          }
        }
      `}</style>

      <div className="snake-root" data-ocid="game.page">
        {/* HEADER */}
        <header className="snake-header">
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 20 }}>🐍</span>
            <span
              style={{
                fontWeight: 800,
                fontSize: 14,
                background: "linear-gradient(90deg,#ec4899,#f97316,#eab308)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Tamil Snake
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                padding: "2px 10px",
                background: "#0a2040",
                color: "#7ec8f0",
                borderRadius: 20,
                fontFamily: tamilFont,
              }}
            >
              {seriesLabel}
            </span>
            <button
              type="button"
              onClick={() => handleNewGame()}
              style={{
                background: "#1E88E5",
                color: "white",
                border: "none",
                borderRadius: 8,
                padding: "4px 12px",
                fontWeight: 700,
                fontSize: 12,
                cursor: "pointer",
              }}
              data-ocid="game.primary_button"
            >
              New
            </button>
          </div>
        </header>

        {/* MAIN */}
        <main className="snake-main">
          {/* Info bar */}
          <div className="snake-infobar">
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  color: "#60a5fa",
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                }}
              >
                Score
              </div>
              <div
                style={{ color: "white", fontSize: 16, fontWeight: 700 }}
                data-ocid="game.score"
              >
                {s.score}
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  color: "#60a5fa",
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                }}
              >
                Level
              </div>
              <div
                style={{ color: "white", fontSize: 16, fontWeight: 700 }}
                data-ocid="game.level"
              >
                {s.level}
              </div>
            </div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                padding: "2px 10px",
                background: "#0a2040",
                color: "#fb923c",
                borderRadius: 20,
                fontFamily: currentSet.isEnglish ? "inherit" : tamilFont,
              }}
            >
              {currentSet.name}
            </div>
            <div
              style={{
                marginLeft: "auto",
                fontSize: 11,
                color: "rgba(147,197,253,0.6)",
                fontFamily: tamilFont,
              }}
            >
              {s.targetLetterIndex}/{currentSet.letters.length}
            </div>
          </div>

          {/* Game area */}
          <div className="snake-game-area">
            {/* Board column */}
            <div className="snake-board-col">
              <div className="rainbow-border">
                <div
                  ref={boardRef}
                  className="snake-board-grid"
                  style={{ background: "#0F4D2A" }}
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                  data-ocid="game.canvas_target"
                >
                  {Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => {
                    const x = i % GRID_SIZE;
                    const y = Math.floor(i / GRID_SIZE);
                    const key = `${x},${y}`;
                    const isHead = key === snakeHeadKey;
                    const isBody = snakeBodySet.has(key);
                    const foodLetterIdx = s.foodPositions.get(key);
                    const isFood = foodLetterIdx !== undefined;
                    const isTarget =
                      isFood && foodLetterIdx === s.targetLetterIndex;
                    const isEven = (x + y) % 2 === 0;

                    let cellClass = "board-cell";
                    let bg = isEven ? "#0F4D2A" : "#145A32";
                    if (isHead) cellClass += " snake-head";
                    else if (isBody) cellClass += " snake-body";
                    else if (isTarget) cellClass += " food-target";
                    else if (isFood) cellClass += " food-other";

                    const displayLetter = isFood
                      ? (currentSet.letters[foodLetterIdx] ?? "")
                      : "";

                    return (
                      <div
                        key={`cell-${x}-${y}`}
                        className={cellClass}
                        style={{
                          background:
                            isHead || isBody || isFood ? undefined : bg,
                        }}
                      >
                        {isFood && !isHead && (
                          <span
                            style={{
                              fontWeight: 700,
                              lineHeight: 1,
                              fontSize:
                                displayLetter.length >= 3
                                  ? "clamp(5px, 1.1vmin, 12px)"
                                  : displayLetter.length === 2
                                    ? "clamp(6px, 1.4vmin, 14px)"
                                    : "clamp(8px, 1.8vmin, 18px)",
                              fontFamily: currentSet.isEnglish
                                ? "inherit"
                                : tamilFont,
                              color: isTarget ? "#1a0a00" : "#c8e8ff",
                              userSelect: "none",
                            }}
                          >
                            {displayLetter}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              {(s.status === "idle" || s.status === "paused") && (
                <div
                  style={{
                    color: "#fde047",
                    fontSize: 10,
                    fontWeight: 600,
                    textAlign: "center",
                    marginTop: 2,
                  }}
                  className="animate-pulse"
                >
                  {s.status === "idle"
                    ? "⬆ Press arrow or D-pad to start!"
                    : "⏸ Paused — press arrow or D-pad to resume"}
                </div>
              )}
            </div>

            {/* Side panel */}
            <div className="snake-side-col">
              {/* Replay button */}
              <div
                style={{
                  background: "#0a1f35",
                  borderRadius: 10,
                  padding: "6px 10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span
                  style={{
                    color: "#60a5fa",
                    fontSize: 9,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    fontFamily: tamilFont,
                  }}
                >
                  ஒலி
                </span>
                <button
                  type="button"
                  onClick={handleReplay}
                  style={{
                    background: "#0e2d50",
                    color: "#93c5fd",
                    border: "none",
                    borderRadius: 8,
                    padding: "4px 10px",
                    fontSize: 11,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    cursor: "pointer",
                    fontFamily: tamilFont,
                  }}
                  data-ocid="game.replay.button"
                >
                  <Volume2 size={12} /> கேள்
                </button>
              </div>

              {/* Controls row */}
              <div
                style={{ display: "flex", gap: 8, alignItems: "flex-start" }}
              >
                {/* D-pad */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 3,
                    flexShrink: 0,
                  }}
                >
                  <button
                    type="button"
                    className="dpad-btn"
                    onClick={() => handleDpad("UP")}
                    data-ocid="game.up.button"
                    aria-label="Up"
                  >
                    <ChevronUp size={18} />
                  </button>
                  <div style={{ display: "flex", gap: 3 }}>
                    <button
                      type="button"
                      className="dpad-btn"
                      onClick={() => handleDpad("LEFT")}
                      data-ocid="game.left.button"
                      aria-label="Left"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        background: "#0a1f35",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <span style={{ color: "#1FA3E0", fontSize: 18 }}>◆</span>
                    </div>
                    <button
                      type="button"
                      className="dpad-btn"
                      onClick={() => handleDpad("RIGHT")}
                      data-ocid="game.right.button"
                      aria-label="Right"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                  <button
                    type="button"
                    className="dpad-btn"
                    onClick={() => handleDpad("DOWN")}
                    data-ocid="game.down.button"
                    aria-label="Down"
                  >
                    <ChevronDown size={18} />
                  </button>
                </div>

                {/* Speed + buttons */}
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                  }}
                >
                  {/* Speed */}
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 6 }}
                  >
                    <span
                      style={{
                        color: "#60a5fa",
                        fontSize: 9,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: 1,
                        fontFamily: tamilFont,
                      }}
                    >
                      வேகம்
                    </span>
                    <button
                      type="button"
                      onClick={() => handleSpeedChange(+SPEED_STEP)}
                      style={{
                        background: "#0a1f35",
                        color: "#94a3b8",
                        border: "none",
                        borderRadius: 8,
                        width: 34,
                        height: 34,
                        fontSize: 20,
                        fontWeight: 700,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      data-ocid="game.speed.button.1"
                      title="Slower"
                    >
                      −
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSpeedChange(-SPEED_STEP)}
                      style={{
                        background: "#0a1f35",
                        color: "#94a3b8",
                        border: "none",
                        borderRadius: 8,
                        width: 34,
                        height: 34,
                        fontSize: 20,
                        fontWeight: 700,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      data-ocid="game.speed.button.2"
                      title="Faster"
                    >
                      +
                    </button>
                  </div>

                  {/* Action buttons */}
                  <div style={{ display: "flex", gap: 4 }}>
                    <button
                      type="button"
                      onClick={handlePause}
                      disabled={
                        s.status === "idle" ||
                        s.status === "gameover" ||
                        s.status === "allcomplete"
                      }
                      style={{
                        flex: 1,
                        padding: "6px 0",
                        background: "#0a1f35",
                        color: "#94a3b8",
                        border: "none",
                        borderRadius: 8,
                        fontSize: 10,
                        fontWeight: 700,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 3,
                        opacity:
                          s.status === "idle" ||
                          s.status === "gameover" ||
                          s.status === "allcomplete"
                            ? 0.4
                            : 1,
                      }}
                      data-ocid="game.pause.button"
                    >
                      {s.status === "paused" ? (
                        <>
                          <Play size={10} />
                          Resume
                        </>
                      ) : (
                        <>
                          <Pause size={10} />
                          Pause
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleNewGame()}
                      style={{
                        flex: 1,
                        padding: "6px 0",
                        background: "#1E88E5",
                        color: "white",
                        border: "none",
                        borderRadius: 8,
                        fontSize: 10,
                        fontWeight: 700,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 3,
                      }}
                      data-ocid="game.new_game.button"
                    >
                      <RefreshCw size={10} />
                      New
                    </button>
                    <button
                      type="button"
                      onClick={() => handleNewGame(nextSeriesIndex)}
                      style={{
                        flex: 1,
                        padding: "6px 0",
                        background: "#16a34a",
                        color: "white",
                        border: "none",
                        borderRadius: 8,
                        fontSize: 10,
                        fontWeight: 700,
                        cursor: "pointer",
                        fontFamily: tamilFont,
                      }}
                      data-ocid="game.next.button"
                    >
                      அடுத்து
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* GAME OVER */}
        <AnimatePresence>
          {s.status === "gameover" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.85)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 50,
              }}
              data-ocid="game.dialog"
            >
              <motion.div
                initial={{ scale: 0.75, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 18 }}
                style={{
                  background: "#0B2A45",
                  border: `1px solid ${gameOverReason === "wrong" ? "rgba(251,146,60,0.5)" : "rgba(239,68,68,0.4)"}`,
                  borderRadius: 16,
                  padding: 24,
                  textAlign: "center",
                  minWidth: 260,
                  maxWidth: "90vw",
                }}
              >
                {gameOverReason === "wrong" ? (
                  <>
                    <div style={{ fontSize: 40, marginBottom: 8 }}>😢</div>
                    <h2
                      style={{
                        color: "#fb923c",
                        fontFamily: tamilFont,
                        fontSize: 24,
                        fontWeight: 800,
                        marginBottom: 4,
                      }}
                    >
                      தோற்றுவிட்டாய்!
                    </h2>
                    <p
                      style={{
                        color: "#fed7aa",
                        fontSize: 13,
                        fontFamily: tamilFont,
                        marginBottom: 4,
                      }}
                    >
                      தவறான எழுத்தை சாப்பிட்டுவிட்டாய்!
                    </p>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: 40, marginBottom: 8 }}>💀</div>
                    <h2
                      style={{
                        color: "#f87171",
                        fontSize: 24,
                        fontWeight: 800,
                        marginBottom: 4,
                      }}
                    >
                      GAME OVER
                    </h2>
                  </>
                )}
                <p style={{ color: "white", fontSize: 18, marginBottom: 4 }}>
                  Score:{" "}
                  <span style={{ color: "#fbbf24", fontWeight: 700 }}>
                    {s.score}
                  </span>
                </p>
                <p
                  style={{
                    color: "#93c5fd",
                    fontSize: 11,
                    fontFamily: tamilFont,
                    marginBottom: 16,
                  }}
                >
                  {currentSet.name} • {s.targetLetterIndex}/
                  {currentSet.letters.length} எழுத்துக்கள்
                </p>
                <button
                  type="button"
                  onClick={() => handleNewGame()}
                  style={{
                    background: "#1E88E5",
                    color: "white",
                    border: "none",
                    borderRadius: 12,
                    padding: "10px 24px",
                    fontWeight: 700,
                    fontSize: 15,
                    cursor: "pointer",
                  }}
                  data-ocid="game.restart.button"
                >
                  மீண்டும் விளையாடு 🎮
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* LEVEL COMPLETE */}
        <AnimatePresence>
          {s.status === "levelcomplete" && (
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.8 }}
              transition={{ type: "spring", damping: 16 }}
              style={{
                position: "fixed",
                top: 64,
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 50,
              }}
            >
              <div
                style={{
                  background: "linear-gradient(135deg,#f59e0b,#ef4444)",
                  borderRadius: 16,
                  padding: "12px 24px",
                  textAlign: "center",
                  color: "white",
                  minWidth: 200,
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 2 }}>🎉</div>
                <div style={{ fontSize: 18, fontWeight: 800 }}>
                  SERIES COMPLETE!
                </div>
                <div
                  style={{ fontSize: 11, opacity: 0.9, fontFamily: tamilFont }}
                >
                  {currentSet.name} — அடுத்த வரிசை வருகிறது…
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ALL COMPLETE */}
        <AnimatePresence>
          {s.status === "allcomplete" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.88)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 50,
              }}
              data-ocid="game.allcomplete.dialog"
            >
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 14 }}
                style={{
                  background: "linear-gradient(135deg,#0B2A45,#0a1f35)",
                  border: "2px solid #ffd700",
                  borderRadius: 16,
                  padding: 24,
                  textAlign: "center",
                  minWidth: 260,
                  maxWidth: "90vw",
                }}
              >
                <div style={{ fontSize: 48, marginBottom: 8 }}>🏆</div>
                <h2
                  style={{
                    color: "#ffd700",
                    fontFamily: tamilFont,
                    fontSize: 20,
                    fontWeight: 800,
                    marginBottom: 4,
                  }}
                >
                  அனைத்து வரிசைகளும் முடிந்தன!
                </h2>
                <p
                  style={{
                    color: "white",
                    fontFamily: tamilFont,
                    fontSize: 15,
                    marginBottom: 4,
                  }}
                >
                  18 வரிசைகள் முடிக்கப்பட்டன! 🌟
                </p>
                <p style={{ color: "white", fontSize: 18, marginBottom: 4 }}>
                  Total Score:{" "}
                  <span style={{ color: "#fbbf24", fontWeight: 700 }}>
                    {s.score}
                  </span>
                </p>
                <p style={{ color: "#93c5fd", fontSize: 11, marginBottom: 16 }}>
                  Congratulations! You learned all Tamil Mei letters!
                </p>
                <button
                  type="button"
                  onClick={() => handleNewGame(0)}
                  style={{
                    background: "#f97316",
                    color: "white",
                    border: "none",
                    borderRadius: 12,
                    padding: "10px 24px",
                    fontWeight: 700,
                    fontSize: 15,
                    cursor: "pointer",
                  }}
                  data-ocid="game.playagain.button"
                >
                  மீண்டும் விளையாடு 🎮
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
