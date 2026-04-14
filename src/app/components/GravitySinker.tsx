import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";

type Probe = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  active: boolean;
  trail: { x: number; y: number }[];
};

export function GravitySinker() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [angle, setAngle] = useState(45);
  const [power, setPower] = useState(150);
  const [isLaunched, setIsLaunched] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [successes, setSuccesses] = useState(0);
  const [message, setMessage] = useState("");

  const probeRef = useRef<Probe>({
    x: 50,
    y: 300,
    vx: 0,
    vy: 0,
    active: false,
    trail: [],
  });

  const blackHole = { x: 300, y: 300, mass: 8000, radius: 40 };
  const target = { x: 550, y: 300, radius: 35 };
  const animationRef = useRef<number>();

  useEffect(() => {
    drawFrame();
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const drawFrame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Dark slate background
    ctx.fillStyle = "#0a0118";
    ctx.fillRect(0, 0, 600, 600);

    // Draw grid lines (subtle)
    ctx.strokeStyle = "rgba(232, 213, 183, 0.05)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 600; i += 30) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 600);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(600, i);
      ctx.stroke();
    }

    // Draw target portal
    const targetGradient = ctx.createRadialGradient(
      target.x,
      target.y,
      0,
      target.x,
      target.y,
      target.radius
    );
    targetGradient.addColorStop(0, "rgba(13, 148, 136, 0.8)");
    targetGradient.addColorStop(0.7, "rgba(13, 148, 136, 0.4)");
    targetGradient.addColorStop(1, "rgba(13, 148, 136, 0.1)");
    ctx.fillStyle = targetGradient;
    ctx.beginPath();
    ctx.arc(target.x, target.y, target.radius, 0, Math.PI * 2);
    ctx.fill();

    // Target portal ring
    ctx.strokeStyle = "rgba(13, 148, 136, 0.6)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(target.x, target.y, target.radius, 0, Math.PI * 2);
    ctx.stroke();

    // Draw black hole
    const holeGradient = ctx.createRadialGradient(
      blackHole.x,
      blackHole.y,
      0,
      blackHole.x,
      blackHole.y,
      blackHole.radius
    );
    holeGradient.addColorStop(0, "rgba(0, 0, 0, 1)");
    holeGradient.addColorStop(0.6, "rgba(168, 85, 247, 0.4)");
    holeGradient.addColorStop(1, "rgba(168, 85, 247, 0.1)");
    ctx.fillStyle = holeGradient;
    ctx.beginPath();
    ctx.arc(blackHole.x, blackHole.y, blackHole.radius, 0, Math.PI * 2);
    ctx.fill();

    // Black hole event horizon
    ctx.strokeStyle = "rgba(168, 85, 247, 0.5)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(blackHole.x, blackHole.y, blackHole.radius, 0, Math.PI * 2);
    ctx.stroke();

    // Draw glowing chalk trail
    const probe = probeRef.current;
    if (probe.trail.length > 1) {
      ctx.strokeStyle = "rgba(251, 191, 36, 0.7)";
      ctx.lineWidth = 3;
      ctx.shadowColor = "rgba(251, 191, 36, 0.8)";
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(probe.trail[0].x, probe.trail[0].y);
      for (let i = 1; i < probe.trail.length; i++) {
        ctx.lineTo(probe.trail[i].x, probe.trail[i].y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // Draw probe
    if (probe.active || probe.trail.length > 0) {
      const probeGradient = ctx.createRadialGradient(
        probe.x,
        probe.y,
        0,
        probe.x,
        probe.y,
        8
      );
      probeGradient.addColorStop(0, "rgba(251, 191, 36, 1)");
      probeGradient.addColorStop(1, "rgba(251, 191, 36, 0.3)");
      ctx.fillStyle = probeGradient;
      ctx.beginPath();
      ctx.arc(probe.x, probe.y, 8, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw launch position
    if (!isLaunched) {
      ctx.fillStyle = "rgba(232, 213, 183, 0.6)";
      ctx.beginPath();
      ctx.arc(50, 300, 6, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const launchProbe = () => {
    const angleRad = (angle * Math.PI) / 180;
    const vx = (power / 10) * Math.cos(angleRad);
    const vy = (power / 10) * Math.sin(angleRad);

    probeRef.current = {
      x: 50,
      y: 300,
      vx,
      vy,
      active: true,
      trail: [{ x: 50, y: 300 }],
    };

    setIsLaunched(true);
    setAttempts(attempts + 1);
    setMessage("");
    animate();
  };

  const animate = () => {
    const probe = probeRef.current;
    if (!probe.active) return;

    const dx = blackHole.x - probe.x;
    const dy = blackHole.y - probe.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Check if hit black hole
    if (dist < blackHole.radius) {
      probe.active = false;
      setIsLaunched(false);
      setMessage("Consumed by the singularity!");
      return;
    }

    // Check if hit target
    const targetDx = target.x - probe.x;
    const targetDy = target.y - probe.y;
    const targetDist = Math.sqrt(targetDx * targetDx + targetDy * targetDy);

    if (targetDist < target.radius) {
      probe.active = false;
      setIsLaunched(false);
      setSuccesses(successes + 1);
      setMessage("Portal reached! Perfect trajectory!");
      return;
    }

    // Apply gravity
    const G = 0.8;
    const force = (G * blackHole.mass) / (dist * dist);
    const ax = (force * dx) / dist;
    const ay = (force * dy) / dist;

    probe.vx += ax * 0.05;
    probe.vy += ay * 0.05;

    probe.x += probe.vx * 0.1;
    probe.y += probe.vy * 0.1;

    probe.trail.push({ x: probe.x, y: probe.y });

    // Check bounds
    if (probe.x < 0 || probe.x > 600 || probe.y < 0 || probe.y > 600) {
      probe.active = false;
      setIsLaunched(false);
      setMessage("Lost in the void...");
      return;
    }

    drawFrame();

    if (probe.active) {
      animationRef.current = requestAnimationFrame(animate);
    }
  };

  const reset = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    probeRef.current = {
      x: 50,
      y: 300,
      vx: 0,
      vy: 0,
      active: false,
      trail: [],
    };
    setIsLaunched(false);
    setMessage("");
    drawFrame();
  };

  return (
    <div>
      <h2
        className="font-serif tracking-wider mb-6"
        style={{
          fontSize: "2rem",
          color: "var(--amber)",
          textShadow: "0 0 20px rgba(251, 191, 36, 0.5)",
        }}
      >
        The Gravity Sinker
      </h2>

      <p className="font-mono mb-6 opacity-70" style={{ color: "var(--parchment)" }}>
        Navigate your probe through the black hole's gravity to reach the target portal.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div
          className="border-2 rounded-lg overflow-hidden"
          style={{
            borderColor: "rgba(251, 191, 36, 0.3)",
            boxShadow: "inset 4px 0 12px rgba(251, 191, 36, 0.2)",
          }}
        >
          <canvas
            ref={canvasRef}
            width={600}
            height={600}
            className="w-full h-auto"
            style={{ backgroundColor: "var(--deep-space)" }}
          />
        </div>

        <div className="space-y-6">
          <div
            className="p-4 rounded border"
            style={{
              backgroundColor: "rgba(26, 15, 46, 0.6)",
              borderColor: "rgba(13, 148, 136, 0.3)",
            }}
          >
            <p className="font-mono" style={{ color: "var(--parchment)" }}>
              Successes: {successes} / {attempts}
            </p>
          </div>

          <div>
            <label
              className="font-mono mb-2 block"
              style={{ color: "var(--parchment)" }}
            >
              Launch Angle: {angle}°
            </label>
            <input
              type="range"
              min="-90"
              max="90"
              value={angle}
              onChange={(e) => setAngle(Number(e.target.value))}
              disabled={isLaunched}
              className="w-full"
              style={{ accentColor: "var(--amber)" }}
            />
          </div>

          <div>
            <label
              className="font-mono mb-2 block"
              style={{ color: "var(--parchment)" }}
            >
              Launch Power: {power}
            </label>
            <input
              type="range"
              min="50"
              max="300"
              value={power}
              onChange={(e) => setPower(Number(e.target.value))}
              disabled={isLaunched}
              className="w-full"
              style={{ accentColor: "var(--amber)" }}
            />
          </div>

          <div className="space-y-3 pt-4">
            <motion.button
              onClick={launchProbe}
              disabled={isLaunched}
              className="w-full px-6 py-3 rounded font-mono tracking-wider transition-all border-2"
              style={{
                backgroundColor: isLaunched
                  ? "rgba(157, 139, 115, 0.2)"
                  : "rgba(13, 148, 136, 0.2)",
                borderColor: isLaunched ? "var(--muted-foreground)" : "var(--nebula-teal)",
                color: isLaunched ? "var(--muted-foreground)" : "var(--nebula-teal)",
                cursor: isLaunched ? "not-allowed" : "pointer",
              }}
              whileHover={!isLaunched ? { scale: 1.02 } : {}}
              whileTap={!isLaunched ? { scale: 0.98 } : {}}
            >
              Launch Probe
            </motion.button>

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
          </div>

          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded border text-center"
              style={{
                backgroundColor: message.includes("Perfect")
                  ? "rgba(13, 148, 136, 0.2)"
                  : "rgba(168, 85, 247, 0.2)",
                borderColor: message.includes("Perfect")
                  ? "var(--nebula-teal)"
                  : "var(--purple-smoke)",
                color: message.includes("Perfect")
                  ? "var(--nebula-teal)"
                  : "var(--purple-smoke)",
              }}
            >
              <p className="font-mono">{message}</p>
            </motion.div>
          )}

          <div
            className="p-4 rounded border"
            style={{
              backgroundColor: "rgba(26, 15, 46, 0.4)",
              borderColor: "rgba(184, 115, 51, 0.3)",
            }}
          >
            <p className="font-mono text-sm opacity-70" style={{ color: "var(--parchment)" }}>
              💫 Purple singularity = Black hole
              <br />
              🌟 Teal portal = Target
              <br />
              🎯 Use gravity to curve your path
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
