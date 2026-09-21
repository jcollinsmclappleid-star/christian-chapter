import type { HouseState } from "./houseState";

const IMAGE_ROOT = "/images/chapter-house";

export function ChapterHousePoster({ state }: { state: HouseState }) {
  return (
    <div className="house-static-world" aria-hidden="true" data-mode={state.mode}>
      <picture>
        <source
          media="(max-width: 767px)"
          type="image/avif"
          srcSet={`${IMAGE_ROOT}/chapter-house-mobile.avif`}
        />
        <source
          media="(max-width: 767px)"
          type="image/webp"
          srcSet={`${IMAGE_ROOT}/chapter-house-mobile.webp`}
        />
        <source
          media="(max-width: 767px)"
          type="image/svg+xml"
          srcSet={`${IMAGE_ROOT}/chapter-house-mobile.svg`}
        />
        <source type="image/avif" srcSet={`${IMAGE_ROOT}/chapter-house-desktop.avif`} />
        <source type="image/webp" srcSet={`${IMAGE_ROOT}/chapter-house-desktop.webp`} />
        <img
          className="house-poster-image"
          src={`${IMAGE_ROOT}/chapter-house-desktop.svg`}
          alt=""
          width="2400"
          height="1600"
          decoding="async"
          fetchPriority="high"
        />
      </picture>
      <div className="house-poster-shade" />
      <div className="house-poster-selection" data-mode={state.mode} />
    </div>
  );
}
