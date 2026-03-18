import Link from "next/link";
import { Facebook, Instagram, Twitter, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-background mt-auto">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 border-b border-gray-300 pb-12">
          
          {/* Brand & Apps */}
          <div className="space-y-6 lg:col-span-1">
            <Link href="/" className="flex items-center mb-6">
              <span className="font-heading font-bold text-4xl tracking-tight text-navy">
                Order<span className="text-primary">🔥</span><span className="text-xs bg-gray-200 px-1 py-0.5 rounded ml-1 text-gray-500">.pk</span>
              </span>
            </Link>
            <div className="flex gap-3">
              <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" className="h-[40px] cursor-pointer" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" className="h-[40px] cursor-pointer" />
            </div>
            <p className="text-sm text-gray-600 max-w-xs mt-4">
              Company # 490039-445, Registered with House of companies.
            </p>
          </div>

          {/* Newsletter */}
          <div className="space-y-4 bg-gray-200/50 p-6 rounded-2xl col-span-1 md:col-span-2 lg:col-span-2">
            <h4 className="font-heading font-bold text-lg text-navy">Get Exclusive Deals in your Inbox</h4>
            <div className="flex flex-col sm:flex-row gap-0 mt-2">
              <input 
                type="email" 
                placeholder="youremail@gmail.com" 
                className="bg-white text-foreground px-4 py-3 rounded-t-lg sm:rounded-none sm:rounded-l-full outline-none flex-grow min-w-0"
              />
              <button className="bg-primary text-white font-bold px-6 py-3 rounded-b-lg sm:rounded-none sm:rounded-r-full hover:bg-primary/90 transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>
            <p className="text-xs text-gray-500 pt-1">
              we won't spam, read our <Link href="#" className="underline">email policy</Link>
            </p>
            <div className="flex gap-4 pt-4">
              <a href="#" className="text-navy hover:text-primary transition-colors"><Facebook size={24} /></a>
              <a href="#" className="text-navy hover:text-primary transition-colors"><Instagram size={24} /></a>
              <a href="#" className="text-navy hover:text-primary transition-colors"><Twitter size={24} /></a>
              <a href="#" className="text-navy hover:text-primary transition-colors"><MessageCircle size={24} /></a>
            </div>
          </div>

          {/* Legal Pages */}
          <div className="space-y-4">
            <h4 className="font-heading font-bold text-lg text-navy">Legal Pages</h4>
            <ul className="space-y-3 text-sm font-medium text-foreground underline decoration-gray-300 underline-offset-4">
              <li><Link href="#" className="hover:text-primary transition-colors">Terms and conditions</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Privacy</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Cookies</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Modern Slavery Statement</Link></li>
            </ul>
          </div>

          {/* Important Links */}
          <div className="space-y-4">
            <h4 className="font-heading font-bold text-lg text-navy">Important Links</h4>
            <ul className="space-y-3 text-sm font-medium text-foreground underline decoration-gray-300 underline-offset-4">
              <li><Link href="#" className="hover:text-primary transition-colors">Get help</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Add your restaurant</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Sign up to deliver</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Create a business account</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Legal Bar */}
      <div className="bg-navy text-white text-xs md:text-sm py-4 w-full">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>Order.pk Copyright 2024, All Rights Reserved.</p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-primary transition-colors">Terms</Link>
            <Link href="#" className="hover:text-primary transition-colors">Pricing</Link>
            <Link href="#" className="hover:text-primary transition-colors">Do not sell or share my personal information</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
