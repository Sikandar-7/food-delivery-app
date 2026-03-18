"use client";

import { useState } from "react";
import { useModal } from "@/context/ModalContext";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

const toppings = [
  { id: "t1", name: "Extra Cheese", price: 1.50 },
  { id: "t2", name: "Pepperoni", price: 2.00 },
  { id: "t3", name: "Mushrooms", price: 1.00 },
  { id: "t4", name: "Onions", price: 0.50 },
  { id: "t5", name: "Sausage", price: 2.00 },
  { id: "t6", name: "Olives", price: 1.00 },
];

export function CustomizeModal() {
  const { modalState, closeModal } = useModal();
  const { dispatch } = useCart();
  const [selected, setSelected] = useState<string[]>([]);
  const product = modalState.data?.product;

  const handleToggle = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((item) => item !== id));
    } else {
        // Max 4 validation
      if (selected.length < 4) {
        setSelected([...selected, id]);
      } else {
          alert("You can select a maximum of 4 toppings.");
      }
    }
  };

  const handleAddToCart = () => {
    const selectedNames = selected.map(id => toppings.find(t => t.id === id)?.name).join(", ");
    const toppingsPrice = selected.reduce((sum, id) => sum + (toppings.find(t => t.id === id)?.price || 0), 0);
    
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: product?.id || "custom-pizza",
        name: product?.name || "Pizza",
        price: (product?.price || 15) + toppingsPrice,
        quantity: 1,
        customization: selectedNames || "No extra toppings",
      },
    });
    closeModal();
    toast.success(`${product?.name || "Item"} added to cart!`);
  };

  return (
    <div className="w-full">
      <div className="p-8 pb-4">
        <h2 className="text-3xl font-heading font-bold text-navy mb-2">Customize your order</h2>
        <p className="text-gray-600 font-medium">Select up to 4 extra toppings for your pizza.</p>
      </div>

      <div className="p-8 pt-0 overflow-y-auto max-h-[400px]">
        <div className="space-y-3">
          {toppings.map((topping) => (
            <label key={topping.id} className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition ${selected.includes(topping.id) ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-gray-200'}`}>
               <div>
                  <h4 className="font-bold text-navy">{topping.name}</h4>
                  <p className="text-sm text-gray-500">+Rs.{topping.price.toFixed(2)}</p>
               </div>
               
               <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${selected.includes(topping.id) ? 'border-primary bg-primary text-white' : 'border-gray-300'}`}>
                  {selected.includes(topping.id) && <span>✓</span>}
               </div>
               <input type="checkbox" checked={selected.includes(topping.id)} onChange={() => handleToggle(topping.id)} className="hidden" />
            </label>
          ))}
        </div>
      </div>

      <div className="p-6 bg-gray-50 border-t border-gray-100">
         <button 
            onClick={handleAddToCart}
            className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary/90 transition shadow-md"
         >
            Add to Basket
         </button>
      </div>
    </div>
  );
}
