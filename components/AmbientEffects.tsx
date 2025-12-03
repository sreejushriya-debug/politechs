"use client";

import { useEffect, useRef } from "react";

// Floating particles background
export function FloatingParticles() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-white/20 rounded-full animate-float-particle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${15 + Math.random() * 10}s`,
          }}
        />
      ))}
    </div>
  );
}

// Gradient orbs that follow mouse slightly
export function GradientOrbs() {
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;

      if (orb1Ref.current) {
        orb1Ref.current.style.transform = `translate(${x * 50}px, ${y * 50}px)`;
      }
      if (orb2Ref.current) {
        orb2Ref.current.style.transform = `translate(${-x * 30}px, ${-y * 30}px)`;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      <div
        ref={orb1Ref}
        className="fixed top-1/4 left-1/4 w-[600px] h-[600px] bg-accent-blue/10 rounded-full blur-[150px] pointer-events-none transition-transform duration-1000 ease-out z-0"
      />
      <div
        ref={orb2Ref}
        className="fixed bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent-red/10 rounded-full blur-[150px] pointer-events-none transition-transform duration-1000 ease-out z-0"
      />
    </>
  );
}

// Animated grid background
export function AnimatedGrid() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.02]">
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'grid-move 20s linear infinite',
        }}
      />
    </div>
  );
}

// Glowing cursor trail
export function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (glowRef.current) {
        glowRef.current.style.left = `${e.clientX}px`;
        glowRef.current.style.top = `${e.clientY}px`;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={glowRef}
      className="fixed w-64 h-64 pointer-events-none z-50 opacity-30 mix-blend-screen"
      style={{
        background: 'radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)',
        transform: 'translate(-50%, -50%)',
        transition: 'left 0.1s ease-out, top 0.1s ease-out',
      }}
    />
  );
}

// Pulsing dots decoration
export function PulsingDots({ className = "" }: { className?: string }) {
  return (
    <div className={`flex gap-2 ${className}`}>
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="w-2 h-2 rounded-full bg-accent-blue animate-pulse"
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </div>
  );
}

// Animated line decoration
export function AnimatedLine({ className = "" }: { className?: string }) {
  return (
    <div className={`relative h-px overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent-blue to-transparent animate-shimmer-line" />
    </div>
  );
}

// Rotating border gradient
export function GlowingBorder({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative group ${className}`}>
      <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-blue via-accent-red to-accent-blue rounded-3xl opacity-30 group-hover:opacity-60 blur transition-opacity duration-500 animate-gradient-rotate" />
      <div className="relative bg-navy-900 rounded-3xl">
        {children}
      </div>
    </div>
  );
}

// Typing effect
interface TypingEffectProps {
  texts: string[];
  className?: string;
}

export function TypingEffect({ texts, className = "" }: TypingEffectProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const textIndex = useRef(0);
  const charIndex = useRef(0);
  const isDeleting = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const type = () => {
      const currentText = texts[textIndex.current];
      
      if (isDeleting.current) {
        charIndex.current--;
        element.textContent = currentText.substring(0, charIndex.current);
        
        if (charIndex.current === 0) {
          isDeleting.current = false;
          textIndex.current = (textIndex.current + 1) % texts.length;
        }
      } else {
        charIndex.current++;
        element.textContent = currentText.substring(0, charIndex.current);
        
        if (charIndex.current === currentText.length) {
          setTimeout(() => {
            isDeleting.current = true;
          }, 2000);
        }
      }
    };

    const interval = setInterval(type, isDeleting.current ? 50 : 100);
    return () => clearInterval(interval);
  }, [texts]);

  return (
    <span className={className}>
      <span ref={ref}></span>
      <span className="animate-blink">|</span>
    </span>
  );
}

