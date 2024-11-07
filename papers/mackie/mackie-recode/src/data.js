// celebrity images (16img; 8 celebs)
import { writable } from "svelte/store";
//writable to change image reveal status

export let images = writable([
  {
    id: "01",
    img_url: "images/anniston_real.jpeg",
    title: "Jennifer Anniston - Real",
    isRevealed: false,
    matched: false,
  },
  {
    id: "11",
    img_url: "images/anniston_magazine.jpg",
    title: "Jennifer Anniston - Magazine",
    isRevealed: false,
    matched: false,
  },

  {
    id: "02",
    img_url: "images/gaga_real.jpeg",
    title: "Gaga - Real",
    isRevealed: false,
    matched: false,
  },
  {
    id: "12",
    img_url: "images/gaga_magazine.jpeg",
    title: "Gaga - Magazine",
    isRevealed: false,
    matched: false,
  },

  {
    id: "03",
    img_url: "images/gomez_real.jpeg",
    title: "Selena Gomez - Real",
    isRevealed: false,
    matched: false,
  },
  {
    id: "13",
    img_url: "images/gomez_magazine.jpeg",
    title: "Selena Gomez - Magazine",
    isRevealed: false,
    matched: false,
  },

  {
    id: "04",
    img_url: "images/lively_real.jpeg",
    title: "Blake Lively - Real",
    isRevealed: false,
    matched: false,
  },
  {
    id: "14",
    img_url: "images/lively_magazine.jpeg",
    title: "Blake Lively - Magazine",
    isRevealed: false,
    matched: false,
  },

  {
    id: "05",
    img_url: "images/lohan_real.jpeg",
    title: "Lindsey Lohan - Real",
    isRevealed: false,
    matched: false,
  },
  {
    id: "15",
    img_url: "images/lohan_magazine.jpeg",
    title: "Lindsey Lohan - Magazine",
    isRevealed: false,
    matched: false,
  },

  {
    id: "06",
    img_url: "images/morgan_real.jpg",
    title: "Morgan - Real",
    isRevealed: false,
    matched: false,
  },
  {
    id: "16",
    img_url: "images/morgan_magazine.jpeg",
    title: "Morgan - Magazine",
    isRevealed: false,
    matched: false,
  },

  {
    id: "07",
    img_url: "images/underwood_real.jpeg",
    title: "Underwood - Real",
    isRevealed: false,
    matched: false,
  },
  {
    id: "17",
    img_url: "images/underwood_magazine.jpeg",
    title: "Underwood - Magazine",
    isRevealed: false,
    matched: false,
  },

  {
    id: "08",
    img_url: "images/witherspoon_real.jpeg",
    title: "Witherspoon - Real",
    isRevealed: false,
    matched: false,
  },
  {
    id: "18",
    img_url: "images/witherspoon_magazine.jpeg",
    title: "Witherspoon - Magazine",
    isRevealed: false,
    matched: false,
  },
]);
