import { Transition } from 'motion/react'

// Animation configurations
const animations = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.6, ease: 'easeOut' } as Transition,
  },
  slideUp: {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: 'easeOut' } as Transition,
  },
  slideDown: {
    initial: { opacity: 0, y: -50 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: 'easeOut' } as Transition,
  },
  slideLeft: {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6, ease: 'easeOut' } as Transition,
  },
  slideRight: {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6, ease: 'easeOut' } as Transition,
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.6, ease: 'easeOut' } as Transition,
  },
  bounceIn: {
    initial: { opacity: 0, scale: 0.3 },
    animate: { opacity: 1, scale: 1 },
    transition: {
      duration: 0.8,
      ease: [0.68, -0.55, 0.265, 1.55], // Bounce easing
    } as Transition,
  },
  flipIn: {
    initial: { opacity: 0, rotateY: -90 },
    animate: { opacity: 1, rotateY: 0 },
    transition: { duration: 0.8, ease: 'easeOut' } as Transition,
  },
  zoomIn: {
    initial: { opacity: 0, scale: 0.5 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.7, ease: 'easeOut' } as Transition,
  },
  rotateIn: {
    initial: { opacity: 0, rotate: -180 },
    animate: { opacity: 1, rotate: 0 },
    transition: { duration: 0.8, ease: 'easeOut' } as Transition,
  },
}

// Stagger animations for multiple children
const staggerAnimations = {
  slideUpStagger: {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: 0.6,
      ease: 'easeOut',
      staggerChildren: 0.1,
    } as Transition,
  },
  scaleInStagger: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: {
      duration: 0.6,
      ease: 'easeOut',
      staggerChildren: 0.1,
    } as Transition,
  },
  fadeInStagger: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: {
      duration: 0.6,
      ease: 'easeOut',
      staggerChildren: 0.1,
    } as Transition,
  },
}

export { animations, staggerAnimations }
