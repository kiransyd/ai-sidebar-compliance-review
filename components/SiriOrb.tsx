"use client"

import { cn } from "@/lib/utils";

// --- SiriOrb Component ---
interface SiriOrbProps {
  size?: string
  className?: string
  colors?: {
    bg?: string
    c1?: string
    c2?: string
    c3?: string
    c4?: string
    c5?: string
  }
  animationDuration?: number
  state?: 'idle' | 'typing' | 'thinking' | 'listening'
}

const SiriOrb: React.FC<SiriOrbProps> = ({
  size = "16px",
  className,
  colors,
  animationDuration = 15,
  state = 'idle',
}) => {
  // Using rainbow colors from the RainbowButton
  const defaultColors = {
    bg: "transparent",
    c1: "hsl(0, 100%, 63%)",    // Red
    c2: "hsl(270, 100%, 63%)",  // Purple
    c3: "hsl(210, 100%, 63%)",  // Blue
    c4: "hsl(195, 100%, 63%)",  // Cyan
    c5: "hsl(90, 100%, 63%)",   // Green
  }

  const finalColors = { ...defaultColors, ...colors }
  const sizeValue = parseInt(size.replace("px", ""), 10)

  // Different animation settings based on state
  const getAnimationSettings = () => {
    switch (state) {
      case 'typing':
        return {
          duration: 8, // Faster for typing
          blurAmount: Math.max(sizeValue * 0.15, 4),
          contrastAmount: Math.max(sizeValue * 0.005, 2.5),
          animationClass: 'typing-animation'
        }
      case 'thinking':
        return {
          duration: 20, // Slower for thinking
          blurAmount: Math.max(sizeValue * 0.08, 2),
          contrastAmount: Math.max(sizeValue * 0.003, 1.8),
          animationClass: 'thinking-animation'
        }
      case 'listening':
        return {
          duration: 6, // Very fast for listening
          blurAmount: Math.max(sizeValue * 0.18, 5),
          contrastAmount: Math.max(sizeValue * 0.006, 3),
          animationClass: 'listening-animation'
        }
      default: // idle
        return {
          duration: animationDuration,
          blurAmount: Math.max(sizeValue * 0.12, 3),
          contrastAmount: Math.max(sizeValue * 0.004, 2.2),
          animationClass: 'idle-animation'
        }
    }
  }

  const settings = getAnimationSettings()

  return (
    <div
      className={cn("siri-orb", settings.animationClass, className)}
      style={
        {
          width: size,
          height: size,
          "--bg": finalColors.bg,
          "--c1": finalColors.c1,
          "--c2": finalColors.c2,
          "--c3": finalColors.c3,
          "--c4": finalColors.c4,
          "--c5": finalColors.c5,
          "--animation-duration": `${settings.duration}s`,
          "--blur-amount": `${settings.blurAmount}px`,
          "--contrast-amount": settings.contrastAmount,
        } as React.CSSProperties
      }
    >
      <style jsx>{`
        @property --angle {
          syntax: "<angle>";
          inherits: false;
          initial-value: 0deg;
        }

        .siri-orb {
          display: grid;
          grid-template-areas: "stack";
          overflow: hidden;
          border-radius: 50%;
          position: relative;
          background: radial-gradient(
            circle,
            rgba(255, 0, 0, 0.15) 0%,     /* Red glow */
            rgba(0, 255, 0, 0.08) 25%,   /* Green glow */
            rgba(0, 0, 255, 0.12) 50%,   /* Blue glow */
            rgba(255, 0, 255, 0.06) 75%, /* Purple glow */
            transparent 100%
          );
        }

        /* override for dark mode */
        .dark .siri-orb {
          background: radial-gradient(
            circle,
            rgba(255, 0, 0, 0.2) 0%,     /* Red glow */
            rgba(0, 255, 0, 0.12) 25%,   /* Green glow */
            rgba(0, 0, 255, 0.18) 50%,   /* Blue glow */
            rgba(255, 0, 255, 0.1) 75%,  /* Purple glow */
            transparent 100%
          );
        }

        .siri-orb::before {
          content: "";
          display: block;
          grid-area: stack;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background:
            conic-gradient(
              from calc(var(--angle) * 1.5) at 20% 20%,
              var(--c1) 0deg,
              transparent 30deg 330deg,
              var(--c1) 360deg
            ),
            conic-gradient(
              from calc(var(--angle) * -1.2) at 80% 30%,
              var(--c2) 0deg,
              transparent 40deg 320deg,
              var(--c2) 360deg
            ),
            conic-gradient(
              from calc(var(--angle) * 0.8) at 30% 80%,
              var(--c3) 0deg,
              transparent 50deg 310deg,
              var(--c3) 360deg
            ),
            conic-gradient(
              from calc(var(--angle) * -2.1) at 70% 70%,
              var(--c4) 0deg,
              transparent 35deg 325deg,
              var(--c4) 360deg
            ),
            conic-gradient(
              from calc(var(--angle) * 1.8) at 50% 10%,
              var(--c5) 0deg,
              transparent 45deg 315deg,
              var(--c5) 360deg
            ),
            conic-gradient(
              from calc(var(--angle) * -0.5) at 10% 50%,
              var(--c1) 0deg,
              transparent 25deg 335deg,
              var(--c1) 360deg
            ),
            radial-gradient(
              ellipse 150% 100% at 50% 50%,
              var(--c2) 0%,
              var(--c3) 25%,
              var(--c4) 50%,
              var(--c5) 75%,
              transparent 100%
            );
          filter: blur(var(--blur-amount)) contrast(var(--contrast-amount)) saturate(1.5);
          animation: rotate var(--animation-duration) linear infinite;
          transform: translateZ(0);
          will-change: transform;
        }

        .siri-orb::after {
          content: "";
          display: block;
          grid-area: stack;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: radial-gradient(
            circle at 50% 50%,
            rgba(255, 255, 255, 0.2) 0%,
            rgba(255, 255, 255, 0.1) 30%,
            rgba(255, 255, 255, 0.05) 60%,
            transparent 100%
          );
          mix-blend-mode: overlay;
        }

        /* State-specific animations */
        .typing-animation::before {
          animation: typing-pulse var(--animation-duration) ease-in-out infinite;
        }

        .thinking-animation::before {
          animation: thinking-rotate var(--animation-duration) linear infinite;
        }

        .listening-animation::before {
          animation: listening-bounce var(--animation-duration) ease-in-out infinite;
        }

        .idle-animation::before {
          animation: rotate var(--animation-duration) linear infinite;
        }

        @keyframes rotate {
          from { --angle: 0deg; }
          to { --angle: 360deg; }
        }

        @keyframes typing-pulse {
          0%, 100% { 
            --angle: 0deg;
            transform: scale(1);
            filter: blur(var(--blur-amount)) contrast(var(--contrast-amount)) saturate(1.5);
          }
          25% { 
            --angle: 90deg;
            transform: scale(1.1);
            filter: blur(calc(var(--blur-amount) * 1.2)) contrast(calc(var(--contrast-amount) * 1.3)) saturate(2);
          }
          50% { 
            --angle: 180deg;
            transform: scale(1.05);
            filter: blur(var(--blur-amount)) contrast(var(--contrast-amount)) saturate(1.5);
          }
          75% { 
            --angle: 270deg;
            transform: scale(1.1);
            filter: blur(calc(var(--blur-amount) * 1.2)) contrast(calc(var(--contrast-amount) * 1.3)) saturate(2);
          }
        }

        @keyframes thinking-rotate {
          0% { --angle: 0deg; transform: scale(0.95); }
          25% { --angle: 90deg; transform: scale(1.02); }
          50% { --angle: 180deg; transform: scale(0.98); }
          75% { --angle: 270deg; transform: scale(1.01); }
          100% { --angle: 360deg; transform: scale(0.95); }
        }

        @keyframes listening-bounce {
          0%, 100% { 
            --angle: 0deg;
            transform: scale(1) translateY(0);
            filter: blur(var(--blur-amount)) contrast(var(--contrast-amount)) saturate(2);
          }
          20% { 
            --angle: 72deg;
            transform: scale(1.15) translateY(-2px);
            filter: blur(calc(var(--blur-amount) * 1.5)) contrast(calc(var(--contrast-amount) * 1.5)) saturate(2.5);
          }
          40% { 
            --angle: 144deg;
            transform: scale(1.05) translateY(1px);
            filter: blur(var(--blur-amount)) contrast(var(--contrast-amount)) saturate(2);
          }
          60% { 
            --angle: 216deg;
            transform: scale(1.1) translateY(-1px);
            filter: blur(calc(var(--blur-amount) * 1.3)) contrast(calc(var(--contrast-amount) * 1.2)) saturate(2.2);
          }
          80% { 
            --angle: 288deg;
            transform: scale(1.08) translateY(0.5px);
            filter: blur(var(--blur-amount)) contrast(var(--contrast-amount)) saturate(2);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .siri-orb::before {
            animation: none;
          }
        }
      `}</style>
    </div>
  )
}

export default SiriOrb