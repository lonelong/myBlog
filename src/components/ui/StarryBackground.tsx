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
    canvas.style.opacity = isDark ? '0.9' : '1'
    let animationId: number
    let width = window.innerWidth
    let height = window.innerHeight

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
    }
    resize()
    window.addEventListener('resize', resize)

    let time = 0

    if (isDark) {
      // === DARK MODE: Starry sky ===

      interface Star {
        x: number; y: number; size: number; opacity: number
        twinkleSpeed: number; twinkleOffset: number
      }
      interface Meteor {
        x: number; y: number; length: number; speed: number
        opacity: number; angle: number; active: boolean
        life: number; maxLife: number
      }

      const stars: Star[] = Array.from({ length: 200 }, () => ({
        x: Math.random() * width, y: Math.random() * height,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinkleOffset: Math.random() * Math.PI * 2,
      }))

      const meteors: Meteor[] = []
      let meteorTimer = 0

      const createMeteor = (): Meteor => {
        const angle = (Math.random() * 30 + 15) * (Math.PI / 180)
        return {
          x: Math.random() * width * 1.2 - width * 0.1, y: -20,
          length: Math.random() * 120 + 80, speed: Math.random() * 8 + 6,
          opacity: 1, angle, active: true, life: 0,
          maxLife: Math.random() * 60 + 40,
        }
      }

      const draw = () => {
        time += 1; meteorTimer += 1
        ctx.clearRect(0, 0, width, height)

        // Nebula glows
        const g1 = ctx.createRadialGradient(width * 0.2, height * 0.3, 0, width * 0.2, height * 0.3, width * 0.5)
        g1.addColorStop(0, 'rgba(139, 92, 246, 0.06)'); g1.addColorStop(0.5, 'rgba(99, 102, 241, 0.03)')
        g1.addColorStop(1, 'rgba(0, 0, 0, 0)'); ctx.fillStyle = g1; ctx.fillRect(0, 0, width, height)

        const g2 = ctx.createRadialGradient(width * 0.8, height * 0.6, 0, width * 0.8, height * 0.6, width * 0.4)
        g2.addColorStop(0, 'rgba(168, 85, 247, 0.05)'); g2.addColorStop(0.5, 'rgba(139, 92, 246, 0.02)')
        g2.addColorStop(1, 'rgba(0, 0, 0, 0)'); ctx.fillStyle = g2; ctx.fillRect(0, 0, width, height)

        const g3 = ctx.createRadialGradient(width * 0.5, height * 0.1, 0, width * 0.5, height * 0.1, width * 0.3)
        g3.addColorStop(0, 'rgba(99, 102, 241, 0.04)'); g3.addColorStop(1, 'rgba(0, 0, 0, 0)')
        ctx.fillStyle = g3; ctx.fillRect(0, 0, width, height)

        // Stars
        stars.forEach((s) => {
          const tw = Math.sin(time * s.twinkleSpeed + s.twinkleOffset)
          const op = s.opacity * (0.5 + tw * 0.5)
          const gl = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size * 3)
          gl.addColorStop(0, `rgba(200,180,255,${op})`); gl.addColorStop(0.5, `rgba(160,140,220,${op * 0.3})`)
          gl.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = gl
          ctx.fillRect(s.x - s.size * 3, s.y - s.size * 3, s.size * 6, s.size * 6)
          ctx.beginPath(); ctx.arc(s.x, s.y, s.size * 0.8, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(230,220,255,${op})`; ctx.fill()
        })

        // Meteors
        if (meteorTimer > 80 + Math.random() * 120) {
          meteorTimer = 0
          if (meteors.filter(m => m.active).length < 3) meteors.push(createMeteor())
        }
        meteors.forEach((m) => {
          if (!m.active) return
          m.life++; m.x += Math.cos(m.angle) * m.speed; m.y += Math.sin(m.angle) * m.speed
          if (m.life < 10) m.opacity = m.life / 10
          else if (m.life > m.maxLife - 15) m.opacity = (m.maxLife - m.life) / 15
          if (m.life >= m.maxLife || m.y > height + 50 || m.x > width + 50) { m.active = false; return }
          const tx = m.x - Math.cos(m.angle) * m.length, ty = m.y - Math.sin(m.angle) * m.length
          const mg = ctx.createLinearGradient(tx, ty, m.x, m.y)
          mg.addColorStop(0, 'rgba(0,0,0,0)'); mg.addColorStop(0.3, `rgba(168,85,247,${m.opacity * 0.1})`)
          mg.addColorStop(0.7, `rgba(200,180,255,${m.opacity * 0.4})`); mg.addColorStop(1, `rgba(255,255,255,${m.opacity * 0.9})`)
          ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(m.x, m.y)
          ctx.strokeStyle = mg; ctx.lineWidth = 1.5; ctx.stroke()
          const hg = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, 6)
          hg.addColorStop(0, `rgba(255,255,255,${m.opacity * 0.8})`); hg.addColorStop(0.5, `rgba(168,85,247,${m.opacity * 0.3})`)
          hg.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = hg; ctx.fillRect(m.x - 6, m.y - 6, 12, 12)
        })
        for (let i = meteors.length - 1; i >= 0; i--) { if (!meteors[i].active) meteors.splice(i, 1) }
        animationId = requestAnimationFrame(draw)
      }
      draw()
    } else {
      // === LIGHT MODE: Realistic dendrite snowflake crystals ===

      interface Snowflake {
        x: number; y: number; r: number
        speedY: number; wobbleAmp: number; wobbleSpd: number; wobbleOff: number
        opacity: number; wind: number; rotation: number; rotSpd: number
        variant: number  // 0-3 different crystal patterns
      }

      // Draw a single dendrite arm with recursive branches
      const drawBranch = (
        cx: number, cy: number, angle: number, len: number,
        depth: number, lineW: number, variant: number
      ) => {
        const ex = cx + len * Math.cos(angle)
        const ey = cy + len * Math.sin(angle)
        ctx.beginPath()
        ctx.moveTo(cx, cy)
        ctx.lineTo(ex, ey)
        ctx.lineWidth = lineW
        ctx.stroke()

        if (depth <= 0) return

        // Sub-branches at different positions along the arm
        const branchPositions = variant === 0
          ? [0.35, 0.6, 0.85]         // 3 pairs of branches
          : variant === 1
          ? [0.4, 0.7]                 // 2 pairs, wider
          : variant === 2
          ? [0.3, 0.5, 0.7, 0.9]      // dense fern-like
          : [0.45, 0.75]              // simple elegant

        const branchAngle = variant === 1 ? Math.PI * 0.33 : Math.PI * 0.3
        const branchScale = variant === 2 ? 0.35 : 0.4

        branchPositions.forEach((pos) => {
          const bx = cx + len * pos * Math.cos(angle)
          const by = cy + len * pos * Math.sin(angle)
          const bLen = len * branchScale * (1.1 - pos * 0.4)
          for (const side of [-1, 1]) {
            drawBranch(bx, by, angle + side * branchAngle, bLen, depth - 1, lineW * 0.7, variant)
          }
        })

        // Tip split for extra detail on deeper branches
        if (depth >= 2 && variant !== 3) {
          const tipLen = len * 0.2
          for (const side of [-1, 1]) {
            ctx.beginPath()
            ctx.moveTo(ex, ey)
            ctx.lineTo(
              ex + tipLen * Math.cos(angle + side * Math.PI * 0.4),
              ey + tipLen * Math.sin(angle + side * Math.PI * 0.4)
            )
            ctx.lineWidth = lineW * 0.5
            ctx.stroke()
          }
        }
      }

      // Draw full snowflake with 6-fold symmetry
      const drawSnowflake = (f: Snowflake, op: number) => {
        ctx.save()
        ctx.translate(f.x, f.y)
        ctx.rotate(f.rotation)

        const armLen = f.r * 0.92
        const baseWidth = Math.max(0.6, f.r / 18)
        const depth = f.r > 25 ? 2 : f.r > 12 ? 1 : 0

        ctx.strokeStyle = `rgba(160, 195, 230, ${op * 0.7})`
        ctx.lineCap = 'round'

        // 6 main arms
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i
          drawBranch(0, 0, angle, armLen, depth, baseWidth, f.variant)
        }

        // Center hexagonal plate
        const plateR = f.r * 0.15
        ctx.beginPath()
        for (let i = 0; i < 6; i++) {
          const a = (Math.PI / 3) * i
          const px = plateR * Math.cos(a)
          const py = plateR * Math.sin(a)
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py)
        }
        ctx.closePath()
        ctx.fillStyle = `rgba(200, 225, 250, ${op * 0.5})`
        ctx.fill()
        ctx.lineWidth = baseWidth * 0.6
        ctx.stroke()

        // Tiny center dot
        ctx.beginPath()
        ctx.arc(0, 0, f.r * 0.04 + 0.5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(220, 240, 255, ${op * 0.8})`
        ctx.fill()

        ctx.restore()
      }

      // Mix of sizes: many small, some medium, a few large
      const flakeCount = Math.floor(width * height / 8000)
      const snowflakes: Snowflake[] = []

      for (let i = 0; i < flakeCount; i++) {
        // Weighted random: 50% small (5-12), 35% medium (13-28), 15% large (30-55)
        const rnd = Math.random()
        let r: number
        if (rnd < 0.5) r = Math.random() * 7 + 5
        else if (rnd < 0.85) r = Math.random() * 15 + 13
        else r = Math.random() * 25 + 30

        snowflakes.push({
          x: Math.random() * width,
          y: Math.random() * (height + 200) - 100,
          r,
          speedY: 0.08 + (0.5 / (r * 0.1 + 1)),  // bigger = slower
          wobbleAmp: Math.random() * 1.2 + 0.4,
          wobbleSpd: Math.random() * 0.01 + 0.003,
          wobbleOff: Math.random() * Math.PI * 2,
          opacity: r > 25 ? Math.random() * 0.25 + 0.2 : Math.random() * 0.35 + 0.15,
          wind: Math.random() * 0.15 + 0.03,
          rotation: Math.random() * Math.PI * 2,
          rotSpd: (Math.random() - 0.5) * 0.004,
          variant: Math.floor(Math.random() * 4),
        })
      }

      // Sort: draw smaller (farther) first
      snowflakes.sort((a, b) => a.r - b.r)

      const draw = () => {
        time += 1
        ctx.clearRect(0, 0, width, height)

        // Light blue-gray sky wash
        const sky = ctx.createLinearGradient(0, 0, 0, height)
        sky.addColorStop(0, 'rgba(195, 215, 240, 0.2)')
        sky.addColorStop(0.5, 'rgba(210, 225, 248, 0.1)')
        sky.addColorStop(1, 'rgba(230, 238, 252, 0.03)')
        ctx.fillStyle = sky
        ctx.fillRect(0, 0, width, height)

        snowflakes.forEach((f) => {
          const sway = Math.sin(time * f.wobbleSpd + f.wobbleOff) * f.wobbleAmp
          f.y += f.speedY
          f.x += sway * 0.25 + f.wind
          f.rotation += f.rotSpd

          if (f.y > height + f.r + 20) { f.y = -f.r - 20; f.x = Math.random() * width }
          if (f.x > width + f.r) f.x = -f.r
          if (f.x < -f.r) f.x = width + f.r

          const depthOp = f.opacity * (0.3 + (f.r / 55) * 0.7)

          // Soft glow behind crystal
          const glow = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r * 1.3)
          glow.addColorStop(0, `rgba(190, 220, 250, ${depthOp * 0.2})`)
          glow.addColorStop(1, 'rgba(190, 220, 250, 0)')
          ctx.fillStyle = glow
          ctx.fillRect(f.x - f.r * 1.3, f.y - f.r * 1.3, f.r * 2.6, f.r * 2.6)

          drawSnowflake(f, depthOp)
        })

        animationId = requestAnimationFrame(draw)
      }
      draw()
    }

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
