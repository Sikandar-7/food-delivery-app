"use client";

import { deliverySchedule } from "@/lib/data";
import { MapPin, Phone, Globe, Clock } from "lucide-react";
import { FadeIn } from "@/components/animations/MotionWrappers";

export function DeliveryInfo() {
  const today = new Date().toLocaleDateString("en-GB", { weekday: "long" });

  return (
    <section className="bg-navy py-14">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <FadeIn>
          <h2 className="text-3xl font-heading font-black text-white mb-8">
            Delivery Information
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Delivery Schedule */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                <Clock size={20} className="text-primary" />
              </div>
              <h3 className="font-heading font-bold text-white text-lg">Delivery Hours</h3>
            </div>
            <ul className="space-y-2">
              {deliverySchedule.map((item) => (
                <li
                  key={item.day}
                  className={`flex justify-between text-sm rounded-lg px-3 py-2 transition-colors ${
                    item.day === today ? "bg-primary text-white font-bold" : "text-white/70"
                  }`}
                >
                  <span>{item.day}</span>
                  <span>{item.hours}</span>
                </li>
              ))}
            </ul>
            <p className="text-white/50 text-xs mt-4">Estimated delivery: 20 min</p>
          </div>

          {/* Contact Info */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                <Phone size={20} className="text-primary" />
              </div>
              <h3 className="font-heading font-bold text-white text-lg">Contact Information</h3>
            </div>
            <div className="space-y-4">
              <p className="text-white/70 text-sm leading-relaxed">
                If you have allergies or other dietary restrictions, please contact the restaurant directly. The restaurant will provide food-specific information upon request.
              </p>
              <div className="flex items-center gap-3 text-white/80">
                <Phone size={16} className="text-primary flex-shrink-0" />
                <span className="text-sm font-medium">+92 300 1234567</span>
              </div>
              <div className="flex items-center gap-3 text-white/80">
                <Globe size={16} className="text-primary flex-shrink-0" />
                <a href="https://order.pk" className="text-sm font-medium text-primary hover:underline">
                  https://order.pk
                </a>
              </div>
              <div className="flex items-center gap-3 text-white/80">
                <MapPin size={16} className="text-primary flex-shrink-0" />
                <span className="text-sm">MM Alam Road, Gulberg, Lahore</span>
              </div>
            </div>
          </div>

          {/* Operational Times */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                <Clock size={20} className="text-primary" />
              </div>
              <h3 className="font-heading font-bold text-white text-lg">Operational Times</h3>
            </div>
            <ul className="space-y-2">
              {deliverySchedule.map((item) => (
                <li key={item.day} className="flex justify-between text-sm text-white/70">
                  <span>{item.day}</span>
                  <span>{item.hours}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
