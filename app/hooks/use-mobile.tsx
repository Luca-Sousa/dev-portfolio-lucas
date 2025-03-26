import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined,
  );
  const [isClient, setIsClient] = React.useState(false); // Adicionando um estado para verificar se está no cliente

  React.useEffect(() => {
    setIsClient(true); // Setando como true após a renderização no cliente

    if (typeof window !== "undefined") {
      const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
      const onChange = () => {
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
      };
      mql.addEventListener("change", onChange);
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
      return () => mql.removeEventListener("change", onChange);
    }
  }, []);

  // Só retorna o valor de isMobile depois de garantir que está no cliente
  if (!isClient) return false;

  return !!isMobile;
}
