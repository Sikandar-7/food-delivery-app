// ============================================================
// Order.uk – Central Data Store
// ============================================================

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  rating?: number;
  sizes?: { label: string; price: number }[];
  category: string;
  restaurantId: string;
}

export interface MenuCategory {
  title: string;
  color: string;
  products: Product[];
}

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  logo: string;
  coverImage: string;
  backgroundColor: string;
  cuisine: string;
  rating: number;
  reviewCount: number;
  minOrder: number;
  deliveryTime: string;
  deliveryFee: number;
  tag?: string;
  discount?: string;
  isOpen: boolean;
  closeTime: string;
}

// ──────────────────────────────────────────────────────────────
// Restaurants
// ──────────────────────────────────────────────────────────────
export const restaurants: Restaurant[] = [
  {
    id: "mcdonalds",
    name: "McDonald's Gulberg Lahore",
    slug: "mcdonalds",
    logo: "https://upload.wikimedia.org/wikipedia/commons/3/36/McDonald%27s_Golden_Arches.svg",
    coverImage: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1400&q=80&auto=format&fit=crop",
    backgroundColor: "#F40027",
    cuisine: "Burgers • Fast Food",
    rating: 3.4,
    reviewCount: 1360,
    minOrder: 12,
    deliveryTime: "20-25 min",
    deliveryFee: 2.5,
    discount: "-40%",
    isOpen: true,
    closeTime: "3:00 AM",
    tag: "Popular",
  },
  {
    id: "papa-johns",
    name: "Papa Johns",
    slug: "papa-johns",
    logo: "https://upload.wikimedia.org/wikipedia/commons/b/b0/Papa_John%27s_Pizza_logo.svg",
    coverImage: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1400&q=80&auto=format&fit=crop",
    backgroundColor: "#006241",
    cuisine: "Pizza • Italian",
    rating: 4.2,
    reviewCount: 890,
    minOrder: 15,
    deliveryTime: "25-35 min",
    deliveryFee: 2.0,
    discount: "-20%",
    isOpen: true,
    closeTime: "11:00 PM",
    tag: "Top Rated",
  },
  {
    id: "kfc",
    name: "KFC DHA Karachi",
    slug: "kfc",
    logo: "https://upload.wikimedia.org/wikipedia/en/b/bf/KFC_logo.svg",
    coverImage: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=1400&q=80&auto=format&fit=crop",
    backgroundColor: "#F40027",
    cuisine: "Chicken • Fast Food",
    rating: 4.0,
    reviewCount: 1120,
    minOrder: 10,
    deliveryTime: "20-30 min",
    deliveryFee: 1.99,
    discount: "-17%",
    isOpen: true,
    closeTime: "2:00 AM",
    tag: "Fast Delivery",
  },
  {
    id: "texas-chicken",
    name: "Texas Chicken",
    slug: "texas-chicken",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/23/Texas_Chicken_Logo.svg",
    coverImage: "https://images.unsplash.com/photo-1562967914-608f82629710?w=1400&q=80&auto=format&fit=crop",
    backgroundColor: "#FFC107",
    cuisine: "Chicken • Southern",
    rating: 3.9,
    reviewCount: 540,
    minOrder: 12,
    deliveryTime: "25-35 min",
    deliveryFee: 2.5,
    isOpen: true,
    closeTime: "1:00 AM",
  },
  {
    id: "burger-king",
    name: "Burger King",
    slug: "burger-king",
    logo: "https://upload.wikimedia.org/wikipedia/commons/c/cc/Burger_King_2020.svg",
    coverImage: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=1400&q=80&auto=format&fit=crop",
    backgroundColor: "#EFE6DB",
    cuisine: "Burgers • Grill",
    rating: 4.1,
    reviewCount: 980,
    minOrder: 10,
    deliveryTime: "15-25 min",
    deliveryFee: 1.5,
    isOpen: true,
    closeTime: "3:00 AM",
  },
  {
    id: "shaurma",
    name: "Shaurma 1",
    slug: "shaurma",
    logo: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text x='50%' y='50%' font-family='Arial' font-size='18' font-weight='bold' fill='%23FFFFFF' text-anchor='middle' dominant-baseline='middle'>SHAURMA 1</text></svg>",
    coverImage: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=1400&q=80&auto=format&fit=crop",
    backgroundColor: "#FF8C00",
    cuisine: "Wraps • Middle Eastern",
    rating: 4.5,
    reviewCount: 320,
    minOrder: 8,
    deliveryTime: "20-30 min",
    deliveryFee: 1.99,
    isOpen: true,
    closeTime: "4:00 AM",
    tag: "New",
  },
];

// ──────────────────────────────────────────────────────────────
// Menu per restaurant
// ──────────────────────────────────────────────────────────────
export const menuByRestaurant: Record<string, MenuCategory[]> = {
  mcdonalds: [
    {
      title: "Burgers",
      color: "bg-orange-500",
      products: [
        {
          id: "mc-b1", name: "Royal Cheese Burger", restaurantId: "mcdonalds", category: "Burgers",
          description: "Double beef patty, melted cheese, lettuce, tomato & special sauce.", price: 23.10,
          rating: 4.5, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=400",
          sizes: [{ label: "Single", price: 14.99 }, { label: "Double", price: 23.10 }, { label: "Triple", price: 29.99 }],
        },
        {
          id: "mc-b2", name: "McChicken Deluxe", restaurantId: "mcdonalds", category: "Burgers",
          description: "Crispy chicken fillet, mayo, lettuce in a toasted sesame bun.", price: 19.99,
          rating: 4.3, image: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=400",
        },
        {
          id: "mc-b3", name: "Big Mac Meal", restaurantId: "mcdonalds", category: "Burgers",
          description: "Two all-beef patties, special sauce, lettuce, cheese, pickles, onions.", price: 24.10,
          rating: 4.6, image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?q=80&w=400",
        },
      ],
    },
    {
      title: "Fries",
      color: "bg-yellow-500",
      products: [
        {
          id: "mc-f1", name: "Medium Fries", restaurantId: "mcdonalds", category: "Fries",
          description: "Classic crispy golden fries, medium portion.", price: 3.50,
          rating: 4.7, image: "https://images.unsplash.com/photo-1576107232684-1279f3908594?q=80&w=400",
        },
        {
          id: "mc-f2", name: "Large Fries", restaurantId: "mcdonalds", category: "Fries",
          description: "Extra-large portion of golden crispy fries.", price: 4.50,
          rating: 4.7, image: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?q=80&w=400",
        },
      ],
    },
    {
      title: "Cold Drinks",
      color: "bg-blue-500",
      products: [
        {
          id: "mc-d1", name: "Coca Cola", restaurantId: "mcdonalds", category: "Cold Drinks",
          description: "Ice-cold Coca Cola, 500ml.", price: 2.50,
          rating: 4.8, image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=400",
        },
        {
          id: "mc-d2", name: "Fanta Orange", restaurantId: "mcdonalds", category: "Cold Drinks",
          description: "Refreshing orange soda, 500ml.", price: 2.50,
          rating: 4.5, image: "https://images.unsplash.com/photo-1629851759656-74ab3fd0e768?q=80&w=400",
        },
      ],
    },
    {
      title: "Desserts",
      color: "bg-pink-500",
      products: [
        {
          id: "mc-ds1", name: "McFlurry Oreo", restaurantId: "mcdonalds", category: "Desserts",
          description: "Creamy vanilla soft serve blended with Oreo cookie pieces.", price: 3.99,
          rating: 4.9, image: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?q=80&w=400",
        },
        {
          id: "mc-ds2", name: "Apple Pie", restaurantId: "mcdonalds", category: "Desserts",
          description: "Crispy pastry filled with tender, cinnamon-spiced apple filling.", price: 1.99,
          rating: 4.4, image: "https://images.unsplash.com/photo-1621955508163-0e5db51f4c37?q=80&w=400",
        },
      ],
    },
  ],

  "papa-johns": [
    {
      title: "Pizzas",
      color: "bg-red-600",
      products: [
        {
          id: "pj-p1", name: "Farm House Xtreme Pizza", restaurantId: "papa-johns", category: "Pizzas",
          description: "Loaded with pepperoni, beef, chicken, mushrooms, bell peppers & extra cheese.", price: 25.99,
          rating: 4.7, image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=400",
          sizes: [{ label: "Small", price: 19.99 }, { label: "Medium", price: 25.99 }, { label: "Large", price: 27.98 }, { label: "XL", price: 33.99 }],
        },
        {
          id: "pj-p2", name: "Deluxe Pizza", restaurantId: "papa-johns", category: "Pizzas",
          description: "Premium cut toppings with double cheese, black olives and fresh veggies.", price: 25.99,
          rating: 4.6, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=400",
          sizes: [{ label: "Small", price: 19.99 }, { label: "Medium", price: 25.99 }, { label: "Large", price: 27.98 }, { label: "XL", price: 33.99 }],
        },
        {
          id: "pj-p3", name: "Tandoori Pizza", restaurantId: "papa-johns", category: "Pizzas",
          description: "Spicy tandoori chicken chunks, bell peppers & coriander on a classic tomato base.", price: 26.99,
          rating: 4.8, image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=400",
          sizes: [{ label: "Small", price: 21.00 }, { label: "Medium", price: 26.99 }, { label: "Large", price: 27.98 }, { label: "XL", price: 33.99 }],
        },
      ],
    },
    {
      title: "Garlic Bread",
      color: "bg-yellow-600",
      products: [
        {
          id: "pj-g1", name: "Original Garlic Bread", restaurantId: "papa-johns", category: "Garlic Bread",
          description: "Freshly baked garlic bread with herb butter.", price: 4.99,
          rating: 4.5, image: "https://images.unsplash.com/photo-1573140247632-f8359b8cd82c?q=80&w=400",
        },
        {
          id: "pj-g2", name: "Cheesy Garlic Bread", restaurantId: "papa-johns", category: "Garlic Bread",
          description: "Golden garlic bread loaded with mozzarella cheese.", price: 6.99,
          rating: 4.7, image: "https://images.unsplash.com/photo-1619096252214-ef06c45683e3?q=80&w=400",
        },
      ],
    },
    {
      title: "Cold Drinks",
      color: "bg-blue-500",
      products: [
        {
          id: "pj-d1", name: "Pepsi 1.5L", restaurantId: "papa-johns", category: "Cold Drinks",
          description: "Chilled Pepsi, 1.5L bottle.", price: 3.50,
          rating: 4.5, image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=400",
        },
      ],
    },
  ],

  kfc: [
    {
      title: "Chicken",
      color: "bg-red-500",
      products: [
        {
          id: "kfc-c1", name: "Hot Wings Bucket (10 pcs)", restaurantId: "kfc", category: "Chicken",
          description: "10 pieces of KFC's signature crispy hot wings.", price: 11.99,
          rating: 4.8, image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=400",
        },
        {
          id: "kfc-c2", name: "Zinger Burger", restaurantId: "kfc", category: "Chicken",
          description: "Spicy crispy chicken fillet with spicy mayo and fresh lettuce.", price: 8.99,
          rating: 4.6, image: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=400",
        },
        {
          id: "kfc-c3", name: "Popcorn Chicken Box", restaurantId: "kfc", category: "Chicken",
          description: "Bite-sized chunks of crispy, seasoned chicken. Regular 190g.", price: 5.99,
          rating: 4.5, image: "https://images.unsplash.com/photo-1562967914-608f82629710?q=80&w=400",
        },
      ],
    },
    {
      title: "Sides & Drinks",
      color: "bg-yellow-500",
      products: [
        {
          id: "kfc-s1", name: "Coleslaw", restaurantId: "kfc", category: "Sides",
          description: "Classic creamy coleslaw, regular portion.", price: 2.49,
          rating: 4.3, image: "https://images.unsplash.com/photo-1576107232684-1279f3908594?q=80&w=400",
        },
        {
          id: "kfc-s2", name: "Pepsi Max", restaurantId: "kfc", category: "Drinks",
          description: "Large Pepsi Max, no sugar.", price: 2.99,
          rating: 4.5, image: "https://images.unsplash.com/photo-1629851759656-74ab3fd0e768?q=80&w=400",
        },
      ],
    },
  ],
};

// ──────────────────────────────────────────────────────────────
// Popular Categories
// ──────────────────────────────────────────────────────────────
export const categories = [
  { name: "Burgers & Fast food", emoji: "🍔", count: 34, color: "bg-orange-50" },
  { name: "Salads", emoji: "🥗", count: 12, color: "bg-green-50" },
  { name: "Pasta & Casuals", emoji: "🍝", count: 18, color: "bg-yellow-50" },
  { name: "Pizza", emoji: "🍕", count: 22, color: "bg-red-50" },
  { name: "Breakfast", emoji: "🍳", count: 9, color: "bg-purple-50" },
  { name: "Soups & Bowls", emoji: "🍲", count: 7, color: "bg-blue-50" },
];

// ──────────────────────────────────────────────────────────────
// Reviews mock
// ──────────────────────────────────────────────────────────────
export const reviews = [
  { id: 1, name: "James W.", avatar: "J", rating: 5, date: "24th September, 2023", text: "Absolutely amazing food! The Tandoori pizza was out of this world. Delivered on time and still piping hot." },
  { id: 2, name: "Priya K.", avatar: "P", rating: 4, date: "12th October, 2023", text: "Great flavours and generous portions. Slightly late but the food made up for it. Will order again!" },
  { id: 3, name: "Mohammed A.", avatar: "M", rating: 5, date: "3rd November, 2023", text: "Best delivery service in Gulberg Lahore. Always reliable, fresh food and friendly drivers." },
  { id: 4, name: "Sophie L.", avatar: "S", rating: 4, date: "18th November, 2023", text: "Consistently good quality. Love the Deluxe pizza, comes with so many toppings. Highly recommend!" },
];

// ──────────────────────────────────────────────────────────────
// Delivery schedule
// ──────────────────────────────────────────────────────────────
export const deliverySchedule = [
  { day: "Monday", hours: "10:00 AM – 3:00 AM" },
  { day: "Tuesday", hours: "8:00 AM – 3:00 AM" },
  { day: "Wednesday", hours: "8:00 AM – 3:00 AM" },
  { day: "Thursday", hours: "8:00 AM – 3:00 AM" },
  { day: "Friday", hours: "8:00 AM – 4:00 AM" },
  { day: "Saturday", hours: "9:00 AM – 4:00 AM" },
  { day: "Sunday", hours: "9:00 AM – 2:00 AM" },
];
