export const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } } };
export const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};
