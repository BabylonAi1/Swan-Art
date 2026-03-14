import React, { useState } from 'react';
import { 
  Settings, 
  CheckCircle, 
  Package, 
  DollarSign, 
  Search,
  Truck,
  MoreHorizontal,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Order, OrderStatus } from '../types';

// Mock Data
const MOCK_OPERATIONS_ORDERS: Order[] = [
  {
    id: '1',
    orderNumber: 'SW-1001',
    date: '2024-03-14',
    agentName: 'عذراء',
    customerName: 'محمد علي',
    customerPhone: '07801112223',
    address: 'البصرة - الجزائر',
    canvasSizeDetails: '100x70',
    frameType: 'خشب داخلي',
    totalPrice: 35000,
    downPayment: 5000,
    orderType: 'عادي',
    canvasCount: '1',
    status: 'قيد التصميم',
    designerName: 'أحمد جاسم',
    instagramLink: 'https://instagram.com/user1'
  },
  {
    id: '2',
    orderNumber: 'SW-1002',
    date: '2024-03-14',
    agentName: 'حسين',
    customerName: 'نور الهدى',
    customerPhone: '07705556667',
    address: 'بغداد - المنصور',
    canvasSizeDetails: '40x40',
    frameType: 'إطار مودرن أسود',
    totalPrice: 60000,
    downPayment: 10000,
    orderType: 'مستعجل',
    canvasCount: '3',
    status: 'تم التثبيت',
    instagramLink: 'https://instagram.com/user2'
  },
  {
    id: '3',
    orderNumber: 'SW-1003',
    date: '2024-03-13',
    agentName: 'عذراء',
    customerName: 'ليلى حسن',
    customerPhone: '07509998887',
    address: 'أربيل - عينكاوة',
    canvasSizeDetails: '50x50',
    frameType: 'خشب داخلي',
    totalPrice: 50000,
    downPayment: 0,
    orderType: 'عادي',
    canvasCount: '2',
    status: 'تم التجهيز',
    shippingOrderNumber: 'EXP-99281',
    shippingCompany: 'الوسيط'
  }
];

export default function OperationsDashboard() {
  const [orders, setOrders] = useState<Order[]>(MOCK_OPERATIONS_ORDERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [trackingInput, setTrackingInput] = useState('');
  const [shippingCompanyInput, setShippingCompanyInput] = useState('برايم');

  const updateStatus = async (id: string, newStatus: OrderStatus) => {
    setIsUpdating(id);
    // Simulate n8n update
    console.log(`Updating ${id} to ${newStatus}`);
    await new Promise(resolve => setTimeout(resolve, 800));
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
    setIsUpdating(null);
  };

  const handlePreparedClick = (id: string) => {
    setSelectedOrderId(id);
    setShowTrackingModal(true);
  };

  const confirmPrepared = async () => {
    if (!selectedOrderId || !trackingInput) return;
    setIsUpdating(selectedOrderId);
    // Simulate n8n update
    console.log(`Setting tracking ${trackingInput} for ${selectedOrderId}`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setOrders(prev => prev.map(o => o.id === selectedOrderId ? { 
      ...o, 
      status: 'تم التجهيز', 
      shippingOrderNumber: trackingInput,
      shippingCompany: shippingCompanyInput as any
    } : o));
    setShowTrackingModal(false);
    setTrackingInput('');
    setIsUpdating(null);
  };

  const filteredOrders = orders.filter(o => 
    o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.customerName.includes(searchTerm) ||
    o.customerPhone.includes(searchTerm)
  );

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'طلب جديد': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'تم التثبيت': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      case 'قيد التصميم': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'تم التجهيز': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'واصل': return 'bg-green-100 text-green-800 border-green-200';
      case 'استبدال': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-1 flex items-center gap-2">
            <Settings className="text-slate-600" />
            إدارة العمليات والمتابعة
          </h1>
          <p className="text-slate-500">تثبيت الطلبات، التجهيز، والمحاسبة المالية</p>
        </div>

        <div className="relative w-full md:w-96">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="بحث برقم الطلب، اسم الزبون، أو الهاتف..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-400 outline-none transition-all bg-white"
          />
        </div>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'بانتظار التثبيت', count: orders.filter(o => o.status === 'طلب جديد').length, color: 'text-blue-600' },
          { label: 'قيد التصميم', count: orders.filter(o => o.status === 'قيد التصميم').length, color: 'text-amber-600' },
          { label: 'جاهز للشحن', count: orders.filter(o => o.status === 'تم التجهيز').length, color: 'text-emerald-600' },
          { label: 'تم الاستلام', count: orders.filter(o => o.status === 'واصل').length, color: 'text-green-800' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            <p className="text-xs text-slate-400 mb-1">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.count}</p>
          </div>
        ))}
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-sm font-bold text-slate-600">رقم الطلب</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-600">الزبون</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-600">التفاصيل</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-600">الحالة</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-600">الوكيل</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-600 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800">{order.orderNumber}</div>
                    <div className="text-[10px] text-slate-400">{order.date}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-700">{order.customerName}</div>
                    <div className="text-xs text-slate-500">{order.customerPhone}</div>
                    <div className="text-[10px] text-slate-400 truncate max-w-[150px]">{order.address}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs text-slate-600">{order.canvasSizeDetails} - {order.canvasCount} لوحات</div>
                    <div className="text-xs font-bold text-emerald-600">
                      {order.totalPrice.toLocaleString()} د.ع 
                      {order.downPayment > 0 && <span className="text-slate-400 font-normal mr-1">(عربون: {order.downPayment})</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-lg border ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                    {order.shippingOrderNumber && (
                      <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                        <Truck size={10} /> {order.shippingCompany}: {order.shippingOrderNumber}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs text-slate-600">{order.agentName}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {order.status === 'طلب جديد' && (
                        <button 
                          onClick={() => updateStatus(order.id, 'تم التثبيت')}
                          disabled={isUpdating === order.id}
                          className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                          title="تثبيت الطلب"
                        >
                          <CheckCircle size={18} />
                        </button>
                      )}
                      
                      {(order.status === 'تم التثبيت' || order.status === 'قيد التصميم') && (
                        <button 
                          onClick={() => handlePreparedClick(order.id)}
                          disabled={isUpdating === order.id}
                          className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"
                          title="تم التجهيز"
                        >
                          <Package size={18} />
                        </button>
                      )}

                      {order.status === 'تم التجهيز' && (
                        <button 
                          onClick={() => updateStatus(order.id, 'واصل')}
                          disabled={isUpdating === order.id}
                          className="p-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                          title="واصل (محاسبة)"
                        >
                          <DollarSign size={18} />
                        </button>
                      )}

                      {order.status !== 'استبدال' && (
                        <button 
                          onClick={() => updateStatus(order.id, 'استبدال')}
                          disabled={isUpdating === order.id}
                          className="p-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors"
                          title="طلب استبدال"
                        >
                          <RefreshCw size={18} />
                        </button>
                      )}

                      <button className="p-2 text-slate-400 hover:text-slate-600">
                        <MoreHorizontal size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tracking Modal */}
      <AnimatePresence>
        {showTrackingModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowTrackingModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8"
            >
              <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-2">
                <Truck className="text-emerald-500" />
                تجهيز الطلب للشحن
              </h2>
              <p className="text-slate-500 mb-6">يرجى إدخال تفاصيل الشحن</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">شركة التوصيل</label>
                  <select 
                    value={shippingCompanyInput}
                    onChange={(e) => setShippingCompanyInput(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  >
                    <option value="برايم">برايم</option>
                    <option value="الوسيط">الوسيط</option>
                    <option value="كية">كية (نقل خاص)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">رقم التتبع / البوليصة</label>
                  <input 
                    type="text" 
                    value={trackingInput}
                    onChange={(e) => setTrackingInput(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    placeholder="مثلاً: EXP-123456"
                    autoFocus
                  />
                </div>
                
                <div className="flex gap-3 pt-2">
                  <button 
                    onClick={confirmPrepared}
                    disabled={!trackingInput || !!isUpdating}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isUpdating ? <Loader2 className="animate-spin" /> : <CheckCircle size={20} />}
                    تأكيد التجهيز
                  </button>
                  <button 
                    onClick={() => setShowTrackingModal(false)}
                    className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-all"
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
