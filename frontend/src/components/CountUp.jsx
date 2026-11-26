import { useEffect, useRef, useState } from 'react';
import { animate, useReducedMotion } from 'framer-motion';

/** Animates a number from its previous value to the new one. */
export default function CountUp({ value, duration = 0.9 }) {
  const reduce = useReducedMotion();
  const prev = useRef(0);
  const [n, setN] = useState(reduce ? value : 0);

  useEffect(() => {
    if (reduce) {
      setN(value);
      return undefined;
    }
    const controls = animate(prev.current, value, {
      duration,
      ease: 'easeOut',
      onUpdate: (v) => setN(Math.round(v)),
    });
    prev.current = value;
    return () => controls.stop();
  }, [value, duration, reduce]);

  return <>{n}</>;
}
