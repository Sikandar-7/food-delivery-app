"use client";

import { useCart } from "@/context/CartContext";
import { useModal } from "@/context/ModalContext";
import { Plus } from "lucide-react";
import { FadeIn, SlideUp } from "@/components/animations/MotionWrappers";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

interface Category {
  title: string;
  color: string;
  products: Product[];
}

const menuData: Category[] = [
  {
    title: "Burgers",
    color: "bg-orange-500",
    products: [
      { id: "b1", name: "Royal Cheese Burger with extra Fries", description: "1 McChicken™, 1 McRoyal™, 1 Filet-O-Fish, 3 medium fries, 3 large soft drinks.", price: 23.10, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=400&auto=format&fit=crop" },
      { id: "b2", name: "The classics for 3", description: "1 McChicken™, 1 McRoyal™, 1 Filet-O-Fish, 3 medium fries.", price: 24.10, image: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=400&auto=format&fit=crop" },
      { id: "b3", name: "The classics for 4", description: "1 McChicken™, 1 McRoyal™, 1 Filet-O-Fish, 4 medium fries, 4 large soft drinks.", price: 28.10, image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?q=80&w=400&auto=format&fit=crop" },
    ]
  },
  {
    title: "Fries",
    color: "bg-success",
    products: [
      { id: "f1", name: "Medium Fries", description: "Classic crunchy golden fries.", price: 3.50, image: "https://images.unsplash.com/photo-1576107232684-1279f3908594?q=80&w=400&auto=format&fit=crop" },
      { id: "f2", name: "Large Fries", description: "Classic crunchy golden fries in a larger portion.", price: 4.50, image: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?q=80&w=400&auto=format&fit=crop" },
      { id: "f3", name: "Sweet Potato Fries", description: "Crispy sweet potato fries with a touch of sea salt.", price: 5.50, image: "https://images.unsplash.com/photo-1623238779603-9e9d9b4b94f6?q=80&w=400&auto=format&fit=crop" },
    ]
  },
  {
    title: "Cold drinks",
    color: "bg-blue-500",
    products: [
      { id: "d1", name: "Coca Cola Local", description: "Standard Coca Cola, 500ml.", price: 2.50, image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=400&auto=format&fit=crop" },
      { id: "d2", name: "Fanta Orange", description: "Refreshing orange soda, 500ml.", price: 2.50, image: "https://images.unsplash.com/photo-1629851759656-74ab3fd0e768?q=80&w=400&auto=format&fit=crop" },
      { id: "d3", name: "Sprite Lemon", description: "Crisp lemon-lime soda, 500ml.", price: 2.50, image: "https://images.unsplash.com/photo-1583021950796-0ab09559c381?q=80&w=400&auto=format&fit=crop" },
    ]
  },
  {
    title: "Desserts",
    color: "bg-pink-500",
    products: [
      { id: "ds1", name: "McFlurry Oreo", description: "Soft serve vanilla ice cream blended with Oreo cookie pieces.", price: 3.99, image: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?q=80&w=400&auto=format&fit=crop" },
      { id: "ds2", name: "Apple Pie", description: "Crispy pastry filled with tender apple pieces.", price: 1.99, image: "https://images.unsplash.com/photo-1621955508163-0e5db51f4c37?q=80&w=400&auto=format&fit=crop" },
      { id: "ds3", name: "Chocolate Shake", description: "Thick creamy chocolate milkshake.", price: 3.49, image: "https://images.unsplash.com/photo-1572490122747-3a3c89b4ca1c?q=80&w=400&auto=format&fit=crop" },
    ]
  }
];

export function MenuGrid() {
  const { openModal } = useModal();
  const { dispatch } = useCart();

  const handleAddToCart = (product: Product) => {
    // Directly add to cart and also open a confirmation/customization
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
      },
    });
    
    // Show toast notification
    toast.success(`${product.name} added to cart!`);
  };

  const handleCustomize = (product: Product) => {
    openModal("CUSTOMIZE_PIZZA", { product });
  };

  return (
    <section className="w-full bg-background pb-10">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex flex-col gap-12 mt-8">
          {menuData.map((category) => (
            <div key={category.title} id={category.title.toLowerCase().replace(/\s+/g, "-")}>
              <FadeIn delay={0.1}>
                <h2 className="text-3xl font-heading font-bold text-navy mb-6 flex items-center gap-4">
                  <span className={`w-8 h-8 ${category.color} rounded-full flex-shrink-0`}></span>
                  {category.title}
                </h2>
              </FadeIn>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.products.map((product, prodIdx) => (
                  <SlideUp key={product.id} delay={prodIdx * 0.1}>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow group">
                      {/* Image */}
                      <div className="relative h-40 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      <div className="p-4 flex flex-col gap-2 flex-grow">
                        <h3 className="font-bold text-navy text-base leading-tight">{product.name}</h3>
                        <p className="text-xs text-gray-500 line-clamp-2 flex-grow">{product.description}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="font-bold text-navy text-lg">Rs.{product.price.toFixed(2)}</span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleCustomize(product)}
                              className="text-xs text-gray-500 hover:text-primary transition font-medium border border-gray-200 rounded-pill px-3 py-1.5"
                            >
                              Customize
                            </button>
                            <motion.button
                              onClick={() => handleAddToCart(product)}
                              whileTap={{ scale: 0.93 }}
                              className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors shadow-md"
                            >
                              <Plus size={20} />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SlideUp>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
