'use client'

import { AnimatedGradientText } from '@/components/ui/animated-gradient-text'
import { AnimatedGridPattern } from '@/components/ui/animated-grid-pattern'
import { TextAnimate } from '@/components/ui/text-animate'
import { TypingAnimation } from '@/components/ui/typing-animation'
import { useTranslations } from '@/shared/hooks'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef } from 'react'
import ContactForm from '../organisms/ContactForm'
import ContactMethods from '../organisms/ContactMethods'

// Đăng ký ScrollTrigger ngay từ đầu
gsap.registerPlugin(ScrollTrigger)

export default function ContactPage() {
  const t = useTranslations()
  const containerRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const floatingElementsRef = useRef<HTMLDivElement>(null)
  const contactMethodsRef = useRef<HTMLDivElement>(null)
  const contactFormRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      // Initial page entrance animation
      const tl = gsap.timeline()

      // Chỉ áp dụng animation cho hero section, không ẩn toàn bộ container
      const heroIcon = heroRef.current?.querySelector('.hero-icon')
      const heroTitle = heroRef.current?.querySelector('.hero-title')
      const heroSubtitle = heroRef.current?.querySelector('.hero-subtitle')

      if (heroIcon) {
        tl.fromTo(
          heroIcon,
          { scale: 0, rotation: -180 },
          { scale: 1, rotation: 0, duration: 0.8, ease: 'back.out(1.7)' },
        )
      }

      if (heroTitle) {
        tl.fromTo(heroTitle, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }, '-=0.4')
      }

      if (heroSubtitle) {
        tl.fromTo(heroSubtitle, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }, '-=0.6')
      }

      // Floating elements animation
      const floatingElements = floatingElementsRef.current?.querySelectorAll('.floating-element')
      if (floatingElements) {
        gsap.to(floatingElements, {
          y: -20,
          duration: 3,
          ease: 'power1.inOut',
          stagger: 0.5,
          repeat: -1,
          yoyo: true,
        })
      }

      const parallaxElements = floatingElementsRef.current?.querySelectorAll('.parallax-bg')
      if (parallaxElements && containerRef.current) {
        gsap.to(parallaxElements, {
          yPercent: -50,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        })
      }
    },
    { scope: containerRef },
  )

  // Mouse move effect for floating elements
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      const { innerWidth, innerHeight } = window

      const x = (clientX / innerWidth - 0.5) * 20
      const y = (clientY / innerHeight - 0.5) * 20

      const floatingElements = floatingElementsRef.current?.querySelectorAll('.floating-element')
      if (floatingElements) {
        gsap.to(floatingElements, {
          x: x,
          y: y,
          duration: 1,
          ease: 'power2.out',
        })
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div ref={containerRef} className="min-h-screen">
      {/* Hero Section - Full Screen */}
      <div ref={heroRef} className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Enhanced Background with multiple layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-primary/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(120,119,198,0.1),transparent_50%)]" />

        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-30" />

        {/* Animated Grid Pattern Background */}
        <AnimatedGridPattern
          className="opacity-20"
          width={60}
          height={60}
          numSquares={0}
          maxOpacity={0.3}
          duration={3}
        />

        {/* Enhanced Floating elements */}
        <div ref={floatingElementsRef} className="absolute inset-0 pointer-events-none">
          <div className="floating-element parallax-bg absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-primary/25 to-primary/5 rounded-full blur-3xl animate-pulse" />
          <div className="floating-element parallax-bg absolute bottom-20 right-10 w-[500px] h-[500px] bg-gradient-to-br from-primary/15 to-primary/5 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="floating-element absolute top-1/3 right-1/4 w-64 h-64 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-2xl" />
          <div className="floating-element absolute bottom-1/3 left-1/4 w-80 h-80 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl" />

          {/* Animated particles */}
          <div className="floating-element absolute top-1/4 left-1/3 w-3 h-3 bg-primary/70 rounded-full" />
          <div className="floating-element absolute top-3/4 right-1/3 w-2 h-2 bg-primary/50 rounded-full" />
          <div className="floating-element absolute top-1/2 left-1/2 w-2.5 h-2.5 bg-primary/60 rounded-full" />
          <div className="floating-element absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-primary/40 rounded-full" />
        </div>

        {/* Hero Content */}
        <div className="relative z-20 text-center px-4 max-w-6xl mx-auto">
          <div className="hero-icon inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary to-primary/70 rounded-3xl mb-12 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full animate-shimmer" />
            <svg className="w-12 h-12 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>

          {/* Aurora Text Effect for Main Title */}
          <div className="hero-title mb-12">
            <TypingAnimation
              className="text-7xl md:text-8xl lg:text-9xl font-bold leading-tight"
              // colors={['var(--primary)', 'var(--primary)', 'var(--secondary)', 'var(--secondary)']}
              // speed={0.8}
            >
              {t('Get in Touch')}
            </TypingAnimation>
          </div>

          {/* Animated Gradient Text for Subtitle */}
          <div className="hero-subtitle">
            <TextAnimate
              as="p"
              className="text-2xl md:text-3xl lg:text-4xl max-w-5xl mx-auto leading-relaxed font-light"
              animation="blurInUp"
              by="word"
              delay={0.5}
              duration={0.8}
            >
              {t('We would love to hear from you. Send us a message and we will respond as soon as possible.')}
            </TextAnimate>
          </div>
        </div>
      </div>

      {/* Contact Methods Section */}
      <div ref={contactMethodsRef} className="py-32 bg-gradient-to-b from-background to-background/95 relative">
        {/* Animated Grid Pattern for Contact Methods */}
        <AnimatedGridPattern
          className="opacity-10"
          width={40}
          height={40}
          numSquares={20}
          maxOpacity={0.2}
          duration={4}
        />
        <div className="container mx-auto px-4 relative z-10">
          <ContactMethods />
        </div>
      </div>

      {/* Contact Form Section */}
      <div ref={contactFormRef} className="py-32 bg-gradient-to-b from-background/95 to-background relative">
        {/* Animated Grid Pattern for Contact Form */}
        <AnimatedGridPattern
          className="opacity-5"
          width={50}
          height={50}
          numSquares={15}
          maxOpacity={0.1}
          duration={5}
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="relative group">
              {/* Enhanced Decorative elements */}
              <div className="absolute -top-6 -left-6 w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-full opacity-20 group-hover:scale-150 transition-transform duration-500" />
              <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-gradient-to-br from-primary/30 to-primary/10 rounded-full opacity-30 group-hover:scale-150 transition-transform duration-500" />

              <div className="bg-card/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-border/50 p-12 md:p-20 relative overflow-hidden group-hover:shadow-primary/20 transition-all duration-500">
                {/* Enhanced Background pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-30" />
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />

                <div className="relative z-10">
                  <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl mb-8 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>

                    {/* Animated Gradient Text for Form Title */}
                    <div className="mb-8">
                      <AnimatedGradientText
                        className="text-5xl md:text-6xl font-bold"
                        speed={0.8}
                        colorFrom="#6366f1"
                        colorTo="#8b5cf6"
                      >
                        {t('Send us a Message')}
                      </AnimatedGradientText>
                    </div>

                    {/* Text Animate for Form Description */}
                    <TextAnimate
                      as="p"
                      className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
                      animation="fadeIn"
                      by="word"
                      delay={0.3}
                      duration={0.6}
                    >
                      {t('Fill out the form below and we will get back to you within 24 hours')}
                    </TextAnimate>
                  </div>
                  <ContactForm />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info Section */}
      <div className="py-20 bg-background relative">
        {/* Animated Grid Pattern for Additional Info */}
        <AnimatedGridPattern
          className="opacity-5"
          width={30}
          height={30}
          numSquares={10}
          maxOpacity={0.1}
          duration={6}
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center space-x-3 text-muted-foreground hover:text-primary transition-colors duration-300 cursor-pointer group">
              <svg
                className="w-6 h-6 group-hover:scale-110 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <span className="text-lg font-medium">{t('Your information is secure and will never be shared')}</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%) skewX(-12deg);
          }
          100% {
            transform: translateX(200%) skewX(-12deg);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  )
}
