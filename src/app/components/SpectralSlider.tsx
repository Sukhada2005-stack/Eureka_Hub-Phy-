import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

type Element = {
  name: string;
  color: { r: number; g: number; b: number };
};

const elements: Element[] = [
  { name: "Hydrogen", color: { r: 255, g: 100, b: 100 } },
  { name: "Helium", color: { r: 255, g: 200, b: 100 } },
  { name: "Neon", color: { r: 255, g: 100, b: 255 } },
];

type TargetStar = {
  name: string;
  h: number;
  he: number;
  ne: number;
};

const targetStars: TargetStar[] = [
  { name: "Betelgeuse", h: 70, he: 20, ne: 10 },
  { name: "Rigel", h: 50, he: 40, ne: 10 },
  { name: "Sirius", h: 60, he: 25, ne: 15 },
  { name: "Vega", h: 45, he: 30, ne: 25 },
  { name: "Antares", h: 80, he: 15, ne: 5 },
  { name: "Aldebaran", h: 55, he: 35, ne: 10 },
];

export function SpectralSlider() {
  const [hydrogen, setHydrogen] = useState(33);
  const [helium, setHelium] = useState(33);
  const [neon, setNeon] = useState(33);
  const [currentStarIndex, setCurrentStarIndex] = useState(0);
  const [isMatched, setIsMatched] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const targetStar = targetStars[currentStarIndex];

  const getUserColor = () => {
    const total = hydrogen + helium + neon;
    const r = Math.round((elements[0].color.r * hydrogen) / total);
    const g = Math.round(
      (elements[0].color.g * hydrogen +
        elements[1].color.g * helium +
        elements[2].color.g * neon) /
        total
    );
    const b = Math.round(
      (elements[0].color.b * hydrogen +
        elements[1].color.b * helium +
        elements[2].color.b * neon) /
        total
    );
    return { r, g, b };
  };

  const getTargetColor = () => {
    const total = targetStar.h + targetStar.he + targetStar.ne;
    const r = Math.round((elements[0].color.r * targetStar.h) / total);
    const g = Math.round(
      (elements[0].color.g * targetStar.h +
        elements[1].color.g * targetStar.he +
        elements[2].color.g * targetStar.ne) /
        total
    );
    const b = Math.round(
      (elements[0].color.b * targetStar.h +
        elements[1].color.b * targetStar.he +
        elements[2].color.b * targetStar.ne) /
        total
    );
    return { r, g, b };
  };

  const checkMatch = () => {
    setAttempts(attempts + 1);
    const tolerance = 12;
    const hMatch = Math.abs(hydrogen - targetStar.h) <= tolerance;
    const heMatch = Math.abs(helium - targetStar.he) <= tolerance;
    const neMatch = Math.abs(neon - targetStar.ne) <= tolerance;

    if (hMatch && heMatch && neMatch) {
      setIsMatched(true);
    }
  };

  const nextStar = () => {
    setCurrentStarIndex((currentStarIndex + 1) % targetStars.length);
    setIsMatched(false);
    setHydrogen(33);
    setHelium(33);
    setNeon(33);
  };

  const userColor = getUserColor();
  const targetColor = getTargetColor();

  return (
    <div>
      <h2
        className="font-serif tracking-wider mb-6"
        style={{
          fontSize: "2rem",
          color: "var(--electric-blue)",
          textShadow: "0 0 20px rgba(59, 130, 246, 0.5)",
        }}
      >
        Spectral Slider
      </h2>

      <p className="font-mono mb-6 opacity-70" style={{ color: "var(--parchment)" }}>
        Mix elements to match the target star's spectral signature. Adjust sliders to
        recreate the light.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div
          className="p-8 rounded-lg border-2 space-y-8"
          style={{
            backgroundColor: `rgba(${userColor.r}, ${userColor.g}, ${userColor.b}, 0.1)`,
            borderColor: "rgba(184, 115, 51, 0.5)",
            boxShadow: `0 0 60px rgba(${userColor.r}, ${userColor.g}, ${userColor.b}, 0.3)`,
            transition: "all 0.3s ease",
          }}
        >
          <div className="text-center mb-8">
            <p
              className="font-serif mb-4"
              style={{
                fontSize: "1.5rem",
                color: "var(--parchment)",
              }}
            >
              Target: {targetStar.name}
            </p>
            <div
              className="mx-auto rounded-full border-2"
              style={{
                width: "120px",
                height: "120px",
                backgroundColor: `rgb(${targetColor.r}, ${targetColor.g}, ${targetColor.b})`,
                borderColor: "var(--copper)",
                boxShadow: `0 0 40px rgba(${targetColor.r}, ${targetColor.g}, ${targetColor.b}, 0.6)`,
              }}
            />
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  className="font-mono"
                  style={{ color: "var(--parchment)" }}
                >
                  Hydrogen
                </label>
                <span
                  className="font-mono"
                  style={{ color: "var(--copper)" }}
                >
                  {hydrogen}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={hydrogen}
                onChange={(e) => setHydrogen(Number(e.target.value))}
                disabled={isMatched}
                className="w-full"
                style={{
                  accentColor: "rgb(255, 100, 100)",
                }}
              />
              <div
                className="mt-2 h-2 rounded"
                style={{
                  backgroundColor: `rgba(255, 100, 100, ${hydrogen / 100})`,
                  boxShadow: `0 0 10px rgba(255, 100, 100, ${hydrogen / 100})`,
                }}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  className="font-mono"
                  style={{ color: "var(--parchment)" }}
                >
                  Helium
                </label>
                <span
                  className="font-mono"
                  style={{ color: "var(--copper)" }}
                >
                  {helium}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={helium}
                onChange={(e) => setHelium(Number(e.target.value))}
                disabled={isMatched}
                className="w-full"
                style={{
                  accentColor: "rgb(255, 200, 100)",
                }}
              />
              <div
                className="mt-2 h-2 rounded"
                style={{
                  backgroundColor: `rgba(255, 200, 100, ${helium / 100})`,
                  boxShadow: `0 0 10px rgba(255, 200, 100, ${helium / 100})`,
                }}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  className="font-mono"
                  style={{ color: "var(--parchment)" }}
                >
                  Neon
                </label>
                <span
                  className="font-mono"
                  style={{ color: "var(--copper)" }}
                >
                  {neon}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={neon}
                onChange={(e) => setNeon(Number(e.target.value))}
                disabled={isMatched}
                className="w-full"
                style={{
                  accentColor: "rgb(255, 100, 255)",
                }}
              />
              <div
                className="mt-2 h-2 rounded"
                style={{
                  backgroundColor: `rgba(255, 100, 255, ${neon / 100})`,
                  boxShadow: `0 0 10px rgba(255, 100, 255, ${neon / 100})`,
                }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div
            className="p-8 rounded-lg border-2 text-center"
            style={{
              backgroundColor: `rgba(${userColor.r}, ${userColor.g}, ${userColor.b}, 0.15)`,
              borderColor: "rgba(59, 130, 246, 0.4)",
              boxShadow: `0 0 40px rgba(${userColor.r}, ${userColor.g}, ${userColor.b}, 0.3)`,
              transition: "all 0.3s ease",
            }}
          >
            <p
              className="font-serif mb-4"
              style={{
                fontSize: "1.25rem",
                color: "var(--parchment)",
              }}
            >
              Your Star
            </p>
            <div
              className="mx-auto rounded-full border-2"
              style={{
                width: "120px",
                height: "120px",
                backgroundColor: `rgb(${userColor.r}, ${userColor.g}, ${userColor.b})`,
                borderColor: "var(--electric-blue)",
                boxShadow: `0 0 40px rgba(${userColor.r}, ${userColor.g}, ${userColor.b}, 0.6)`,
              }}
            />
          </div>

          <div
            className="p-4 rounded border"
            style={{
              backgroundColor: "rgba(26, 15, 46, 0.6)",
              borderColor: "rgba(184, 115, 51, 0.3)",
            }}
          >
            <p className="font-mono" style={{ color: "var(--parchment)" }}>
              Attempts: {attempts}
            </p>
          </div>

          <AnimatePresence>
            {isMatched && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="p-6 rounded border text-center"
                style={{
                  backgroundColor: "rgba(13, 148, 136, 0.2)",
                  borderColor: "var(--nebula-teal)",
                }}
              >
                <p
                  className="font-serif mb-2"
                  style={{
                    fontSize: "1.5rem",
                    color: "var(--nebula-teal)",
                    textShadow: "0 0 20px rgba(13, 148, 136, 0.5)",
                  }}
                >
                  Perfect Match!
                </p>
                <p className="font-mono opacity-70" style={{ color: "var(--parchment)" }}>
                  The spectral signature is aligned
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-3">
            <motion.button
              onClick={checkMatch}
              disabled={isMatched}
              className="w-full px-6 py-3 rounded font-mono tracking-wider transition-all border-2"
              style={{
                backgroundColor: isMatched
                  ? "rgba(157, 139, 115, 0.2)"
                  : "rgba(59, 130, 246, 0.2)",
                borderColor: isMatched ? "var(--muted-foreground)" : "var(--electric-blue)",
                color: isMatched ? "var(--muted-foreground)" : "var(--electric-blue)",
                cursor: isMatched ? "not-allowed" : "pointer",
              }}
              whileHover={!isMatched ? { scale: 1.02 } : {}}
              whileTap={!isMatched ? { scale: 0.98 } : {}}
            >
              Check Match
            </motion.button>

            <motion.button
              onClick={nextStar}
              className="w-full px-6 py-3 rounded font-mono tracking-wider transition-all border-2"
              style={{
                backgroundColor: "rgba(251, 191, 36, 0.2)",
                borderColor: "var(--amber)",
                color: "var(--amber)",
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Next Star
            </motion.button>
          </div>

          <div
            className="p-4 rounded border"
            style={{
              backgroundColor: "rgba(26, 15, 46, 0.4)",
              borderColor: "rgba(184, 115, 51, 0.3)",
            }}
          >
            <p className="font-mono text-sm opacity-70" style={{ color: "var(--parchment)" }}>
              🔬 Mix spectral elements
              <br />
              🌈 Match the target color
              <br />
              ✨ The lab glows with your creation
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
