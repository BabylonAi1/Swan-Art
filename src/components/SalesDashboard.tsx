import React, { useState } from 'react';
import { 
  Plus, 
  Sparkles, 
  Upload, 
  Send, 
  Image as ImageIcon, 
  X,
  Loader2,
  Instagram,
  Phone,
  MapPin,
  Hash
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Order } from '../types';
import { scanOrderScreenshot } from '../services/geminiService';

// n8n Webhook URLs
const N8N_CREATE_ORDER_WEBHOOK = "https://your-n8n-instance.com/webhook/create-order";

export default function SalesDashboard() {
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [files, setFiles] = useState<{name: string, url: string}[]>([]);
  const [formData, setFormData] = useState<Partial<Order>>({
    date: new Date().toISOString().split('T')[0],
    status: 'طلب جديد',
    agentName: 'سوان',
    orderType: 'عادي',
    downPayment: 0
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'number' ? Number(value) : value 
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImages(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (uploadedFiles) {
      Array.from(uploadedFiles).forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFiles(prev => [...prev, { name: file.name, url: reader.result as string }]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleMagicAutofill = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsAiLoading(true);
    
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        const data = await scanOrderScreenshot(base64);
        setFormData(prev => ({
          ...prev,
          ...data
        }));
        setIsAiLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("AI Scan failed", error);
      setIsAiLoading(false);
      alert("فشل التحليل الذكي، يرجى المحاولة مرة أخرى أو إدخال البيانات يدوياً");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // In n8n, you will handle uploading images to Google Drive 
      // with filename as orderNumber
      console.log("Sending to n8n:", { ...formData, images, files });
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert("تم إرسال الطلب بنجاح إلى النظام!");
      setFormData({
        date: new Date().toISOString().split('T')[0],
        status: 'طلب جديد',
        agentName: 'سوان',
        orderType: 'عادي',
        downPayment: 0
      });
      setImages([]);
      setFiles([]);
    } catch (error) {
      console.error(error);
      alert("حدث خطأ أثناء إرسال الطلب");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">إدخال طلبات سوان آرت</h1>
        <p className="text-slate-500">نظام إدارة الطلبات المركزي - قسم المبيعات</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">نوع الطلب / الوكيل</label>
                <div className="flex gap-2">
                  <button 
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, agentName: 'سوان' }))}
                    className={`flex-1 py-2 px-4 rounded-xl border transition-all ${formData.agentName === 'سوان' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200'}`}
                  >
                    طلب سوان
                  </button>
                  <select 
                    name="agentName" 
                    value={formData.agentName !== 'سوان' ? formData.agentName : ''} 
                    onChange={(e) => setFormData(prev => ({ ...prev, agentName: e.target.value }))}
                    className={`flex-1 px-4 py-2 rounded-xl border outline-none transition-all ${formData.agentName !== 'سوان' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200'}`}
                  >
                    <option value="" disabled>اختر وكيل...</option>
                    <option value="وكيل عذراء">وكيل عذراء</option>
                    <option value="وكيل حسين">وكيل حسين</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">رقم الطلب (سوان)</label>
                <input 
                  type="text" name="orderNumber" value={formData.orderNumber || ''} onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="مثلاً #5331" required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">اسم الزبون</label>
                <input 
                  type="text" name="customerName" value={formData.customerName || ''} onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="الاسم الكامل" required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
                  <Phone size={14} /> رقم الزبون
                </label>
                <input 
                  type="tel" name="customerPhone" value={formData.customerPhone || ''} onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="07xxxxxxxx" required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
                  <Instagram size={14} /> رابط الانستكرام
                </label>
                <input 
                  type="url" name="instagramLink" value={formData.instagramLink || ''} onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="https://instagram.com/..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
                <MapPin size={14} /> العنوان
              </label>
              <input 
                type="text" name="address" value={formData.address || ''} onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="المحافظة - المنطقة - تفاصيل" required
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">قياس اللوحات</label>
                <input 
                  type="text" name="canvasSizeDetails" value={formData.canvasSizeDetails || ''} onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="مثلاً 60x90"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">عدد اللوحات</label>
                <input 
                  type="text" name="canvasCount" value={formData.canvasCount || ''} onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">نوع الإطار</label>
                <input 
                  type="text" name="frameType" value={formData.frameType || ''} onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="J3, A2..."
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">السعر الكامل</label>
                <input 
                  type="number" name="totalPrice" value={formData.totalPrice || ''} onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">العربون</label>
                <input 
                  type="number" name="downPayment" value={formData.downPayment || ''} onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">موعد التوصيل</label>
                <input 
                  type="date" name="deliveryDate" value={formData.deliveryDate || ''} onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">نوع الطلب</label>
                <select 
                  name="orderType" value={formData.orderType} onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                >
                  <option value="عادي">عادي</option>
                  <option value="مستعجل">مستعجل</option>
                  <option value="استبدال">استبدال</option>
                  <option value="طباعة مباشرة">طباعة مباشرة</option>
                </select>
              </div>
            </div>

            <button 
              type="submit" disabled={isSubmitting}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : <Send size={20} />}
              إرسال الطلب إلى n8n
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="text-yellow-300" />
              <h3 className="font-bold text-lg">الماسح الذكي</h3>
            </div>
            <p className="text-sm text-indigo-100 mb-6">ارفع لقطة شاشة للمحادثة لملء البيانات تلقائياً</p>
            
            <label className="cursor-pointer block">
              <input type="file" className="hidden" accept="image/*" onChange={handleMagicAutofill} disabled={isAiLoading} />
              <div className="bg-white/20 hover:bg-white/30 border border-white/30 rounded-xl py-3 px-4 text-center transition-all flex items-center justify-center gap-2">
                {isAiLoading ? <Loader2 className="animate-spin" /> : <Upload size={18} />}
                {isAiLoading ? "جاري التحليل..." : "رفع لقطة الشاشة"}
              </div>
            </label>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <ImageIcon size={20} className="text-indigo-500" />
              صور اللوحات
            </h3>
            
            <div className="grid grid-cols-2 gap-2 mb-4">
              <AnimatePresence>
                {images.map((img, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 group"
                  >
                    <img src={img} alt="upload" className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              <label className="aspect-square rounded-lg border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-indigo-400 hover:text-indigo-500 cursor-pointer transition-all">
                <Plus size={24} />
                <span className="text-xs mt-1">إضافة صورة</span>
                <input type="file" className="hidden" multiple accept="image/*" onChange={handleImageUpload} />
              </label>
            </div>

            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 mt-6">
              <Upload size={20} className="text-indigo-500" />
              ملفات إضافية (PDF, ZIP)
            </h3>
            <div className="space-y-2">
              {files.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <span className="text-xs text-slate-600 truncate max-w-[150px]">{file.name}</span>
                  <button type="button" onClick={() => removeFile(idx)} className="text-red-500 hover:text-red-700">
                    <X size={14} />
                  </button>
                </div>
              ))}
              <label className="w-full py-2 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center gap-2 text-slate-400 hover:border-indigo-400 hover:text-indigo-500 cursor-pointer transition-all">
                <Plus size={16} />
                <span className="text-xs">رفع ملف</span>
                <input type="file" className="hidden" multiple onChange={handleFileUpload} />
              </label>
            </div>
            <p className="text-[10px] text-slate-400 text-center mt-4">سيتم تسمية الملفات برقم الطلب تلقائياً</p>
          </div>
        </div>
      </div>
    </div>
  );
}
