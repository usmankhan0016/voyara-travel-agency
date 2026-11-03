import gsap from "gsap";
import type { MouseEvent } from "react";

let reduceMotion: boolean | null = null;

function prefersReducedMotion() {
  if (reduceMotion === null) {
    reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }
  return reduceMotion;
}

interface TiltOptions {
  /** Maximum rotation per axis, in degrees. */
  max?: number;
  scale?: number;
  /** Upward lift, in pixels. */
  lift?: number;
}

/**
 * Scale-and-tilt hover props, spreadable onto any number of cards: the handlers
 * act on `event.currentTarget`, so no per-card refs are needed.
 */
export function tiltProps({ max = 7, scale = 1.02, lift = 6 }: TiltOptions = {}) {
  return {
    onMouseMove: (event: MouseEvent<HTMLElement>) => {
      if (prefersReducedMotion()) return;
      const el = event.currentTarget;
      const rect = el.getBoundingClientRect();
      const offsetX = (event.clientX - rect.left) / rect.width - 0.5;
      const offsetY = (event.clientY - rect.top) / rect.height - 0.5;

      gsap.to(el, {
        rotateY: offsetX * max * 2,
        rotateX: -offsetY * max * 2,
        y: -lift,
        scale,
        transformPerspective: 900,
        duration: 0.4,
        ease: "power2.out",
        overwrite: "auto",
      });
    },
    onMouseLeave: (event: MouseEvent<HTMLElement>) => {
      gsap.to(event.currentTarget, {
        rotateX: 0,
        rotateY: 0,
        y: 0,
        scale: 1,
        duration: 0.5,
        ease: "power3.out",
        overwrite: "auto",
      });
    },
  };
}

/**
 * Untilts a card at once. Call before measuring it: `getBoundingClientRect` on a
 * rotated element returns the bounding box of the rotation, not the card.
 */
export function resetTilt(el: HTMLElement) {
  gsap.killTweensOf(el);
  gsap.set(el, { rotateX: 0, rotateY: 0, y: 0, scale: 1 });
}
