import { useEffect, useRef, useState } from "react";

const MARIO_SIZE = 72;
const YOSHI_SIZE = 65;
const POOF_SIZE = 140;
const MEET_DIST = 30;
const POOF_DURATION = 1000;

type Pos = { x: number; y: number };
type MarioPos = Pos & { flipped: boolean };
type GameState =
  | { phase: "chasing" }
  | { phase: "poof"; meetPos: Pos }
  | { phase: "combined"; meetPos: Pos };

const INIT_YOSHI = (): Pos => ({
  x: window.innerWidth - 220,
  y: window.innerHeight - YOSHI_SIZE,
});
const INIT_MARIO = (): MarioPos => ({
  x: 0,
  y: window.innerHeight - MARIO_SIZE,
  flipped: false,
});

function imgStyle(size: number, flipped?: boolean) {
  return {
    position: "fixed" as const,
    width: "auto",
    height: size,
    imageRendering: "pixelated" as const,
    userSelect: "none" as const,
    ...(flipped ? { transform: "scaleX(-1)" } : {}),
  };
}

export default function MascotChase() {
  const [yoshiPos, setYoshiPos] = useState(INIT_YOSHI);
  const [marioPos, setMarioPos] = useState(INIT_MARIO);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [gameState, setGameState] = useState<GameState>({ phase: "chasing" });

  const yoshiPosRef = useRef(yoshiPos);
  const marioPosRef = useRef<MarioPos>(marioPos);
  const phaseRef = useRef<GameState["phase"]>("chasing");
  const isDraggingRef = useRef(false);
  const dragOffsetRef = useRef<Pos>({ x: 0, y: 0 });
  const animFrameRef = useRef<number | null>(null);
  const poofTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateYoshiPos = (x: number, y: number) => {
    const pos = { x, y };
    yoshiPosRef.current = pos;
    setYoshiPos(pos);
  };

  useEffect(() => {
    const chase = () => {
      if (phaseRef.current !== "chasing") {
        animFrameRef.current = requestAnimationFrame(chase);
        return;
      }

      const target = yoshiPosRef.current;
      const current = marioPosRef.current;
      const dx = target.x - current.x;
      const dy = target.y - current.y;
      const dist = Math.hypot(dx, dy);

      if (dist <= MEET_DIST) {
        const meetPos = {
          x: (target.x + YOSHI_SIZE / 2 + current.x + MARIO_SIZE / 2) / 2,
          y: (target.y + YOSHI_SIZE / 2 + current.y + MARIO_SIZE / 2) / 2,
        };
        phaseRef.current = "poof";
        setGameState({ phase: "poof", meetPos });
        poofTimerRef.current = setTimeout(() => {
          phaseRef.current = "combined";
          setGameState({ phase: "combined", meetPos });
        }, POOF_DURATION);
      } else if (dist >= 4) {
        const speed = Math.min(3, dist * 0.04);
        const next: MarioPos = {
          x: current.x + (dx / dist) * speed,
          y: current.y + (dy / dist) * speed,
          flipped: dx < 0,
        };
        marioPosRef.current = next;
        setMarioPos(next);
      }

      animFrameRef.current = requestAnimationFrame(chase);
    };
    animFrameRef.current = requestAnimationFrame(chase);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (poofTimerRef.current) clearTimeout(poofTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      updateYoshiPos(
        e.clientX - dragOffsetRef.current.x,
        e.clientY - dragOffsetRef.current.y,
      );
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current) return;
      const touch = e.touches[0];
      updateYoshiPos(
        touch.clientX - dragOffsetRef.current.x,
        touch.clientY - dragOffsetRef.current.y,
      );
    };
    const onUp = () => {
      isDraggingRef.current = false;
      setIsDragging(false);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onUp);
    };
  }, []);

  const handleReset = () => {
    const yoshi = INIT_YOSHI();
    const mario = INIT_MARIO();
    yoshiPosRef.current = yoshi;
    marioPosRef.current = mario;
    setYoshiPos(yoshi);
    setMarioPos(mario);
    phaseRef.current = "chasing";
    setGameState({ phase: "chasing" });
  };

  const startDrag = (clientX: number, clientY: number) => {
    if (phaseRef.current !== "chasing") return;
    isDraggingRef.current = true;
    setIsDragging(true);
    dragOffsetRef.current = {
      x: clientX - yoshiPosRef.current.x,
      y: clientY - yoshiPosRef.current.y,
    };
  };

  const yoshiFlipped = yoshiPos.x < window.innerWidth / 2;
  const isChasing = Math.hypot(yoshiPos.x - marioPos.x, yoshiPos.y - marioPos.y) >= 4;

  return (
    <>
      {gameState.phase === "chasing" && (
        <>
          <img
            src={isChasing ? "/img/mario-run.gif" : "/img/mario.png"}
            alt="mario"
            draggable={false}
            style={{
              ...imgStyle(MARIO_SIZE, marioPos.flipped),
              left: marioPos.x,
              top: marioPos.y,
              pointerEvents: "none",
              zIndex: 50,
            }}
          />
          <img
            src="/img/yoshi-run.gif"
            alt="yoshi"
            draggable={false}
            style={{
              ...imgStyle(YOSHI_SIZE, yoshiFlipped),
              left: yoshiPos.x,
              top: yoshiPos.y,
              pointerEvents: "none",
              zIndex: 51,
            }}
          />
          {/* 투명 오버레이: GIF 투명 픽셀에서도 마우스 이벤트 처리 */}
          <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onMouseDown={(e) => {
              e.preventDefault();
              startDrag(e.clientX, e.clientY);
            }}
            onTouchStart={(e) => {
              const touch = e.touches[0];
              startDrag(touch.clientX, touch.clientY);
            }}
            style={{
              position: "fixed",
              left: yoshiPos.x,
              top: yoshiPos.y,
              width: YOSHI_SIZE,
              height: YOSHI_SIZE,
              cursor: isDragging ? "grabbing" : "pointer",
              zIndex: 52,
            }}
          />
          {isHovered && !isDragging && (
            <div
              style={{
                position: "fixed",
                left: yoshiPos.x + 45,
                top: yoshiPos.y - 36,
                transform: "translateX(-50%)",
                background: "white",
                border: "2px solid black",
                borderRadius: 4,
                padding: "2px 8px",
                fontSize: 11,
                fontFamily: "monospace",
                boxShadow: "2px 2px 0 #000",
                whiteSpace: "nowrap",
                pointerEvents: "none",
                zIndex: 53,
              }}
            >
              drag me!
            </div>
          )}
        </>
      )}

      {gameState.phase === "poof" && (
        <img
          src="/img/poof.gif"
          alt="poof"
          draggable={false}
          style={{
            position: "fixed",
            left: gameState.meetPos.x - POOF_SIZE / 2,
            top: gameState.meetPos.y - POOF_SIZE / 2,
            width: POOF_SIZE,
            height: POOF_SIZE,
            imageRendering: "pixelated",
            pointerEvents: "none",
            zIndex: 52,
          }}
        />
      )}

      {gameState.phase === "combined" && (
        <img
          src="/img/marioandyoshi.gif"
          alt="mario and yoshi"
          draggable={false}
          onClick={handleReset}
          style={{
            position: "fixed",
            left: gameState.meetPos.x - MARIO_SIZE / 2,
            top: gameState.meetPos.y - MARIO_SIZE / 2,
            width: "auto",
            height: MARIO_SIZE,
            imageRendering: "pixelated",
            cursor: "pointer",
            userSelect: "none",
            zIndex: 52,
          }}
        />
      )}
    </>
  );
}
