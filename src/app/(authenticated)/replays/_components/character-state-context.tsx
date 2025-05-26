"use client";

import { createContext, useState } from "react";

export type CharacterState = {
  stocks: number;
  percent: number;
};

export const CharacterStateContext = createContext<{
  characterStates: Record<string, Record<number, CharacterState>>;
  setCharacterState: (
    key: string,
    playerIndex: number,
    state: CharacterState,
  ) => void;
}>({
  characterStates: {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setCharacterState: () => {},
});

export function CharacterStateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [characterStates, setCharacterStates] = useState<
    Record<string, Record<number, CharacterState>>
  >({});

  const setCharacterState = (
    key: string,
    playerIndex: number,
    state: CharacterState,
  ) => {
    setCharacterStates((prev) => {
      const newCharacterStates = { ...prev };
      newCharacterStates[key] = {
        ...newCharacterStates[key]!,
        [playerIndex]: state,
      };

      console.log(newCharacterStates);
      return newCharacterStates;
    });
  };

  return (
    <CharacterStateContext.Provider
      value={{ characterStates, setCharacterState }}
    >
      {children}
    </CharacterStateContext.Provider>
  );
}
