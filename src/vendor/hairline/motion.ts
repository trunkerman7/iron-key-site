/**
 * Minimal discrete-motion runtime adapted from @lucasmarkes/hairline.
 * Original source: https://github.com/lucasmarkes/hairline
 * Copyright (c) 2026 Lucas Marques, used under the MIT License in ./LICENSE.
 */

import { clamp } from './iso'

let reduced = false
export const setReducedMotion = (value: boolean) => { reduced = value }

function bezier(x1: number, y1: number, x2: number, y2: number) {
  const cx = 3 * x1
  const bx = 3 * (x2 - x1) - cx
  const ax = 1 - cx - bx
  const cy = 3 * y1
  const by = 3 * (y2 - y1) - cy
  const ay = 1 - cy - by
  const x = (value: number) => ((ax * value + bx) * value + cx) * value
  const y = (value: number) => ((ay * value + by) * value + cy) * value
  const derivative = (value: number) => (3 * ax * value + 2 * bx) * value + cx

  return (progress: number) => {
    if (progress <= 0) return 0
    if (progress >= 1) return 1
    let value = progress
    for (let index = 0; index < 8; index++) {
      const error = x(value) - progress
      if (Math.abs(error) < 1e-5) break
      const slope = derivative(value)
      if (Math.abs(slope) < 1e-6) break
      value -= error / slope
    }
    if (!(value >= 0 && value <= 1) || Math.abs(x(value) - progress) > 1e-4) {
      let low = 0
      let high = 1
      value = progress
      for (let index = 0; index < 24; index++) {
        if (x(value) < progress) low = value
        else high = value
        value = (low + high) / 2
      }
    }
    return y(value)
  }
}

const easeLift = bezier(0.32, 0.72, 0, 1)

export type Tween = { from: number; to: number; t0: number; dur: number }
export const tween = (value: number, duration = 700): Tween => ({ from: value, to: value, t0: -1e9, dur: duration })

export const tweenValue = (clock: Tween, now: number) => {
  const progress = clamp((now - clock.t0) / clock.dur, 0, 1)
  return clock.from + (clock.to - clock.from) * (reduced ? 1 : easeLift(progress))
}

export const retargetTween = (clock: Tween, target: number, now: number, delay: number) => {
  if (clock.to === target) return
  clock.from = tweenValue(clock, now)
  clock.to = target
  clock.t0 = now + delay
}

export const tweenDone = (clock: Tween, now: number) => reduced || now >= clock.t0 + clock.dur
