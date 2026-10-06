/**
 * Minimal geometry runtime adapted from @lucasmarkes/hairline.
 * Original source: https://github.com/lucasmarkes/hairline
 * Copyright (c) 2026 Lucas Marques, used under the MIT License in ./LICENSE.
 */

export type Vec2 = [number, number]
export type Vec3 = [number, number, number]
export type Sample = { u: number; v: number; nu: number; nv: number }
export type Ring = Sample[]
export type Camera = { az: number; k: number; S: number; ox: number; oy: number }
export type Projector = (x: number, y: number, z: number) => Vec2
export type PrismPaths = { sil: string; crease: string }

export const clamp = (value: number, low: number, high: number) => Math.max(low, Math.min(high, value))
const radians = (degrees: number) => (degrees * Math.PI) / 180
const round = (value: number) => Math.round(value * 100) / 100

export const poly = (points: readonly Vec2[]) =>
  `M${points.map(point => `${round(point[0])} ${round(point[1])}`).join('L')}Z`

const open = (points: readonly Vec2[]) =>
  points.length < 2 ? '' : `M${points.map(point => `${round(point[0])} ${round(point[1])}`).join('L')}`

export const Cam = (azimuth: number, elevation: number, scale: number): Camera => ({
  az: radians(azimuth),
  k: elevation,
  S: scale,
  ox: 0,
  oy: 0,
})

export function proj(camera: Camera): Projector {
  const cosine = Math.cos(camera.az)
  const sine = Math.sin(camera.az)
  const height = Math.sqrt(1 - camera.k * camera.k)
  return (x, y, z) => {
    const horizontal = x * cosine - y * sine
    const depth = x * sine + y * cosine
    return [
      camera.ox + camera.S * horizontal,
      camera.oy + camera.S * (depth * camera.k - z * height),
    ]
  }
}

export function fit(camera: Camera, points: readonly Vec3[], centerX: number, centerY: number) {
  camera.ox = 0
  camera.oy = 0
  const project = proj(camera)
  let left = Infinity
  let right = -Infinity
  let top = Infinity
  let bottom = -Infinity
  for (const point of points) {
    const projected = project(point[0], point[1], point[2])
    left = Math.min(left, projected[0])
    right = Math.max(right, projected[0])
    top = Math.min(top, projected[1])
    bottom = Math.max(bottom, projected[1])
  }
  camera.ox = centerX - (left + right) / 2
  camera.oy = centerY - (top + bottom) / 2
}

export function rrect(left: number, top: number, right: number, bottom: number, radius: number, samples = 4): Ring {
  const safeRadius = Math.max(0, Math.min(radius, (right - left) / 2, (bottom - top) / 2))
  const ring: Ring = []
  const corners = [
    [right - safeRadius, bottom - safeRadius, 0],
    [left + safeRadius, bottom - safeRadius, 90],
    [left + safeRadius, top + safeRadius, 180],
    [right - safeRadius, top + safeRadius, 270],
  ]
  for (const [centerU, centerV, start] of corners) {
    for (let index = 0; index <= samples; index++) {
      const angle = radians(start + (90 * index) / samples)
      const cosine = Math.cos(angle)
      const sine = Math.sin(angle)
      ring.push({
        u: centerU + safeRadius * cosine,
        v: centerV + safeRadius * sine,
        nu: cosine,
        nv: sine,
      })
    }
  }
  return ring
}

function hull(input: readonly Vec2[]): Vec2[] {
  const points = input.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1])
  const cross = (origin: Vec2, a: Vec2, b: Vec2) =>
    (a[0] - origin[0]) * (b[1] - origin[1]) - (a[1] - origin[1]) * (b[0] - origin[0])
  const lower: Vec2[] = []
  const upper: Vec2[] = []
  for (const point of points) {
    while (lower.length > 1 && cross(lower[lower.length - 2], lower[lower.length - 1], point) <= 0) lower.pop()
    lower.push(point)
  }
  for (let index = points.length - 1; index >= 0; index--) {
    const point = points[index]
    while (upper.length > 1 && cross(upper[upper.length - 2], upper[upper.length - 1], point) <= 0) upper.pop()
    upper.push(point)
  }
  lower.pop()
  upper.pop()
  return lower.concat(upper)
}

export const ringAt = (project: Projector, ring: readonly Sample[], height: number): Vec2[] =>
  ring.map(sample => project(sample.u, sample.v, height))

export const facing = (camera: Camera) => {
  const sine = Math.sin(camera.az)
  const cosine = Math.cos(camera.az)
  return (sample: Sample) => sample.nu * sine + sample.nv * cosine >= -1e-6
}

function run(ring: readonly Sample[], keep: (sample: Sample) => boolean): Ring {
  const length = ring.length
  let start = -1
  for (let index = 0; index < length; index++) {
    if (keep(ring[index]) && !keep(ring[(index + length - 1) % length])) {
      start = index
      break
    }
  }
  if (start < 0) return keep(ring[0]) ? ring.slice() : []
  const kept: Ring = []
  for (let offset = 0; offset < length && keep(ring[(start + offset) % length]); offset++) {
    kept.push(ring[(start + offset) % length])
  }
  return kept
}

export function prism(
  project: Projector,
  front: (sample: Sample) => boolean,
  ring: readonly Sample[],
  inner: readonly Sample[] | null,
  bottom: number,
  top: number,
): PrismPaths {
  return {
    sil: poly(hull(ringAt(project, ring, top).concat(ringAt(project, ring, bottom)))),
    crease: inner ? open(ringAt(project, run(inner, front), top)) : '',
  }
}
