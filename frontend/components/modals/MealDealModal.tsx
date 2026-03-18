"use client";

import { useState } from "react";
import { useModal } from "@/context/ModalContext";
import { useCart } from "@/context/CartContext";
import { Plus, Minus } from "lucide-react";
import { toast } from "sonner";

const options = [
  { id: "o1", name: "Margherita Pizza", price: 0, image: "🍕" },
  { id: "o2", name: "Pepperoni Pizza", price: 2.50, image: "🍕" },
  { id: "o3", name: "Veggie Supreme", price: 1.50, image: "🥗" },
];

export function MealDealModal() {
  const { modalState, closeModal } = useModal();
  const { dispatch } = useCart();
  const [selected, setSelected] = useState(options[0].id);
  const [quantity, setQuantity] = useState(1);

  const product = modalState.data?.product; // The triggering product

  const handleAddToCart = () => {
    const chosenOption = options.find((o) => o.id === selected);
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: `${product?.id || "deal"}-${selected}`,
        name: product?.name || "Meal Deal Item",
        price: (product?.price || 15) + (chosenOption?.price || 0),
        quantity,
        customization: chosenOption?.name,
      },
    });
    closeModal();
    toast.success(`${quantity}x ${product?.name || "Deal"} added to cart!`);
  };

  return (
    <div className="w-full">
      <div className="bg-navy text-white p-6 pb-12">
        <h2 className="text-2xl font-heading font-bold mb-2">Configure Meal Deal</h2>
        <p className="text-sm text-white/80">Choose your base option to go with your combo.</p>
      </div>

      <div className="p-6 -mt-8 bg-white rounded-t-3xl h-[400px] overflow-y-auto">
         <h3 className="font-bold text-navy mb-4">Select Option (Choose 1)</h3>
         
         <div className="space-y-4">
            {options.map(opt => (
                <label key={opt.id} className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition ${selected === opt.id ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50'}`}>
                    <div className="flex items-center gap-4">
                        <div className="text-3xl bg-white shadow-sm p-2 rounded-xl">{opt.image}</div>
                        <div>
                            <h4 className="font-bold text-navy">{opt.name}</h4>
                            <p className="text-xs text-gray-500">{opt.price === 0 ? "Included" : `+Rs.${opt.price.toFixed(2)}`}</p>
                        </div>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selected === opt.id ? 'border-primary' : 'border-gray-300'}`}>
                        {selected === opt.id && <div className="w-3 h-3 bg-primary rounded-full"></div>}
                    </div>
                    {/* Hidden radio for accessibility */}
                    <input type="radio" name="meal_option" value={opt.id} checked={selected === opt.id} onChange={() => setSelected(opt.id)} className="hidden" />
                </label>
            ))}
         </div>
      </div>

      <div className="p-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
         {/* Quantity */}
         <div className="flex items-center gap-4 bg-white border border-gray-200 rounded-pill p-1">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center text-navy hover:bg-gray-100 rounded-full transition"><Minus size={18} /></button>
            <span className="font-bold text-navy w-4 text-center">{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 flex items-center justify-center text-navy hover:bg-gray-100 rounded-full transition"><Plus size={18} /></button>
         </div>

         {/* Add to Cart */}
         <button 
           onClick={handleAddToCart}
           className="bg-primary text-white font-bold py-3 px-8 rounded-pill hover:bg-primary/90 transition shadow-lg"
         >
           Add to Basket
         </button>
      </div>
    </div>
  );
}
