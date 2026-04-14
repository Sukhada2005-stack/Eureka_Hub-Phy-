import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";

type Body = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  mass: number;
  trail: { x: number; y: number }[];
};

export function OrbitalMechanicsLab() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [velocity, setVelocity] = useState(150);
  const [angle, setAngle] = useState(0);
  const [showTrail, setShowTrail] = useState(true);

  const sunRef = useRef({ x: 300, y: 300, mass: 5000 });
  const planetRef = useRef<Body>({
    x: 300,
    y: 150,
    vx: 0,
    vy: 0,
    mass: 1,
    trail: [],
  });

  const animationRef = useRef<number>();

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const resetSimulation = () => {
    setIsRunning(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    const angleRad = (angle * Math.PI) / 180;
    const vx = velocity * Math.cos(angleRad);
    const vy = velocity * Math.sin(angleRad);

    planetRef.current = {
      x: 300,
      y: 150,
      vx,
      vy,
      mass: 1,
      trail: [],
    };

    drawFrame();
  };

  const startSimulation = () => {
    const angleRad = (angle * Math.PI) / 180;
    const vx = velocity * Math.cos(angleRad);
    const vy = velocity * Math.sin(angleRad);

    planetRef.current = {
      x: 300,
      y: 150,
      vx,
      vy,
      mass: 1,
      trail: [],
    };

    setIsRunning(true);
    animate();
  };

  const drawFrame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "rgba(10, 1, 24, 0.95)";
    ctx.fillRect(0, 0, 600, 600);

    if (showTrail && planetRef.current.trail.length > 1) {
      ctx.strokeStyle = "rgba(59, 130, 246, 0.3)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(planetRef.current.trail[0].x, planetRef.current.trail[0].y);
      for (let i = 1; i < planetRef.current.trail.length; i++) {
        ctx.lineTo(planetRef.current.trail[i].x, planetRef.current.trail[i].y);
      }
      ctx.stroke();
    }

    const gradient = ctx.createRadialGradient(
      sunRef.current.x,
      sunRef.current.y,
      0,
      sunRef.current.x,
      sunRef.current.y,
      30
    );
    gradient.addColorStop(0, "rgba(251, 191, 36, 1)");
    gradient.addColorStop(1, "rgba(251, 191, 36, 0.3)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(sunRef.current.x, sunRef.current.y, 25, 0, Math.PI * 2);
    ctx.fill();

    const planetGradient = ctx.createRadialGradient(
      planetRef.current.x,
      planetRef.current.y,
      0,
      planetRef.current.x,
      planetRef.current.y,
      15
    );
    planetGradient.addColorStop(0, "rgba(13, 148, 136, 1)");
    planetGradient.addColorStop(1, "rgba(13, 148, 136, 0.3)");
    ctx.fillStyle = planetGradient;
    ctx.beginPath();
    ctx.arc(planetRef.current.x, planetRef.current.y, 10, 0, Math.PI * 2);
    ctx.fill();
  };

  const animate = () => {
    const planet = planetRef.current;
    const sun = sunRef.current;

    const dx = sun.x - planet.x;
    const dy = sun.y - planet.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 30) {
      setIsRunning(false);
      return;
    }

    const G = 0.5;
    const force = (G * sun.mass * planet.mass) / (dist * dist);
    const ax = (force * dx) / (dist * planet.mass);
    const ay = (force * dy) / (dist * planet.mass);

    planet.vx += ax * 0.1;
    planet.vy += ay * 0.1;

    planet.x += planet.vx * 0.1;
    planet.y += planet.vy * 0.1;

    planet.trail.push({ x: planet.x, y: planet.y });
    if (planet.trail.length > 300) {
      planet.trail.shift();
    }

    if (planet.x < 0 || planet.x > 600 || planet.y < 0 || planet.y > 600) {
      setIsRunning(false);
      return;
    }

    drawFrame();

    if (isRunning) {
      animationRef.current = requestAnimationFrame(animate);
    }
  };

  useEffect(() => {
    if (isRunning) {
      animate();
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
  }, [isRunning]);

  useEffect(() => {
    drawFrame();
  }, [showTrail]);

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
        Orbital Mechanics Laboratory
      </h2>

      <p className="font-mono mb-6 opacity-70" style={{ color: "var(--parchment)" }}>
        Set initial velocity and angle to launch a celestial body. Observe gravitational
        effects in real-time.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div
          className="border-2 rounded-lg overflow-hidden"
          style={{
            borderColor: "rgba(59, 130, 246, 0.3)",
            boxShadow: "0 0 40px rgba(59, 130, 246, 0.2)",
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
          <div>
            <label
              className="font-mono mb-2 block"
              style={{ color: "var(--parchment)" }}
            >
              Initial Velocity: {velocity} units/s
            </label>
            <input
              type="range"
              min="50"
              max="300"
              value={velocity}
              onChange={(e) => setVelocity(Number(e.target.value))}
              disabled={isRunning}
              className="w-full"
              style={{
                accentColor: "var(--nebula-teal)",
              }}
            />
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
              min="0"
              max="360"
              value={angle}
              onChange={(e) => setAngle(Number(e.target.value))}
              disabled={isRunning}
              className="w-full"
              style={{
                accentColor: "var(--electric-blue)",
              }}
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="trail"
              checked={showTrail}
              onChange={(e) => setShowTrail(e.target.checked)}
              className="w-5 h-5"
              style={{
                accentColor: "var(--electric-blue)",
              }}
            />
            <label
              htmlFor="trail"
              className="font-mono"
              style={{ color: "var(--parchment)" }}
            >
              Show Orbital Trail
            </label>
          </div>

          <div className="space-y-3 pt-4">
            <motion.button
              onClick={isRunning ? () => setIsRunning(false) : startSimulation}
              className="w-full px-6 py-3 rounded font-mono tracking-wider transition-all border-2"
              style={{
                backgroundColor: isRunning
                  ? "rgba(212, 24, 61, 0.2)"
                  : "rgba(13, 148, 136, 0.2)",
                borderColor: isRunning ? "var(--destructive)" : "var(--nebula-teal)",
                color: isRunning ? "var(--destructive)" : "var(--nebula-teal)",
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isRunning ? "Stop Simulation" : "Launch"}
            </motion.button>

            <motion.button
              onClick={resetSimulation}
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

          <div
            className="p-4 rounded-lg border"
            style={{
              backgroundColor: "rgba(26, 15, 46, 0.4)",
              borderColor: "rgba(184, 115, 51, 0.3)",
            }}
          >
            <p className="font-mono text-sm opacity-70" style={{ color: "var(--parchment)" }}>
              🌟 The amber star represents the Sun
              <br />
              🌍 The teal body is your launched object
              <br />
              💫 Watch how gravity shapes its path
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
