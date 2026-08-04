"use client"

import Link from "next/link"
import { LazyMotion, m, useReducedMotion } from "framer-motion"

const loadFeatures = () => import("framer-motion").then((mod) => mod.domAnimation)
import { useEffect, useRef, useState } from "react"

type AnimatedHeroProps = {
  locale?: "pt" | "en"
}

type NavigatorWithConnection = Navigator & {
  connection?: {
    saveData?: boolean
    effectiveType?: string
  }
}

const copy = {
  pt: {
    lineOne: "Toda marca precisa",
    lineTwo: "do seu tempo de",
    impact: "infusão.",
    eyebrow: "Ottea Studio: Branding e Estratégia",
    kicker: "Somos um estúdio de branding e estratégia que cuida da sua marca do processo à entrega.",
    description: "Com intenção, criatividade e propósito.",
    cta: "Nossos serviços",
    ctaHref: "#servicos-home",
  },
  en: {
    lineOne: "Every brand needs",
    lineTwo: "its own time to",
    impact: "infuse.",
    eyebrow: "Ottea Studio: Branding and Strategy",
    kicker: "We are a branding and strategy studio that nurtures your brand from process to delivery.",
    description: "With intention, creativity and purpose.",
    cta: "Our services",
    ctaHref: "#servicos-home",
  },
} as const

function shouldPlayHeroVideo(reduceMotion: boolean) {
  if (reduceMotion || typeof window === "undefined") return false

  const nav = navigator as NavigatorWithConnection
  const saveData = Boolean(nav.connection?.saveData)
  const effectiveType = nav.connection?.effectiveType ?? ""
  const slowNetwork = effectiveType === "slow-2g" || effectiveType === "2g" || effectiveType === "3g"

  return !saveData && !slowNetwork
}

export default function AnimatedHero({ locale = "pt" }: AnimatedHeroProps) {
  const reduceMotion = useReducedMotion()
  const content = copy[locale]
  const [showVideo, setShowVideo] = useState(false)
  const [videoReady, setVideoReady] = useState(false)
  const allowVideo = shouldPlayHeroVideo(Boolean(reduceMotion))
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (!allowVideo) return

    const timer = window.setTimeout(() => setShowVideo(true), 140)
    return () => window.clearTimeout(timer)
  }, [allowVideo])

  // Never rely on the autoPlay attribute — call .play() explicitly and treat
  // a rejected Promise as the definitive signal to fall back to the static bg
  // before any native player UI has a chance to render.
  useEffect(() => {
    if (!showVideo) return

    const video = videoRef.current
    if (!video) return

    const tryPlay = () => {
      video.play().catch(() => {
        setShowVideo(false)
      })
    }

    if (video.readyState >= 3) {
      tryPlay()
    } else {
      video.addEventListener("canplay", tryPlay, { once: true })
    }

    return () => {
      video.removeEventListener("canplay", tryPlay)
    }
  }, [showVideo])

  return (
    <LazyMotion features={loadFeatures} strict>
    <section className="relative min-h-[84vh] md:min-h-[92vh] flex items-center section-padding overflow-hidden">
      <div className="absolute inset-0 bg-[var(--tea-green)]" />
      <div className="absolute inset-0 hero-gradient-shift opacity-70" />

      {allowVideo && showVideo && (
        <video
          ref={videoRef}
          className={`absolute inset-0 h-full w-full object-cover pointer-events-none transition-opacity duration-500 ${videoReady ? "opacity-100" : "opacity-0"}`}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          onCanPlay={() => setVideoReady(true)}
        >
          <source src="/video-home.mp4" type="video/mp4" />
        </video>
      )}

      <div className="absolute inset-0 bg-[var(--tea-green)]/56" />
      <div className="absolute inset-0 hero-grain opacity-35" />

      <div className="relative w-full max-w-[1280px]">
        <m.h1
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="hero-title-lock block w-full max-w-full text-[clamp(2rem,9vw,6.3rem)] leading-[0.93] font-semibold tracking-[-0.03em] text-[var(--tea-cream)]"
        >
          <span className="hero-line">{content.lineOne}</span>
          <span className="hero-line">{content.lineTwo}</span>
          <span className="hero-line tea-script text-[var(--tea-cream)]">{content.impact}</span>
        </m.h1>

        <m.div
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="mt-8 md:mt-10 lg:mt-12 grid lg:grid-cols-12 gap-6 lg:gap-10 items-end text-[var(--tea-cream)]"
        >
          <div className="lg:col-span-8">
            <p className="text-xs uppercase tracking-[0.32em] mb-4 text-[var(--tea-cream)]/72">{content.eyebrow}</p>
            <p className="text-sm sm:text-base lg:text-xl leading-relaxed text-[var(--tea-cream)] mb-3">{content.kicker}</p>
            <p className="text-xs sm:text-sm lg:text-base leading-relaxed text-[var(--tea-cream)]/90 max-w-none">{content.description}</p>
          </div>

          <div className="lg:col-span-4 lg:justify-self-end w-full lg:w-auto">
            <Link
              href={content.ctaHref}
              className="inline-block w-full lg:w-auto rounded-[0.85rem] bg-[var(--tea-cream)] text-[var(--tea-green)] border border-[var(--tea-cream)] px-7 py-4 text-sm tracking-[0.08em] text-center hover:bg-transparent hover:text-[var(--tea-cream)] transition-colors"
            >
              {content.cta}
            </Link>
          </div>
        </m.div>
      </div>
    </section>
    </LazyMotion>
  )
}
