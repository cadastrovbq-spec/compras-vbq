
import React, { useState, useMemo, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Plus, 
  Trash2, 
  TrendingUp,
  ShoppingCart,
  CreditCard,
  BarChart3,
  Search,
  Users,
  Box,
  Percent,
  History,
  X,
  ListPlus,
  FileText,
  Printer,
  Pencil,
  AlertCircle,
  Calculator,
  Calendar,
  FilterX
} from 'lucide-react';
import { Supplier, Product, Receipt, DailySale, Category, ViewType, Boleto } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<ViewType>('dashboard');
  
  const loadFromLS = <T,>(key: string, defaultValue: T): T => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  };

  const [categories] = useState<Category[]>([
    { id: 'c1', name: 'MERCEARIA' }, { id: 'c2', name: 'CARAMUJO' }, { id: 'c3', name: 'PROTEINAS AVES' },
    { id: 'c4', name: 'PROTEINA BOVINO' }, { id: 'c5', name: 'PEIXARIA' }, { id: 'c6', name: 'PROTEINA SUÍNOS' },
    { id: 'c7', name: 'QUEIJOS & FRIOS' }, { id: 'c8', name: 'MASSAS' }, { id: 'c9', name: 'CARVAO' },
    { id: 'c10', name: 'HORTFRUT' }, { id: 'c11', name: 'CONGELADOS' }, { id: 'c12', name: 'PROTUDOS JAPONES SUSHI' },
    { id: 'c13', name: 'DESCARTAVÉIS/ DIVERSOS' }, { id: 'c14', name: 'MATERIAIS DE LIMPEZA' }, { id: 'c15', name: 'ESCRITORIO' },
    { id: 'c16', name: 'BEBIDAS GELADAS' }, { id: 'c17', name: 'CHOPP' }, { id: 'c18', name: 'BEBIDAS QUENTES/DESTILADOS' },
    { id: 'c19', name: 'GAS' }, { id: 'c20', name: 'MANUTENÇAO' }, { id: 'c21', name: 'COPOS/PRATOS' },
    { id: 'c22', name: 'UNIFORMES' }, { id: 'c23', name: 'SORVETE' }, { id: 'c24', name: 'POLPAS E SUCO' }, { id: 'c25', name: 'SALGADOS' }
  ]);

  const [suppliers, setSuppliers] = useState<Supplier[]>(() => loadFromLS('vbq_suppliers', [
    "AJES", "ALVES", "AMBEV", "BMG FOODS", "BRASAL", "BRILHO INOX", "CANAL", "CARAMUJO", "CARVÃO TROPICAL", "CIDADE", "DAMASCO", "DE MARCHI", "DEL MAIPO", "DELLY'S", "ELÉTRICA BURITI", "EUROBRAS", "FRIPREMIUM", "GARDA", "GELO TOP", "GERMANA", "GOTA GAS", "HP ELÉTRICA", "JC DISTRIBUIÇÃO", "LGA", "LENI ALVES", "LOJA DO AÇOUGUEIRO", "MACHADO", "MANDIOCA AMARELA", "MR CARNES", "NACIONAL GRÁFICA", "POTIGUAR SALGADOS", "RESTAURANTEIRO", "REFRIUS", "RSANTOS", "S.O.S. DESENTUPIDORA", "SEVEN", "SORVE MILK", "SOLLI ATACADISTA", "SUPER GAS BRAS", "SWEET", "TOTAL SERV", "WESLEY", "WL"
  ].map((name, i) => ({ id: `s-${i}`, name, taxId: '', contact: '', vendorName: '', vendorPhone: '' }))));

  const [products, setProducts] = useState<Product[]>(() => loadFromLS('vbq_products', []));
  const [receipts, setReceipts] = useState<Receipt[]>(() => loadFromLS('vbq_receipts', []));
  const [dailySales, setDailySales] = useState<DailySale[]>(() => loadFromLS('vbq_sales', []));
  const [boletos, setBoletos] = useState<Boleto[]>(() => loadFromLS('vbq_boletos', []));

  useEffect(() => { localStorage.setItem('vbq_suppliers', JSON.stringify(suppliers)); }, [suppliers]);
  useEffect(() => { localStorage.setItem('vbq_products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('vbq_receipts', JSON.stringify(receipts)); }, [receipts]);
  useEffect(() => { localStorage.setItem('vbq_sales', JSON.stringify(dailySales)); }, [dailySales]);
  useEffect(() => { localStorage.setItem('vbq_boletos', JSON.stringify(boletos)); }, [boletos]);

  // Filtros de Análise
  const [reportFilterProduct, setReportFilterProduct] = useState('');
  const [reportFilterSupplier, setReportFilterSupplier] = useState('');
  const [reportFilterStartDate, setReportFilterStartDate] = useState(() => {
    const d = new Date(); d.setDate(1); return d.toISOString().split('T')[0];
  });
  const [reportFilterEndDate, setReportFilterEndDate] = useState(new Date().toISOString().split('T')[0]);

  // Dash Stats
  const stats = useMemo(() => {
    const now = new Date();
    const curMonthReceipts = receipts.filter(r => new Date(r.date).getMonth() === now.getMonth());
    const totalPurchases = curMonthReceipts.reduce((acc, r) => acc + r.totalValue, 0);
    const curMonthSales = dailySales.filter(s => new Date(s.date).getMonth() === now.getMonth());
    const totalSales = curMonthSales.reduce((acc, s) => acc + s.totalValue, 0);
    const cmvPercent = totalSales > 0 ? (totalPurchases / totalSales) * 100 : 0;
    const nextMonthDebt = boletos.filter(b => b.status === 'pending').reduce((acc, b) => acc + b.value, 0);
    return { totalPurchases, totalSales, cmvPercent, nextMonthDebt };
  }, [receipts, boletos, dailySales]);

  // Filtragem Dinâmica
  const filteredReceiptsForReport = useMemo(() => {
    return receipts.filter(r => {
      const matchProduct = reportFilterProduct ? r.productId === reportFilterProduct : true;
      const matchSupplier = reportFilterSupplier ? r.supplierId === reportFilterSupplier : true;
      const date = new Date(r.date);
      const start = reportFilterStartDate ? new Date(reportFilterStartDate) : null;
      const end = reportFilterEndDate ? new Date(reportFilterEndDate) : null;
      return matchProduct && matchSupplier && (start ? date >= start : true) && (end ? date <= end : true);
    });
  }, [receipts, reportFilterProduct, reportFilterSupplier, reportFilterStartDate, reportFilterEndDate]);

  const totalFilteredReport = useMemo(() => filteredReceiptsForReport.reduce((acc, r) => acc + r.totalValue, 0), [filteredReceiptsForReport]);

  const [draftInvoiceHeader, setDraftInvoiceHeader] = useState({ supplierId: '', invoiceNumber: '', date: new Date().toISOString().split('T')[0] });
  const [draftItems, setDraftItems] = useState<{ productId: string, quantity: number, unitPrice: number }[]>([]);
  const [currentProductSearch, setCurrentProductSearch] = useState('');
  const [isProductListOpen, setIsProductListOpen] = useState(false);
  const [currentItemForm, setCurrentItemForm] = useState({ productId: '', quantity: '', unitPrice: '' });

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 relative font-sans">
      <aside className="w-full md:w-72 bg-slate-900 text-white flex flex-col h-screen sticky top-0 z-50 shadow-2xl overflow-y-auto no-print">
        <div className="p-10 flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500 rounded-2xl shadow-lg shadow-emerald-500/20"><Package size={28}/></div>
          <div>
            <h1 className="text-xl font-black tracking-tighter uppercase leading-none">COMPRAS VBQ</h1>
            <p className="text-[10px] font-bold text-slate-500 tracking-widest mt-1">VERCEL DEPLOY</p>
          </div>
        </div>
        <nav className="flex-1 px-5 space-y-1.5 pb-10">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Painel Geral' },
            { id: 'receipts', icon: ListPlus, label: 'Lançar Notas' },
            { id: 'notas_lancadas', icon: FileText, label: 'Histórico de Notas' },
            { id: 'boletos', icon: CreditCard, label: 'Contas a Pagar' },
            { id: 'products', icon: Box, label: 'Produtos' },
            { id: 'suppliers', icon: Users, label: 'Fornecedores' },
            { id: 'sales', icon: ShoppingCart, label: 'Caixa do Dia' },
            { id: 'reports', icon: BarChart3, label: 'Análise de Itens' }
          ].map(item => (
            <button key={item.id} onClick={() => setView(item.id as ViewType)} className={`w-full flex items-center gap-3.5 px-5 py-4 rounded-2xl transition-all font-semibold ${view === item.id ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
              <item.icon size={20} /> {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-6 md:p-12 overflow-y-auto max-w-7xl mx-auto w-full">
        {view === 'dashboard' && (
          <div className="space-y-10 animate-in fade-in duration-500">
            <header><h2 className="text-3xl font-black text-slate-800 tracking-tight">Painel de Controle</h2></header>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm relative overflow-hidden group">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Compras no Mês</p>
                <p className="text-4xl font-black text-slate-900 mt-3 group-hover:text-emerald-600 transition-colors">R$ {stats.totalPurchases.toLocaleString('pt-BR')}</p>
                <TrendingUp className="absolute right-6 top-6 text-slate-100" size={60} />
              </div>
              <div className="bg-indigo-900 p-8 rounded-[40px] shadow-2xl relative text-white overflow-hidden group">
                <p className="text-[11px] font-bold text-white/50 uppercase tracking-[0.2em]">CMV Estimado</p>
                <p className="text-5xl font-black mt-3 text-emerald-400">{stats.cmvPercent.toFixed(1)}%</p>
                <Percent className="absolute right-6 top-6 text-white/10" size={80} />
              </div>
              <div className="bg-red-600 p-8 rounded-[40px] shadow-2xl relative text-white overflow-hidden group">
                <p className="text-[11px] font-bold text-white/50 uppercase tracking-[0.2em]">Contas a Pagar</p>
                <p className="text-4xl font-black mt-3">R$ {stats.nextMonthDebt.toLocaleString('pt-BR')}</p>
                <Calculator className="absolute right-6 top-6 text-white/10" size={60} />
              </div>
              <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm relative overflow-hidden">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Faturamento (Mês)</p>
                <p className="text-4xl font-black text-slate-900 mt-3">R$ {stats.totalSales.toLocaleString('pt-BR')}</p>
                <ShoppingCart className="absolute right-6 top-6 text-slate-100" size={60} />
              </div>
            </div>
          </div>
        )}

        {view === 'reports' && (
          <div className="space-y-10 animate-in fade-in duration-500">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">Análise Avançada de Consumo</h2>
              <div className="flex gap-2">
                <button onClick={() => { setReportFilterProduct(''); setReportFilterSupplier(''); setReportFilterStartDate(''); setReportFilterEndDate(''); }} className="p-3 bg-slate-200 text-slate-600 rounded-xl hover:bg-slate-300 transition-all flex items-center gap-2 font-bold text-xs uppercase"><FilterX size={16}/> Limpar Filtros</button>
                <button onClick={() => window.print()} className="p-3 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all flex items-center gap-2 font-bold text-xs uppercase"><Printer size={16}/> Imprimir</button>
              </div>
            </header>

            <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 no-print">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 flex items-center gap-1.5"><Users size={12}/> Cliente / Fornecedor</label>
                <select className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none" value={reportFilterSupplier} onChange={e => setReportFilterSupplier(e.target.value)}>
                  <option value="">Todos</option>
                  {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 flex items-center gap-1.5"><Box size={12}/> Produto</label>
                <select className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none" value={reportFilterProduct} onChange={e => setReportFilterProduct(e.target.value)}>
                  <option value="">Todos</option>
                  {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 flex items-center gap-1.5"><Calendar size={12}/> Início</label>
                <input type="date" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold" value={reportFilterStartDate} onChange={e => setReportFilterStartDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 flex items-center gap-1.5"><Calendar size={12}/> Fim</label>
                <input type="date" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold" value={reportFilterEndDate} onChange={e => setReportFilterEndDate(e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 bg-emerald-600 p-10 rounded-[48px] shadow-2xl text-white flex flex-col justify-center">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] opacity-70">Gasto no Período</p>
                <p className="text-5xl font-black mt-4">R$ {totalFilteredReport.toLocaleString('pt-BR')}</p>
                <div className="mt-8"><span className="px-3 py-1 bg-white/20 rounded-lg text-[10px] font-black uppercase">{filteredReceiptsForReport.length} Lançamentos</span></div>
              </div>
              <div className="lg:col-span-2 bg-white p-10 rounded-[48px] border border-slate-200 shadow-sm overflow-y-auto max-h-[350px]">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2"><History size={16}/> Histórico Filtrado</h3>
                <div className="space-y-3">
                  {filteredReceiptsForReport.map((r, i) => (
                    <div key={i} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl group hover:bg-emerald-50 transition-colors">
                      <div>
                        <p className="font-black text-slate-700">{products.find(p => p.id === r.productId)?.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">{suppliers.find(s => s.id === r.supplierId)?.name} • {new Date(r.date).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-emerald-600">R$ {r.totalValue.toLocaleString('pt-BR')}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">{r.quantity} {products.find(p => p.id === r.productId)?.unit}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {view === 'receipts' && (
          <div className="space-y-12 animate-in slide-in-from-bottom-6 duration-700 pb-20">
            <header><h2 className="text-4xl font-black text-slate-900 tracking-tight">Lançar Nova Mercadoria</h2></header>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-7 space-y-10">
                <section className="bg-white p-10 rounded-[48px] border border-slate-200 shadow-xl space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="md:col-span-2 space-y-3">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Fornecedor</label>
                      <select className="w-full p-5 bg-slate-50 border-2 border-transparent rounded-[28px] font-bold text-slate-700 outline-none focus:border-indigo-500 transition-all" value={draftInvoiceHeader.supplierId} onChange={e => setDraftInvoiceHeader({...draftInvoiceHeader, supplierId: e.target.value})}>
                        <option value="">Selecione...</option>
                        {suppliers.sort((a,b) => a.name.localeCompare(b.name)).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Nº Nota</label>
                      <input className="w-full p-5 bg-slate-50 border-2 border-transparent rounded-[28px] font-black" value={draftInvoiceHeader.invoiceNumber} onChange={e => setDraftInvoiceHeader({...draftInvoiceHeader, invoiceNumber: e.target.value})} />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Data</label>
                      <input type="date" className="w-full p-5 bg-slate-50 border-2 border-transparent rounded-[28px] font-black" value={draftInvoiceHeader.date} onChange={e => setDraftInvoiceHeader({...draftInvoiceHeader, date: e.target.value})} />
                    </div>
                  </div>
                </section>
                <section className="bg-white p-10 rounded-[48px] border border-slate-200 shadow-xl space-y-8">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3 relative">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Produto</label>
                        <input className="w-full p-5 pl-6 bg-slate-50 border-2 border-transparent rounded-[28px] font-black outline-none focus:border-emerald-500" placeholder="Buscar no catálogo..." value={currentProductSearch} onFocus={() => setIsProductListOpen(true)} onChange={e => { setCurrentProductSearch(e.target.value); setIsProductListOpen(true); }} />
                        {isProductListOpen && (
                          <div className="absolute top-full left-0 w-full mt-2 bg-white border rounded-[28px] shadow-2xl z-[100] max-h-60 overflow-y-auto">
                            {products.filter(p => p.name.toLowerCase().includes(currentProductSearch.toLowerCase())).slice(0, 20).map(p => (
                              <button key={p.id} className="w-full p-5 text-left hover:bg-emerald-50 border-b flex justify-between" onClick={() => { setCurrentItemForm({...currentItemForm, productId: p.id}); setCurrentProductSearch(p.name); setIsProductListOpen(false); }}>
                                <span className="font-bold">{p.name}</span>
                                <span className="text-xs text-slate-400 uppercase">{p.unit}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <input type="number" placeholder="Valor Unit." className="w-full p-5 bg-emerald-50/50 rounded-[28px] font-black text-center outline-none" value={currentItemForm.unitPrice} onChange={e => setCurrentItemForm({...currentItemForm, unitPrice: e.target.value})} />
                        <input type="number" placeholder="Qtd" className="w-full p-5 bg-slate-50 rounded-[28px] font-black text-center outline-none" value={currentItemForm.quantity} onChange={e => setCurrentItemForm({...currentItemForm, quantity: e.target.value})} />
                      </div>
                   </div>
                   <button onClick={() => {
                     if (!currentItemForm.productId || !currentItemForm.quantity || !currentItemForm.unitPrice) return;
                     setDraftItems(prev => [{ productId: currentItemForm.productId, quantity: parseFloat(currentItemForm.quantity), unitPrice: parseFloat(currentItemForm.unitPrice) }, ...prev]);
                     setCurrentItemForm({ productId: '', quantity: '', unitPrice: '' });
                     setCurrentProductSearch('');
                   }} className="w-full py-5 bg-emerald-600 text-white rounded-[28px] font-black uppercase tracking-widest shadow-lg hover:bg-emerald-700 transition-all">Adicionar Item</button>
                </section>
              </div>
              <div className="lg:col-span-5 space-y-10">
                <section className="bg-slate-900 p-10 rounded-[48px] shadow-2xl text-white">
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Total Acumulado</p>
                  <p className="text-6xl font-black text-emerald-400 mt-2">R$ {draftItems.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0).toLocaleString('pt-BR')}</p>
                  {draftItems.length > 0 && <button onClick={() => {
                    const newReceipts: Receipt[] = draftItems.map(item => ({ id: Math.random().toString(), ...draftInvoiceHeader, productId: item.productId, quantity: item.quantity, unitPrice: item.unitPrice, totalValue: item.quantity * item.unitPrice }));
                    setReceipts(prev => [...newReceipts, ...prev]);
                    setDraftItems([]);
                    alert("Nota gravada com sucesso!");
                  }} className="w-full mt-10 py-6 bg-white text-slate-900 rounded-[32px] font-black uppercase shadow-xl hover:bg-emerald-50">Finalizar Nota</button>}
                </section>
                <section className="bg-white rounded-[48px] border border-slate-200 shadow-xl p-8 max-h-[400px] overflow-y-auto space-y-4">
                   {draftItems.map((item, i) => (
                     <div key={i} className="flex justify-between items-center p-4 bg-slate-50 rounded-[24px]">
                       <div><p className="font-bold">{products.find(p => p.id === item.productId)?.name}</p><p className="text-xs text-slate-400">{item.quantity} x R$ {item.unitPrice}</p></div>
                       <button onClick={() => setDraftItems(prev => prev.filter((_, idx) => idx !== i))} className="text-red-400"><Trash2 size={16}/></button>
                     </div>
                   ))}
                </section>
              </div>
            </div>
          </div>
        )}

        {/* MANTENDO AS OUTRAS TELAS SIMPLIFICADAS PARA ESPAÇO */}
        {view === 'notas_lancadas' && (
           <div className="space-y-10 animate-in fade-in duration-500">
             <header className="flex justify-between items-center"><h2 className="text-3xl font-black text-slate-800 tracking-tight">Histórico de Notas</h2></header>
             <div className="bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b text-[10px] font-black uppercase text-slate-400">
                    <tr><th className="p-8">Data</th><th className="p-8">Fornecedor</th><th className="p-8 text-right">Total</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {receipts.slice(0, 50).map(r => (
                      <tr key={r.id} className="hover:bg-slate-50">
                        <td className="p-8 font-bold">{new Date(r.date).toLocaleDateString()}</td>
                        <td className="p-8 font-black text-slate-700">{suppliers.find(s => s.id === r.supplierId)?.name}</td>
                        <td className="p-8 text-right font-black text-emerald-600">R$ {r.totalValue.toLocaleString('pt-BR')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
           </div>
        )}
      </main>
    </div>
  );
};

export default App;
