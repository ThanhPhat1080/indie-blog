import { useLayoutEffect, useState } from "react";
import type { ReactNode } from "react";

export const ClientOnly = ({ children }: { children: ReactNode }) => {
  const [isMounted, setIsMounted] = useState(false);

  useLayoutEffect(function checkDOMMounted() {
    setIsMounted(true);

    return () => {
      setIsMounted(false);
    };
  }, []);

  if (isMounted) {
    return children;
  }

  return null;
};
