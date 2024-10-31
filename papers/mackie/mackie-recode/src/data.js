// celeberity images (16img; 8 celebs)
import { writable } from "svelte/store";
//writable to change image reveal status

export let images = writable([
  {
    id: "01",
    img_url: "images/anniston_real.jpeg.jpeg",
    title: "Jennifer Anniston - Real",
    isRevealed: false,
  },
  {
    id: "11",
    img_url: "images/anniston_magazine.jpg.jpg",
    title: "Jennifer Anniston - Magazine",
    isRevealed: false,
  },

  {
    id: "02",
    img_url: "images/gaga_real.jpeg.jpeg",
    title: "Gaga - Real",
    isRevealed: false,
  },
  {
    id: "12",
    img_url: "images/gaga_magazine.jpeg.jpeg",
    title: "Gaga - Magazine",
    isRevealed: false,
  },

  {
    id: "03",
    img_url: "images/gomez_real.jpeg.jpeg",
    title: "Selena Gomez - Real",
    isRevealed: false,
  },
  {
    id: "13",
    img_url: "images/gomez_magazine.jpeg.jpeg",
    title: "Selena Gomez - Magazine",
    isRevealed: false,
  },

  {
    id: "04",
    img_url: "images/lively_real.jpeg.jpeg",
    title: "Blake Lively - Real",
    isRevealed: false,
  },
  {
    id: "14",
    img_url: "images/lively_magazine.jpeg.jpeg",
    title: "Blake Lively - Magazine",
    isRevealed: false,
  },

  {
    id: "05",
    img_url: "images/lohan_real.jpeg.jpeg",
    title: "Lindsey Lohan - Real",
    isRevealed: false,
  },
  {
    id: "15",
    img_url: "images/lohan_magazine.jpeg.jpeg",
    title: "Lindsey Lohan - Magazine",
    isRevealed: false,
  },

  {
    id: "06",
    img_url: "images/morgan_real.jpg.jpg",
    title: "Morgan - Real",
    isRevealed: false,
  },
  {
    id: "16",
    img_url: "images/morgan_magazine.jpeg.jpeg",
    title: "Morgan - Magazine",
    isRevealed: false,
  },

  {
    id: "07",
    img_url: "images/underwood_real.jpeg.jpeg",
    title: "Underwood - Real",
    isRevealed: false,
  },
  {
    id: "17",
    img_url: "images/underwood_magazine.jpeg.jpeg",
    title: "Underwood - Magazine",
    isRevealed: false,
  },

  {
    id: "08",
    img_url: "images/witherspoon_real.jpeg.jpeg",
    title: "Witherspoon - Real",
    isRevealed: false,
  },
  {
    id: "18",
    img_url: "images/witherspoon_magazine.jpeg.jpeg",
    title: "Witherspoon - Magazine",
    isRevealed: false,
  },
]);
