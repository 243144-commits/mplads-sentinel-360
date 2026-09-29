import React, { useEffect, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [trailingPos, setTrailingPos] = useState({ x: -100, y: -100 });
  const [cursorText, setCursorText] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only enable custom cursor for non-touch fine pointers
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (target) {
        const interactiveEl = target.closest('button, a, input, select, [data-cursor-action]');
        if (interactiveEl) {
          setIsHovered(true);
          const customAction = interactiveEl.getAttribute('data-cursor-action');
          setCursorText(customAction || null);
        } else {
          setIsHovered(false);
          setCursorText(null);
        }
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Smooth trailing loop
    let rafId: number;
    const updateTrailing = () => {
      setTrailingPos(prev => ({
        x: prev.x + (position.x - prev.x) * 0.22,
        y: prev.y + (position.y - prev.y) * 0.22
      }));
      rafId = requestAnimationFrame(updateTrailing);
    };
    rafId = requestAnimationFrame(updateTrailing);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(rafId);
    };
  }, [position.x, position.y, isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Outer Ring with spring lag */}
      <div
        className={`fixed top-0 left-0 pointer-events-none z-50 rounded-full transition-transform duration-100 ease-out border border-cyan-400/40 backdrop-blur-[0.5px] ${
          isHovered
            ? 'w-10 h-10 -ml-5 -mt-5 bg-indigo-500/10 border-indigo-400/60 scale-110'
            : 'w-6 h-6 -ml-3 -mt-3'
        }`}
        style={{
          transform: `translate3d(${trailingPos.x}px, ${trailingPos.y}px, 0)`,
        }}
      >
        {cursorText && (
          <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-mono tracking-wider font-bold text-cyan-300 uppercase whitespace-nowrap">
            {cursorText}
          </span>
        )}
      </div>

      {/* Inner Dot follows immediately */}
      <div
        className={`fixed top-0 left-0 pointer-events-none z-50 rounded-full ${
          isHovered ? 'w-1.5 h-1.5 -ml-[3px] -mt-[3px] bg-cyan-300' : 'w-2 h-2 -ml-1 -mt-1 bg-indigo-400 shadow-sm shadow-indigo-500'
        }`}
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        }}
      />
    </>
  );
};
