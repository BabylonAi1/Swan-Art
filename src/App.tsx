import { useState } from 'react';
import { 
  LayoutDashboard, 
  Palette, 
  Settings, 
  Menu, 
  X,
  Truck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import SalesDashboard from './components/SalesDashboard';
import DesignerDashboard from './components/DesignerDashboard';
import OperationsDashboard from './components/OperationsDashboard';
import DispatcherDashboard from './components/DispatcherDashboard';

type Tab = 'sales' | 'designer' | 'operations' | 'dispatcher';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('sales');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'sales', label: 'المبيعات', icon: LayoutDashboard },
    { id: 'designer', label: 'المصممين', icon: Palette },
    { id: 'dispatcher', label: 'المجهز', icon: Truck },
    { id: 'operations', label: 'العمليات', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'sales': return <SalesDashboard />;
      case 'designer': return <DesignerDashboard />;
      case 'dispatcher': return <DispatcherDashboard />;
      case 'operations': return <OperationsDashboard />;
      default: return <SalesDashboard />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row gradient-bg">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-64 flex-col bg-white border-l border-slate-100 shadow-xl z-20">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <span className="text-xl font-bold">S</span>
            </div>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">SwanArt</h2>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as Tab)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeTab === item.id 
                    ? 'bg-indigo-50 text-indigo-600 font-bold' 
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
                {activeTab === item.id && (
                  <motion.div 
                    layoutId="activeTab"
                    className="mr-auto w-1.5 h-1.5 rounded-full bg-indigo-600"
                  />
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-slate-50">
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">المستخدم الحالي</p>
            <p className="text-sm font-bold text-slate-700">مدير النظام</p>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden bg-white border-b border-slate-100 p-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">S</div>
          <span className="font-bold text-slate-800">SwanArt</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-slate-600"
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-72 bg-white z-50 md:hidden p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">S</div>
                  <span className="font-bold text-slate-800">SwanArt</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400"><X /></button>
              </div>
              <nav className="space-y-4">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id as Tab);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl transition-all ${
                      activeTab === item.id 
                        ? 'bg-indigo-50 text-indigo-600 font-bold' 
                        : 'text-slate-500'
                    }`}
                  >
                    <item.icon size={24} />
                    <span className="text-lg">{item.label}</span>
                  </button>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
