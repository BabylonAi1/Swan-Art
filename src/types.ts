export type OrderStatus = 'طلب جديد' | 'تم التثبيت' | 'قيد التصميم' | 'تم التجهيز' | 'واصل' | 'ملغي' | 'استبدال';

export interface Order {
  id: string;
  date: string;
  orderNumber: string; // رقم الطلب (سوان)
  customerName: string; // اسم الزبون
  customerPhone: string; // رقم الزبون
  instagramLink?: string; // رابط الانستكرام
  address: string; // العنوان
  canvasSizeDetails: string; // قياس اللوحات
  totalPrice: number; // السعر الكامل
  downPayment: number; // العربون
  designPrice?: number; // سعر التصميم
  customerApproval?: string; // موافقة الزبون
  shippingOrderNumber?: string; // رقم طلب شركة التوصيل
  deliveryDate?: string; // موعد التوصيل
  designerName?: string; // اسم المصمم
  orderType: string; // نوع الطلب
  canvasCount: string; // عدد اللوحات
  frameType: string; // نوع الاطار
  status: OrderStatus;
  agentName: string; // اسم الوكيل (عذراء/حسين)
  images?: string[];
  shippingCompany?: 'برايم' | 'الوسيط' | 'كية';
}
