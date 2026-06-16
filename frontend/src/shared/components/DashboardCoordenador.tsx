import React, { useState } from 'react';
import { User, Event, Workshop, Enrollment, SystemLog, HomeBanner, UserRole, FinancialExpense, ExpenseCategory, FinancialSettings } from '../../types';
import { ShieldCheck, BarChart4, ClipboardList, CheckCircle2, XCircle, Sliders, Settings, Users, LogIn, ChevronRight, Play, ToggleLeft, ToggleRight, Sparkles, Activity, FileSpreadsheet, TrendingUp, TrendingDown, DollarSign, FileText, Download, Trash2, Plus, Calculator, AlertCircle, RefreshCw, Edit2, Calendar, MapPin, BookOpen } from 'lucide-react';
import { DB } from '../utils/db';
import { THEME } from '../styles/designSystem';

interface DashboardCoordenadorProps {
  currentUser: User;
  events: Event[];
  workshops: Workshop[];
  enrollments: Enrollment[];
  logs: SystemLog[];
  banners: HomeBanner[];
  systemUsers: User[];
  financialSettings: FinancialSettings;
  onDataChanged: () => void;
}

export default function DashboardCoordenador({
  currentUser,
  events,
  workshops,
  enrollments,
  logs,
  banners,
  systemUsers,
  financialSettings,
  onDataChanged
}: DashboardCoordenadorProps) {
  const [activeSubTab, setActiveSubTab] = useState<'METRICS' | 'APPROVALS' | 'BANNERS' | 'AUDIT_LOGS' | 'USERS' | 'FINANCEIRO' | 'INSCRITOS' | 'EVENTOS'>('METRICS');

  const [eventListFilter, setEventListFilter] = useState<'TODOS' | 'ANALISE' | 'PUBLICADO' | 'ENCERRADO'>('TODOS');
  const [isEditingEventId, setIsEditingEventId] = useState<string | null>(null);

  const [editEventName, setEditEventName] = useState('');
  const [editEventDesc, setEditEventDesc] = useState('');
  const [editEventBanner, setEditEventBanner] = useState('');
  const [editEventLocation, setEditEventLocation] = useState('');
  const [editEventStartDate, setEditEventStartDate] = useState('');
  const [editEventEndDate, setEditEventEndDate] = useState('');
  const [editEventStartTime, setEditEventStartTime] = useState('');
  const [editEventEndTime, setEditEventEndTime] = useState('');
  const [editEventCategory, setEditEventCategory] = useState('PALESTRA');
  const [editEventMaxPart, setEditEventMaxPart] = useState(100);
  const [editEventPrice, setEditEventPrice] = useState(0);

  const [showAddWsInCoordenador, setShowAddWsInCoordenador] = useState<string | null>(null);
  const [coorWsName, setCoorWsName] = useState('');
  const [coorWsDesc, setCoorWsDesc] = useState('');
  const [coorWsInstructor, setCoorWsInstructor] = useState('');
  const [coorWsDate, setCoorWsDate] = useState('2026-10-15');
  const [coorWsTime, setCoorWsTime] = useState('14:00');
  const [coorWsMaxVagas, setCoorWsMaxVagas] = useState(30);
  const [coorWsPrice, setCoorWsPrice] = useState(0);
  const [coorWsHours, setCoorWsHours] = useState(4);

  const [editingWorkshopId, setEditingWorkshopId] = useState<string | null>(null);
  const [editWsName, setEditWsName] = useState('');
  const [editWsDesc, setEditWsDesc] = useState('');
  const [editWsInstructor, setEditWsInstructor] = useState('');
  const [editWsDate, setEditWsDate] = useState('2026-10-15');
  const [editWsTime, setEditWsTime] = useState('14:00');
  const [editWsMaxVagas, setEditWsMaxVagas] = useState(30);
  const [editWsPrice, setEditWsPrice] = useState(0);
  const [editWsHours, setEditWsHours] = useState(4);

  const handleStartEditWorkshop = (ws: Workshop) => {
    setEditingWorkshopId(ws.id);
    setEditWsName(ws.name);
    setEditWsDesc(ws.description);
    setEditWsInstructor(ws.instructor);
    setEditWsDate(ws.date);
    setEditWsTime(ws.time);
    setEditWsMaxVagas(ws.maxParticipants);
    setEditWsPrice(ws.price);
    setEditWsHours(ws.hours || 4);
  };

  const [selectedEventIdForInscritos, setSelectedEventIdForInscritos] = useState<string>(events.length > 0 ? events[0].id : '');
  const [selectedWorkshopIdForInscritos, setSelectedWorkshopIdForInscritos] = useState<string>('GERAL');

  
  const [newBannerTitle, setNewBannerTitle] = useState('');
  const [newBannerSubtitle, setNewBannerSubtitle] = useState('');
  const [newBannerImage, setNewBannerImage] = useState('https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200');
  const [newBannerLinkedEventId, setNewBannerLinkedEventId] = useState('');

  
  const [expenseEventId, setExpenseEventId] = useState(events.length > 0 ? events[0].id : '');
  const [expenseDescription, setExpenseDescription] = useState('');
  const [expenseCategory, setExpenseCategory] = useState<ExpenseCategory>('INFRAESTRUTURA');
  const [expenseValue, setExpenseValue] = useState<number | ''>('');
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0]);
  const [expenseType, setExpenseType] = useState<'DESPESA' | 'ENTRADA'>('DESPESA');
  const [selectedEventFilter, setSelectedEventFilter] = useState<string>('ALL');
  
  
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportEventId, setReportEventId] = useState<string>('ALL');
  const [pixKeyInput, setPixKeyInput] = useState(financialSettings.pixKey || '');
  const [pixReceiverInput, setPixReceiverInput] = useState(financialSettings.pixReceiverName || 'Campo Real Eventos');

  React.useEffect(() => {
    setPixKeyInput(financialSettings.pixKey || '');
    setPixReceiverInput(financialSettings.pixReceiverName || 'Campo Real Eventos');
  }, [financialSettings]);

  const pendingEvents = events.filter(e => e.status === 'ANALISE');

  const totalStudents = systemUsers.filter(u => u.role === 'ALUNO').length;
  const totalProfessors = systemUsers.filter(u => u.role === 'PROFESSOR').length;
  const totalApprovedEventsCount = events.filter(e => e.status === 'PUBLICADO').length;

  const totalSimulatorEarnings = enrollments
    .filter(en => en.status === 'APROVADO')
    .reduce((sum, en) => sum + en.totalValue, 0);

  const handleApproveReject = (eventId: string, approve: boolean) => {
    try {
      DB.approveEvent(eventId, approve, currentUser);
      alert(approve ? 'Evento publicado com sucesso!' : 'Evento reprovado e removido do fluxo.');
      onDataChanged();
    } catch (err: any) {
      alert(err.message || 'Erro ao modificar status do evento.');
    }
  };

  const handleEditEventClickInCoordenador = (ev: Event) => {
    setIsEditingEventId(ev.id);
    setEditEventName(ev.name);
    setEditEventDesc(ev.description);
    setEditEventBanner(ev.banner);
    setEditEventLocation(ev.location);
    setEditEventStartDate(ev.startDate);
    setEditEventEndDate(ev.endDate);
    setEditEventStartTime(ev.startTime);
    setEditEventEndTime(ev.endTime);
    setEditEventCategory(ev.category);
    setEditEventMaxPart(ev.maxParticipants);
    setEditEventPrice(ev.price);
  };

  const handleEditEventSubmitInCoordenador = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditingEventId) return;
    try {
      DB.updateEvent(isEditingEventId, {
        name: editEventName,
        description: editEventDesc,
        banner: editEventBanner,
        location: editEventLocation,
        startDate: editEventStartDate,
        endDate: editEventEndDate,
        startTime: editEventStartTime,
        endTime: editEventEndTime,
        category: editEventCategory,
        maxParticipants: Number(editEventMaxPart),
        price: Number(editEventPrice)
      }, currentUser);
      setIsEditingEventId(null);
      alert('Evento editado com sucesso!');
      onDataChanged();
    } catch (err: any) {
      alert(err.message || 'Erro ao editar o evento.');
    }
  };

  const handleAddWorkshopSubmitInCoordenador = (e: React.FormEvent, eventId: string) => {
    e.preventDefault();
    try {
      DB.saveWorkshop({
        eventId,
        name: coorWsName,
        description: coorWsDesc,
        instructor: coorWsInstructor,
        date: coorWsDate,
        time: coorWsTime,
        maxParticipants: Number(coorWsMaxVagas),
        price: Number(coorWsPrice),
        hours: Number(coorWsHours)
      }, currentUser);

      setCoorWsName('');
      setCoorWsDesc('');
      setCoorWsInstructor('');
      setCoorWsPrice(0);
      setCoorWsHours(4);
      setShowAddWsInCoordenador(null);
      alert('Workshop criado e vinculado com sucesso!');
      onDataChanged();
    } catch (err: any) {
      alert(err.message || 'Erro ao adicionar workshop.');
    }
  };

  const handleAddBannerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      DB.saveBanner({
        imageUrl: newBannerImage,
        title: newBannerTitle,
        subtitle: newBannerSubtitle,
        linkToEventId: newBannerLinkedEventId || undefined,
        isActive: true
      }, currentUser);

      setNewBannerTitle('');
      setNewBannerSubtitle('');
      setNewBannerLinkedEventId('');
      alert('Novo Banner cadastrado com sucesso!');
      onDataChanged();
    } catch (err: any) {
      alert(err.message || 'Ocorreu um erro.');
    }
  };

  const handleToggleBannerState = (bannerId: string) => {
    try {
      DB.toggleBanner(bannerId, currentUser);
      onDataChanged();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const formatTimeBR = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()} às ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}h`;
    } catch {
      return isoStr;
    }
  };

  const allExpenses = DB.getExpenses();

  const filteredLedgerExpenses = selectedEventFilter === 'ALL'
    ? allExpenses
    : allExpenses.filter(ex => ex.eventId === selectedEventFilter);

  
  const getEventEnrollmentsRevenue = (eventId: string) => {
    return enrollments
      .filter(en => en.eventId === eventId && en.status === 'APROVADO')
      .reduce((sum, en) => sum + en.totalValue, 0);
  };

  const getEventExtraRevenues = (eventId: string) => {
    return allExpenses
      .filter(ex => ex.eventId === eventId && ex.type === 'ENTRADA')
      .reduce((sum, ex) => sum + ex.value, 0);
  };

  const getEventRevenue = (eventId: string) => {
    return getEventEnrollmentsRevenue(eventId) + getEventExtraRevenues(eventId);
  };

  const getEventExpenses = (eventId: string) => {
    return allExpenses
      .filter(ex => ex.eventId === eventId && ex.type === 'DESPESA')
      .reduce((sum, ex) => sum + ex.value, 0);
  };

  const getEventEnrollmentsCount = (eventId: string) => {
    return enrollments.filter(en => en.eventId === eventId && en.status === 'APROVADO').length;
  };

  const totalEnrollmentRevenue = enrollments
    .filter(en => en.status === 'APROVADO')
    .reduce((sum, en) => sum + en.totalValue, 0);

  const totalFinancialRevenue = totalEnrollmentRevenue + allExpenses
    .filter(ex => ex.type === 'ENTRADA')
    .reduce((sum, ex) => sum + ex.value, 0);

  const totalFinancialExpenses = allExpenses
    .filter(ex => ex.type === 'DESPESA')
    .reduce((sum, ex) => sum + ex.value, 0);

  const netFinancialProfit = totalFinancialRevenue - totalFinancialExpenses;

  
  const handleAddExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseEventId) {
      alert('Selecione um evento válido.');
      return;
    }
    const val = Number(expenseValue);
    if (!expenseValue || isNaN(val) || val <= 0) {
      alert('Digite um valor numérico de transação válido.');
      return;
    }
    const evt = events.find(ev => ev.id === expenseEventId);
    if (!evt) {
      alert('Evento não encontrado.');
      return;
    }

    try {
      DB.saveExpense({
        eventId: expenseEventId,
        eventName: evt.name,
        description: expenseDescription,
        category: expenseCategory,
        value: val,
        type: expenseType,
        date: expenseDate,
      }, currentUser);

      setExpenseDescription('');
      setExpenseValue('');
      alert(expenseType === 'ENTRADA' ? 'Entrada / Patrocínio registrado com sucesso!' : 'Gasto registrado com sucesso de forma consolidada!');
      onDataChanged();
    } catch (err: any) {
      alert(err.message || 'Erro ao registrar.');
    }
  };

  const handleDeleteExpenseClick = (id: string) => {
    const transaction = allExpenses.find(x => x.id === id);
    const label = transaction?.type === 'ENTRADA' ? 'remover esta entrada' : 'remover esta despesa';
    if (!confirm(`Deseja realmente ${label}? O balanço financeiro do evento será recalculado.`)) return;
    try {
      DB.deleteExpense(id, currentUser);
      onDataChanged();
    } catch (err: any) {
      alert(err.message || 'Erro ao deletar.');
    }
  };

  const getCategoryColor = (cat: ExpenseCategory) => {
    switch(cat) {
      case 'INFRAESTRUTURA': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'REFEICAO': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'MARKETING': return 'bg-pink-50 text-pink-700 border-pink-200';
      case 'PALESTRANTE': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'SERVICOS': return 'bg-green-50 text-green-700 border-green-200';
      case 'PATROCINIO': return 'bg-amber-50 text-amber-700 border-amber-250';
      case 'APORTE': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const handleSavePixSettings = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      DB.saveFinancialSettings({
        pixKey: pixKeyInput,
        pixReceiverName: pixReceiverInput
      }, currentUser);
      alert('Configuração PIX salva com sucesso!');
      onDataChanged();
    } catch (err: any) {
      alert(err.message || 'Erro ao salvar configuração PIX.');
    }
  };

  const handleExportCSV = () => {
    try {
      let csvContent = "";
      
      csvContent += "=== BALANCO GERAL POR EVENTO ===\n";
      csvContent += "Evento,Categoria,Inscricoes Aprovadas,Receita Bruta (R$),Total Despesas (R$),Saldo Liquido (R$),Status\n";
      
      events.forEach(evt => {
        const rev = getEventRevenue(evt.id);
        const exp = getEventExpenses(evt.id);
        const bal = rev - exp;
        const approvedCount = getEventEnrollmentsCount(evt.id);
        
        csvContent += `"${evt.name.replace(/"/g, '""')}","${evt.category}",${approvedCount},${rev.toFixed(2)},${exp.toFixed(2)},${bal.toFixed(2)},"${bal >= 0 ? 'SUPERAVIT' : 'DEFICIT'}"\n`;
      });
      
      csvContent += "\n\n=== LIVRO DE LANCAMENTOS DETALHADO (RAZAO) ===\n";
      csvContent += "ID Lancamento,Evento Relacionado,Descricao do Lancamento,Tipo,Categoria do Gasto,Valor (R$),Data do Lancamento,Data Registro\n";
      
      allExpenses.forEach(exp => {
        csvContent += `"${exp.id}","${exp.eventName.replace(/"/g, '""')}","${exp.description.replace(/"/g, '""')}","${exp.type || 'DESPESA'}","${exp.category}",${exp.value.toFixed(2)},"${exp.date}","${exp.createdAt}"\n`;
      });
      
      const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `demonstrativo_financeiro_camporeal_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err: any) {
      alert('Erro ao exportar planilha CSV: ' + err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 mt-10 py-2 select-none selection:bg-blue-600 selection:text-white pb-12">
      
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-200 pb-5 mb-8 gap-4">
        <div>
          <span className="text-xs text-blue-600 font-extrabold uppercase tracking-widest leading-none">VISTA DE ADMINISTRAÇÃO TOTAL</span>
        </div>

        
        <div className="flex bg-gray-100 border border-gray-200 p-1 rounded-xl text-xs font-bold w-full md:w-auto flex-wrap gap-1">
          <button 
            onClick={() => setActiveSubTab('METRICS')}
            className={`px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${activeSubTab === 'METRICS' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Métricas
          </button>
          <button 
            onClick={() => setActiveSubTab('APPROVALS')}
            className={`px-3 py-1.5 rounded-lg cursor-pointer transition-colors relative ${activeSubTab === 'APPROVALS' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Aprovações {pendingEvents.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-yellow-500 text-purple-950 font-black flex items-center justify-center rounded-full text-[9px] {pendingEvents.length}">{pendingEvents.length}</span>
            )}
          </button>
          <button 
            onClick={() => setActiveSubTab('BANNERS')}
            className={`px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${activeSubTab === 'BANNERS' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Banners Home
          </button>
          <button 
            onClick={() => setActiveSubTab('USERS')}
            className={`px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${activeSubTab === 'USERS' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Usuários
          </button>
          <button 
            onClick={() => setActiveSubTab('INSCRITOS')}
            className={`px-3 py-1.5 rounded-lg cursor-pointer transition-colors relative ${activeSubTab === 'INSCRITOS' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Inscritos & Pagamentos
            {enrollments.filter(e => e.status === 'PENDENTE').length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-orange-505 bg-red-500 font-extrabold text-white flex items-center justify-center rounded-full text-[9px] animate-pulse">
                {enrollments.filter(e => e.status === 'PENDENTE').length}
              </span>
            )}
          </button>
          <button 
            onClick={() => setActiveSubTab('EVENTOS')}
            className={`px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${activeSubTab === 'EVENTOS' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Gerenciar Eventos
          </button>
          <button 
            onClick={() => setActiveSubTab('FINANCEIRO')}
            className={`px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${activeSubTab === 'FINANCEIRO' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Gestão Financeira 📊
          </button>
          <button 
            onClick={() => setActiveSubTab('AUDIT_LOGS')}
            className={`px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${activeSubTab === 'AUDIT_LOGS' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Histórico Audit
          </button>
        </div>
      </div>

      
      {activeSubTab === 'METRICS' && (
        <div className="flex flex-col gap-8 animate-fade-in text-gray-805">
          
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold font-mono">Discente Alunos</span>
                <span className="text-xl font-black text-gray-900">{totalStudents}</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold font-mono">Docente Profes</span>
                <span className="text-xl font-black text-gray-900">{totalProfessors}</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-yellow-50 text-yellow-600 flex items-center justify-center font-bold">
                <BarChart4 className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold font-mono">Eventos Ativos</span>
                <span className="text-xl font-black text-gray-900">{totalApprovedEventsCount}</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center font-bold">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold font-mono">Receita Ingressos</span>
                <span className="text-xl font-black text-green-600 font-mono">R$ {totalSimulatorEarnings.toFixed(2)}</span>
              </div>
            </div>

          </div>

          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            
            <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-5 flex flex-col justify-between h-[300px]">
              <div>
                <h4 className="text-gray-800 font-bold text-xs uppercase tracking-wider mb-1">MÉTRICAS: Eventos por Categoria</h4>
                <p className="text-[10px] text-gray-400">Distribuição quantitativa de grade curricular cadastrada.</p>
              </div>

              
              <div className="flex-1 mt-4 relative flex items-end justify-between px-4 pb-4 gap-2">
                
                
                <div className="flex flex-col items-center flex-1 gap-2 group cursor-pointer">
                  <div className="text-[10px] font-mono font-bold text-blue-600 group-hover:block hidden absolute -top-1 animate-in fade-in transition-all">
                    {events.filter(e => e.category === 'PALESTRA').length} Eventos
                  </div>
                  <div 
                    style={{ height: `${(events.filter(e => e.category === 'PALESTRA').length / Math.max(events.length, 1)) * 140 + 10}px` }}
                    className="w-full max-w-[44px] bg-gradient-to-t from-blue-700/80 to-blue-600 rounded-t-lg group-hover:brightness-110 shadow shadow-blue-500/20"
                  ></div>
                  <span className="text-[9px] text-gray-500 uppercase font-bold truncate tracking-tighter">Palestras</span>
                </div>

                
                <div className="flex flex-col items-center flex-1 gap-2 group cursor-pointer">
                  <div className="text-[10px] font-mono font-bold text-sky-600 group-hover:block hidden absolute -top-1 animate-in fade-in transition-all">
                    {events.filter(e => e.category === 'SEMANA ACADÊMICA').length} Eventos
                  </div>
                  <div 
                    style={{ height: `${(events.filter(e => e.category === 'SEMANA ACADÊMICA').length / Math.max(events.length, 1)) * 140 + 10}px` }}
                    className="w-full max-w-[44px] bg-gradient-to-t from-sky-600/80 to-sky-500 rounded-t-lg group-hover:brightness-110 shadow shadow-sky-500/20"
                  ></div>
                  <span className="text-[9px] text-gray-500 uppercase font-bold truncate tracking-tighter">S. Acadêm</span>
                </div>

                
                <div className="flex flex-col items-center flex-1 gap-2 group cursor-pointer">
                  <div className="text-[10px] font-mono font-bold text-yellow-500 group-hover:block hidden absolute -top-1 animate-in fade-in transition-all">
                    {events.filter(e => e.category === 'WORKSHOP').length} Eventos
                  </div>
                  <div 
                    style={{ height: `${(events.filter(e => e.category === 'WORKSHOP').length / Math.max(events.length, 1)) * 140 + 10}px` }}
                    className="w-full max-w-[44px] bg-gradient-to-t from-yellow-500/80 to-yellow-500 rounded-t-lg group-hover:brightness-110 shadow shadow-yellow-500/20"
                  ></div>
                  <span className="text-[9px] text-gray-500 uppercase font-bold truncate tracking-tighter">Workshops</span>
                </div>

                
                <div className="flex flex-col items-center flex-1 gap-2 group cursor-pointer">
                  <div className="text-[10px] font-mono font-bold text-gray-600 group-hover:block hidden absolute -top-1 animate-in fade-in transition-all">
                    {events.filter(e => e.category === 'CONGRESSO').length} Eventos
                  </div>
                  <div 
                    style={{ height: `${(events.filter(e => e.category === 'CONGRESSO').length / Math.max(events.length, 1)) * 140 + 10}px` }}
                    className="w-full max-w-[44px] bg-gradient-to-t from-gray-500/80 to-gray-400 rounded-t-lg group-hover:brightness-110 shadow shadow-gray-400/20"
                  ></div>
                  <span className="text-[9px] text-gray-500 uppercase font-bold truncate tracking-tighter">Congresso</span>
                </div>

              </div>

            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-5 flex flex-col justify-between h-[300px]">
              <div>
                <h4 className="text-gray-800 font-bold text-xs uppercase tracking-wider mb-1">MÉTRICAS: Taxa de Inscrições Reais</h4>
                <p className="text-[10px] text-gray-400">Razão de transações simuladas aprovadas contra pendentes.</p>
              </div>

              <div className="flex-1 flex items-center justify-center p-4">
                
                <div className="relative w-36 h-36 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-gray-100"></div>
                  
                  
                  <svg className="w-full h-full transform -rotate-90">
                    <circle 
                      cx="72" 
                      cy="72" 
                      r="66" 
                      stroke="#2563EB" 
                      strokeWidth="6" 
                      fill="transparent" 
                      strokeDasharray="414"
                      strokeDashoffset={414 - (414 * (enrollments.filter(e => e.status === 'APROVADO').length / Math.max(enrollments.length, 1)))} 
                      strokeLinecap="round"
                    />
                  </svg>

                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-2xl font-black text-gray-900 font-mono">
                      {Math.round((enrollments.filter(e => e.status === 'APROVADO').length / Math.max(enrollments.length, 1)) * 100)}%
                    </span>
                    <span className="text-[8px] text-gray-400 uppercase tracking-wider font-extrabold mt-0.5">Aprovadas</span>
                  </div>
                </div>

              </div>
              
              <div className="flex items-center justify-around text-[10px] font-mono text-gray-500">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-blue-600"></span>
                  <span>{enrollments.filter(e => e.status === 'APROVADO').length} Aprovadas</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-gray-200"></span>
                  <span>{enrollments.filter(e => e.status === 'PENDENTE').length} Pendentes</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      
      {activeSubTab === 'APPROVALS' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs animate-fade-in flex flex-col gap-4">
          <div>
            <h3 className="text-gray-800 font-bold text-sm uppercase tracking-wider mb-1">Aprovações Pendentes</h3>
            <p className="text-xs text-gray-500">Analise os quesitos pedagógicos dos eventos cadastrados por professores antes da publicação na homepage pública.</p>
          </div>

          {pendingEvents.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 border border-gray-150 rounded-xl">
              <CheckCircle2 className="w-10 h-10 text-green-600 mx-auto mb-3" />
              <h4 className="text-gray-800 font-bold text-sm">Nenhum evento em análise no momento</h4>
              <p className="text-xs text-gray-400 mt-1">Todos os eventos publicados estão de acordo com as diretrizes do colegiado de curso.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {pendingEvents.map((pe) => (
                <div 
                  key={pe.id}
                  className="bg-white border border-gray-250 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all hover:border-gray-350"
                >
                  
                  
                  <div className="flex gap-4 items-start flex-1 min-w-0">
                    <img 
                      src={pe.banner} 
                      alt={pe.name} 
                                            className="w-16 h-16 rounded-xl object-cover shrink-0 border border-gray-200"
                    />
                    <div className="flex flex-col gap-1 min-w-0">
                      <span className="text-[9px] text-blue-600 font-extrabold uppercase bg-blue-50 px-2 py-0.5 rounded-full w-fit">{pe.category}</span>
                      <h4 className="text-gray-800 font-bold text-xs truncate leading-tight mt-0.5">{pe.name}</h4>
                      <p className="text-[10px] text-gray-500 leading-normal line-clamp-2 mt-0.5">{pe.description}</p>
                      <div className="flex items-center gap-x-3 text-[10px] text-blue-600 font-semibold mt-1">
                        <span>Proponente: {pe.creatorName}</span>
                        <span>•</span>
                        <span>Local: {pe.location}</span>
                        <span>•</span>
                        <span>Limite: {pe.maxParticipants} vagas</span>
                      </div>
                    </div>
                  </div>

                  
                  <div className="flex md:flex-col gap-2 shrink-0 max-md:w-full">
                    <button 
                      onClick={() => handleApproveReject(pe.id, true)}
                      className="flex-1 md:flex-none bg-green-600 hover:bg-green-700 text-white font-bold uppercase text-[9px] tracking-wider px-4 py-2.5 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>Aprovar evento</span>
                    </button>
                    <button 
                      onClick={() => handleApproveReject(pe.id, false)}
                      className="flex-1 md:flex-none border border-red-200 hover:bg-red-50 text-red-650 font-bold uppercase text-[9px] tracking-wider px-4 py-2.5 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <XCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>Reprovar</span>
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>
      )}

      
      {activeSubTab === 'BANNERS' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
          
          
          <div className="lg:col-span-7 bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-4 shadow-xs">
            <div>
              <h3 className="text-gray-800 font-bold text-sm uppercase tracking-wider mb-1">Gere Banners Ativos</h3>
              <p className="text-xs text-gray-500">Ative ou remova slides visualizados no carrossel de cabeçalho da plataforma.</p>
            </div>

            <div className="flex flex-col gap-3">
              {banners.map((b) => (
                <div 
                  key={b.id}
                  className="bg-white border border-gray-200 p-3.5 rounded-xl flex items-center justify-between gap-4 select-none hover:border-gray-300 transition-colors"
                >
                  <div className="flex gap-3 items-center truncate">
                    <img 
                      src={b.imageUrl} 
                      alt={b.title} 
                      referrerPolicy="no-referrer"
                      className="w-14 h-10 rounded-lg object-cover border border-gray-200"
                    />
                    <div className="flex flex-col truncate">
                      <span className="text-gray-800 font-bold text-xs truncate leading-tight">{b.title}</span>
                      <span className="text-[9px] text-gray-500 truncate mt-0.5">{b.subtitle}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleToggleBannerState(b.id)}
                    className="text-gray-400 hover:text-blue-600 transition-colors cursor-pointer shrink-0"
                  >
                    {b.isActive ? (
                      <ToggleRight className="w-8 h-8 text-blue-600" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-gray-400" />
                    )}
                  </button>

                </div>
              ))}
            </div>

          </div>

          
          <form onSubmit={handleAddBannerSubmit} className="lg:col-span-5 bg-white border border-gray-200 shadow-xs rounded-xl p-5 flex flex-col gap-4">
            <div>
              <h3 className="text-gray-800 font-bold text-sm uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Novo Banner Promocional</span>
              </h3>
            </div>

            <div className="flex flex-col gap-3.5 text-xs">
              <div>
                <label className="text-[10px] text-gray-500 uppercase tracking-widest block mb-1">Fundo de Capa (URL)</label>
                <input 
                  type="url"
                  value={newBannerImage}
                  onChange={e => setNewBannerImage(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-xs text-gray-800 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] text-gray-500 uppercase tracking-widest block mb-1">Título do Banner</label>
                <input 
                  type="text"
                  placeholder="EX: OS MELHORES EVENTOS COMEÇAM AQUI"
                  value={newBannerTitle}
                  onChange={e => setNewBannerTitle(e.target.value.toUpperCase())}
                  className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-xs text-gray-800 placeholder-gray-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] text-gray-500 uppercase tracking-widest block mb-1">Subtítulo e Resumo</label>
                <input 
                  type="text"
                  placeholder="EX: Saiba o que está acontecendo no seu curso universitário."
                  value={newBannerSubtitle}
                  onChange={e => setNewBannerSubtitle(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-xs text-gray-800 placeholder-gray-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] text-gray-550 block mb-1">Ligar a Evento Específico (Opcional)</label>
                <select
                  value={newBannerLinkedEventId}
                  onChange={e => setNewBannerLinkedEventId(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-xs text-gray-800 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
                >
                  <option value="">Nenhum — Apenas Informativo</option>
                  {events.map(ev => (
                    <option key={ev.id} value={ev.id}>{ev.name}</option>
                  ))}
                </select>
              </div>

              <button 
                type="submit"
                className="w-full bg-blue-600 text-white hover:bg-blue-700 font-bold uppercase py-3 rounded-lg transition-all cursor-pointer text-center shadow-xs"
              >
                Cadastrar Banner Slide
              </button>
            </div>

          </form>

        </div>
      )}

      
      {activeSubTab === 'USERS' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-4 animate-fade-in shadow-xs">
          <div>
            <h3 className="text-gray-800 font-bold text-sm uppercase tracking-wider mb-1">Gerência de Usuários Cadastrados</h3>
            <p className="text-xs text-gray-500">Diretório completo de alunos, professores e colegiados ativos no sistema oficial Campo Real Eventos.</p>
          </div>

          <div className="border border-gray-200 rounded-xl overflow-hidden bg-white mt-2">
            
            <div className="bg-gray-50 text-[10px] font-extrabold uppercase text-gray-600 p-3 flex border-b border-gray-200 align-middle">
              <div className="flex-1 pl-2">Nome Completo</div>
              <div className="flex-1">E-mail Cadastrado</div>
              <div className="w-40 max-md:hidden">Curso de Colegiado</div>
              <div className="w-32 text-right">Perfil de Cargo</div>
            </div>

            <div className="divide-y divide-gray-150 font-medium">
              {systemUsers.map((su) => (
                <div key={su.id} className="p-3 flex items-center hover:bg-gray-50/50 transition-all text-xs leading-none">
                  
                  <div className="flex-1 flex items-center gap-2 pl-2">
                    <div className="w-6 h-6 rounded-full bg-gray-100 text-blue-600 font-black text-[10px] flex items-center justify-center shrink-0">
                      {su.name.charAt(0)}
                    </div>
                    <span className="font-bold text-gray-800">{su.name} {su.ra && <span className="font-mono text-gray-400 font-normal text-[10px] ml-0.5">({su.ra})</span>}</span>
                  </div>

                  <div className="flex-1 text-gray-500 truncate pr-2 font-mono">
                    {su.email}
                  </div>

                  <div className="w-40 max-md:hidden text-gray-400 truncate mt-0.5">
                    {su.course || 'Administrativo'}
                  </div>

                  <div className="w-32 text-right">
                    <select
                      value={su.role}
                      onChange={(e) => {
                        const newRole = e.target.value as UserRole;
                        if (su.id === currentUser.id && newRole !== currentUser.role) {
                          if (!confirm(`Você está prestes a alterar o seu próprio cargo de ${currentUser.role} para ${newRole}. Tem certeza de que deseja prosseguir?`)) {
                            return;
                          }
                        }
                        try {
                          DB.updateUser(su.id, { role: newRole });
                          alert(`Permissão de "${su.name}" alterada para ${newRole} com sucesso!`);
                          onDataChanged();
                        } catch (err: any) {
                          alert(err.message || 'Erro ao alterar permissão.');
                        }
                      }}
                      className={`text-[10px] font-bold py-1 px-2 rounded-lg border outline-none cursor-pointer text-center font-mono ${
                        su.role === 'COORDENADOR' ? 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100' :
                        su.role === 'ROOT' ? 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100/90' :
                        su.role === 'PROFESSOR' ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' :
                        'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                      }`}
                    >
                      <option value="ALUNO" className="bg-white text-blue-700">ALUNO</option>
                      <option value="PROFESSOR" className="bg-white text-green-700">PROFESSOR</option>
                      <option value="COORDENADOR" className="bg-white text-yellow-700">COORDENADOR</option>
                      <option value="ROOT" className="bg-white text-purple-700 font-bold">ROOT ⚡</option>
                    </select>
                  </div>

                </div>
              ))}
            </div>

          </div>

        </div>
      )}

      
      {activeSubTab === 'INSCRITOS' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-6 animate-fade-in shadow-xs">
          <div>
            <h3 className="text-gray-800 font-bold text-sm uppercase tracking-wider mb-1 flex items-center gap-1.5 leading-none">
              <ClipboardList className="w-4 h-4 text-blue-600" />
              <span>Gerência de Inscritos e Homologação de Pagamentos</span>
            </h3>
            <p className="text-xs text-gray-500 mt-1">Selecione um evento ativo e filtre por workshops para visualizar participantes e aprovar pagamentos pendentes de forma manual.</p>
          </div>

          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-150">
            <div>
              <label className="text-[10px] font-extrabold uppercase text-gray-450 block mb-1">Selecione o Evento Ativo</label>
              <select
                value={selectedEventIdForInscritos}
                onChange={(e) => {
                  setSelectedEventIdForInscritos(e.target.value);
                  setSelectedWorkshopIdForInscritos('GERAL');
                }}
                className="w-full bg-white border border-gray-200 text-xs font-semibold py-2 px-3 rounded-lg outline-none text-gray-800 focus:border-blue-500 cursor-pointer"
              >
                {events.filter(e => e.status !== 'CANCELADO').map(evt => (
                  <option key={evt.id} value={evt.id}>
                    {evt.name} ({evt.status === 'PUBLICADO' ? 'Ativo/Publicado' : evt.status})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-extrabold uppercase text-gray-450 block mb-1">Filtrar por Workshop</label>
              <select
                value={selectedWorkshopIdForInscritos}
                onChange={(e) => setSelectedWorkshopIdForInscritos(e.target.value)}
                className="w-full bg-white border border-gray-200 text-xs font-semibold py-2 px-3 rounded-lg outline-none text-gray-800 focus:border-blue-500 cursor-pointer"
                disabled={!selectedEventIdForInscritos}
              >
                <option value="GERAL">Geral (Todos os Inscritos no Evento)</option>
                {workshops.filter(w => w.eventId === selectedEventIdForInscritos).map(ws => (
                  <option key={ws.id} value={ws.id}>
                    {ws.name} — Instrutor: {ws.instructor} (R$ {ws.price.toFixed(2)})
                  </option>
                ))}
              </select>
            </div>
          </div>

          
          {(() => {
            const currentEvent = events.find(e => e.id === selectedEventIdForInscritos);
            if (!currentEvent) {
              return (
                <div className="text-center py-10 text-xs text-gray-400">
                  Nenhum evento ativo selecionado.
                </div>
              );
            }

            const currentWorkshop = selectedWorkshopIdForInscritos !== 'GERAL' 
              ? workshops.find(w => w.id === selectedWorkshopIdForInscritos) 
              : null;

            const totalEnrollmentForFilter = enrollments.filter(en => {
              if (en.eventId !== selectedEventIdForInscritos) return false;
              if (selectedWorkshopIdForInscritos !== 'GERAL') {
                return en.selectedWorkshops.includes(selectedWorkshopIdForInscritos);
              }
              return true;
            });

            const countTotal = totalEnrollmentForFilter.length;
            const countPending = totalEnrollmentForFilter.filter(en => en.status === 'PENDENTE').length;
            const countApproved = totalEnrollmentForFilter.filter(en => en.status === 'APROVADO').length;
            const limitMax = currentWorkshop ? currentWorkshop.maxParticipants : currentEvent.maxParticipants;

            return (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100 flex flex-col justify-between">
                    <span className="text-[9px] text-blue-800 uppercase tracking-wider font-extrabold font-mono">Filtro Ativo</span>
                    <span className="text-sm font-black text-blue-900 mt-1 truncate">
                      {currentWorkshop ? `WS: ${currentWorkshop.name}` : `Geral: ${currentEvent.name}`}
                    </span>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-gray-200 flex flex-col justify-between">
                    <span className="text-[9px] text-gray-400 uppercase tracking-widest font-semibold font-mono">Inscritos Totais</span>
                    <span className="text-lg font-black text-gray-800 mt-1">{countTotal} / {limitMax}</span>
                  </div>

                  <div className="bg-orange-50/40 p-3 rounded-xl border border-orange-100 flex flex-col justify-between animate-pulse">
                    <span className="text-[9px] text-orange-700 uppercase tracking-widest font-extrabold font-mono flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 text-orange-500" />
                      <span>Pendentes Pagto</span>
                    </span>
                    <span className="text-lg font-black text-orange-700 mt-1">{countPending}</span>
                  </div>

                  <div className="bg-green-50/30 p-3 rounded-xl border border-green-100 flex flex-col justify-between">
                    <span className="text-[9px] text-green-700 uppercase tracking-widest font-extrabold font-mono flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-green-600" />
                      <span>Inscrições Pagas</span>
                    </span>
                    <span className="text-lg font-black text-green-700 mt-1">{countApproved}</span>
                  </div>
                </div>

                
                <div className="border border-gray-200 rounded-xl overflow-hidden bg-white mt-1">
                  <div className="bg-gray-50 text-[10px] font-extrabold uppercase text-gray-600 p-3.5 flex border-b border-gray-200">
                    <div className="flex-1 pl-2">Participante (Aluno)</div>
                    <div className="w-44 max-md:hidden pl-2">Contatos & RA</div>
                    <div className="w-32 text-center">Valor Total</div>
                    <div className="w-28 text-center">Situação</div>
                    <div className="w-48 text-right pr-2">Ações de Homologação</div>
                  </div>

                  {totalEnrollmentForFilter.length === 0 ? (
                    <div className="text-center py-12 text-gray-450 font-medium text-xs bg-gray-50/50">
                      Nenhuma inscrição encontrada para o contexto atual do filtro.
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-150 font-medium divide-dashed">
                      {totalEnrollmentForFilter.map((en) => (
                        <div key={en.id} className="p-3.5 flex items-center hover:bg-gray-50/30 transition-all text-xs">
                          
                          
                          <div className="flex-1 flex items-center gap-2.5 pl-2 leading-none">
                            <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 font-extrabold text-[10px] flex items-center justify-center shrink-0">
                              {en.userName.charAt(0)}
                            </div>
                            <div className="flex flex-col gap-1 pr-2 leading-tight">
                              <span className="font-bold text-gray-800 text-[13px]">{en.userName}</span>
                              <span className="text-[9px] text-gray-400 font-semibold uppercase">{en.selectedWorkshops.length} workshops selecionados</span>
                            </div>
                          </div>

                          
                          <div className="w-44 max-md:hidden flex flex-col gap-1 pr-2 overflow-hidden leading-tight font-mono">
                            <span className="text-gray-500 font-medium truncate">{en.userEmail}</span>
                            <span className="text-[10px] text-gray-400">RA: {en.userRa || 'Não Inf.'}</span>
                          </div>

                          
                          <div className="w-32 text-center text-gray-700 font-black font-mono">
                            R$ {en.totalValue.toFixed(2)}
                          </div>

                          
                          <div className="w-28 text-center shrink-0">
                            <span className={`text-[9px] font-black uppercase px-2 py-0.8 rounded-full border ${
                              en.status === 'APROVADO' ? 'bg-green-50 text-green-700 border-green-200' :
                              en.status === 'PENDENTE' ? 'bg-orange-50 text-orange-700 border-orange-200 animate-pulse' :
                              'bg-gray-50 text-gray-500 border-gray-200'
                            }`}>
                              {en.status === 'APROVADO' ? 'Pago' : en.status === 'PENDENTE' ? 'Pendente' : 'Cancelado'}
                            </span>
                          </div>

                          
                          <div className="w-48 text-right shrink-0 flex items-center justify-end gap-1.5 pr-2">
                            {en.status === 'PENDENTE' ? (
                              <>
                                <button
                                  onClick={() => {
                                    try {
                                      DB.updateEnrollmentStatus(en.id, 'APROVADO', currentUser);
                                      alert(`Pagamento de ${en.userName} aprovado com sucesso!`);
                                      onDataChanged();
                                    } catch (err: any) {
                                      alert(err.message || 'Erro ao homologar pagamento.');
                                    }
                                  }}
                                  className="bg-green-600 hover:bg-green-700 hover:scale-102 cursor-pointer text-white font-extrabold uppercase text-[9px] tracking-wider py-1.5 px-2.5 rounded-lg transition-all flex items-center gap-1 shadow-3xs"
                                >
                                  <CheckCircle2 className="w-3 h-3" />
                                  <span>Aprovar</span>
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm(`Deseja realmente recusar e cancelar a inscrição de ${en.userName}?`)) {
                                      try {
                                        DB.updateEnrollmentStatus(en.id, 'CANCELADO', currentUser);
                                        alert(`Inscrição de ${en.userName} cancelada.`);
                                        onDataChanged();
                                      } catch (err: any) {
                                        alert(err.message || 'Erro ao cancelar inscrição.');
                                      }
                                    }
                                  }}
                                  className="bg-gray-100 hover:bg-red-55 hover:bg-red-50 hover:text-red-700 cursor-pointer text-gray-500 hover:border-red-200 border border-gray-200 font-extrabold uppercase text-[9px] tracking-wider py-1.5 px-2 rounded-lg transition-all"
                                >
                                  <span>Recusar</span>
                                </button>
                              </>
                            ) : en.status === 'APROVADO' ? (
                              <button
                                onClick={() => {
                                  if (confirm(`Deseja reverter o pagamento de ${en.userName} de volta para PENDENTE?`)) {
                                    try {
                                      DB.updateEnrollmentStatus(en.id, 'PENDENTE', currentUser);
                                      alert(`Status alterado de volta para PENDENTE.`);
                                      onDataChanged();
                                    } catch (err: any) {
                                      alert(err.message || 'Erro ao reverter status.');
                                    }
                                  }
                                }}
                                className="bg-gray-50 hover:bg-yellow-50 hover:text-yellow-700 hover:border-yellow-200 border border-gray-200 text-gray-400 font-bold text-[9px] tracking-wide py-1.5 px-2 rounded-lg transition-colors cursor-pointer"
                              >
                                Reverter para Pendente
                              </button>
                            ) : (
                              <span className="text-[10px] text-gray-400 italic font-medium">Sem ações</span>
                            )}
                          </div>

                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            );
          })()}
        </div>
      )}

      
      {activeSubTab === 'EVENTOS' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-6 animate-fade-in shadow-xs text-left">
          
          {isEditingEventId ? (
            
            <form onSubmit={handleEditEventSubmitInCoordenador} className="flex flex-col gap-5 max-w-3xl mx-auto w-full">
              <div className="border-b border-gray-150 pb-3 flex justify-between items-center">
                <h3 className="text-gray-805 font-black text-sm uppercase tracking-wider flex items-center gap-2">
                  <Edit2 className="w-4 h-4 text-blue-600" />
                  <span>Editar Detalhes do Evento Acadêmico</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setIsEditingEventId(null)}
                  className="text-xs text-gray-500 hover:text-gray-800 font-bold uppercase transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-[10px] text-gray-500 uppercase tracking-wider block font-bold mb-1">Título do Evento</label>
                  <input 
                    type="text" 
                    value={editEventName}
                    onChange={e => setEditEventName(e.target.value)}
                    placeholder="Exemplo: VII Semana de Engenharia de Software"
                    className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-xs text-gray-850 placeholder-gray-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none font-semibold"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-[10px] text-gray-500 uppercase tracking-wider block font-bold mb-1">Capa / Banner (URL)</label>
                  <input 
                    type="url" 
                    value={editEventBanner}
                    onChange={e => setEditEventBanner(e.target.value)}
                    placeholder="Insira uma URL de imagem válida de capa"
                    className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-xs text-gray-850 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none font-mono"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-[10px] text-gray-500 uppercase tracking-wider block font-bold mb-1">Descrição do Evento</label>
                  <textarea 
                    rows={4}
                    value={editEventDesc}
                    onChange={e => setEditEventDesc(e.target.value)}
                    placeholder="Insira detalhes completos sobre o evento acadêmico..."
                    className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-xs text-gray-850 placeholder-gray-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none font-medium"
                    required
                  ></textarea>
                </div>

                <div>
                  <label className="text-[10px] text-gray-500 uppercase tracking-wider block font-bold mb-1">Localização</label>
                  <input 
                    type="text" 
                    value={editEventLocation}
                    onChange={e => setEditEventLocation(e.target.value)}
                    placeholder="Ex: Auditório Central, Bloco 2"
                    className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-xs text-gray-850 placeholder-gray-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] text-gray-500 uppercase tracking-wider block font-bold mb-1">Categoria de Atividade</label>
                  <select 
                    value={editEventCategory}
                    onChange={e => setEditEventCategory(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-xs text-gray-850 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none font-bold cursor-pointer"
                  >
                    <option value="PALESTRA">PALESTRA</option>
                    <option value="WORKSHOP">WORKSHOP</option>
                    <option value="SEMANA ACADÊMICA">SEMANA ACADÊMICA</option>
                    <option value="CONGRESSO">CONGRESSO</option>
                    <option value="OFICINA">OFICINA</option>
                    <option value="SEMINÁRIO">SEMINÁRIO</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-gray-500 uppercase tracking-wider block font-bold mb-1">Data de Início</label>
                  <input 
                    type="date" 
                    value={editEventStartDate}
                    onChange={e => setEditEventStartDate(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-xs text-gray-850 outline-none font-semibold font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] text-gray-500 uppercase tracking-wider block font-bold mb-1">Data Final</label>
                  <input 
                    type="date" 
                    value={editEventEndDate}
                    onChange={e => setEditEventEndDate(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-xs text-gray-850 outline-none font-semibold font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] text-gray-500 uppercase tracking-wider block font-bold mb-1">Horário de Início</label>
                  <input 
                    type="time" 
                    value={editEventStartTime}
                    onChange={e => setEditEventStartTime(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-xs text-gray-850 outline-none font-semibold font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] text-gray-500 uppercase tracking-wider block font-bold mb-1">Horário de Término</label>
                  <input 
                    type="time" 
                    value={editEventEndTime}
                    onChange={e => setEditEventEndTime(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-xs text-gray-850 outline-none font-semibold font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] text-gray-500 uppercase tracking-wider block font-bold mb-1">Limite Máximo de Inscritos</label>
                  <input 
                    type="number" 
                    value={editEventMaxPart}
                    onChange={e => setEditEventMaxPart(Number(e.target.value))}
                    min={5}
                    placeholder="Vagas para o evento"
                    className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-xs text-gray-855 outline-none font-bold font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] text-gray-500 uppercase tracking-wider block font-bold mb-1">Preço da Inscrição (Básico / R$)</label>
                  <input 
                    type="number" 
                    step="5"
                    min="0"
                    value={editEventPrice}
                    onChange={e => setEditEventPrice(Number(e.target.value))}
                    className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-xs text-gray-855 outline-none font-bold font-mono"
                    required
                  />
                </div>
              </div>

              {isEditingEventId && (
                <div className="border-t border-gray-200 pt-6 mt-4">
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-xs font-black uppercase text-gray-700 tracking-wider flex items-center gap-1.5 leading-none">
                        <BookOpen className="w-4 h-4 text-blue-600" />
                        <span>Workshops Vinculados a este Evento</span>
                      </h4>
                      <span className="text-[10px] text-gray-505 font-bold uppercase">{workshops.filter(w => w.eventId === isEditingEventId).length} Encontrados</span>
                    </div>

                    {workshops.filter(w => w.eventId === isEditingEventId).length === 0 ? (
                      <p className="text-gray-500 text-xs italic text-center py-4 bg-white border border-dashed border-gray-200 rounded-xl">Não há workshops vinculados a este evento ainda.</p>
                    ) : (
                      <div className="flex flex-col gap-3">
                        {workshops.filter(w => w.eventId === isEditingEventId).map(ws => {
                          const isSelfEditing = editingWorkshopId === ws.id;
                          return (
                            <div key={ws.id} className="bg-white border border-gray-150 rounded-xl p-3 shadow-3xs flex flex-col gap-3">
                              {isSelfEditing ? (
                                
                                <div className="flex flex-col gap-3 text-left">
                                  <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                                    <span className="text-[10px] text-blue-600 font-extrabold uppercase font-mono">Editando Workshop</span>
                                    <button 
                                      type="button" 
                                      onClick={() => setEditingWorkshopId(null)}
                                      className="text-[10px] text-gray-500 hover:text-gray-800 font-bold uppercase"
                                    >
                                      Cancelar
                                    </button>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="md:col-span-2">
                                      <label className={THEME.input.labelSmall}>Título do Workshop</label>
                                      <input
                                        type="text"
                                        value={editWsName}
                                        onChange={e => setEditWsName(e.target.value)}
                                        className={THEME.input.textSmall}
                                        required
                                      />
                                    </div>
                                    <div className="md:col-span-2">
                                      <label className={THEME.input.labelSmall}>Instrutor / Palestrante</label>
                                      <input
                                        type="text"
                                        value={editWsInstructor}
                                        onChange={e => setEditWsInstructor(e.target.value)}
                                        className={THEME.input.textSmall}
                                        required
                                      />
                                    </div>
                                    <div className="md:col-span-2">
                                      <label className={THEME.input.labelSmall}>Resumo / Descrição</label>
                                      <textarea
                                        rows={2}
                                        value={editWsDesc}
                                        onChange={e => setEditWsDesc(e.target.value)}
                                        className={THEME.input.textareaSmall}
                                        required
                                      />
                                    </div>
                                    <div>
                                      <label className={THEME.input.labelSmall}>Data</label>
                                      <input
                                        type="date"
                                        value={editWsDate}
                                        onChange={e => setEditWsDate(e.target.value)}
                                        className={THEME.input.textSmall + " font-mono"}
                                        required
                                      />
                                    </div>
                                    <div>
                                      <label className={THEME.input.labelSmall}>Horário</label>
                                      <input
                                        type="time"
                                        value={editWsTime}
                                        onChange={e => setEditWsTime(e.target.value)}
                                        className={THEME.input.textSmall + " font-mono"}
                                        required
                                      />
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 md:col-span-2">
                                      <div>
                                        <label className={THEME.input.labelSmall}>Limite Vagas</label>
                                        <input
                                          type="number"
                                          min={1}
                                          value={editWsMaxVagas}
                                          onChange={e => setEditWsMaxVagas(Number(e.target.value))}
                                          className={THEME.input.textSmall + " font-mono font-bold"}
                                          required
                                        />
                                      </div>
                                      <div>
                                        <label className={THEME.input.labelSmall}>Preço (R$)</label>
                                        <input
                                          type="number"
                                          min={0}
                                          value={editWsPrice}
                                          onChange={e => setEditWsPrice(Number(e.target.value))}
                                          className={THEME.input.textSmall + " font-mono font-bold"}
                                          required
                                        />
                                      </div>
                                      <div>
                                        <label className={THEME.input.labelSmall}>Carga Horária</label>
                                        <input
                                          type="number"
                                          min={1}
                                          value={editWsHours}
                                          onChange={e => setEditWsHours(Number(e.target.value))}
                                          className={THEME.input.textSmall + " font-mono font-bold"}
                                          required
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex justify-end gap-2 mt-2 pt-2 border-t border-gray-100">
                                    <button
                                      type="button"
                                      onClick={() => setEditingWorkshopId(null)}
                                      className={THEME.button.secondary + " py-1.5 px-3"}
                                    >
                                      Cancelar
                                    </button>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        if (!editWsName || !editWsInstructor) {
                                          alert('Nome e Palestrante são obrigatórios.');
                                          return;
                                        }
                                        try {
                                          DB.updateWorkshop(ws.id, {
                                            name: editWsName,
                                            description: editWsDesc,
                                            instructor: editWsInstructor,
                                            date: editWsDate,
                                            time: editWsTime,
                                            maxParticipants: Number(editWsMaxVagas),
                                            price: Number(editWsPrice),
                                            hours: Number(editWsHours)
                                          }, currentUser);
                                          setEditingWorkshopId(null);
                                          alert('Workshop atualizado com sucesso!');
                                          onDataChanged();
                                        } catch (err: any) {
                                          alert(err.message || 'Erro ao editar workshop.');
                                        }
                                      }}
                                      className={THEME.button.primary + " py-1.5 px-4"}
                                    >
                                      Salvar Workshop
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                
                                <div className="flex justify-between items-start md:items-center gap-3 flex-wrap">
                                  <div className="flex-1 min-w-0 text-left">
                                    <h5 className="text-xs font-bold text-gray-800 leading-tight">{ws.name}</h5>
                                    <span className="text-[10px] text-gray-500 font-medium">Instrutor: <strong className="text-gray-750">{ws.instructor}</strong></span>
                                    <div className="flex gap-x-2 text-[9px] text-gray-400 font-mono mt-0.5 flex-wrap">
                                      <span>Data: {ws.date.split('-').reverse().join('/')}</span>
                                      <span>•</span>
                                      <span>Preço: {ws.price === 0 ? 'Gratuito' : `R$ ${ws.price}`}</span>
                                      <span>•</span>
                                      <span>Horário: {ws.time}</span>
                                      <span>•</span>
                                      <span>Carga: {ws.hours || 4}h</span>
                                    </div>
                                  </div>

                                  <div className="flex gap-2">
                                    <button
                                      type="button"
                                      onClick={() => handleStartEditWorkshop(ws)}
                                      className="bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-700 font-medium uppercase text-[9px] tracking-wider py-1.5 px-2.5 rounded-lg flex items-center gap-1 cursor-pointer"
                                    >
                                      <Edit2 className="w-2.5 h-2.5" />
                                      <span>Editar</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (confirm(`Deseja realmente apagar o workshop "${ws.name}"?`)) {
                                          try {
                                            DB.deleteWorkshop(ws.id, currentUser);
                                            alert('Workshop apagado com sucesso!');
                                            onDataChanged();
                                          } catch (err: any) {
                                            alert(err.message || 'Erro ao apagar workshop.');
                                          }
                                        }
                                      }}
                                      className="bg-red-50 hover:bg-red-100 border border-red-100 text-red-700 font-medium uppercase text-[9px] tracking-wider py-1.5 px-2.5 rounded-lg flex items-center gap-1 cursor-pointer"
                                    >
                                      <Trash2 className="w-2.5 h-2.5" />
                                      <span>Apagar</span>
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-3 justify-end mt-4">
                <button 
                  type="button"
                  onClick={() => setIsEditingEventId(null)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold uppercase text-[9px] tracking-wider py-2.5 px-4 rounded-lg cursor-pointer transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase text-[9px] tracking-wider py-2.5 px-5 rounded-lg cursor-pointer transition-colors flex items-center gap-1 shadow-xs font-mono"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Salvar Alterações</span>
                </button>
              </div>
            </form>
          ) : (
            
            <>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-4">
                <div>
                  <h3 className="text-gray-800 font-bold text-sm uppercase tracking-wider mb-1 flex items-center gap-1.5 leading-none">
                    <ClipboardList className="w-4 h-4 text-blue-600" />
                    <span>Gerenciamento de Eventos Acadêmicos</span>
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">Visualize todos os eventos cadastrados na plataforma. Como Coordenador, você possui autonomia para gerenciar e editar qualquer atividade acadêmica.</p>
                </div>

                
                <div className="flex bg-gray-100 border border-gray-200 p-1 rounded-xl text-[10px] font-bold self-start md:self-auto shrink-0 shadow-3xs gap-1">
                  {(['TODOS', 'ANALISE', 'PUBLICADO', 'ENCERRADO'] as const).map(f => (
                    <button 
                      key={f}
                      type="button"
                      onClick={() => setEventListFilter(f)}
                      className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer font-bold ${
                        eventListFilter === f 
                          ? 'bg-blue-600 text-white shadow-3xs' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {f === 'ANALISE' ? 'Em Análise' : f === 'TODOS' ? 'Todos' : f}
                    </button>
                  ))}
                </div>
              </div>

              {(() => {
                const filteredEvents = events.filter(e => {
                  if (eventListFilter === 'TODOS') return true;
                  return e.status === eventListFilter;
                });

                if (filteredEvents.length === 0) {
                  return (
                    <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-200 shadow-xs">
                      <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h4 className="text-gray-800 font-bold text-sm">Nenhum evento registrado nesta subdivisão</h4>
                      <p className="text-gray-500 text-[11px] mt-1 max-w-xs mx-auto">Não há eventos cadastrados no status "{eventListFilter === 'ANALISE' ? 'Em Análise' : eventListFilter}".</p>
                    </div>
                  );
                }

                return (
                  <div className="flex flex-col gap-4">
                    {filteredEvents.map((ev) => {
                      const enrolledCount = enrollments.filter(en => en.eventId === ev.id && en.status === 'APROVADO').length;
                      const evWorkshops = workshops.filter(w => w.eventId === ev.id);

                      return (
                        <div 
                          key={ev.id}
                          className="bg-white border border-gray-200 rounded-xl overflow-hidden p-4 md:p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-5 transition-all hover:bg-gray-50/40 hover:border-gray-300 shadow-3xs"
                        >
                          
                          <div className="flex gap-4 items-center flex-1 min-w-0">
                            <img 
                              src={ev.banner} 
                              alt={ev.name} 
                              referrerPolicy="no-referrer"
                              className="w-16 h-16 rounded-xl object-cover shrink-0 border border-gray-200"
                            />
                            <div className="flex flex-col gap-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                                  ev.status === 'PUBLICADO' ? 'bg-green-50 text-green-700 border border-green-200' :
                                  ev.status === 'ANALISE' ? 'bg-yellow-50 text-yellow-700 border border-yellow-250' :
                                  'bg-gray-100 text-gray-505 border border-gray-200'
                                }`}>
                                  {ev.status === 'ANALISE' ? 'Em Análise' : ev.status}
                                </span>
                                <span className="text-[10px] text-blue-600 font-bold uppercase">{ev.category}</span>
                                {ev.creatorName && (
                                  <span className="text-[9px] text-gray-400 font-medium">Por: {ev.creatorName}</span>
                                )}
                              </div>
                              
                              <h4 className="text-gray-800 font-bold text-sm leading-tight mt-0.5 truncate">{ev.name}</h4>
                              <div className="flex items-center gap-x-3 gap-y-1 flex-wrap text-[11px] text-gray-500 mt-1">
                                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-blue-600" />{ev.startDate.split('-').reverse().join('/')}</span>
                                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-[#FF2A85]" />{ev.location}</span>
                                <span className="flex items-center gap-1 font-mono text-gray-600 font-semibold">{ev.price === 0 ? 'Gratuito' : `R$ ${ev.price.toFixed(2)}`}</span>
                              </div>
                            </div>
                          </div>

                          
                          <div className="flex flex-col md:items-end gap-1.5 shrink-0 w-full md:w-auto max-md:border-t max-md:border-gray-200 max-md:pt-4">
                            <div className="flex items-center gap-4 text-xs text-gray-600 font-bold font-mono py-1 px-3 bg-gray-50 border border-gray-200 rounded-lg max-md:w-full max-md:justify-around shadow-3xs">
                              <div className="flex items-center gap-1">
                                <Users className="w-3.5 h-3.5 text-blue-600" />
                                <span>{enrolledCount} / {ev.maxParticipants} Inscritos</span>
                              </div>
                              <span>•</span>
                              <div className="flex items-center gap-1">
                                <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                                <span>{evWorkshops.length} Workshops</span>
                              </div>
                            </div>

                            
                            <div className="flex flex-wrap gap-2 mt-1.5 max-md:w-full">
                              <button 
                                type="button"
                                onClick={() => handleEditEventClickInCoordenador(ev)}
                                className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 hover:text-gray-800 font-bold uppercase text-[9px] tracking-wider py-2 px-3 rounded-lg flex items-center gap-1 cursor-pointer transition-colors max-md:flex-1 justify-center shadow-3xs"
                              >
                                <Edit2 className="w-3 h-3" />
                                <span>Editar</span>
                              </button>

                              <button 
                                type="button"
                                onClick={() => {
                                  if (confirm(`Deseja realmente apagar o evento "${ev.name}"? Esta ação removerá permanentemente o evento.`)) {
                                    try {
                                      DB.deleteEvent(ev.id, currentUser);
                                      alert('Evento apagado com sucesso!');
                                      onDataChanged();
                                    } catch (err: any) {
                                      alert(err.message || 'Erro ao apagar evento.');
                                    }
                                  }
                                }}
                                className="bg-red-50 border border-red-200 hover:bg-red-100 text-red-700 font-bold uppercase text-[9px] tracking-wider py-2 px-3 rounded-lg flex items-center gap-1 cursor-pointer transition-colors max-md:flex-1 justify-center shadow-3xs"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>Apagar</span>
                              </button>

                              <button 
                                type="button"
                                onClick={() => setShowAddWsInCoordenador(showAddWsInCoordenador === ev.id ? null : ev.id)}
                                className="bg-white border border-blue-200 hover:bg-blue-50 text-blue-700 font-bold uppercase text-[9px] tracking-wider py-2 px-3 rounded-lg flex items-center gap-1 cursor-pointer transition-colors max-md:flex-1 justify-center shadow-3xs"
                              >
                                <Plus className="w-3 h-3" />
                                <span>+ Workshop</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </>
          )}

          
          {showAddWsInCoordenador && (() => {
            const parentEvent = events.find(e => e.id === showAddWsInCoordenador);
            if (!parentEvent) return null;
            
            return (
              <div className="fixed inset-0 z-50 overflow-y-auto px-4 py-12 bg-black/40 backdrop-blur-xs flex items-center justify-center">
                <div className="bg-white border border-gray-200 rounded-2xl p-6 w-full max-w-md shadow-2xl relative select-none animate-fade-in text-left">
                  
                  <button 
                    type="button"
                    onClick={() => setShowAddWsInCoordenador(null)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 cursor-pointer text-sm font-bold"
                  >
                    ✕
                  </button>

                  <div className="mb-4">
                    <span className="text-[10px] text-blue-600 font-extrabold uppercase tracking-widest block font-mono">ADICIONAR GRADE CURRICULAR</span>
                    <h4 className="text-md font-extrabold text-gray-800 uppercase mt-0.5 leading-tight">Novo Workshop para "{parentEvent.name.slice(0, 30)}..."</h4>
                  </div>

                  <form onSubmit={(e) => handleAddWorkshopSubmitInCoordenador(e, parentEvent.id)} className="flex flex-col gap-3.5">
                    
                    <div>
                      <label className="text-[10px] text-gray-500 uppercase tracking-wider block font-semibold mb-1">Título do Workshop</label>
                      <input 
                        type="text" 
                        value={coorWsName}
                        onChange={e => setCoorWsName(e.target.value)}
                        placeholder="EX: Introdução a Figma ou Redes"
                        className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-805 placeholder-gray-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none font-semibold"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-gray-500 uppercase tracking-wider block font-semibold mb-1">Instrutor / Palestrante Convidado</label>
                      <input 
                        type="text" 
                        value={coorWsInstructor}
                        onChange={e => setCoorWsInstructor(e.target.value)}
                        placeholder="EX: Prof. Daniel de Oliveira"
                        className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-805 placeholder-gray-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none font-semibold"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-gray-500 uppercase tracking-wider block font-semibold mb-1">Objetivos / Resumo</label>
                      <textarea 
                        rows={2}
                        value={coorWsDesc}
                        onChange={e => setCoorWsDesc(e.target.value)}
                        placeholder="Descreva as atividades..."
                        className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-805 placeholder-gray-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none font-medium"
                        required
                      ></textarea>
                    </div>

                    <div className="grid grid-cols-2 gap-3.5">
                      <div>
                        <label className="text-[10px] text-gray-500 uppercase tracking-wider block font-semibold mb-1">Data</label>
                        <input 
                          type="date" 
                          value={coorWsDate}
                          onChange={e => setCoorWsDate(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-805 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-500 uppercase tracking-wider block font-semibold mb-1">Horário</label>
                        <input 
                          type="time" 
                          value={coorWsTime}
                          onChange={e => setCoorWsTime(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-805 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3.5">
                      <div>
                        <label className="text-[9px] text-gray-500 uppercase tracking-wider block font-semibold mb-1 truncate">Carga Horária</label>
                        <input 
                          type="number" 
                          min={1}
                          max={40}
                          value={coorWsHours}
                          onChange={e => setCoorWsHours(Number(e.target.value))}
                          className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-805 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none font-bold font-mono"
                          required
                        />
                      </div>

                      <div>
                        <label className="text-[9px] text-gray-500 uppercase tracking-wider block font-semibold mb-1 truncate">Limite Vagas</label>
                        <input 
                          type="number" 
                          min={5}
                          max={200}
                          value={coorWsMaxVagas}
                          onChange={e => setCoorWsMaxVagas(Number(e.target.value))}
                          className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-805 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none font-bold font-mono"
                          required
                        />
                      </div>

                      <div>
                        <label className="text-[9px] text-gray-500 uppercase tracking-wider block font-semibold mb-1 truncate">Preço (R$)</label>
                        <input 
                          type="number" 
                          min={0}
                          value={coorWsPrice}
                          onChange={e => setCoorWsPrice(Number(e.target.value))}
                          className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-805 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none font-bold font-mono"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex gap-2.5 mt-2 justify-end">
                      <button 
                        type="button"
                        onClick={() => setShowAddWsInCoordenador(null)}
                        className="border border-gray-200 text-gray-500 font-bold uppercase text-[9px] tracking-wider py-1.8 px-3 rounded-lg cursor-pointer transition-colors hover:bg-gray-50"
                      >
                        Cancelar
                      </button>
                      <button 
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase text-[9px] tracking-wider py-1.8 px-4 rounded-lg cursor-pointer transition-colors"
                      >
                        Vincular Workshop
                      </button>
                    </div>

                  </form>
                </div>
              </div>
            );
          })()}

        </div>
      )}

          
      {activeSubTab === 'AUDIT_LOGS' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-4 animate-fade-in max-h-[80vh] shadow-xs">
          <div className="flex items-center justify-between border-b border-gray-200 pb-3">
            <div>
              <h3 className="text-gray-800 font-bold text-sm uppercase tracking-wider mb-1 flex items-center gap-1.5 leading-none">
                <Activity className="w-4 h-4 text-blue-600" />
                <span>Auditoria e Logs de Sistema</span>
              </h3>
              <p className="text-xs text-gray-500 mt-1">Histórico completo de auditoria para fins de compliance e supervisão da coordenação.</p>
            </div>
            <span className="text-[10px] text-gray-500 bg-gray-50 py-1 px-3 border border-gray-150 rounded-full font-mono">{logs.length} ações salvas</span>
          </div>

          
          <div className="flex flex-col gap-2 overflow-y-auto max-h-[360px] pr-1.5 scrollbar-thin">
            {logs.map((log) => (
              <div 
                key={log.id} 
                className="bg-white border border-gray-200 p-2.5 rounded-lg flex items-start justify-between gap-4 text-xs font-medium hover:border-gray-200 transition-colors"
              >
                <div className="flex flex-col gap-1 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-[9px] bg-blue-55 text-blue-700 px-1.5 rounded py-0.2 font-black uppercase border border-blue-200">{log.action}</span>
                    <span className="text-[10px] text-gray-500 font-semibold">{log.userEmail}</span>
                    <span className="text-[9px] text-gray-400 uppercase font-bold font-mono">({log.userRole})</span>
                  </div>
                  <p className="text-gray-700 leading-normal mt-0.5 text-[11px] font-sans">{log.details}</p>
                </div>
                
                <span className="text-[9px] text-gray-400 font-mono shrink-0 pt-0.5">
                  {formatTimeBR(log.timestamp)}
                </span>
              </div>
            ))}
          </div>

        </div>
      )}

      
      {activeSubTab === 'FINANCEIRO' && (
        <div className="flex flex-col gap-6 animate-fade-in">
          
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white p-4 rounded-xl border border-gray-200 gap-4 shadow-3xs">
            <div>
              <h3 className="text-gray-800 font-extrabold text-base uppercase tracking-tight flex items-center gap-2 leading-none">
                <Calculator className="w-5 h-5 text-blue-600" />
                <span>Painel Financeiro Gerencial</span>
              </h3>
              <p className="text-xs text-gray-500 mt-1">Monitore receitas de inscrições, crie ordens de despesa e emita relatórios integrados.</p>
            </div>

            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              <button 
                onClick={handleExportCSV}
                className="bg-green-600 hover:bg-green-700 active:scale-97 text-white font-extrabold text-[10px] uppercase tracking-wider px-3.5 py-2 rounded-lg cursor-pointer transition-all flex items-center gap-1.5 shadow-2xs"
                title="Exportar Planilha Excel com Dados de Balanço"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Exportar Excel</span>
              </button>

              <button 
                onClick={() => { setReportEventId('ALL'); setShowReportModal(true); }}
                className="bg-blue-600 hover:bg-blue-700 active:scale-97 text-white font-extrabold text-[10px] uppercase tracking-wider px-3.5 py-2 rounded-lg cursor-pointer transition-all flex items-center gap-1.5 shadow-2xs"
                title="Visualizar e Imprimir Relatório de Auditoria PDF"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Emitir Relatório PDF</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSavePixSettings} className="bg-white border border-gray-200 rounded-xl p-4 shadow-3xs grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
            <div className="md:col-span-2">
              <label className="text-[10px] text-gray-500 uppercase tracking-wider block font-bold mb-1">Chave PIX da Plataforma</label>
              <input
                type="text"
                value={pixKeyInput}
                onChange={(e) => setPixKeyInput(e.target.value)}
                placeholder="Ex: email@instituicao.br ou +55..."
                className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-xs text-gray-850 placeholder-gray-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none font-semibold"
                required
              />
            </div>

            <div>
              <label className="text-[10px] text-gray-500 uppercase tracking-wider block font-bold mb-1">Favorecido</label>
              <input
                type="text"
                value={pixReceiverInput}
                onChange={(e) => setPixReceiverInput(e.target.value)}
                placeholder="Campo Real Eventos"
                className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-xs text-gray-850 placeholder-gray-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none font-semibold"
              />
            </div>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase text-[10px] tracking-wider py-2.5 px-3 rounded-lg transition-colors cursor-pointer"
            >
              Salvar PIX
            </button>

            <p className="md:col-span-4 text-[11px] text-gray-500">
              Pagamentos no checkout são aceitos somente via PIX e ficam pendentes para homologação manual em "Inscritos & Pagamentos".
            </p>
          </form>

          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            
            <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-3xs flex items-center justify-between relative overflow-hidden group">
              <div className="flex flex-col gap-1.5 z-10">
                <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest leading-none">Receita Total Geral (Inscrições + Entradas)</span>
                <span className="text-2xl font-black text-gray-900 leading-tight">
                  {totalFinancialRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
                <span className="text-[10px] text-green-600 font-mono font-bold flex items-center gap-1 leading-none mt-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>{enrollments.filter(en => en.status === 'APROVADO').length} inscrições + {allExpenses.filter(x => x.type === 'ENTRADA').length} patrocínios</span>
                </span>
              </div>
              <div className="p-3 bg-green-50 rounded-xl text-green-600 border border-green-100 group-hover:scale-105 transition-transform">
                <DollarSign className="w-6 h-6" />
              </div>
              <div className="absolute right-0 bottom-0 w-24 h-24 bg-green-50/20 rounded-full translate-x-8 translate-y-8 select-none pointer-events-none"></div>
            </div>

            
            <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-3xs flex items-center justify-between relative overflow-hidden group">
              <div className="flex flex-col gap-1.5 z-10">
                <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest leading-none">Despesas Totais</span>
                <span className="text-2xl font-black text-gray-900 leading-tight text-red-650">
                  {totalFinancialExpenses.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
                <span className="text-[10px] text-red-500 font-mono font-bold flex items-center gap-1 leading-none mt-1">
                  <TrendingDown className="w-3 h-3" />
                  <span>{allExpenses.filter(x => x.type === 'DESPESA').length} despesas/saídas registradas</span>
                </span>
              </div>
              <div className="p-3 bg-red-50 rounded-xl text-red-650 border border-red-100 group-hover:scale-105 transition-transform">
                <TrendingDown className="w-6 h-6" />
              </div>
              <div className="absolute right-0 bottom-0 w-24 h-24 bg-red-50/20 rounded-full translate-x-8 translate-y-8 select-none pointer-events-none"></div>
            </div>

            
            <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-3xs flex items-center justify-between relative overflow-hidden group">
              <div className="flex flex-col gap-1.5 z-10">
                <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest leading-none">Saldo e Balanço Geral</span>
                <span className={`text-2xl font-black leading-tight ${netFinancialProfit >= 0 ? 'text-green-600' : 'text-red-700'}`}>
                  {netFinancialProfit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border w-fit mt-1.5 leading-none block uppercase ${
                  netFinancialProfit >= 0 
                    ? 'bg-green-50 text-green-700 border-green-200' 
                    : 'bg-red-50 text-red-700 border-red-100'
                }`}>
                  {netFinancialProfit >= 0 ? '💰 Superavitário' : '⚠️ Déficit Geral'}
                </span>
              </div>
              <div className={`p-3 rounded-xl border group-hover:scale-105 transition-transform ${
                netFinancialProfit >= 0 ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'
              }`}>
                <ShieldCheck className="w-6 h-6" />
              </div>
            </div>

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            
            <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-4 shadow-3xs">
              <div>
                <h4 className="text-gray-800 font-bold text-sm uppercase tracking-wider leading-none">Balanço Ativo por Evento acadêmico</h4>
                <p className="text-xs text-gray-500 mt-1">Compare as receitas geradas das taxas de inscrições versus todas as despesas vinculadas.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50 text-[10px] font-extrabold uppercase tracking-wider text-gray-400 font-bold">
                      <th className="py-2.5 px-3">Evento</th>
                      <th className="py-2.5 px-2 text-center">Checkouts</th>
                      <th className="py-2.5 px-2 text-right">Inscrições</th>
                      <th className="py-2.5 px-2 text-right">Despesas</th>
                      <th className="py-2.5 px-3 text-right">Resultado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map(evt => {
                      const revVal = getEventRevenue(evt.id);
                      const expVal = getEventExpenses(evt.id);
                      const balVal = revVal - expVal;
                      const hasProfit = balVal >= 0;
                      const salesCount = getEventEnrollmentsCount(evt.id);

                      return (
                        <tr key={evt.id} className="border-b border-gray-150 hover:bg-gray-50/50 transition-colors font-medium">
                          <td className="py-3 px-3">
                            <span className="font-bold text-gray-800 block leading-tight">{evt.name}</span>
                            <span className="text-[9px] uppercase font-mono tracking-wider text-gray-400 font-bold mt-0.5 block">{evt.category} • R$ {evt.price.toFixed(2)}/ingresso</span>
                          </td>
                          <td className="py-3 px-2 text-center text-gray-600 font-mono font-bold">
                            {salesCount}
                          </td>
                          <td className="py-3 px-2 text-right text-gray-800 font-mono">
                            R$ {revVal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="py-3 px-2 text-right text-red-650 font-mono">
                            R$ {expVal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="py-3 px-3 text-right">
                            <span className={`inline-block font-mono font-black text-[11px] px-2 py-0.5 rounded ${
                              hasProfit ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                            }`}>
                              {hasProfit ? '+' : ''} R$ {balVal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                    {events.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-gray-400">Nenhum evento registrado no sistema para cálculos.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            
            <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-4 shadow-3xs relative">
              <div>
                <h4 className="text-gray-800 font-bold text-sm uppercase tracking-wider leading-none">Registrar Lançamento</h4>
                <p className="text-xs text-gray-500 mt-1">Insira qualquer despesa ou entrada extra (como patrocínios) para os eventos.</p>
              </div>

              <form onSubmit={handleAddExpenseSubmit} className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] uppercase tracking-wider font-extrabold text-gray-400">Tipo de Lançamento</label>
                  <div className="grid grid-cols-2 gap-2 mb-1">
                    <button
                      type="button"
                      onClick={() => {
                        setExpenseType('DESPESA');
                        if (expenseCategory === 'PATROCINIO' || expenseCategory === 'APORTE') {
                          setExpenseCategory('INFRAESTRUTURA');
                        }
                      }}
                      className={`py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer text-center ${
                        expenseType === 'DESPESA'
                          ? 'bg-red-50 text-red-700 border-red-300'
                          : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      🛑 Despesa (Saída)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setExpenseType('ENTRADA');
                        setExpenseCategory('APORTE');
                      }}
                      className={`py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer text-center ${
                        expenseType === 'ENTRADA'
                          ? 'bg-green-50 text-green-700 border-green-300'
                          : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      💰 Entrada (Aporte)
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] uppercase tracking-wider font-extrabold text-gray-400">Evento Relacionado</label>
                  <select 
                    value={expenseEventId} 
                    onChange={(e) => setExpenseEventId(e.target.value)}
                    className="bg-gray-55 border border-gray-200 rounded-lg p-2 text-xs font-semibold text-gray-800 focus:outline-none focus:border-blue-505 w-full"
                    required
                  >
                    <option value="" disabled>Selecione o Evento</option>
                    {events.map(ev => (
                      <option key={ev.id} value={ev.id}>{ev.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] uppercase tracking-wider font-extrabold text-gray-400">Categoria do Lançamento</label>
                  <select 
                    value={expenseCategory} 
                    onChange={(e) => setExpenseCategory(e.target.value as ExpenseCategory)}
                    disabled={expenseType === 'ENTRADA'}
                    className="bg-gray-55 border border-gray-200 rounded-lg p-2 text-xs font-semibold text-gray-800 focus:outline-none focus:border-blue-505 w-full disabled:bg-gray-100 disabled:opacity-75 disabled:cursor-not-allowed"
                    required
                  >
                    {expenseType === 'ENTRADA' ? (
                      <option value="APORTE">Aporte</option>
                    ) : (
                      <>
                        <option value="INFRAESTRUTURA">Infraestrutura e Equipamentos</option>
                        <option value="REFEICAO">Alimentação e Refeição</option>
                        <option value="MARKETING">Marketing e Brindes</option>
                        <option value="PALESTRANTE">Honorários de Palestrante</option>
                        <option value="SERVICOS">Serviços Gerais e Limpeza</option>
                        <option value="OUTROS">Outros Lançamentos</option>
                      </>
                    )}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] uppercase tracking-wider font-extrabold text-gray-400">Descrição / Finalidade</label>
                  <input 
                    type="text" 
                    value={expenseDescription} 
                    onChange={(e) => setExpenseDescription(e.target.value)} 
                    placeholder={expenseType === 'ENTRADA' ? "Ex: Patrocínio Master - Cooperativa Sicredi" : "Ex: Aquisição de Certificados Térmicos"} 
                    className="bg-gray-55 border border-gray-200 rounded-lg p-2 text-xs font-medium text-gray-800 focus:outline-none focus:border-blue-505 w-full animate-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] uppercase tracking-wider font-extrabold text-gray-400">Valor (R$)</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      value={expenseValue} 
                      onChange={(e) => setExpenseValue(e.target.value === '' ? '' : Number(e.target.value))} 
                      placeholder="850.00" 
                      className="bg-gray-55 border border-gray-200 rounded-lg p-2 text-xs font-semibold text-gray-800 focus:outline-none focus:border-blue-505 w-full"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] uppercase tracking-wider font-extrabold text-gray-400">Data da Operação</label>
                    <input 
                      type="date" 
                      value={expenseDate} 
                      onChange={(e) => setExpenseDate(e.target.value)} 
                      className="bg-gray-55 border border-gray-200 rounded-lg p-2 text-xs font-semibold text-gray-800 focus:outline-none focus:border-blue-505 w-full"
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 active:scale-97 text-white font-black text-[11px] uppercase tracking-widest py-2.5 rounded-xl cursor-pointer shadow-xs transition-all mt-2 w-full text-center flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Registrar Lançamento ⚡</span>
                </button>
              </form>
            </div>

          </div>

          
          <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-4 shadow-3xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-3 gap-2">
              <div>
                <h4 className="text-gray-800 font-bold text-sm uppercase tracking-wider mb-0.5 flex items-center gap-1.5 leading-none">
                  <ClipboardList className="w-4 h-4 text-blue-600" />
                  <span>Livro de Lançamentos Detalhado (Razão)</span>
                </h4>
                <p className="text-xs text-gray-500 mt-1">Histórico completo de auditoria para cada débito ou crédito gerencial lançado no sistema.</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[9px] font-extrabold text-gray-450 uppercase">Filtrar Evento:</span>
                <select 
                  value={selectedEventFilter} 
                  onChange={(e) => setSelectedEventFilter(e.target.value)}
                  className="bg-gray-50 border border-gray-200 rounded-lg py-1 px-3 text-xs font-bold text-gray-700 focus:outline-none focus:border-blue-505"
                >
                  <option value="ALL">Mostrar Todos ({allExpenses.length})</option>
                  {events.map(ev => {
                    const cnt = allExpenses.filter(x => x.eventId === ev.id).length;
                    return (
                      <option key={ev.id} value={ev.id}>{ev.name} ({cnt})</option>
                    );
                  })}
                </select>
              </div>
            </div>

            
            <div className="flex flex-col gap-2 overflow-y-auto max-h-[350px] pr-1.5 scrollbar-thin">
              {filteredLedgerExpenses.map((exp) => (
                <div 
                  key={exp.id} 
                  className="bg-white border border-gray-200 p-3 rounded-xl flex items-center justify-between gap-4 text-xs font-medium hover:border-blue-200 hover:bg-gray-50/20 transition-all shadow-xs"
                >
                  <div className="flex flex-col gap-1">
                    <span className="font-mono text-[9px] text-gray-400">ID: {exp.id}</span>
                    <h5 className="font-black text-gray-800 text-[13px]">{exp.description}</h5>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className="text-[10px] text-blue-600 font-bold">{exp.eventName}</span>
                      <span className="text-gray-300">•</span>
                      <span className={`text-[9px] uppercase font-mono border px-1.5 rounded-full font-bold ${getCategoryColor(exp.category)}`}>
                        {exp.category}
                      </span>
                      <span className="text-gray-300">•</span>
                      <span className="text-[10px] text-gray-500 font-semibold mt-0.5 sm:mt-0">{exp.type === 'ENTRADA' ? 'Entrada ocorrida em' : 'Gasto ocorrido em'}: {exp.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-extrabold uppercase font-mono tracking-wider ${
                      exp.type === 'ENTRADA' 
                        ? 'bg-green-100 text-green-700 border border-green-200' 
                        : 'bg-red-100 text-red-700 border border-red-200'
                    }`}>
                      {exp.type === 'ENTRADA' ? 'Entrada' : 'Saída'}
                    </span>
                    <span className={`font-mono font-black text-xs py-1 px-2.5 rounded-lg border ${
                      exp.type === 'ENTRADA' 
                        ? 'text-green-700 bg-green-50 border-green-100' 
                        : 'text-red-650 bg-red-50 border-red-100'
                    }`}>
                      {exp.type === 'ENTRADA' ? '+' : '-'} R$ {exp.value.toFixed(2)}
                    </span>
                    <button 
                      onClick={() => handleDeleteExpenseClick(exp.id)}
                      className="text-gray-400 hover:text-red-650 p-2 rounded-lg hover:bg-red-50 active:scale-95 transition-all cursor-pointer"
                      title="Apagar lançamento do livro-razão"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {filteredLedgerExpenses.length === 0 && (
                <div className="py-12 text-center text-gray-400 flex flex-col items-center justify-center gap-2">
                  <AlertCircle className="w-8 h-8 text-gray-300" />
                  <span className="text-[13px] font-semibold">Nenhuma movimentação de lançamento encontrada.</span>
                  <span className="text-xs text-gray-400">Utilize o painel lateral para registrar os lançamentos dos eventos.</span>
                </div>
              )}
            </div>
          </div>

          
          {showReportModal && (
            <div className="fixed inset-0 bg-black/75 z-[9999] flex items-center justify-center p-4 overflow-y-auto backdrop-blur-xs animate-fade-in print:p-0 print:bg-white print:absolute print:inset-0">
              
              
              <style>{`
                @media print {
                  body * {
                    visibility: hidden !important;
                  }
                  #printable-report-area, #printable-report-area * {
                    visibility: visible !important;
                  }
                  #printable-report-area {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100% !important;
                    background: white !important;
                    color: black !important;
                    box-shadow: none !important;
                    border: none !important;
                    padding: 0 !important;
                    margin: 0 !important;
                    font-size: 12px !important;
                  }
                  .non-printable-element {
                    display: none !important;
                  }
                }
              `}</style>

              <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-gray-100 print:rounded-none print:shadow-none print:border-none">
                
                
                <div className="non-printable-element p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <div>
                      <h4 className="text-sm font-black text-gray-800 uppercase tracking-tight">Ficha PDF de Prestação de Contas</h4>
                      <p className="text-[10px] text-gray-500">Configure o escopo antes de gerar a via impressa ou exportar em PDF oficial.</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-xs font-semibold">
                      <span className="text-gray-500">Filtrar para impressão:</span>
                      <select 
                        value={reportEventId}
                        onChange={(e) => setReportEventId(e.target.value)}
                        className="bg-white border border-gray-250 py-1 px-2.5 rounded-lg text-xs font-bold text-gray-700"
                      >
                        <option value="ALL">Balancete Geral Consolidado</option>
                        {events.map(ev => (
                          <option key={ev.id} value={ev.id}>{ev.name}</option>
                        ))}
                      </select>
                    </div>

                    <button 
                      onClick={() => window.print()}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold uppercase text-[10px] tracking-wider px-4 py-2 rounded-lg cursor-pointer"
                    >
                      Imprimir PDF 🖨️
                    </button>

                    <button 
                      onClick={() => setShowReportModal(false)}
                      className="text-gray-400 hover:text-gray-700 font-bold p-2 text-xs"
                    >
                      Fechar
                    </button>
                  </div>
                </div>

                
                <div 
                  id="printable-report-area" 
                  className="flex-1 overflow-y-auto p-12 bg-white text-black font-sans print:overflow-visible print:p-0"
                  style={{ color: '#000' }}
                >
                  
                  
                  <div className="text-center border-b-2 border-black pb-4 mb-6 flex flex-col items-center">
                    <h2 className="text-2xl font-black uppercase tracking-wider text-black">Centro Universitário Campo Real</h2>
                    <h3 className="text-xs uppercase tracking-widest font-mono font-bold text-gray-700 mt-1">Pró-Reitoria de Administração e Eventos de Extensão</h3>
                    <p className="text-[10px] text-gray-500 mt-1">Campus Guarapuava • PR • Brasil • www.camporeal.edu.br</p>
                  </div>

                  
                  <div className="bg-gray-100 p-4 border border-gray-300 text-center mb-6 rounded-lg print:border-black">
                    <h1 className="text-base font-bold uppercase tracking-wide">Relatório Gerencial de Prestação de Contas & Auditoria Financeira</h1>
                    <p className="text-xs text-gray-600 mt-1">Auditado sob as credenciais de {currentUser.name} ({currentUser.role})</p>
                  </div>

                  
                  <div className="grid grid-cols-2 gap-4 text-xs mb-6 border border-gray-200 p-4 rounded-lg bg-gray-50/50 print:border-black">
                    <div>
                      <p className="mb-1"><span className="font-bold text-gray-700">Data de Emissão:</span> {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}</p>
                      <p className="mb-1"><span className="font-bold text-gray-700">Auditor Responsável:</span> {currentUser.name} ({currentUser.email})</p>
                      <p className="mb-1"><span className="font-bold text-gray-700">Cargo de Exercício:</span> {currentUser.role}</p>
                    </div>
                    <div>
                      <p className="mb-1">
                        <span className="font-bold text-gray-700">Escopo do Demonstrativo:</span>{' '}
                        <span className="font-bold uppercase text-blue-600 print:text-black">
                          {reportEventId === 'ALL' ? 'CONSOLIDADO INTEGRAL (TODOS EVENTOS)' : events.find(e => e.id === reportEventId)?.name}
                        </span>
                      </p>
                      <p className="mb-1"><span className="font-bold text-gray-700">Código Oficial de Autenticidade:</span> <span className="font-mono uppercase font-extrabold text-[10px] bg-gray-200 px-1 py-0.2 rounded print:p-0">CRE-AUD-{Math.random().toString(36).substr(2, 9).toUpperCase()}</span></p>
                      <p className="mb-1"><span className="font-bold text-gray-700">Situação de Conformidade:</span> <span className="font-bold text-green-700">Conforme (Aprovado em Exercício)</span></p>
                    </div>
                  </div>

                  
                  <div className="grid grid-cols-3 gap-4 mb-6 border-b border-gray-300 pb-6 text-center">
                    <div className="p-3 border border-gray-200 rounded-lg bg-gray-50 print:border-black leading-none">
                      <span className="text-[9px] uppercase font-bold text-gray-500 block mb-1">Receita de Inscrições</span>
                      <span className="text-lg font-black text-black block">
                        {(reportEventId === 'ALL' 
                          ? totalFinancialRevenue 
                          : getEventRevenue(reportEventId)
                        ).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                      <span className="text-[9px] text-gray-500 block mt-1">{(reportEventId === 'ALL' ? enrollments.filter(en => en.status === 'APROVADO').length : getEventEnrollmentsCount(reportEventId))} checkouts aprovados</span>
                    </div>

                    <div className="p-3 border border-gray-200 rounded-lg bg-gray-50 print:border-black leading-none">
                      <span className="text-[9px] uppercase font-bold text-gray-500 block mb-1">Despesas Operacionais</span>
                      <span className="text-lg font-black text-black block">
                        {(reportEventId === 'ALL' 
                          ? totalFinancialExpenses 
                          : getEventExpenses(reportEventId)
                        ).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                      <span className="text-[9px] text-gray-500 block mt-1">{(reportEventId === 'ALL' ? allExpenses.length : allExpenses.filter(x => x.eventId === reportEventId).length)} saídas contábeis</span>
                    </div>

                    <div className="p-3 border border-gray-200 rounded-lg bg-gray-50 print:border-black leading-none">
                      <span className="text-[9px] uppercase font-bold text-gray-500 block mb-1">Saldo Final de Caixa</span>
                      <span className="text-lg font-black text-black block">
                        {(reportEventId === 'ALL' 
                          ? netFinancialProfit 
                          : (getEventRevenue(reportEventId) - getEventExpenses(reportEventId))
                        ).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                      <span className="text-[9.5px] uppercase font-mono tracking-widest font-extrabold text-green-700 block mt-1">
                        {(reportEventId === 'ALL' ? netFinancialProfit : (getEventRevenue(reportEventId) - getEventExpenses(reportEventId))) >= 0 ? '💰 SUPERAVIT' : '⚠️ DEFICIT'}
                      </span>
                    </div>
                  </div>

                  
                  {reportEventId === 'ALL' && (
                    <div className="mb-6">
                      <h4 className="text-xs uppercase font-extrabold text-black border-l-4 border-black pl-2.5 mb-3">Item 1. Balancete Consolidado por Evento Acadêmico</h4>
                      <table className="w-full text-left text-[11px] border-collapse border border-gray-300">
                        <thead>
                          <tr className="bg-gray-100 uppercase text-[9px] font-bold text-gray-700 border-b border-gray-300">
                            <th className="p-2 border border-gray-350">Nome do Evento</th>
                            <th className="p-2 border border-gray-350">Categoria</th>
                            <th className="p-2 border border-gray-350 text-center">Matrículas</th>
                            <th className="p-2 border border-gray-355 text-right font-bold">Inscrições (R$)</th>
                            <th className="p-2 border border-gray-355 text-right font-bold">Despesas (R$)</th>
                            <th className="p-2 border border-gray-355 text-right font-bold">Balanço (R$)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {events.map(ev => {
                            const rev = getEventRevenue(ev.id);
                            const exp = getEventExpenses(ev.id);
                            const bal = rev - exp;
                            return (
                              <tr key={ev.id} className="border-b border-gray-300 font-medium">
                                <td className="p-2 border border-gray-300 font-bold">{ev.name}</td>
                                <td className="p-2 border border-gray-300">{ev.category}</td>
                                <td className="p-2 border border-gray-300 text-center font-mono">{getEventEnrollmentsCount(ev.id)}</td>
                                <td className="p-2 border border-gray-300 text-right font-mono">R$ {rev.toFixed(2)}</td>
                                <td className="p-2 border border-gray-300 text-right font-mono text-red-650 font-bold">R$ {exp.toFixed(2)}</td>
                                <td className={`p-2 border border-gray-300 text-right font-mono font-bold ${bal >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                                  R$ {bal.toFixed(2)}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}

                  
                  <div className="mb-6">
                    <h4 className="text-xs uppercase font-extrabold text-black border-l-4 border-black pl-2.5 mb-3">
                      {reportEventId === 'ALL' ? 'Item 2. Histórico Contábil Detalhado (Livro Caixa)' : 'Item 1. Rol de Movimentações Alocadas (Entradas e Saídas)'}
                    </h4>
                    <table className="w-full text-left text-[11px] border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-100 uppercase text-[9px] font-bold text-gray-700 border-b border-gray-300">
                          <th className="p-2 border border-gray-300">ID Lançamento</th>
                          <th className="p-2 border border-gray-300">Evento Alvo</th>
                          <th className="p-2 border border-gray-300">Descrição / Destino</th>
                          <th className="p-2 border border-gray-300">Tipo</th>
                          <th className="p-2 border border-gray-300">Categoria</th>
                          <th className="p-2 border border-gray-300 mr-2">Data</th>
                          <th className="p-2 border border-gray-355 text-right font-bold">Valor (R$)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(reportEventId === 'ALL' 
                          ? allExpenses 
                          : allExpenses.filter(x => x.eventId === reportEventId)
                        ).map(ex => (
                          <tr key={ex.id} className="border-b border-gray-300">
                            <td className="p-2 border border-gray-300 font-mono text-[10px]">{ex.id}</td>
                            <td className="p-2 border border-gray-300 font-bold">{ex.eventName}</td>
                            <td className="p-2 border border-gray-300">{ex.description}</td>
                            <td className="p-2 border border-gray-300 font-semibold">{ex.type === 'ENTRADA' ? 'Entrada' : 'Saída'}</td>
                            <td className="p-2 border border-gray-300 font-bold">{ex.category}</td>
                            <td className="p-2 border border-gray-300 text-center">{ex.date}</td>
                            <td className={`p-2 border border-gray-300 text-right font-mono font-bold ${ex.type === 'ENTRADA' ? 'text-green-700' : 'text-red-650'}`}>
                              {ex.type === 'ENTRADA' ? '+' : '-'} R$ {ex.value.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                        {(reportEventId === 'ALL' ? allExpenses.length : allExpenses.filter(x => x.eventId === reportEventId).length) === 0 && (
                          <tr>
                            <td colSpan={7} className="p-4 border border-gray-300 text-center text-gray-400">Nenhum débito, crédito ou gasto alocado para este escopo.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  
                  <div className="mt-8 border border-gray-350 p-4 rounded bg-gray-50 text-[10.5px] text-gray-600 print:bg-white print:border-black">
                    <p className="font-bold text-black uppercase mb-1">Declaração de Conformidade & Autoria Sistêmica</p>
                    <p>O presente balancete consolida faturas, taxas de matrícula de Semana Acadêmica e despesas reais cadastradas por coordenadores habilitados na base sistêmica de eventos do Centro Universitário Campo Real. Por meio deste documento, certifica-se a conformidade e integridade fiscal dos valores demonstrados no exercício fiscal de vigência acadêmica.</p>
                  </div>

                  
                  <div className="mt-12 flex justify-between items-end">
                    <div className="flex flex-col items-center flex-1 max-w-[280px]">
                      <div className="border-b border-black w-full mb-1"></div>
                      <span className="text-[10px] font-bold uppercase">{currentUser.name}</span>
                      <span className="text-[9px] text-gray-500 uppercase">{currentUser.role} Emissor</span>
                    </div>

                    <div className="flex flex-col items-center flex-1 max-w-[280px]">
                      <div className="border-b border-black w-full mb-1"></div>
                      <span className="text-[10px] font-bold uppercase">Prof. Roberto de Almeida — Campo Real</span>
                      <span className="text-[9px] text-gray-500 uppercase">Coordenação Geral de Extensão</span>
                    </div>
                  </div>

                </div>

                
                <div className="non-printable-element p-3 bg-gray-50 border-t border-gray-200 flex justify-end gap-2">
                  <button 
                    onClick={() => setShowReportModal(false)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold uppercase text-[10px] tracking-wider px-4 py-2 rounded-lg cursor-pointer"
                  >
                    Fechar Terminais
                  </button>
                </div>

              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
}

