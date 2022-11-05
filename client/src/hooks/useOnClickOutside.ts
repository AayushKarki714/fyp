import { RefObject, useEffect } from "react";

type Handler = (event: MouseEvent) => void;

function useOnClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: Handler
): void {
  useEffect(() => {
    const listener = (event: MouseEvent) => {
      console.log(ref.current?.contains(event.target as Node));
      if (!ref.current || ref.current.contains(event.target as Node)) return;
      handler(event);
    };
    document.body.addEventListener("click", listener);
    return () => {
      document.body.removeEventListener("click", listener);
    };
  }, [handler, ref]);
}

export default useOnClickOutside;
