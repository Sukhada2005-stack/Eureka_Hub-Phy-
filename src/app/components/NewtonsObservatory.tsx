import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

type Card = {
  id: number;
  content: string;
  type: "formula" | "concept";
  matched: boolean;
  flipped: boolean;
};

const physicsCards = [
  { content: "F = ma", pair: "Newton's 2nd Law" },
  { content: "E = mc²", pair: "Mass-Energy Equivalence" },
  { content: "F = G(m₁m₂)/r²", pair: "Universal Gravitation" },
  { content: "p = mv", pair: "Momentum" },
  { content: "KE = ½mv²", pair: "Kinetic Energy" },
  { content: "PE = mgh", pair: "Potential Energy" },
  { content: "v = fλ", pair: "Wave Equation" },
  { content: "ΔE = hf", pair: "Photon Energy" },
];

export function NewtonsObservatory() {
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const gameCards: Card[] = [];
    physicsCards.forEach((pair, index) => {
      gameCards.push({
        id: index * 2,
        content: pair.content,
        type: "formula",
        matched: false,
        flipped: false,
      });
      gameCards.push({
        id: index * 2 + 1,
        content: pair.pair,
        type: "concept",
        matched: false,
        flipped: false,
      });
    });

    setCards(gameCards.sort(() => Math.random() - 0.5));
    setMatches(0);
    setSelectedCards([]);
  };

  const handleCardClick = (id: number) => {
    if (selectedCards.length === 2) return;
    if (cards[id].flipped || cards[id].matched) return;
    if (selectedCards.includes(id)) return;

    const newCards = [...cards];
    newCards[id].flipped = true;
    setCards(newCards);

    const newSelected = [...selectedCards, id];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      const [first, second] = newSelected;
      const firstCard = cards[first];
      const secondCard = cards[second];

      const isMatch = physicsCards.some(
        (pair) =>
          (firstCard.content === pair.content &&
            secondCard.content === pair.pair) ||
          (firstCard.content === pair.pair &&
            secondCard.content === pair.content)
      );

      if (isMatch) {
        setTimeout(() => {
          const updatedCards = [...cards];
          updatedCards[first].matched = true;
          updatedCards[second].matched = true;
          setCards(updatedCards);
          setMatches(matches + 1);
          setSelectedCards([]);
        }, 600);
      } else {
        setTimeout(() => {
          const updatedCards = [...cards];
          updatedCards[first].flipped = false;
          updatedCards[second].flipped = false;
          setCards(updatedCards);
          setSelectedCards([]);
        }, 1000);
      }
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2
          className="font-serif tracking-wider"
          style={{
            fontSize: "2rem",
            color: "var(--nebula-teal)",
            textShadow: "0 0 20px rgba(13, 148, 136, 0.5)",
          }}
        >
          Newton's Observatory
        </h2>
        <button
          onClick={initializeGame}
          className="px-4 py-2 rounded font-mono tracking-wider transition-all"
          style={{
            backgroundColor: "rgba(13, 148, 136, 0.2)",
            borderColor: "var(--nebula-teal)",
            color: "var(--nebula-teal)",
            border: "1px solid",
          }}
        >
          Reset
        </button>
      </div>

      <p
        className="font-mono mb-6 opacity-70"
        style={{ color: "var(--parchment)" }}
      >
        Match physics formulas with their concepts. Matches: {matches}/
        {physicsCards.length}
      </p>

      <div className="grid grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            className="aspect-square cursor-pointer"
            onClick={() => handleCardClick(index)}
            whileHover={{ scale: card.matched ? 1 : 1.05 }}
            whileTap={{ scale: card.matched ? 1 : 0.95 }}
          >
            <div className="relative w-full h-full" style={{ perspective: "1000px" }}>
              <motion.div
                className="w-full h-full relative"
                style={{
                  transformStyle: "preserve-3d",
                }}
                animate={{
                  rotateY: card.flipped || card.matched ? 180 : 0,
                }}
                transition={{ duration: 0.6 }}
              >
                <div
                  className="absolute inset-0 flex items-center justify-center p-4 rounded-lg border-2"
                  style={{
                    backgroundColor: "rgba(26, 15, 46, 0.8)",
                    borderColor: "rgba(184, 115, 51, 0.5)",
                    backfaceVisibility: "hidden",
                    borderRadius: "12px 12px 12px 4px",
                  }}
                >
                  <div
                    className="text-center font-mono opacity-50"
                    style={{ color: "var(--copper)" }}
                  >
                    ★
                  </div>
                </div>

                <div
                  className="absolute inset-0 flex items-center justify-center p-4 rounded-lg border-2"
                  style={{
                    backgroundColor: card.matched
                      ? "rgba(13, 148, 136, 0.3)"
                      : "rgba(26, 15, 46, 0.8)",
                    borderColor: card.matched
                      ? "var(--nebula-teal)"
                      : "rgba(251, 191, 36, 0.5)",
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                    borderRadius: "12px 12px 12px 4px",
                    boxShadow: card.matched
                      ? "0 0 30px rgba(13, 148, 136, 0.4)"
                      : "inset 4px 0 12px rgba(251, 191, 36, 0.2)",
                  }}
                >
                  <div
                    className="text-center font-mono"
                    style={{
                      color: card.matched ? "var(--nebula-teal)" : "var(--parchment)",
                      fontSize: card.type === "formula" ? "0.9rem" : "0.75rem",
                    }}
                  >
                    {card.content}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {matches === physicsCards.length && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-8 p-6 rounded-lg text-center"
            style={{
              backgroundColor: "rgba(13, 148, 136, 0.2)",
              borderColor: "var(--nebula-teal)",
              border: "2px solid",
            }}
          >
            <p
              className="font-serif"
              style={{
                fontSize: "1.5rem",
                color: "var(--nebula-teal)",
                textShadow: "0 0 20px rgba(13, 148, 136, 0.5)",
              }}
            >
              Observatory Complete!
            </p>
            <p className="font-mono mt-2 opacity-70" style={{ color: "var(--parchment)" }}>
              All physics laws have been mapped to the cosmos
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
