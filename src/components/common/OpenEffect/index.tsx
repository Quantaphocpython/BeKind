'use client'

import { cn } from '@/shared/utils'
import { motion, MotionProps, Transition, ViewportOptions } from 'motion/react'
import { ReactNode } from 'react'
import { animations, staggerAnimations } from './constant'
import { AnimationType } from './type'

interface OpenEffectProps extends MotionProps {
  children: ReactNode
  animation?: AnimationType
  delay?: number
  duration?: number
  className?: string
  once?: boolean
  threshold?: number
  triggerOnScroll?: boolean
}

export default function OpenEffect({
  children,
  animation = 'fadeIn',
  delay = 0.2,
  duration,
  className,
  once = true,
  threshold = 0.1,
  triggerOnScroll = true,
  ...motionProps
}: OpenEffectProps) {
  const getAnimationConfig = () => {
    if (animation.includes('Stagger')) {
      return staggerAnimations[animation as keyof typeof staggerAnimations]
    }
    return animations[animation as keyof typeof animations]
  }

  const config = getAnimationConfig()

  const customTransition: Transition = {
    ...config.transition,
    delay,
    duration: duration || config.transition.duration,
  }

  // Viewport options for scroll triggering
  const viewportOptions: ViewportOptions | undefined = triggerOnScroll
    ? {
        once,
        amount: threshold,
      }
    : undefined

  // If it's a stagger animation, wrap children in motion.div
  if (animation.includes('Stagger')) {
    return (
      <motion.div
        className={cn('w-full', className)}
        initial={config.initial}
        whileInView={config.animate}
        viewport={viewportOptions}
        transition={customTransition}
        {...motionProps}
      >
        {Array.isArray(children) ? (
          children.map((child, index) => (
            <motion.div
              key={index}
              initial={config.initial}
              whileInView={config.animate}
              viewport={viewportOptions}
              transition={{
                ...customTransition,
                delay: delay + index * 0.1,
              }}
            >
              {child}
            </motion.div>
          ))
        ) : (
          <motion.div
            initial={config.initial}
            whileInView={config.animate}
            viewport={viewportOptions}
            transition={customTransition}
          >
            {children}
          </motion.div>
        )}
      </motion.div>
    )
  }

  // Regular animation
  return (
    <motion.div
      className={cn('w-full', className)}
      initial={config.initial}
      whileInView={config.animate}
      viewport={viewportOptions}
      transition={customTransition}
      {...motionProps}
    >
      {children}
    </motion.div>
  )
}

// Convenience components for specific animations
export const FadeIn = (props: Omit<OpenEffectProps, 'animation'>) => <OpenEffect {...props} animation="fadeIn" />

export const SlideUp = (props: Omit<OpenEffectProps, 'animation'>) => <OpenEffect {...props} animation="slideUp" />

export const SlideDown = (props: Omit<OpenEffectProps, 'animation'>) => <OpenEffect {...props} animation="slideDown" />

export const SlideLeft = (props: Omit<OpenEffectProps, 'animation'>) => <OpenEffect {...props} animation="slideLeft" />

export const SlideRight = (props: Omit<OpenEffectProps, 'animation'>) => (
  <OpenEffect {...props} animation="slideRight" />
)

export const ScaleIn = (props: Omit<OpenEffectProps, 'animation'>) => <OpenEffect {...props} animation="scaleIn" />

export const BounceIn = (props: Omit<OpenEffectProps, 'animation'>) => <OpenEffect {...props} animation="bounceIn" />

export const FlipIn = (props: Omit<OpenEffectProps, 'animation'>) => <OpenEffect {...props} animation="flipIn" />

export const ZoomIn = (props: Omit<OpenEffectProps, 'animation'>) => <OpenEffect {...props} animation="zoomIn" />

export const RotateIn = (props: Omit<OpenEffectProps, 'animation'>) => <OpenEffect {...props} animation="rotateIn" />

export const SlideUpStagger = (props: Omit<OpenEffectProps, 'animation'>) => (
  <OpenEffect {...props} animation="slideUpStagger" />
)

export const ScaleInStagger = (props: Omit<OpenEffectProps, 'animation'>) => (
  <OpenEffect {...props} animation="scaleInStagger" />
)

export const FadeInStagger = (props: Omit<OpenEffectProps, 'animation'>) => (
  <OpenEffect {...props} animation="fadeInStagger" />
)
