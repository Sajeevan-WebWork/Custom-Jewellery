// import RingImg from "@/assets/images/ring.png";

export type StorefrontProduct = {
  id: number | string;
  name: string;
  price: number;
  category: string;
  image: string;
  metal: string;
  occasion: string;
};

export const allProducts: StorefrontProduct[] = [
  {
    id: 1,
    name: "Eternal Diamond Ring",
    price: 2450,
    category: "Rings",
    image:
      "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=800",
    metal: "Gold",
    occasion: "Wedding",
  },
  {
    id: 2,
    name: "Royal Emerald Necklace",
    price: 4800,
    category: "Necklaces",
    image:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800",
    metal: "Gold",
    occasion: "Occasion",
  },
  {
    id: 3,
    name: "Celestial Gold Earrings",
    price: 1200,
    category: "Earrings",
    image:
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800",
    metal: "Gold",
    occasion: "Daily",
  },
  {
    id: 4,
    name: "Infinite Grace Bracelet",
    price: 3200,
    category: "Bracelets",
    image:
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800",
    metal: "Silver",
    occasion: "Gift",
  },
  {
    id: 5,
    name: "Princess Cut Studs",
    price: 950,
    category: "Earrings",
    image:
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800",
    metal: "Silver",
    occasion: "Daily",
  },
  {
    id: 6,
    name: "Solitaire Engagement Ring",
    price: 5600,
    category: "Rings",
    image:
      "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=800",
    metal: "Platinum",
    occasion: "Wedding",
  },
  {
    id: 7,
    name: "Vintage Pearl Necklace",
    price: 1800,
    category: "Necklaces",
    image:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800",
    metal: "Gold",
    occasion: "Occasion",
  },
  {
    id: 8,
    name: "Modern Cuff Bracelet",
    price: 1450,
    category: "Bracelets",
    image:
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800",
    metal: "Rose Gold",
    occasion: "Modern",
  },
];

export const bestSellers = allProducts.slice(0, 4);
