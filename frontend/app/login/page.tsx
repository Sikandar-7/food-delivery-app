import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthModal } from "@/components/modals/AuthModal";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-2xl">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold text-navy mb-3">Login to Order.pk</h1>
            <p className="text-gray-500 max-w-xl mx-auto">
              Access your account to track orders, manage restaurants, and continue shopping.
            </p>
          </div>
          <AuthModal />
        </div>
      </main>
      <Footer />
    </div>
  );
}
