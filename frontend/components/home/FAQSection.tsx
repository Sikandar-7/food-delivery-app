"use client";

import { useState } from "react";
import { FadeIn, SlideUp } from "@/components/animations/MotionWrappers";
import { Plus } from "lucide-react";

const faqCategories = ["Frequent Questions", "Who we are", "Partner Program", "Help & Support"];

const faqs = [
  { question: "How does Order.pk work?", answer: "We partner with the best restaurants to deliver your favorite food right to your door. Simply enter your postcode, choose a restaurant, select your items, and checkout." },
  { question: "What payment methods are accepted?", answer: "We accept all major credit cards, debit cards, PayPal, and Apple/Google Pay for a seamless checkout experience." },
  { question: "Can I track my order in real-time?", answer: "Yes! Once your order is confirmed, you can track its status live from preparation to delivery." },
  { question: "Are there any special discounts or promotions available?", answer: "We frequently offer exclusive deals. Keep an eye on our homepage and subscribe to our newsletter for the latest offers." },
  { question: "Is Order.pk available in my area?", answer: "We are rapidly expanding! Enter your postcode on the home page to see if we currently deliver to your location." },
];

export default function FAQSection() {
  const [activeTab, setActiveTab] = useState("Frequent Questions");

  return (
    <section className="w-full bg-background py-16">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <FadeIn>
          <h2 className="text-3xl font-heading font-bold text-navy mb-10 text-center">
            Know more about us!
          </h2>
        </FadeIn>

        <div className="flex flex-col lg:flex-row gap-10">
            {/* Left Tabs */}
            <div className="w-full lg:w-1/3 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 hidescrollbar">
                {faqCategories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveTab(cat)}
                        className={`whitespace-nowrap px-6 py-4 rounded-xl font-bold text-left transition-colors ${
                            activeTab === cat 
                            ? "bg-primary text-white shadow-md" 
                            : "bg-white text-navy hover:bg-gray-50 border border-gray-200"
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Right Content */}
            <div className="w-full lg:w-2/3 bg-white rounded-3xl p-6 lg:p-10 shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row gap-8 items-center mb-10">
                   <div className="flex-1">
                      <h3 className="text-2xl font-bold font-heading text-navy mb-4">How does Order.pk work?</h3>
                      <p className="text-gray-600 font-medium">Fast, reliable, and convenient. We ensure you get the best food from top-rated restaurants, delivered fresh and hot to your doorstep.</p>
                   </div>
                   <div className="flex-1 flex justify-center">
                       {/* 3 Step Process Cards */}
                       <div className="flex flex-col gap-4 w-full max-w-sm">
                           <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-4 border border-gray-100">
                               <span className="font-heading font-black text-3xl text-primary opacity-50">1</span>
                               <span className="font-bold text-navy">Select Location</span>
                           </div>
                           <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-4 border border-gray-100">
                               <span className="font-heading font-black text-3xl text-primary opacity-50">2</span>
                               <span className="font-bold text-navy">Choose Order</span>
                           </div>
                           <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-4 border border-gray-100">
                               <span className="font-heading font-black text-3xl text-primary opacity-50">3</span>
                               <span className="font-bold text-navy">Pay & Get Delivery</span>
                           </div>
                       </div>
                   </div>
                </div>

                {/* FAQ Accordion list */}
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="bg-gray-50 rounded-xl p-5 flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-colors border border-gray-100 group">
                            <span className="font-bold text-navy group-hover:text-primary transition-colors">{faq.question}</span>
                            <div className="bg-white p-2 rounded-full shadow-sm text-navy">
                                <Plus size={20} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </section>
  );
}
