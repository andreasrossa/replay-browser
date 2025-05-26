"use client";

import { createContext, useState } from "react";

export const StockContext = createContext<{
  stocks: Record<string, Record<number, number>>;
  setStock: (key: string, playerIndex: number, stocks: number) => void;
}>({
  stocks: {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setStock: () => {},
});

export function StockProvider({ children }: { children: React.ReactNode }) {
  const [stocks, setStocks] = useState<Record<string, Record<number, number>>>(
    {},
  );

  const setStock = (key: string, playerIndex: number, stocks: number) => {
    setStocks((prev) => {
      const newStocks = { ...prev };
      newStocks[key] = {
        ...newStocks[key]!,
        [playerIndex]: stocks,
      };

      console.log(newStocks);
      return newStocks;
    });
  };

  return (
    <StockContext.Provider value={{ stocks, setStock }}>
      {children}
    </StockContext.Provider>
  );
}
