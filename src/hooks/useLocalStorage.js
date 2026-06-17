import { useEffect, useState } from "react";
import { readStorage, writeStorage } from "../services/storageService.js";

export function useLocalStorage(key, fallback) {
  const [value, setValue] = useState(() => readStorage(key, fallback));

  useEffect(() => {
    writeStorage(key, value);
  }, [key, value]);

  return [value, setValue];
}
