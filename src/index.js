import Hammer from "hammerjs";

class Carousel {
  constructor(element) {
    this.element = element;

    this.dots = [...element.querySelectorAll(".dot")];

    this.slidesContainer = element.querySelector(".slides");

    this.slides = [...element.querySelectorAll(".slide")];

    this.currentSlide = 0;

    this.touchEvents = new Hammer(this.element);

    this.liveRegion;

    this.attachEvents();
    this.setActiveDot();
    this.setActiveSlide();
    this.createLiveRegion();
  }

  attachEvents() {
    this.dots.forEach((dot, index) => {
      dot.addEventListener("click", () => this.goToSlide(index));
    });

    this.touchEvents.on("swipeleft", () =>
      this.goToSlide(this.currentSlide + 1)
    );
    this.touchEvents.on("swiperight", () =>
      this.goToSlide(this.currentSlide - 1)
    );

    this.slidesContainer.addEventListener("transitionend", event => {
      if (event.propertyName === "transform") {
        this.slides[this.currentSlide].focus();
      }
    });
  }

  goToSlide(slideIndex) {
    if (slideIndex < 0) {
      this.currentSlide = this.slides.length - 1;
    } else if (slideIndex > this.slides.length - 1) {
      this.currentSlide = 0;
    } else {
      this.currentSlide = slideIndex;
    }

    this.setActiveDot();
    this.setActiveSlide();
    this.updateLiveRegion();

    this.slidesContainer.style.transform = `translateX(-${this.currentSlide *
      100}%)`;
  }

  setActiveDot() {
    this.dots.forEach((dot, index) => {
      const span = dot.querySelector("span");
      dot.classList.toggle("is-active", index === this.currentSlide);

      if (index === this.currentSlide) {
        span.textContent = `${span.textContent} (Current)`;
      } else {
        span.textContent = span.textContent.replace(" (Current)", "");
      }
    });
  }

  setActiveSlide() {
    this.slides.forEach((slide, index) => {
      slide.classList.toggle("is-active", index === this.currentSlide);
      if (index === this.currentSlide) {
        slide.removeAttribute("aria-hidden");
        slide.setAttribute("tabindex", "-1");
      } else {
        slide.setAttribute("aria-hidden", "true");
        slide.removeAttribute("tabindex", "-1");
      }
    });
  }

  createLiveRegion() {
    const liveRegion = document.createElement("div");

    liveRegion.setAttribute("aria-live", "polite");
    liveRegion.setAttribute("aria-atomic", "polite");
    liveRegion.classList.add("aria-liveregion", "visually-hidden");

    this.liveRegion = liveRegion;

    this.element.appendChild(this.liveRegion);
  }

  updateLiveRegion() {
    this.liveRegion.textContent = `Item ${this.currentSlide + 1} of ${
      this.slides.length
    }`;
  }
}

[...document.querySelectorAll("[data-carousel]")].forEach(
  carousel => new Carousel(carousel)
);
