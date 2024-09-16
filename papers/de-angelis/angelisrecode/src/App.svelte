<script>
  import InteractiveTitle from "./components/InteractiveTitle.svelte";
  import Tabs from "./sharedComps/Tabs.svelte";
  import ItemList from "./components/ItemList.svelte";

  // Tabs component:
  let items = [
    "Popularity and Trends",
    "Reviews, Ratings and Sales",
    "Herd Mentality",
    "Social Cues and Situational Norms",
  ];

  let activeItem = items[0];

  const changeTab = (e) => {
    activeItem = e.detail;
  };

  //TODO: shift to file or alternative
  //data
  let cat1 = [
    {
      text: "Followed a trend just because a lot of people were doing it",
      id: "11",
    },
    {
      text: "Watched a movie/tv show everyone had been talking about",
      id: "12",
    },
    { text: "Recreated a recipe have seen a lot of people try", id: "13" },
    { text: "Visited a not-so-exciting but trendy place", id: "14" },
    { text: "Watched a video just because it was trending", id: "15" },
    {
      text: 'Bought an item because it was a "best-seller" or "fastest growing"',
      id: "16",
    },
    {
      text: 'Watched a movie/tv show that appeared in the "most popular" list',
      id: "17",
    },
    { text: 'Bought an item from the "recommended to me" section', id: "18" },
  ];

  let cat2 = [
    {
      text: "Filtered out items with ratings of three stars or less",
      id: "21",
    },
    {
      text: "Chose to buy something online based on the number and quality of its reviews",
      id: "22",
    },
    {
      text: "Considered a restaurant/store good because it always had a line outside the door",
      id: "23",
    },
    {
      text: "Liked a post just because it already had a lot of likes",
      id: "24",
    },
    { text: "Bought something because it had many likes", id: "25" },
    {
      text: "Thought something was worth buying because it was almost sold out",
      id: "26",
    },
    {
      text: "Bought an item in the stores many people were recommending",
      id: "27",
    },
    {
      text: "Signed up for a service based on the number of people already using it",
      id: "28",
    },
  ];
  let cat3 = [
    {
      text: "Thanked a bus driver after hearing most of the other passengers doing the same",
      id: "31",
    },
    {
      text: "Stayed quiet about a concerning situation in a public place because no one else was saying anything",
      id: "32",
    },
    {
      text: "Joined a line even though did not know what it was for",
      id: "33",
    },
    {
      text: "Clapped at a live show following the rest of the audience's example",
      id: "34",
    },
    {
      text: "Did not comment an interesting post because no one else had commented it",
      id: "35",
    },
    {
      text: "Adhered to an opinion because it was shared by a lot of people",
      id: "36",
    },
  ];
  let cat4 = [
    {
      text: "Thought a waiter was deserving but did not put money in an empty tip jar",
      id: "41",
    },
    { text: "Ate something at a buffet because it was almost gone", id: "42" },
    {
      text: "Got convinced by the sign to reuse the towel in a hotel",
      id: "43",
    },
    {
      text: "Donated to a charity after getting told a lot of people were donating",
      id: "44",
    },
    { text: "Found a show funnier thanks to canned laughter", id: "45" },
    { text: "Ate at a restaurant many people were recommending", id: "46" },
  ];
</script>

<InteractiveTitle />
<main>
  <h4>
    There are countless examples of situations that take advantage of social
    proof. From the situations below, select boxes of ones you relate with or
    have experienced to discover the impact this phenomenon has on you.
  </h4>
  <Tabs {activeItem} {items} on:changeTab={changeTab} />

  {#if activeItem === "Popularity and Trends"}
    <ItemList options={cat1} />
  {:else if activeItem === "Reviews, Ratings and Sales"}
    <ItemList options={cat2} />
  {:else if activeItem === "Herd Mentality"}
    <ItemList options={cat3} />
  {:else if activeItem === "Social Cues and Situational Norms"}
    <ItemList options={cat4} />
  {/if}
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 500px;
    margin: 0 auto;
  }

  h4 {
    color: #333;
    margin-bottom: 20px;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
