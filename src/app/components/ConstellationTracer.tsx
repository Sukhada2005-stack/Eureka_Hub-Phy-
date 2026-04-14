import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

type Star = {
  x: number;
  y: number;
  size: number;
};

type Constellation = {
  name: string;
  stars: Star[];
  connections: number[];
};

const constellations: Constellation[] = [
  {
    name: "Orion's Belt",
    stars: [
      { x: 150, y: 300, size: 4 },
      { x: 300, y: 280, size: 4 },
      { x: 450, y: 300, size: 4 },
    ],
    connections: [0, 1, 2],
  },
  {
    name: "Big Dipper",
    stars: [
      { x: 100, y: 150, size: 3 },
      { x: 180, y: 140, size: 3 },
      { x: 260, y: 150, size: 3 },
      { x: 320, y: 180, size: 3 },
      { x: 340, y: 250, size: 3 },
      { x: 300, y: 320, size: 3 },
      { x: 220, y: 340, size: 3 },
    ],
    connections: [0, 1, 2, 3, 4, 5, 6],
  },
  {
    name: "Water Molecule",
    stars: [
      { x: 300, y: 200, size: 5 },
      { x: 200, y: 350, size: 4 },
      { x: 400, y: 350, size: 4 },
    ],
    connections: [0, 1, 0, 2],
  },
  {
    name: "Cassiopeia",
    stars: [
      { x: 120, y: 300, size: 3 },
      { x: 220, y: 200, size: 3 },
      { x: 320, y: 220, size: 3 },
      { x: 420, y: 180, size: 3 },
      { x: 500, y: 260, size: 3 },
    ],
    connections: [0, 1, 2, 3, 4],
  },
];

export function ConstellationTracer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentConstellation, setCurrentConstellation] = useState(0);
  const [clickedStars, setClickedStars] = useState<number[]>([]);
  const [showBlueprint, setShowBlueprint] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const [backgroundStars, setBackgroundStars] = useState<Star[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Generate random background stars
    const stars: Star[] = [];
    for (let i = 0; i < 80; i++) {
      stars.push({
        x: Math.random() * 600,
        y: Math.random() * 600,
        size: Math.random() * 1.5 + 0.5,
      });
    }
    setBackgroundStars(stars);

    // Initialize audio context
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
  }, []);

  useEffect(() => {
    drawCanvas();
  }, [clickedStars, showBlueprint, currentConstellation, backgroundStars]);

  useEffect(() => {
    if (showBlueprint) {
      const timer = setTimeout(() => {
        setShowBlueprint(false);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [showBlueprint]);

  const playNote = (frequency: number) => {
    if (!audioContextRef.current) return;

    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.3, audioContextRef.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContextRef.current.currentTime + 0.5
    );

    oscillator.start(audioContextRef.current.currentTime);
    oscillator.stop(audioContextRef.current.currentTime + 0.5);
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Dark background
    ctx.fillStyle = "#0a0118";
    ctx.fillRect(0, 0, 600, 600);

    // Draw background stars
    backgroundStars.forEach((star) => {
      ctx.fillStyle = `rgba(232, 213, 183, ${Math.random() * 0.5 + 0.3})`;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    });

    const constellation = constellations[currentConstellation];

    // Draw blueprint (faint) if showing
    if (showBlueprint) {
      ctx.strokeStyle = "rgba(13, 148, 136, 0.3)";
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      for (let i = 0; i < constellation.connections.length - 1; i += 2) {
        const start = constellation.stars[constellation.connections[i]];
        const end = constellation.stars[constellation.connections[i + 1]];
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
      }
      ctx.setLineDash([]);
    }

    // Draw user's traced lines (glowing silk threads)
    if (clickedStars.length > 1) {
      ctx.strokeStyle = "rgba(13, 148, 136, 0.8)";
      ctx.lineWidth = 2;
      ctx.shadowColor = "rgba(13, 148, 136, 0.9)";
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.moveTo(
        constellation.stars[clickedStars[0]].x,
        constellation.stars[clickedStars[0]].y
      );
      for (let i = 1; i < clickedStars.length; i++) {
        ctx.lineTo(
          constellation.stars[clickedStars[i]].x,
          constellation.stars[clickedStars[i]].y
        );
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // Draw constellation stars
    constellation.stars.forEach((star, index) => {
      const isClicked = clickedStars.includes(index);
      const nextExpected = clickedStars.length < constellation.connections.length
        ? constellation.connections[clickedStars.length]
        : -1;
      const isNext = index === nextExpected;

      // Star glow
      const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 3);
      if (isClicked) {
        gradient.addColorStop(0, "rgba(13, 148, 136, 1)");
        gradient.addColorStop(0.5, "rgba(13, 148, 136, 0.4)");
        gradient.addColorStop(1, "rgba(13, 148, 136, 0)");
      } else if (isNext) {
        gradient.addColorStop(0, "rgba(251, 191, 36, 1)");
        gradient.addColorStop(0.5, "rgba(251, 191, 36, 0.4)");
        gradient.addColorStop(1, "rgba(251, 191, 36, 0)");
      } else {
        gradient.addColorStop(0, "rgba(232, 213, 183, 1)");
        gradient.addColorStop(0.5, "rgba(232, 213, 183, 0.3)");
        gradient.addColorStop(1, "rgba(232, 213, 183, 0)");
      }
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
      ctx.fill();

      // Star core
      ctx.fillStyle = isClicked
        ? "rgba(13, 148, 136, 1)"
        : isNext
        ? "rgba(251, 191, 36, 1)"
        : "rgba(232, 213, 183, 1)";
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    });
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || isComplete) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const constellation = constellations[currentConstellation];
    const clickedStarIndex = constellation.stars.findIndex(
      (star) => Math.sqrt((star.x - x) ** 2 + (star.y - y) ** 2) < star.size * 4
    );

    if (clickedStarIndex === -1) return;

    const expectedIndex = constellation.connections[clickedStars.length];

    if (clickedStarIndex === expectedIndex) {
      const newClicked = [...clickedStars, clickedStarIndex];
      setClickedStars(newClicked);

      // Play musical note
      const frequencies = [261.63, 293.66, 329.63, 349.23, 392.0, 440.0, 493.88];
      playNote(frequencies[clickedStarIndex % frequencies.length]);

      if (newClicked.length === constellation.connections.length) {
        setIsComplete(true);
      }
    }
  };

  const nextConstellation = () => {
    setCurrentConstellation((currentConstellation + 1) % constellations.length);
    setClickedStars([]);
    setShowBlueprint(true);
    setIsComplete(false);
  };

  const reset = () => {
    setClickedStars([]);
    setShowBlueprint(true);
    setIsComplete(false);
  };

  return (
    <div>
      <h2
        className="font-serif tracking-wider mb-6"
        style={{
          fontSize: "2rem",
          color: "var(--nebula-teal)",
          textShadow: "0 0 20px rgba(13, 148, 136, 0.5)",
        }}
      >
        Constellation Tracer
      </h2>

      <p className="font-mono mb-6 opacity-70" style={{ color: "var(--parchment)" }}>
        Trace the constellation by clicking stars in the correct order. Listen to the
        celestial harmony.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div
          className="border-2 rounded-lg overflow-hidden relative cursor-pointer"
          style={{
            borderColor: "rgba(13, 148, 136, 0.3)",
            boxShadow: "0 0 40px rgba(13, 148, 136, 0.2)",
          }}
        >
          <canvas
            ref={canvasRef}
            width={600}
            height={600}
            className="w-full h-auto"
            onClick={handleCanvasClick}
            style={{ backgroundColor: "var(--deep-space)" }}
          />
          <AnimatePresence>
            {showBlueprint && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute top-4 left-4 px-4 py-2 rounded border font-mono text-sm"
                style={{
                  backgroundColor: "rgba(26, 15, 46, 0.9)",
                  borderColor: "rgba(13, 148, 136, 0.5)",
                  color: "var(--nebula-teal)",
                }}
              >
                Memorize the pattern...
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-6">
          <div
            className="p-4 rounded border"
            style={{
              backgroundColor: "rgba(26, 15, 46, 0.6)",
              borderColor: "rgba(13, 148, 136, 0.3)",
            }}
          >
            <p className="font-serif mb-2" style={{ fontSize: "1.5rem", color: "var(--parchment)" }}>
              {constellations[currentConstellation].name}
            </p>
            <p className="font-mono text-sm opacity-70" style={{ color: "var(--copper)" }}>
              Progress: {clickedStars.length} /{" "}
              {constellations[currentConstellation].connections.length}
            </p>
          </div>

          {isComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
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
                Constellation Complete!
              </p>
              <p className="font-mono opacity-70" style={{ color: "var(--parchment)" }}>
                The stars have been woven together
              </p>
            </motion.div>
          )}

          <div className="space-y-3">
            <motion.button
              onClick={reset}
              className="w-full px-6 py-3 rounded font-mono tracking-wider transition-all border-2"
              style={{
                backgroundColor: "rgba(251, 191, 36, 0.2)",
                borderColor: "var(--amber)",
                color: "var(--amber)",
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Reset
            </motion.button>

            <motion.button
              onClick={nextConstellation}
              className="w-full px-6 py-3 rounded font-mono tracking-wider transition-all border-2"
              style={{
                backgroundColor: "rgba(13, 148, 136, 0.2)",
                borderColor: "var(--nebula-teal)",
                color: "var(--nebula-teal)",
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Next Constellation
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
              ✨ Blueprint fades after 2.5 seconds
              <br />
              🎵 Each star plays a unique note
              <br />
              🌟 Follow the amber glow
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
