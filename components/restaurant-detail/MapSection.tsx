"use client";

import { FadeIn } from "@/components/animations/MotionWrappers";
import { MapPin, ExternalLink } from "lucide-react";

export function MapSection() {
  return (
    <section className="py-14 bg-background">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <FadeIn>
          <h2 className="text-3xl font-heading font-black text-navy mb-6">Find Us</h2>
        </FadeIn>

        <div className="relative rounded-3xl overflow-hidden shadow-card border border-gray-100">
          {/* Embedded map iframe */}
          <iframe
            title="Restaurant Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2483.0944622428!2d-0.14502!3d51.5098!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48760542e3a40c01%3A0x28b0055c4dd1d9!2sRegent%20St%2C%20London!5e0!3m2!1sen!2suk!4v1234567890"
            width="100%"
            height="420"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full"
          />

          {/* Popup card overlay */}
          <div className="absolute top-4 left-4 bg-white rounded-2xl shadow-xl p-4 max-w-[260px] border border-gray-100">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <MapPin size={18} className="text-primary" />
              </div>
              <div>
                <p className="font-heading font-black text-navy text-sm">Tandoori Pizza Lahore</p>
                <p className="text-xs text-gray-500 mt-1">MM Alam Road, 66, Gulberg<br />Lahore, 54000</p>
                <p className="text-xs text-gray-500 mt-1">📞 +92 300 1234567</p>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-primary font-bold hover:underline flex items-center gap-1 mt-2"
                >
                  Get Directions <ExternalLink size={10} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
