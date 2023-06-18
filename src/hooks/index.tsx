import { useCallback, useEffect, useRef, useState } from "react";

export function useStateWithCallback(init: any) {
  const [state, setState] = useState(init);
  const handlers = useRef(new Set()).current;

  useEffect(() => {
    handlers.forEach((h: any) => h());
    handlers.clear();
  }, [state]);

  return [
    state,
    useCallback((s: any, callback: any) => {
      callback && handlers.add(callback);
      setState(s);
    }, []),
  ];
}