import React, { createContext, useState, useContext, ReactNode } from "react";

export interface Card {
  cardNumber: string;
  nameOnCard: string;
  expiryDate: string;
  cvv: string;
  brand?: string;
}

interface CardContextProps {
  cards: Card[];
  addCard: (card: Card) => void;
}

export const initialCardState: Card = {
  cardNumber: "",
  nameOnCard: "",
  expiryDate: "",
  cvv: "",
};

const CardContext = createContext<CardContextProps | undefined>(undefined);

export const useCardContext = () => {
  const context = useContext(CardContext);
  if (!context) {
    throw new Error("useCardContext must be used within a CardProvider");
  }
  return context;
};

export const CardProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [cards, setCards] = useState<Card[]>([]);

  const addCard = (card: Card) => {
    setCards([...cards, card]);
  };

  return (
    <CardContext.Provider value={{ cards, addCard }}>
      {children}
    </CardContext.Provider>
  );
};
