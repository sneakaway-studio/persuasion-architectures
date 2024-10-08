<!-- makes use of bootstrap v5.3 carousel -->
<script>
  import { onMount, afterUpdate } from "svelte";
  // import { createEventDispatcher } from "svelte";
  import ItemList from "./ItemList.svelte";
  import { items } from "../data";
  import Results from "./Results.svelte";

  // const dispatch = createEventDispatcher();
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
    const carouselElement = document.getElementById("carouselExampleCaptions");
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
        document.getElementById("carouselExampleCaptions")
      );
      carousel.to(4); // Move to the fifth slide (i=4)
    }
  });
</script>

<div class="container">
  <div class="row justify-content-center">
    <div class="col-12 col-md-8">
      <div id="carouselExampleCaptions" class="carousel slide" style="height:500px">
        <div class="carousel-indicators">
          <button
            type="button"
            data-bs-target="#carouselExampleCaptions"
            data-bs-slide-to="0"
            class="active"
            aria-current="true"
            aria-label="Slide 1"
          ></button>

          <button
            type="button"
            data-bs-target="#carouselExampleCaptions"
            data-bs-slide-to="1"
            aria-label="Slide 2"
          ></button>

          <button
            type="button"
            data-bs-target="#carouselExampleCaptions"
            data-bs-slide-to="2"
            aria-label="Slide 3"
          ></button>

          <button
            type="button"
            data-bs-target="#carouselExampleCaptions"
            data-bs-slide-to="3"
            aria-label="Slide 4"
          ></button>

          <!-- add indicator for results slide-->
          {#if submitState}
            <button
              type="button"
              data-bs-target="#carouselExampleCaptions"
              data-bs-slide-to="4"
              aria-label="Slide 5"
            ></button>
          {/if}
        </div>

        <div class="carousel-inner">
          <div class="carousel-item active">
            <div class="carousel-captions">
              <h5>Popularity and Trends</h5>
            </div>
            <ItemList options={items.category1} disabled={submitState} />
          </div>

          <div class="carousel-item">
            <div class="carousel-captions">
              <h5>Reviews, Ratings and Sales</h5>
            </div>
            <ItemList options={items.category2} disabled={submitState} />
          </div>

          <div class="carousel-item">
            <div class="carousel-captions">
              <h5>Herd Mentality</h5>
            </div>
            <ItemList options={items.category3} disabled={submitState} />
          </div>

          <div class="carousel-item">
            <div class="carousel-captions">
              <h5>Social Cues and Situational Norms</h5>
            </div>
            <ItemList options={items.category4} disabled={submitState} />
            <button on:click={handleSubmit} class="btn btn-primary btn-lg mt-3"
              >Submit</button
            >
          </div>

          <!-- results slide, hidden until submit -->
          {#if submitState}
            <div class="carousel-item">
              <div class="carousel-captions">
                <h5>Your Result is...</h5>
              </div>
              <Results />
            </div>
          {/if}
        </div>

        <!-- previous arrow for carousel -->
        <button
          class="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleCaptions"
          data-bs-slide="prev"
        >
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>

        <!-- next arrow for carousel -->
        <button
          class="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleCaptions"
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
  .carousel-captions {
    margin: 2rem auto;
  }

  /* styling arrows */
  .carousel-control-prev,
  .carousel-control-next {
    /* position: absolute; */
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
