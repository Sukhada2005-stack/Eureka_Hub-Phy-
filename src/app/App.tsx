import { Starfield } from "./components/Starfield";
import { NewtonsObservatory } from "./components/NewtonsObservatory";
import { StellarPhysicsQuiz } from "./components/StellarPhysicsQuiz";
import { OrbitalMechanicsLab } from "./components/OrbitalMechanicsLab";
import { GravitySinker } from "./components/GravitySinker";
import { ConstellationTracer } from "./components/ConstellationTracer";
import { SpectralSlider } from "./components/SpectralSlider";
import { HallOfPioneers } from "./components/HallOfPioneers";
import { motion } from "motion/react";

export default function App() {
  return (
    <div
      className="min-h-screen w-full relative overflow-x-hidden"
      style={{ backgroundColor: "var(--deep-space)" }}
    >
      <Starfield />

      <div className="relative z-10 container mx-auto px-6 py-12">
        <motion.header
          className="text-center mb-16"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <motion.h1
            className="font-serif tracking-widest mb-4"
            style={{
              fontSize: "3.5rem",
              color: "var(--parchment)",
              textShadow: "0 0 40px rgba(251, 191, 36, 0.5)",
            }}
            animate={{
              textShadow: [
                "0 0 40px rgba(251, 191, 36, 0.5)",
                "0 0 60px rgba(251, 191, 36, 0.7)",
                "0 0 40px rgba(251, 191, 36, 0.5)",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            EUREKA
          </motion.h1>
          <p
            className="font-mono tracking-wider opacity-70"
            style={{
              color: "var(--copper)",
              fontSize: "1.125rem",
            }}
          >
            The Physics Hub — Where Cosmic Forces Meet Ancient
            Wisdom
          </p>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <motion.div
            className="lg:col-span-2 space-y-12"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div
              className="backdrop-blur-sm border-2 p-8 rounded-lg"
              style={{
                backgroundColor: "rgba(26, 15, 46, 0.4)",
                borderColor: "rgba(184, 115, 51, 0.3)",
                boxShadow:
                  "inset 8px 0 16px rgba(251, 191, 36, 0.2)",
              }}
            >
              <NewtonsObservatory />
            </div>

            <StellarPhysicsQuiz />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <HallOfPioneers />
          </motion.div>
        </div>

        <motion.div
          className="backdrop-blur-sm border-2 p-12 rounded-lg mb-12"
          style={{
            backgroundColor: "rgba(26, 15, 46, 0.4)",
            borderColor: "rgba(251, 191, 36, 0.3)",
            boxShadow: "0 0 40px rgba(251, 191, 36, 0.2)",
          }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <GravitySinker />
        </motion.div>

        <motion.div
          className="backdrop-blur-sm border-2 p-12 rounded-lg mb-12"
          style={{
            backgroundColor: "rgba(26, 15, 46, 0.4)",
            borderColor: "rgba(13, 148, 136, 0.3)",
            boxShadow: "0 0 40px rgba(13, 148, 136, 0.2)",
          }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <ConstellationTracer />
        </motion.div>

        <motion.div
          className="backdrop-blur-sm border-2 p-12 rounded-lg mb-12"
          style={{
            backgroundColor: "rgba(26, 15, 46, 0.4)",
            borderColor: "rgba(59, 130, 246, 0.3)",
            boxShadow: "0 0 40px rgba(59, 130, 246, 0.2)",
          }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
        >
          <SpectralSlider />
        </motion.div>

        <motion.div
          className="backdrop-blur-sm border-2 p-12 rounded-lg mb-12"
          style={{
            backgroundColor: "rgba(26, 15, 46, 0.4)",
            borderColor: "rgba(59, 130, 246, 0.3)",
            boxShadow: "0 0 40px rgba(59, 130, 246, 0.2)",
          }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3 }}
        >
          <OrbitalMechanicsLab />
        </motion.div>

        <motion.footer
          className="mt-16 text-center font-mono opacity-50"
          style={{
            color: "var(--parchment)",
            fontSize: "0.875rem",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          <p>
            Forces & Cosmos — Where Newton's Laws Dance with
            Stellar Bodies
          </p>
        </motion.footer>
      </div>
    </div>
  );
}