import React, { useState, useRef } from 'react';
import { 
  Truck, 
  Camera, 
  CheckCircle, 
  Calendar, 
  Hash, 
  Loader2, 
  X,
  Scan,
  Smartphone,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Order } from '../types';

// Mock Data for Dispatcher
const MOCK_PRINTED_ORDERS: Order[] = [
  {
    id: '101',
    date: '2026-03-10',
    orderNumber: '5434',
    customerName: 'زبون تجريبي 1',
    customerPhone: '7735629616',
    address: 'الزعفرانيه اربع شوارع',
    canvasSizeDetails: '90x150',
    totalPrice: 88000,
    downPayment: 50000,
    orderType: 'طلب جديد',
    canvasCount: '1',
    frameType: 'خشب داخلي',
    status: 'تم التجهيز',
    agentName: 'وكيل عذراء'
  },
  {
    id: '102',
    date: '2026-03-11',
    orderNumber: '5444',
    customerName: 'زبون تجريبي 2',
    customerPhone: '7503570139',
    address: 'الوزيرية نزلة جسر الصرافية',
    canvasSizeDetails: '229x192',
    totalPrice: 230000,
    downPayment: 0,
    orderType: 'طلب جديد',
    canvasCount: '1',
    frameType: 'J3',
    status: 'تم التجهيز',
    agentName: 'وكيل حسين'
  }
];

export default function DispatcherDashboard() {
  const [orders, setOrders] = useState<Order[]>(MOCK_PRINTED_ORDERS);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [shippingCompany, setShippingCompany] = useState<'برايم' | 'الوسيط' | 'كية'>('برايم');
  const [scannedReceipt, setScannedReceipt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleScan = async () => {
    setIsScanning(true);
    // Simulate AI scanning from camera
    await new Promise(resolve => setTimeout(resolve, 3000));
    const randomReceipt = Math.floor(100000 + Math.random() * 900000).toString();
    setScannedReceipt(randomReceipt);
    setIsScanning(false);
  };

  const handleFinalize = async () => {
    if (!selectedOrder || !scannedReceipt) {
      alert("يرجى إكمال جميع البيانات (رقم الوصل)");
      return;
    }

    setIsProcessing(true);
    // Simulate sending to n8n
    console.log("Finalizing dispatch:", {
      orderId: selectedOrder.id,
      deliveryDate: selectedOrder.deliveryDate,
      shippingCompany,
      receiptNumber: scannedReceipt
    });

    await new Promise(resolve => setTimeout(resolve, 1500));
    setOrders(prev => prev.filter(o => o.id !== selectedOrder.id));
    setSelectedOrder(null);
    setScannedReceipt('');
    setIsProcessing(false);
    alert("تم تأكيد معلومات الشحن بنجاح!");
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-1 flex items-center gap-2">
          <Truck className="text-emerald-600" />
          واجهة المجهز (التغليف والشحن)
        </h1>
        <p className="text-slate-500">تأكيد خروج الطلبات من المعمل وتحديد موعد الاستلام</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Orders List */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-700 mb-4 flex items-center gap-2">
            <CheckCircle className="text-emerald-500" size={20} />
            الطلبات المجهزة للطباعة
          </h2>
          {orders.map(order => (
            <motion.div 
              key={order.id}
              whileHover={{ scale: 1.01 }}
              onClick={() => setSelectedOrder(order)}
              className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                selectedOrder?.id === order.id 
                  ? 'bg-emerald-50 border-emerald-200 shadow-md' 
                  : 'bg-white border-slate-100 hover:border-emerald-100'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold text-emerald-600 mb-1">#{order.orderNumber}</p>
                  <h3 className="font-bold text-slate-800">{order.customerName}</h3>
                  <p className="text-xs text-slate-500">{order.address}</p>
                  <p className="text-xs text-slate-400 mt-1">{order.canvasSizeDetails}</p>
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-700">{order.customerPhone}</p>
                  <p className="text-[10px] text-slate-400">{order.date}</p>
                </div>
              </div>
            </motion.div>
          ))}
          {orders.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200 text-slate-400">
              لا توجد طلبات بانتظار التجهيز حالياً
            </div>
          )}
        </div>

        {/* Finalization Form */}
        <AnimatePresence mode="wait">
          {selectedOrder ? (
            <motion.div 
              key={selectedOrder.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 sticky top-8"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-slate-800">تجهيز الطلب #{selectedOrder.orderNumber}</h3>
                <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-slate-600">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="bg-slate-50 p-4 rounded-2xl flex items-start gap-3">
                  <Info className="text-indigo-500 shrink-0 mt-1" size={18} />
                  <div className="text-sm text-slate-600">
                    <p><span className="font-bold">الزبون:</span> {selectedOrder.customerPhone}</p>
                    <p><span className="font-bold">العنوان:</span> {selectedOrder.address}</p>
                    <p><span className="font-bold">التفاصيل:</span> {selectedOrder.canvasSizeDetails}</p>
                    {selectedOrder.deliveryDate && (
                      <p className="text-emerald-600 font-bold mt-1">
                        <Calendar size={14} className="inline ml-1" />
                        موعد التوصيل: {selectedOrder.deliveryDate}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">شركة التوصيل</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['برايم', 'الوسيط', 'كية'] as const).map(company => (
                      <button
                        key={company}
                        onClick={() => setShippingCompany(company)}
                        className={`py-2 rounded-xl border text-sm font-bold transition-all ${
                          shippingCompany === company 
                            ? 'bg-emerald-600 border-emerald-600 text-white' 
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {company}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-1">
                    <Hash size={16} /> رقم الوصل (المسح الذكي)
                  </label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={scannedReceipt}
                      readOnly
                      className="flex-1 px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 text-slate-700 font-mono font-bold outline-none"
                      placeholder="امسح الوصل بالكاميرا..."
                    />
                    <button 
                      onClick={handleScan}
                      disabled={isScanning}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-xl shadow-lg transition-all flex items-center gap-2"
                    >
                      {isScanning ? <Loader2 className="animate-spin" /> : <Camera size={20} />}
                      {isScanning ? "جاري المسح..." : "مسح"}
                    </button>
                  </div>
                  {isScanning && (
                    <div className="mt-4 aspect-video bg-slate-900 rounded-2xl flex flex-col items-center justify-center text-white overflow-hidden relative">
                      <div className="absolute inset-0 border-2 border-emerald-500/50 animate-pulse" />
                      <Scan size={48} className="text-emerald-400 mb-2 animate-bounce" />
                      <p className="text-xs font-bold tracking-widest uppercase">AI Vision Scanning...</p>
                    </div>
                  )}
                </div>

                <button 
                  onClick={handleFinalize}
                  disabled={isProcessing}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isProcessing ? <Loader2 className="animate-spin" /> : <CheckCircle size={20} />}
                  تأكيد التجهيز النهائي
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="hidden lg:flex flex-col items-center justify-center h-[600px] bg-white rounded-3xl border border-dashed border-slate-200 text-slate-400">
              <Smartphone size={64} className="mb-4 opacity-20" />
              <p className="font-bold">اختر طلباً من القائمة للبدء بالتجهيز</p>
              <p className="text-sm">سيتم استخدام الكاميرا لمسح رقم الوصل تلقائياً</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
