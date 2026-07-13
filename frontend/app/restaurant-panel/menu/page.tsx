'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Plus, Edit, Trash2, ChevronDown, ChevronRight, Image as ImageIcon, X } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

type Category = {
  id: string;
  name: string;
  displayOrder: number;
  isActive: boolean;
  items: MenuItem[];
};

type MenuItem = {
  id: string;
  name: string;
  description: string | null;
  basePrice: number;
  imageUrl: string | null;
  isAvailable: boolean;
  calories: number | null;
  categoryId: string;
  sizes: any[];
};

export default function RestaurantMenuManagement() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedCats, setExpandedCats] = useState<string[]>([]);
  
  // Modals
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [selectedCatId, setSelectedCatId] = useState('');

  useEffect(() => {
    if ((user as any)?.restaurantId) {
      loadMenu();
    }
  }, [user]);

  const loadMenu = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(`/restaurants/${(user as any)?.restaurantId}/menu`);
      setCategories(res.data.data || []);
      // Expand all by default
      setExpandedCats((res.data.data || []).map((c: Category) => c.id));
    } catch (e) {
      toast.error('Failed to load menu');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCat = (id: string) => {
    setExpandedCats(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  };

  // --- Category Handlers ---
  const handleSaveCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      displayOrder: Number(formData.get('displayOrder') || 0),
      isActive: true,
    };

    try {
      if (editingCat) {
        await api.put(`/restaurants/${(user as any)?.restaurantId}/categories/${editingCat.id}`, data);
        toast.success('Category updated');
      } else {
        await api.post(`/restaurants/${(user as any)?.restaurantId}/categories`, data);
        toast.success('Category added');
      }
      setIsCatModalOpen(false);
      loadMenu();
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Failed to save category');
    }
  };

  const deleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category? All items inside will be deleted too!')) return;
    try {
      await api.delete(`/restaurants/${(user as any)?.restaurantId}/categories/${id}`);
      toast.success('Category deleted');
      loadMenu();
    } catch (e) {
      toast.error('Failed to delete category');
    }
  };

  // --- Item Handlers ---
  const handleSaveItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      categoryId: selectedCatId,
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      imageUrl: formData.get('imageUrl') as string,
      basePrice: Number(formData.get('basePrice') || 0),
      calories: formData.get('calories') ? Number(formData.get('calories')) : null,
      isAvailable: formData.get('isAvailable') === 'on',
    };

    try {
      if (editingItem) {
        await api.put(`/restaurants/${(user as any)?.restaurantId}/items/${editingItem.id}`, data);
        toast.success('Item updated');
      } else {
        await api.post(`/restaurants/${(user as any)?.restaurantId}/items`, data);
        toast.success('Item added');
      }
      setIsItemModalOpen(false);
      loadMenu();
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Failed to save item');
    }
  };

  const deleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      await api.delete(`/restaurants/${(user as any)?.restaurantId}/items/${id}`);
      toast.success('Item deleted');
      loadMenu();
    } catch (e) {
      toast.error('Failed to delete item');
    }
  };

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading menu...</div>;

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-heading font-black text-navy">Menu Management</h1>
          <p className="text-gray-500 mt-1">Add, edit, and organize your categories and menu items.</p>
        </div>
        <button 
          onClick={() => { setEditingCat(null); setIsCatModalOpen(true); }}
          className="bg-primary text-white font-bold px-6 py-3 rounded-xl hover:bg-primary/90 transition shadow-md flex items-center gap-2"
        >
          <Plus size={20} /> Add Category
        </button>
      </div>

      <div className="space-y-6">
        {categories.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
            <h3 className="text-xl font-bold text-navy mb-2">No menu categories yet</h3>
            <p className="text-gray-500 mb-6">Create a category like &quot;Burgers&quot; or &quot;Drinks&quot; to get started.</p>
            <button 
              onClick={() => { setEditingCat(null); setIsCatModalOpen(true); }}
              className="bg-navy text-white font-bold px-6 py-3 rounded-xl hover:bg-navy/90 transition"
            >
              Create First Category
            </button>
          </div>
        ) : (
          categories.map((category) => (
            <div key={category.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Category Header */}
              <div 
                className="bg-gray-50 p-4 flex items-center justify-between cursor-pointer border-b border-gray-100"
                onClick={() => toggleCat(category.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="text-gray-400">
                    {expandedCats.includes(category.id) ? <ChevronDown size={24} /> : <ChevronRight size={24} />}
                  </div>
                  <h2 className="font-heading font-black text-xl text-navy">{category.name}</h2>
                  <span className="bg-white text-gray-500 text-xs font-bold px-2.5 py-1 rounded-lg border border-gray-200">
                    {category.items?.length || 0} items
                  </span>
                </div>
                <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                  <button 
                    onClick={() => { setSelectedCatId(category.id); setEditingItem(null); setIsItemModalOpen(true); }}
                    className="text-primary hover:bg-primary/10 p-2 rounded-lg transition text-sm font-bold flex items-center gap-1"
                  >
                    <Plus size={16} /> Add Item
                  </button>
                  <div className="w-px h-6 bg-gray-200 mx-2"></div>
                  <button onClick={() => { setEditingCat(category); setIsCatModalOpen(true); }} className="text-gray-400 hover:text-navy p-2 hover:bg-gray-100 rounded-lg transition"><Edit size={18} /></button>
                  <button onClick={() => deleteCategory(category.id)} className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition"><Trash2 size={18} /></button>
                </div>
              </div>

              {/* Items List */}
              <AnimatePresence>
                {expandedCats.includes(category.id) && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }} 
                    animate={{ height: 'auto', opacity: 1 }} 
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    {category.items?.length > 0 ? (
                      <div className="divide-y divide-gray-100 pl-10 pr-4">
                        {category.items.map((item) => (
                          <div key={item.id} className="py-4 flex gap-4 hover:bg-gray-50/50 transition items-center">
                            {item.imageUrl ? (
                              <img src={item.imageUrl} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
                            ) : (
                              <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                                <ImageIcon size={24} />
                              </div>
                            )}
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 className="font-bold text-navy text-lg">{item.name}</h4>
                                {!item.isAvailable && <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Out of Stock</span>}
                              </div>
                              <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">{item.description}</p>
                              
                              <div className="mt-2 flex flex-wrap gap-2 text-xs font-medium text-gray-500">
                                <span className="text-navy font-bold">Rs.{item.basePrice}</span>
                                {item.sizes && item.sizes.length > 0 && (
                                  <span>• {item.sizes.length} variants</span>
                                )}
                                {item.calories && (
                                  <span>• {item.calories} kcal</span>
                                )}
                              </div>
                            </div>

                            <div className="flex flex-col gap-2">
                              <button onClick={() => { setSelectedCatId(category.id); setEditingItem(item); setIsItemModalOpen(true); }} className="text-gray-400 hover:text-navy p-2 hover:bg-gray-100 rounded-lg transition"><Edit size={18} /></button>
                              <button onClick={() => deleteItem(item.id)} className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition"><Trash2 size={18} /></button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center text-gray-400 text-sm">No items in this category. Click &quot;Add Item&quot; to start.</div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))
        )}
      </div>

      {/* --- Category Modal --- */}
      {isCatModalOpen && (
        <div className="fixed inset-0 bg-navy/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="font-heading font-black text-xl">{editingCat ? 'Edit Category' : 'New Category'}</h2>
              <button onClick={() => setIsCatModalOpen(false)} className="text-gray-400 hover:text-navy"><X size={24} /></button>
            </div>
            <form onSubmit={handleSaveCategory} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Category Name</label>
                <input required type="text" name="name" defaultValue={editingCat?.name} placeholder="e.g. Burgers, Drinks..." className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:border-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Display Order (optional)</label>
                <input type="number" name="displayOrder" defaultValue={editingCat?.displayOrder || 0} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:border-primary outline-none" />
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsCatModalOpen(false)} className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-50 rounded-xl">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90">Save Category</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* --- Item Modal --- */}
      {isItemModalOpen && (
        <div className="fixed inset-0 bg-navy/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="font-heading font-black text-xl">{editingItem ? 'Edit Item' : 'New Item'}</h2>
              <button onClick={() => setIsItemModalOpen(false)} className="text-gray-400 hover:text-navy"><X size={24} /></button>
            </div>
            <form onSubmit={handleSaveItem} className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Item Name</label>
                <input required type="text" name="name" defaultValue={editingItem?.name} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:border-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                <textarea rows={3} name="description" defaultValue={editingItem?.description || ''} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:border-primary outline-none resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Base Price (Rs.)</label>
                  <input required type="number" name="basePrice" defaultValue={editingItem?.basePrice || ''} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Calories (optional)</label>
                  <input type="number" name="calories" defaultValue={editingItem?.calories || ''} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:border-primary outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Image URL</label>
                <input type="url" name="imageUrl" defaultValue={editingItem?.imageUrl || ''} placeholder="https://..." className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:border-primary outline-none" />
              </div>
              <div className="flex items-center gap-3 py-2">
                <input type="checkbox" id="isAvailable" name="isAvailable" defaultChecked={editingItem ? editingItem.isAvailable : true} className="w-5 h-5 accent-primary rounded cursor-pointer" />
                <label htmlFor="isAvailable" className="font-bold text-gray-700 cursor-pointer">Item is in stock and available</label>
              </div>
              
              <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl text-sm text-orange-800">
                <strong>Note:</strong> Advanced size & variant management (e.g. Regular/Large) is available in the full web app.
              </div>

              <div className="pt-4 flex gap-3 sticky bottom-0 bg-white">
                <button type="button" onClick={() => setIsItemModalOpen(false)} className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-50 rounded-xl">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90">Save Item</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
