<script>
    //TODO: image credits? ask prof. mundy
  import { count } from "../stores"; // Import the writable store

  // Reactive variable to hold the current count
  let currentCount;

  // Subscribe to the count store to get updates
  const unsubscribe = count.subscribe((value) => {
    currentCount = value; // Update the local variable with the store value
  });

  // Clean up the subscription when the component is destroyed
  import { onDestroy } from "svelte";
  onDestroy(() => {
    unsubscribe();
  });

  let resultText = [
    {
      id: "1",
      title:
        "You do not seem to be impacted by social proof to a significant extent",
      score_min: 0,
      score_max: 33,
      description:
        'You do not really pay attention to the number of comments, likes and reviews on online platforms. Or maybe you do, but they are not the factors that control your actions online. You would rather watch something without hearing how other people react to it, and you would rather not follow the crowd just because "everyone else is doing it."',
        media: {
          image: "https://img.buzzfeed.com/buzzfeed-static/static/2020-04/23/17/enhanced/6bcbd806692c/enhanced-392-1587661661-2.jpg"
        },
    },
    {
      id: "2",
      title:
        "You navigate your actions with a good balance between being driven by social proof and not being affected by it",
      score_min: 34,
      score_max: 67,
      description:
        "Of course you use social media and look at how people react to the content, buy products online and read their reviews. But, you are able to not get influenced too much by the way others use online platform, and can often decide what to do based on what you believe is best. Aside from the online space, you visit popular places, do activities recommended by many, and follow trends, but not just merely because the majority of people suggest doing so, also if you personally think they are worthy.",
        media: {
          image:"https://img.buzzfeed.com/buzzfeed-static/static/2020-04/23/17/enhanced/bc71f6de0007/enhanced-360-1587661566-3.jpg"
        },
    },
    {
      id: "3",
      title: "Social proof is the reason why you do most of your actions",
      score_min: 68,
      score_max: 100,
      description:
        "Posts, images, videos and products seem less interesting and less valid to you if the number of likes, or similar positive reinforcement, is low. You consider the numbers on different online platform to be the main indication of the quality of the content posted there. You are more likely to engage in activities if you see that many other people, especially if they are your friends or similar to you, are also doing them. Additionally, you would feel lost watching a sitcom without the laugh track, and appreciate shows with a live audience, so that the jokes sound funnier and you get a sense of when it is the right time to laugh. In real life, you think lines outside of stores are a clear symbol of good quality and you always try the new trend if many people around you are recommending it.",
        media: {
          image:"https://img.buzzfeed.com/buzzfeed-static/static/2020-04/30/20/enhanced/98bcd8c28f1d/enhanced-831-1588279128-25.jpg"
        },
    },
  ];
</script>

<!-- Display the count -->
<p style="color: azure;">Total checked boxes: {currentCount}</p>

<div>
  {#if currentCount >= 0 && currentCount <= 9}
    <h2>{resultText[0].title}</h2>
    <p>{resultText[0].description}</p>
    <!-- TODO: write proper alt Text.  -->
    <img src={resultText[0].media.image} alt="33% score result" />
  {:else if currentCount >= 10 && currentCount <= 19}
    <h2>{resultText[1].title}</h2>
    <p>{resultText[1].description}</p>
    <img src={resultText[1].media.image} alt="34%+% score result" />
  {:else if currentCount >= 20 && currentCount <= 28}
    <h2>{resultText[2].title}</h2>
    <p>{resultText[2].description}</p>
    <img src={resultText[2].media.image} alt="68% + score result" />
  {/if}
</div>

<style>
  /* TEMPORARY */
  p,
  h2 {
    color: azure;
  }
</style>
