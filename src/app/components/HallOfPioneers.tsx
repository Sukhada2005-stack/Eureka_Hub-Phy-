import { motion } from "motion/react";

type Pioneer = {
  name: string;
  score: number;
  achievement: string;
};

const pioneers: Pioneer[] = [
  { name: "Dr. Feynman", score: 2847, achievement: "Quantum Master" },
  { name: "Prof. Curie", score: 2654, achievement: "Radiation Expert" },
  { name: "Dr. Hawking", score: 2531, achievement: "Black Hole Pioneer" },
  { name: "Prof. Einstein", score: 2412, achievement: "Relativity Scholar" },
  { name: "Dr. Newton", score: 2289, achievement: "Gravity Theorist" },
  { name: "Prof. Bohr", score: 2156, achievement: "Atomic Architect" },
  { name: "Dr. Planck", score: 2043, achievement: "Quantum Founder" },
  { name: "Prof. Maxwell", score: 1987, achievement: "EM Wave Mapper" },
];

export function HallOfPioneers() {
  return (
    <motion.div
      className="backdrop-blur-sm border-2 p-6 rounded-lg h-full"
      style={{
        backgroundColor: "rgba(26, 15, 46, 0.4)",
        borderColor: "rgba(168, 85, 247, 0.3)",
        boxShadow: "0 0 40px rgba(168, 85, 247, 0.15)",
      }}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
    >
      <h2
        className="font-serif tracking-wider mb-6"
        style={{
          fontSize: "1.75rem",
          color: "var(--purple-smoke)",
          textShadow: "0 0 20px rgba(168, 85, 247, 0.5)",
        }}
      >
        Hall of Pioneers
      </h2>

      <p
        className="font-mono mb-6 text-sm opacity-70"
        style={{ color: "var(--parchment)" }}
      >
        The greatest minds exploring the cosmic frontier
      </p>

      <div className="space-y-3">
        {pioneers.map((pioneer, index) => (
          <motion.div
            key={pioneer.name}
            className="p-4 rounded border"
            style={{
              backgroundColor:
                index === 0
                  ? "rgba(251, 191, 36, 0.15)"
                  : "rgba(26, 15, 46, 0.6)",
              borderColor:
                index === 0
                  ? "rgba(251, 191, 36, 0.4)"
                  : "rgba(184, 115, 51, 0.2)",
              borderRadius: "8px 8px 8px 2px",
            }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{
              scale: 1.02,
              borderColor:
                index === 0
                  ? "rgba(251, 191, 36, 0.6)"
                  : "rgba(184, 115, 51, 0.4)",
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span
                  className="font-mono"
                  style={{
                    fontSize: "1.25rem",
                    color:
                      index === 0
                        ? "var(--amber)"
                        : index === 1
                        ? "var(--copper)"
                        : index === 2
                        ? "var(--nebula-teal)"
                        : "var(--parchment)",
                  }}
                >
                  #{index + 1}
                </span>
                <span
                  className="font-serif"
                  style={{
                    fontSize: "1.125rem",
                    color: "var(--parchment)",
                  }}
                >
                  {pioneer.name}
                </span>
              </div>
              <span
                className="font-mono"
                style={{
                  fontSize: "1.125rem",
                  color: index === 0 ? "var(--amber)" : "var(--nebula-teal)",
                }}
              >
                {pioneer.score.toLocaleString()}
              </span>
            </div>
            <p
              className="font-mono text-sm opacity-60"
              style={{ color: "var(--copper)" }}
            >
              {pioneer.achievement}
            </p>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="mt-6 p-4 rounded border text-center"
        style={{
          backgroundColor: "rgba(13, 148, 136, 0.1)",
          borderColor: "rgba(13, 148, 136, 0.3)",
        }}
        whileHover={{ scale: 1.02 }}
      >
        <p className="font-mono text-sm" style={{ color: "var(--nebula-teal)" }}>
          Complete challenges to join the Hall
        </p>
      </motion.div>
    </motion.div>
  );
}
