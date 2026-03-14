import React, { useState } from 'react';
import { 
  Palette, 
  Clock, 
  CheckCircle2, 
  User,
  ExternalLink,
  Loader2,
  Hash,
  Box
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Order } from '../types';

// Mock Data based on Excel
const MOCK_ORDERS: Order[] = [
  {
    id: '1',
    date: '2026-03-02',
    orderNumber: '5331',
    customerName: 'زبون مصمم 1',
    customerPhone: '7507858089',
    instagramLink: 'https://www.instagram.com/abo_shah_f',
    address: 'زاخو',
    canvasSizeDetails: '6 لوحات، القياسات بالصور، كلهم اطار رقم ٦',
    totalPrice: 600000,
    downPayment: 200000,
    orderType: 'طلب جديد',
    canvasCount: '6',
    frameType: 'إطار رقم ٦',
    status: 'طلب جديد',
    agentName: 'وكيل عذراء',
    images: ['https://picsum.photos/seed/art1/400/400']
  },
  {
    id: '2',
    date: '2026-03-02',
    orderNumber: '5297',
    customerName: 'زبون مصمم 2',
    customerPhone: '7823000900',
    address: 'المنصور ١٤ رمضان',
    canvasSizeDetails: '٣ قطع؛ لوحة الولد والبنت تصير قطعتين كل وحده ١٠٠١٠٠',
    totalPrice: 350000,
    downPayment: 100000,
    orderType: 'طلب جديد',
    canvasCount: '3',
    frameType: 'خشب داخلي',
    status: 'تم التثبيت',
    agentName: 'وكيل حسين',
    images: ['https://picsum.photos/seed/art2/400/400']
  }
];

export default function DesignerDashboard() {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [designerName, setDesignerName] = useState('');
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleClaimClick = (order: Order) => {
    setSelectedOrder(order);
    setShowClaimModal(true);
  };

  const confirmClaim = async () => {
    if (!designerName || !selectedOrder) return;
    setClaimingId(selectedOrder.id);
    
    // Simulate n8n update
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setOrders(prev => prev.filter(o => o.id !== selectedOrder.id));
    setShowClaimModal(false);
    setDesignerName('');
    setClaimingId(null);
    alert(`تم استلام الطلب ${selectedOrder.orderNumber} بنجاح!`);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-1 flex items-center gap-2">
          <Palette className="text-indigo-600" />
          لوحة الإنتاج (المصممين)
        </h1>
        <p className="text-slate-500">الطلبات التي تحتاج إلى تصميم ومعالجة فنية</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {orders.map((order) => (
            <motion.div
              key={order.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col"
            >
              <div className="p-5 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-1 rounded-lg">
                      #{order.orderNumber}
                    </span>
                    <span className="text-xs text-slate-400">{order.date}</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-600">{order.agentName}</span>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-2 text-sm text-slate-600">
                    <Box size={16} className="mt-0.5 text-slate-400 shrink-0" />
                    <p><span className="font-bold">التفاصيل:</span> {order.canvasSizeDetails}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Hash size={16} className="text-slate-400 shrink-0" />
                    <p><span className="font-bold">العدد:</span> {order.canvasCount} لوحات</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {order.images?.map((img, i) => (
                    <div key={i} className="aspect-square rounded-lg overflow-hidden bg-slate-100">
                      <img src={img} alt="preview" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100">
                <button 
                  onClick={() => handleClaimClick(order)}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl transition-all"
                >
                  استلام الطلب 👨‍🎨
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showClaimModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowClaimModal(false)} />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8"
            >
              <h2 className="text-2xl font-bold text-slate-800 mb-6">تأكيد استلام الطلب</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">اسم المصمم</label>
                  <input 
                    type="text" 
                    value={designerName}
                    onChange={(e) => setDesignerName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="أدخل اسمك هنا"
                    autoFocus
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button 
                    onClick={confirmClaim}
                    disabled={!designerName || !!claimingId}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50"
                  >
                    {claimingId ? <Loader2 className="animate-spin mx-auto" /> : "تأكيد الاستلام"}
                  </button>
                  <button 
                    onClick={() => setShowClaimModal(false)}
                    className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-medium"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
