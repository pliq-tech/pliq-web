"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import type { ImageCarouselProps } from "./ImageCarousel.model";
import styles from "./ImageCarouselStyles.module.css";

const SWIPE_THRESHOLD = 50;

export function ImageCarousel({ images, alt = "Image" }: ImageCarouselProps) {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef(0);

  const goTo = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(index, images.length - 1));
      setCurrent(clamped);
    },
    [images.length],
  );

  const goPrev = useCallback(() => goTo(current - 1), [current, goTo]);
  const goNext = useCallback(() => goTo(current + 1), [current, goTo]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const delta = touchStartX.current - e.changedTouches[0].clientX;
      if (Math.abs(delta) > SWIPE_THRESHOLD) {
        if (delta > 0) goNext();
        else goPrev();
      }
    },
    [goNext, goPrev],
  );

  if (images.length === 0) return null;

  return (
    <section
      className={styles.carousel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-roledescription="carousel"
      aria-label="Image carousel"
    >
      <div className={styles.viewport}>
        <Image
          src={images[current]}
          alt={`${alt} ${current + 1} of ${images.length}`}
          className={styles.image}
          fill
          sizes="(max-width: 48em) 100vw, 50vw"
        />
      </div>
      {images.length > 1 && (
        <>
          {current > 0 && (
            <button
              type="button"
              className={`${styles.navButton} ${styles.prev}`}
              onClick={goPrev}
              aria-label="Previous image"
            >
              &#8249;
            </button>
          )}
          {current < images.length - 1 && (
            <button
              type="button"
              className={`${styles.navButton} ${styles.next}`}
              onClick={goNext}
              aria-label="Next image"
            >
              &#8250;
            </button>
          )}
          <div
            className={styles.dots}
            role="tablist"
            aria-label="Image indicators"
          >
            {images.map((src) => (
              <button
                key={src}
                type="button"
                className={`${styles.dot} ${images.indexOf(src) === current ? styles.dotActive : ""}`}
                onClick={() => goTo(images.indexOf(src))}
                role="tab"
                aria-selected={images.indexOf(src) === current}
                aria-label={`Go to image ${images.indexOf(src) + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
