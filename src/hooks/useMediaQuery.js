import { useCallback, useSyncExternalStore } from "react";

// True while the screen matches a CSS media query, e.g. "(min-width: 768px)".
// Updates live when the window resizes or a tablet rotates.
export function useMediaQuery(query) {
  const subscribe = useCallback(
    (notify) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", notify);
      return () => mq.removeEventListener("change", notify);
    },
    [query]
  );

  return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches);
}