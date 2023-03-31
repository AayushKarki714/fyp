import { useState, useEffect } from "react";

export default function useDebounce(value: string, delay: number = 5000) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(timer);
    };
  }, [delay, value]);
  return debouncedValue;
}
