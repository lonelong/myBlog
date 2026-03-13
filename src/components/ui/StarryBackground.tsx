'use client'

import { useEffect, useRef, useState } from 'react'
import { useTheme } from 'next-themes'

export default function StarryBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!mounted) return
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const isDark = resolvedTheme === 'dark'
    canvas.style.opacity = isDark ? '0.9' : '0.7'
    let animationId: number
    let width = window.innerWidth
    let height = window.innerHeight

    // Resize canvas
    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
    }
    resize()
    window.addEventListener('resize', resize)

    // Stars
    interface Star {
      x: number
      y: number
      size: number
      opacity: number
      twinkleSpeed: number
      twinkleOffset: number
    }

    const starCount = isDark ? 200 : 120
    const stars: Star[] = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * (isDark ? 2 : 3) + (isDark ? 0.5 : 1),
      opacity: Math.random() * (isDark ? 0.8 : 0.5) + (isDark ? 0.2 : 0.1),
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      twinkleOffset: Math.random() * Math.PI * 2,
    }))

    // Shooting stars (dark mode only)
    interface Meteor {
      x: number
      y: number
      length: number
      speed: number
      opacity: number
      angle: number
      active: boolean
      life: number
      maxLife: number
    }

    const meteors: Meteor[] = []

    const createMeteor = (): Meteor => {
      const angle = (Math.random() * 30 + 15) * (Math.PI / 180)
      return {
        x: Math.random() * width * 1.2 - width * 0.1,
        y: -20,
        length: Math.random() * 120 + 80,
        speed: Math.random() * 8 + 6,
        opacity: 1,
        angle,
        active: true,
        life: 0,
        maxLife: Math.random() * 60 + 40,
      }
    }

    let time = 0
    let meteorTimer = 0

    const draw = () => {
      time += 1
      meteorTimer += 1

      // Clear
      ctx.clearRect(0, 0, width, height)

      if (isDark) {
        // === DARK MODE: Full starry sky ===

        // Draw purple nebula background glow
        const gradient1 = ctx.createRadialGradient(
          width * 0.2, height * 0.3, 0,
          width * 0.2, height * 0.3, width * 0.5
        )
        gradient1.addColorStop(0, 'rgba(139, 92, 246, 0.06)')
        gradient1.addColorStop(0.5, 'rgba(99, 102, 241, 0.03)')
        gradient1.addColorStop(1, 'rgba(0, 0, 0, 0)')
        ctx.fillStyle = gradient1
        ctx.fillRect(0, 0, width, height)

        const gradient2 = ctx.createRadialGradient(
          width * 0.8, height * 0.6, 0,
          width * 0.8, height * 0.6, width * 0.4
        )
        gradient2.addColorStop(0, 'rgba(168, 85, 247, 0.05)')
        gradient2.addColorStop(0.5, 'rgba(139, 92, 246, 0.02)')
        gradient2.addColorStop(1, 'rgba(0, 0, 0, 0)')
        ctx.fillStyle = gradient2
        ctx.fillRect(0, 0, width, height)

        const gradient3 = ctx.createRadialGradient(
          width * 0.5, height * 0.1, 0,
          width * 0.5, height * 0.1, width * 0.3
        )
        gradient3.addColorStop(0, 'rgba(99, 102, 241, 0.04)')
        gradient3.addColorStop(1, 'rgba(0, 0, 0, 0)')
        ctx.fillStyle = gradient3
        ctx.fillRect(0, 0, width, height)

        // Draw twinkling stars
        stars.forEach((star) => {
          const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset)
          const currentOpacity = star.opacity * (0.5 + twinkle * 0.5)

          // Star glow
          const glow = ctx.createRadialGradient(
            star.x, star.y, 0,
            star.x, star.y, star.size * 3
          )
          glow.addColorStop(0, `rgba(200, 180, 255, ${currentOpacity})`)
          glow.addColorStop(0.5, `rgba(160, 140, 220, ${currentOpacity * 0.3})`)
          glow.addColorStop(1, 'rgba(0, 0, 0, 0)')
          ctx.fillStyle = glow
          ctx.fillRect(
            star.x - star.size * 3,
            star.y - star.size * 3,
            star.size * 6,
            star.size * 6
          )

          // Star core
          ctx.beginPath()
          ctx.arc(star.x, star.y, star.size * 0.8, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(230, 220, 255, ${currentOpacity})`
          ctx.fill()
        })

        // Spawn meteors
        if (meteorTimer > 80 + Math.random() * 120) {
          meteorTimer = 0
          if (meteors.filter(m => m.active).length < 3) {
            meteors.push(createMeteor())
          }
        }

        // Draw meteors
        meteors.forEach((meteor) => {
          if (!meteor.active) return

          meteor.life += 1
          meteor.x += Math.cos(meteor.angle) * meteor.speed
          meteor.y += Math.sin(meteor.angle) * meteor.speed

          if (meteor.life < 10) {
            meteor.opacity = meteor.life / 10
          } else if (meteor.life > meteor.maxLife - 15) {
            meteor.opacity = (meteor.maxLife - meteor.life) / 15
          }

          if (meteor.life >= meteor.maxLife || meteor.y > height + 50 || meteor.x > width + 50) {
            meteor.active = false
            return
          }

          const tailX = meteor.x - Math.cos(meteor.angle) * meteor.length
          const tailY = meteor.y - Math.sin(meteor.angle) * meteor.length

          const meteorGrad = ctx.createLinearGradient(tailX, tailY, meteor.x, meteor.y)
          meteorGrad.addColorStop(0, 'rgba(0, 0, 0, 0)')
          meteorGrad.addColorStop(0.3, `rgba(168, 85, 247, ${meteor.opacity * 0.1})`)
          meteorGrad.addColorStop(0.7, `rgba(200, 180, 255, ${meteor.opacity * 0.4})`)
          meteorGrad.addColorStop(1, `rgba(255, 255, 255, ${meteor.opacity * 0.9})`)

          ctx.beginPath()
          ctx.moveTo(tailX, tailY)
          ctx.lineTo(meteor.x, meteor.y)
          ctx.strokeStyle = meteorGrad
          ctx.lineWidth = 1.5
          ctx.stroke()

          const headGlow = ctx.createRadialGradient(
            meteor.x, meteor.y, 0,
            meteor.x, meteor.y, 6
          )
          headGlow.addColorStop(0, `rgba(255, 255, 255, ${meteor.opacity * 0.8})`)
          headGlow.addColorStop(0.5, `rgba(168, 85, 247, ${meteor.opacity * 0.3})`)
          headGlow.addColorStop(1, 'rgba(0, 0, 0, 0)')
          ctx.fillStyle = headGlow
          ctx.fillRect(meteor.x - 6, meteor.y - 6, 12, 12)
        })

        // Clean up inactive meteors
        for (let i = meteors.length - 1; i >= 0; i--) {
          if (!meteors[i].active) meteors.splice(i, 1)
        }
      } else {
        // === LIGHT MODE: Soft purple floating particles ===

        // Subtle purple gradient wash
        const bgGrad1 = ctx.createRadialGradient(
          width * 0.15, height * 0.2, 0,
          width * 0.15, height * 0.2, width * 0.5
        )
        bgGrad1.addColorStop(0, 'rgba(124, 58, 237, 0.06)')
        bgGrad1.addColorStop(0.5, 'rgba(139, 92, 246, 0.03)')
        bgGrad1.addColorStop(1, 'rgba(0, 0, 0, 0)')
        ctx.fillStyle = bgGrad1
        ctx.fillRect(0, 0, width, height)

        const bgGrad2 = ctx.createRadialGradient(
          width * 0.85, height * 0.5, 0,
          width * 0.85, height * 0.5, width * 0.45
        )
        bgGrad2.addColorStop(0, 'rgba(147, 51, 234, 0.05)')
        bgGrad2.addColorStop(0.5, 'rgba(124, 58, 237, 0.02)')
        bgGrad2.addColorStop(1, 'rgba(0, 0, 0, 0)')
        ctx.fillStyle = bgGrad2
        ctx.fillRect(0, 0, width, height)

        const bgGrad3 = ctx.createRadialGradient(
          width * 0.5, height * 0.8, 0,
          width * 0.5, height * 0.8, width * 0.35
        )
        bgGrad3.addColorStop(0, 'rgba(109, 40, 217, 0.04)')
        bgGrad3.addColorStop(1, 'rgba(0, 0, 0, 0)')
        ctx.fillStyle = bgGrad3
        ctx.fillRect(0, 0, width, height)

        // Soft purple floating particles
        stars.forEach((star) => {
          const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset)
          const currentOpacity = star.opacity * (0.4 + twinkle * 0.6)

          // Soft purple glow
          const glow = ctx.createRadialGradient(
            star.x, star.y, 0,
            star.x, star.y, star.size * 4
          )
          glow.addColorStop(0, `rgba(124, 58, 237, ${currentOpacity * 0.5})`)
          glow.addColorStop(0.4, `rgba(147, 51, 234, ${currentOpacity * 0.2})`)
          glow.addColorStop(1, 'rgba(0, 0, 0, 0)')
          ctx.fillStyle = glow
          ctx.fillRect(
            star.x - star.size * 4,
            star.y - star.size * 4,
            star.size * 8,
            star.size * 8
          )

          // Particle core
          ctx.beginPath()
          ctx.arc(star.x, star.y, star.size * 0.6, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(124, 58, 237, ${currentOpacity * 0.35})`
          ctx.fill()
        })
      }

      animationId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [resolvedTheme, mounted])

  if (!mounted) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
    />
  )
}
