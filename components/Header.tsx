"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"

type Locale = "pt" | "en"
type Theme = "light" | "dark"

const navLabels = {
  pt: {
    method: "Processo",
    about: "Nossa história",
    projects: "Portfólio",
    diagnostic: "Iniciar processo",
    mobileDiagnostic: "Iniciar o processo",
    menu: "Menu",
    logoAria: "Ir para a página inicial da Ottea Studio",
    themeAria: "Alternar entre modo claro e escuro",
  },
  en: {
    method: "Process",
    about: "Our story",
    projects: "Portfolio",
    diagnostic: "Start process",
    mobileDiagnostic: "Start the process",
    menu: "Menu",
    logoAria: "Go to Ottea Studio homepage",
    themeAria: "Toggle light and dark mode",
  },
} as const

function getLocale(pathname: string): Locale {
  return pathname.startsWith("/en") ? "en" : "pt"
}

function getToggleHref(pathname: string, locale: Locale) {
  if (locale === "en") {
    const withoutPrefix = pathname.replace(/^\/en/, "")
    return withoutPrefix || "/"
  }

  return pathname === "/" ? "/en" : `/en${pathname}`
}

function getNavItems(locale: Locale) {
  const prefix = locale === "en" ? "/en" : ""
  const labels = navLabels[locale]

  return [
    { href: `${prefix}/metodo`, label: labels.method },
    { href: `${prefix}/sobre`, label: labels.about },
    { href: `${prefix}/projetos`, label: labels.projects },
  ]
}

function resolveInitialTheme(): Theme {
  const stored = localStorage.getItem("tea-theme")
  if (stored === "dark" || stored === "light") {
    return stored
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

function setThemeOnDocument(theme: Theme, persist = true) {
  document.documentElement.dataset.theme = theme
  document.documentElement.style.colorScheme = theme

  if (persist) {
    localStorage.setItem("tea-theme", theme)
  }
}

export default function Header() {
  const pathname = usePathname()
  const locale = getLocale(pathname)
  const labels = navLabels[locale]
  const navItems = getNavItems(locale)
  const homeHref = locale === "en" ? "/en" : "/"
  const diagnosticHref = locale === "en" ? "/en/diagnostico" : "/diagnostico"
  const toggleHref = getToggleHref(pathname, locale)
  const toggleLabel = locale === "en" ? "EN" : "PT"

  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") {
      return "light"
    }

    return resolveInitialTheme()
  })

  useEffect(() => {
    document.documentElement.lang = locale === "en" ? "en" : "pt-BR"
  }, [locale])

  useEffect(() => {
    setThemeOnDocument(theme)
  }, [theme])

  useEffect(() => {
    let rafId = 0

    const handleScroll = () => {
      if (rafId) return
      rafId = window.requestAnimationFrame(() => {
        setScrolled(window.scrollY > 40)
        rafId = 0
      })
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (rafId) window.cancelAnimationFrame(rafId)
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [menuOpen])

  function handleThemeToggle() {
    const next = theme === "dark" ? "light" : "dark"
    setTheme(next)
  }

  return (
    <header className="fixed top-0 left-0 w-full z-50 transition-all duration-700">
      <div className="absolute inset-0 bg-[var(--tea-bg)]" />
      <div className="absolute inset-0 bg-[var(--tea-green)] opacity-[0.06]" />

      {scrolled && <div className="absolute inset-0 backdrop-blur-md bg-[var(--tea-bg)]/86" />}

      <div className="relative section-padding flex items-center justify-between h-20 border-b border-[var(--tea-brown)]/15">
        <Link href={homeHref} className="flex items-center" aria-label={labels.logoAria}>
          <div className="relative h-14 w-[128px] md:h-16 md:w-[156px] shrink-0">
            <Image
              src="/logo-ottea.png"
              alt="Ottea Studio"
              fill
              priority
              sizes="(max-width: 768px) 128px, 156px"
              className="object-contain object-left"
            />
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm tracking-[0.08em] text-[var(--tea-brown)]" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-[var(--tea-hover)] transition-colors">
              {item.label}
            </Link>
          ))}

          <Link
            href={diagnosticHref}
            className="rounded-[0.85rem] bg-[var(--tea-green)] text-[var(--tea-cream)] border border-[var(--tea-green)] px-4 py-2 text-sm tracking-[0.08em] hover:bg-transparent hover:border-[var(--tea-hover)] hover:text-[var(--tea-hover)] transition-colors"
          >
            {labels.diagnostic}
          </Link>

          <button
            type="button"
            onClick={handleThemeToggle}
            aria-label={labels.themeAria}
            suppressHydrationWarning
            className="rounded-[0.85rem] border border-[var(--tea-brown)]/35 px-3 py-2 text-xs uppercase tracking-[0.14em] hover:border-[var(--tea-hover)] hover:text-[var(--tea-hover)] transition-colors"
          >
            {theme === "dark" ? "LIGHT" : "DARK"}
          </button>

          <Link
            href={toggleHref}
            className="rounded-[0.85rem] border border-[var(--tea-brown)]/35 px-3 py-2 text-xs uppercase tracking-[0.14em] hover:border-[var(--tea-hover)] hover:text-[var(--tea-hover)] transition-colors"
          >
            {locale === "pt" ? "EN" : "PT"}
          </Link>
        </nav>

        <button
          type="button"
          className="md:hidden rounded-[0.85rem] border border-[var(--tea-brown)]/40 px-4 py-2 text-xs uppercase tracking-[0.2em] text-[var(--tea-brown)]"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
        >
          {labels.menu}
        </button>
      </div>

      {menuOpen && (
        <div id="mobile-nav" className="md:hidden relative section-padding py-7 bg-[var(--tea-bg)] border-b border-[var(--tea-brown)]/20">
          <nav className="flex flex-col gap-5 text-lg text-[var(--tea-brown)]" aria-label="Mobile navigation">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className="hover:text-[var(--tea-hover)] transition-colors">
                {item.label}
              </Link>
            ))}
            <Link
              href={diagnosticHref}
              onClick={() => setMenuOpen(false)}
              className="mt-2 block w-full rounded-[0.85rem] bg-[var(--tea-green)] text-[var(--tea-cream)] px-4 py-3 text-base tracking-[0.05em] text-left"
            >
              {labels.mobileDiagnostic}
            </Link>
            <button
              type="button"
              onClick={handleThemeToggle}
              aria-label={labels.themeAria}
              suppressHydrationWarning
              className="block w-full rounded-[0.85rem] text-left border border-[var(--tea-brown)]/35 px-4 py-3 text-sm uppercase tracking-[0.16em]"
            >
              {theme === "dark" ? "LIGHT" : "DARK"}
            </button>
            <Link
              href={toggleHref}
              onClick={() => setMenuOpen(false)}
              className="block w-full rounded-[0.85rem] border border-[var(--tea-brown)]/35 px-4 py-3 text-sm uppercase tracking-[0.16em] text-left"
            >
              {locale === "pt" ? "EN" : "PT"}
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
