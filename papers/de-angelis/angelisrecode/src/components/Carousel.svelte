<!-- makes use of bootstrap v5.3 carousel -->
<script>
  import { onMount, afterUpdate } from "svelte";
  import ItemList from "./ItemList.svelte";
  import { items } from "../data";
  import Results from "./Results.svelte";

  let submitState = false;

  // Function to handle arrow visibility
  function updateArrows() {
    const totalSlides = document.querySelectorAll(".carousel-item").length;
    const activeIndex = [
      ...document.querySelectorAll(".carousel-item"),
    ].findIndex((item) => item.classList.contains("active"));

    const prevArrow = document.querySelector(".carousel-control-prev");
    const nextArrow = document.querySelector(".carousel-control-next");

    // Show/hide arrows based on the active index
    prevArrow.style.display = activeIndex === 0 ? "none" : "block";
    nextArrow.style.display =
      activeIndex === totalSlides - 1 ? "none" : "block";
  }

  // Update arrows on initial load and when sliding
  onMount(() => {
    updateArrows();

    // Event listener for slide event
    const carouselElement = document.getElementById("carousel-quiz");
    carouselElement.addEventListener("slid.bs.carousel", updateArrows);
  });

  function handleSubmit() {
    // dispatch("submit"); // pass event details to app.svelte
    submitState = true;
  }

  // trigger results slide when submitState changes
  afterUpdate(() => {
    if (submitState) {
      const carousel = new bootstrap.Carousel(
        document.getElementById("carousel-quiz")
      );
      carousel.to(4); // Move to the fifth slide (i=4)
    }
  });
</script>

<div class="container text-left">
  <div class="row justify-content-center">
    <div class="col-12 col-md-12 col-lg-8">
      <div id="carousel-quiz" class="carousel slide pb-5">
        <div class="carousel-indicators">
          <button
            type="button"
            data-bs-target="#carousel-quiz"
            data-bs-slide-to="0"
            class="active"
            aria-current="true"
            aria-label="Slide 1"
          ></button>

          <button
            type="button"
            data-bs-target="#carousel-quiz"
            data-bs-slide-to="1"
            aria-label="Slide 2"
          ></button>

          <button
            type="button"
            data-bs-target="#carousel-quiz"
            data-bs-slide-to="2"
            aria-label="Slide 3"
          ></button>

          <button
            type="button"
            data-bs-target="#carousel-quiz"
            data-bs-slide-to="3"
            aria-label="Slide 4"
          ></button>

          <!-- add indicator for results slide-->
          {#if submitState}
            <button
              type="button"
              data-bs-target="#carousel-quiz"
              data-bs-slide-to="4"
              aria-label="Slide 5"
            ></button>
          {/if}
        </div>

        <div class="carousel-inner">
          <div class="carousel-item active">
            <ItemList options={items.category1} />
          </div>

          <div class="carousel-item">
            <ItemList options={items.category2} />
          </div>

          <div class="carousel-item">
            <ItemList options={items.category3} />
          </div>

          <div class="carousel-item">
            <ItemList options={items.category4} />
            <div class="d-grid gap-2 col-4 mx-auto">
              <button
                on:click={handleSubmit}
                class="btn btn-primary btn-lg mt-3">Submit</button
              >
            </div>
          </div>

          <!-- results slide, hidden until submit -->
          {#if submitState}
            <div class="carousel-item">
              <div class="carousel-captions"></div>
              <Results />
            </div>
          {/if}
        </div>

        <!-- previous arrow for carousel -->
        <button
          class="carousel-control-prev"
          type="button"
          data-bs-target="#carousel-quiz"
          data-bs-slide="prev"
        >
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>

        <!-- next arrow for carousel -->
        <button
          class="carousel-control-next"
          type="button"
          data-bs-target="#carousel-quiz"
          data-bs-slide="next"
        >
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  </div>
</div>

<style>
  /* styling arrows */
  .carousel-control-prev,
  .carousel-control-next {
    top: 50%; /* Center vertically */
    width: 5%;
    height: 100%;
    cursor: pointer;
    z-index: 2;
    transform: translateY(-50%);
  }

  .carousel-control-prev {
    left: -50px; /* Move outside the carousel */
  }

  .carousel-control-next {
    right: -50px; /* Move outside the carousel */
  }
</style>
