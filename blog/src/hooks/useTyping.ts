import { useEffect, useRef, useState } from "react";

export function useTyping(texts: string[], speed = 80): string {
  const [display, setDisplay] = useState("");
  const state = useRef({ textIdx: 0, charIdx: 0, deleting: false });

  useEffect(() => {
    let timerId: ReturnType<typeof setTimeout>;

    function tick() {
      const { textIdx, charIdx, deleting } = state.current;
      const current = texts[textIdx];

      if (!deleting) {
        if (charIdx < current.length) {
          state.current.charIdx++;
          setDisplay(current.slice(0, state.current.charIdx));
          timerId = setTimeout(tick, speed);
        } else {
          // pause before deleting
          timerId = setTimeout(() => {
            state.current.deleting = true;
            tick();
          }, 1500);
        }
      } else {
        if (charIdx > 0) {
          state.current.charIdx--;
          setDisplay(current.slice(0, state.current.charIdx));
          timerId = setTimeout(tick, speed / 2);
        } else {
          state.current.deleting = false;
          state.current.textIdx = (textIdx + 1) % texts.length;
          timerId = setTimeout(tick, speed);
        }
      }
    }

    timerId = setTimeout(tick, speed);
    return () => clearTimeout(timerId);
  }, [texts, speed]);

  return display;
}
