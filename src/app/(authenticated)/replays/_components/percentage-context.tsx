"use client";

import { createContext, useState } from "react";

export const PercentageContext = createContext<{
  percentages: Record<string, Record<number, number>>;
  setPercentage: (key: string, playerIndex: number, percentage: number) => void;
}>({
  percentages: {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setPercentage: () => {},
});

export function PercentageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [percentages, setPercentages] = useState<
    Record<string, Record<number, number>>
  >({});

  const setPercentage = (
    key: string,
    playerIndex: number,
    percentage: number,
  ) => {
    setPercentages((prev) => {
      const newPercentages = { ...prev };
      newPercentages[key] = {
        ...newPercentages[key]!,
        [playerIndex]: percentage,
      };

      console.log(newPercentages);
      return newPercentages;
    });
  };

  return (
    <PercentageContext.Provider value={{ percentages, setPercentage }}>
      {children}
    </PercentageContext.Provider>
  );
}
