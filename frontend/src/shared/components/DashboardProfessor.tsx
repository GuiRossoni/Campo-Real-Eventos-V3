import React, { useState } from 'react';
import { User, Event, Workshop, Enrollment, Attendance, EventStatus } from '../../types';
import { Plus, Edit2, Trash2, Users, Calendar, MapPin, Tag, ShieldCheck, CheckSquare, Square, FileSpreadsheet, FileText, Sparkles, BookOpen, Clock, AlertTriangle, Save, Eye } from 'lucide-react';
import { DB } from '../utils/db';
import { THEME } from '../styles/designSystem';

interface DashboardProfessorProps {
  currentUser: User;
  events: Event[];
  workshops: Workshop[];
  enrollments: Enrollment[];
  attendances: Attendance[];
  onDataChanged: () => void;
  forceCreateTab?: boolean;
  onTabOpened?: () => void;
}

export default function DashboardProfessor({
  currentUser,
  events,
  workshops,
  enrollments,
  attendances,
  onDataChanged,
  forceCreateTab,
  onTabOpened
}: DashboardProfessorProps) {
  const [activeTab, setActiveTab] = useState<'LIST' | 'CREATE_EVENT' | 'MANAGE_PARTICIPANTS' | 'REPORT'>('LIST');

  React.useEffect(() => {
    if (forceCreateTab) {
      setActiveTab('CREATE_EVENT');
      if (onTabOpened) onTabOpened();
    }
  }, [forceCreateTab, onTabOpened]);
  const [listFilter, setListFilter] = useState<'TODOS' | 'ANALISE' | 'PUBLICADO' | 'ENCERRADO'>('TODOS');
  
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedWorkshopId, setSelectedWorkshopId] = useState<string>('GERAL');
  
  const [eventName, setEventName] = useState('');
  const [eventDesc, setEventDesc] = useState('');
  const [eventBanner, setEventBanner] = useState('https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800');
  const [eventLocation, setEventLocation] = useState('');
  const [eventStartDate, setEventStartDate] = useState('2026-10-15');
  const [eventEndDate, setEventEndDate] = useState('2026-10-15');
  const [eventStartTime, setEventStartTime] = useState('19:00');
  const [eventEndTime, setEventEndTime] = useState('21:30');
  const [eventCategory, setEventCategory] = useState('PALESTRA');
  const [eventMaxPart, setEventMaxPart] = useState(100);
  const [eventPrice, setEventPrice] = useState(0);
  const [isEditingEvent, setIsEditingEvent] = useState<string | null>(null);

  const [showAddWs, setShowAddWs] = useState<string | null>(null);
  const [wsName, setWsName] = useState('');
  const [wsDesc, setWsDesc] = useState('');
  const [wsInstructor, setWsInstructor] = useState('');
  const [wsDate, setWsDate] = useState('2026-10-15');
  const [wsTime, setWsTime] = useState('14:00');
  const [wsMaxVagas, setWsMaxVagas] = useState(30);
  const [wsPrice, setWsPrice] = useState(0);
  const [wsHours, setWsHours] = useState(4);

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

  const professorEvents = events.filter(e => e.status === 'PUBLICADO' || e.creatorId === currentUser.id || currentUser.role === 'COORDENADOR' || currentUser.role === 'ROOT');
  const workshopEventIds = new Set(workshops.map(w => w.eventId));
  const reportEvents = professorEvents.filter(e => workshopEventIds.has(e.id));

  const filteredProfessorEvents = professorEvents.filter(e => {
    if (listFilter === 'TODOS') return true;
    return e.status === listFilter;
  });

  const getEventEnrolledCount = (eventId: string) => {
    return enrollments.filter(en => en.eventId === eventId && en.status === 'APROVADO').length;
  };

  const getEventAttendanceRate = (eventId: string) => {
    const enrolled = enrollments.filter(en => en.eventId === eventId && en.status !== 'CANCELADO');
    const presentUserIds = new Set(
      attendances
        .filter(att => att.eventId === eventId)
        .map(att => att.userId)
    );

    const presentCount = enrolled.filter(en => presentUserIds.has(en.userId)).length;
    const total = enrolled.length;
    const percentage = total > 0 ? Math.round((presentCount / total) * 100) : 0;

    return {
      total,
      presentCount,
      absentCount: Math.max(0, total - presentCount),
      percentage
    };
  };

  
  const currentParticipants = selectedEventId ? (() => {
    
    const eventEnrolls = enrollments.filter(en => en.eventId === selectedEventId && en.status !== 'CANCELADO');
    
    if (selectedWorkshopId === 'GERAL') {
      return eventEnrolls;
    } else {
      
      return eventEnrolls.filter(en => en.selectedWorkshops.includes(selectedWorkshopId));
    }
  })() : [];

  const handleCreateEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditingEvent) {
        DB.updateEvent(isEditingEvent, {
          name: eventName,
          description: eventDesc,
          banner: eventBanner,
          location: eventLocation,
          startDate: eventStartDate,
          endDate: eventEndDate,
          startTime: eventStartTime,
          endTime: eventEndTime,
          category: eventCategory,
          maxParticipants: Number(eventMaxPart),
          price: Number(eventPrice)
        }, currentUser);
        setIsEditingEvent(null);
        alert('Evento editado com sucesso!');
      } else {
        DB.saveEvent({
          name: eventName,
          description: eventDesc,
          banner: eventBanner,
          location: eventLocation,
          startDate: eventStartDate,
          endDate: eventEndDate,
          startTime: eventStartTime,
          endTime: eventEndTime,
          category: eventCategory,
          maxParticipants: Number(eventMaxPart),
          isFeatured: false,
          price: Number(eventPrice)
        }, currentUser);
        alert('Seu evento foi enviado para validação da coordenação!');
      }
      
      
      setEventName('');
      setEventDesc('');
      setEventLocation('');
      setIsEditingEvent(null);
      setActiveTab('LIST');
      onDataChanged();
    } catch (err: any) {
      alert(err.message || 'Ocorreu um erro.');
    }
  };

  const handleEditEventClick = (ev: Event) => {
    setIsEditingEvent(ev.id);
    setEventName(ev.name);
    setEventDesc(ev.description);
    setEventBanner(ev.banner);
    setEventLocation(ev.location);
    setEventStartDate(ev.startDate);
    setEventEndDate(ev.endDate);
    setEventStartTime(ev.startTime);
    setEventEndTime(ev.endTime);
    setEventCategory(ev.category);
    setEventMaxPart(ev.maxParticipants);
    setEventPrice(ev.price);
    setActiveTab('CREATE_EVENT');
  };

  const handleAddWorkshopSubmit = (e: React.FormEvent, eventId: string) => {
    e.preventDefault();
    try {
      DB.saveWorkshop({
        eventId,
        name: wsName,
        description: wsDesc,
        instructor: wsInstructor,
        date: wsDate,
        time: wsTime,
        maxParticipants: Number(wsMaxVagas),
        price: Number(wsPrice),
        hours: Number(wsHours)
      }, currentUser);

      setWsName('');
      setWsDesc('');
      setWsInstructor('');
      setWsPrice(0);
      setWsHours(4);
      setShowAddWs(null);
      alert('Workshop criado e vinculado com sucesso!');
      onDataChanged();
    } catch (err: any) {
      alert(err.message || 'Erro ao adicionar workshop.');
    }
  };

  const handleToggleCheckin = (participantEmail: string, userId: string) => {
    if (!selectedEventId) return;
    try {
      const activeWs = selectedWorkshopId === 'GERAL' ? undefined : selectedWorkshopId;
      const alreadyChecked = attendances.find(
        a => a.userId === userId && a.eventId === selectedEventId && a.workshopId === activeWs
      );

      if (alreadyChecked) {
        DB.removeAttendance(alreadyChecked.id, currentUser);
      } else {
        DB.registerAttendance(userId, selectedEventId, activeWs, currentUser);
      }
      onDataChanged();
    } catch (err: any) {
      alert(err.message || 'Erro ao alterar lista.');
    }
  };

  
  const handleExportList = (type: 'EXCEL' | 'PDF') => {
    const wsNameStr = selectedWorkshopId === 'GERAL' ? 'Presença Geral' : (workshops.find(w => w.id === selectedWorkshopId)?.name || 'Workshop');
    const eventNameStr = events.find(e => e.id === selectedEventId)?.name || 'Evento';
    
    const studentsPresent = currentParticipants.filter(p => 
      attendances.some(a => a.userId === p.userId && a.eventId === selectedEventId && (selectedWorkshopId === 'GERAL' ? !a.workshopId : a.workshopId === selectedWorkshopId))
    );

    const csvContent = "Nome Completo,E-mail,RA,Curso,Presença\n" + 
      currentParticipants.map(en => {
        const check = attendances.some(a => a.userId === en.userId && a.eventId === selectedEventId && (selectedWorkshopId === 'GERAL' ? !a.workshopId : a.workshopId === selectedWorkshopId));
        return `"${en.userName}","${en.userEmail}","${en.userRa || '—'}","${en.userName}",${check ? 'PRESENTE' : 'AUSENTE'}`;
      }).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `lista_presenca_${eventNameStr.slice(0,10)}_${wsNameStr.slice(0,10)}.${type === 'EXCEL' ? 'csv' : 'txt'}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    alert(`Sucesso! Lista de presença para "${eventNameStr}" emitida em formulário ${type}. Download iniciado contendo ${currentParticipants.length} inscritos.`);
  };

  return (
    <div id="dashboard-top" className="max-w-7xl mx-auto px-4 md:px-8 mt-10 py-2 select-none selection:bg-blue-600 selection:text-white">
      
      
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-gray-200 pb-5 mb-8 gap-4">
        <div>
          <span className="text-xs text-blue-600 font-extrabold uppercase tracking-widest leading-none">GERENCIE SEUS EVENTOS CRIADOS</span>
        </div>

        
        <div className="flex bg-gray-100 border border-gray-200 p-1.5 rounded-xl gap-2 text-xs font-bold w-full md:w-auto shadow-3xs">
          <button 
            type="button"
            onClick={() => { setActiveTab('LIST'); setIsEditingEvent(null); }}
            className={`flex-1 md:flex-none px-4 py-2 rounded-lg cursor-pointer transition-all ${activeTab === 'LIST' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
          >
            Meus Eventos
          </button>
          
          <button 
            type="button"
            onClick={() => {
              setEventName('');
              setEventDesc('');
              setEventLocation('');
              setIsEditingEvent(null);
              setActiveTab('CREATE_EVENT');
            }}
            className={`flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-2xs`}
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Novo Evento</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('REPORT')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-lg cursor-pointer transition-all ${activeTab === 'REPORT' ? 'bg-white text-gray-800 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-800'}`}
          >
            Relatório de Frequência
          </button>
        </div>
      </div>

      
      {activeTab === 'LIST' && (
        <div className="flex flex-col gap-6">
          
          
          <div className="flex gap-2.5 overflow-x-auto pb-2 border-b border-gray-150 text-xs font-semibold">
            {(['TODOS', 'ANALISE', 'PUBLICADO', 'ENCERRADO'] as const).map(f => (
              <button
                key={f}
                type="button"
                onClick={() => setListFilter(f)}
                className={`py-1.5 px-4 rounded-full transition-colors cursor-pointer capitalize ${
                  listFilter === f 
                    ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                    : 'text-gray-500 hover:text-gray-850'
                }`}
              >
                {f === 'ANALISE' ? 'Em Análise' : f === 'TODOS' ? 'Todos' : f.toLowerCase()}
              </button>
            ))}
          </div>

          {filteredProfessorEvents.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-200 shadow-xs">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-gray-800 font-bold text-sm">Nenhum evento registrado nesta subdivisão</h4>
              <p className="text-gray-500 text-[11px] mt-1 max-w-xs mx-auto">Clique no botão "+ Novo Evento" para projetar seu congresso ou deparar revisões com a coordenação.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {filteredProfessorEvents.map((ev) => {
                const enrolledVal = getEventEnrolledCount(ev.id);
                const evWorkshops = workshops.filter(w => w.eventId === ev.id);

                return (
                  <div 
                    key={ev.id}
                    className="bg-white border border-gray-200 rounded-xl overflow-hidden p-4 md:p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-5 transition-all hover:bg-gray-50/40 hover:border-gray-300 select-none shadow-xs"
                  >
                    
                    
                    <div className="flex gap-4 items-center flex-1">
                      <img 
                        src={ev.banner} 
                        alt={ev.name} 
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 rounded-xl object-cover shrink-0 border border-gray-200"
                      />
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                            ev.status === 'PUBLICADO' ? 'bg-green-50 text-green-700 border border-green-200' :
                            ev.status === 'ANALISE' ? 'bg-yellow-50 text-yellow-700 border border-yellow-250' :
                            'bg-gray-100 text-gray-505 border border-gray-200'
                          }`}>
                            {ev.status === 'ANALISE' ? 'Em Análise' : ev.status}
                          </span>
                          <span className="text-[10px] text-blue-600 font-bold uppercase">{ev.category}</span>
                        </div>
                        
                        <h4 className="text-gray-800 font-bold text-sm leading-tight mt-0.5">{ev.name}</h4>
                        <div className="flex items-center gap-x-3 gap-y-1 flex-wrap text-[11px] text-gray-500 mt-1">
                          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-blue-600" />{ev.startDate.split('-').reverse().join('/')}</span>
                          <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-[#FF2A85]" />{ev.location}</span>
                          <span className="flex items-center gap-1 font-mono text-gray-600 font-semibold">{ev.price === 0 ? 'Livre' : `R$ ${ev.price.toFixed(2)}`}</span>
                        </div>
                      </div>
                    </div>

                    
                    <div className="flex flex-col md:items-end gap-1.5 shrink-0 w-full md:w-auto max-md:border-t max-md:border-gray-200 max-md:pt-4">
                      
                      <div className="flex items-center gap-4 text-xs text-gray-600 font-bold font-mono py-1 px-3 bg-gray-50 border border-gray-200 rounded-lg max-md:w-full max-md:justify-around shadow-2xs">
                        <div className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-blue-600" />
                          <span>{enrolledVal} / {ev.maxParticipants} Inscritos</span>
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
                          onClick={() => {
                            setSelectedEventId(ev.id);
                            setSelectedWorkshopId('GERAL');
                            setActiveTab('MANAGE_PARTICIPANTS');
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase text-[9px] tracking-wider py-2 px-3 rounded-lg flex items-center gap-1 cursor-pointer transition-colors border border-blue-700 max-md:flex-1 justify-center shadow-xs"
                        >
                          <CheckSquare className="w-3 h-3" />
                          <span>Credenciamento</span>
                        </button>

                        {(currentUser.role === 'COORDENADOR' || currentUser.role === 'ROOT' || ev.creatorId === currentUser.id) && (
                          <>
                            <button 
                              type="button"
                              onClick={() => handleEditEventClick(ev)}
                              className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 hover:text-gray-800 font-bold uppercase text-[9px] tracking-wider py-2 px-3 rounded-lg flex items-center gap-1 cursor-pointer transition-colors max-md:flex-1 justify-center shadow-3xs"
                            >
                              <Edit2 className="w-3 h-3" />
                              <span>Editar</span>
                            </button>

                            <button 
                              type="button"
                              onClick={() => {
                                if (confirm(`Deseja realmente apagar o evento "${ev.name}"? Esta ação removerá o evento permanentemente.`)) {
                                  try {
                                    DB.deleteEvent(ev.id, currentUser);
                                    alert('Evento apagado com sucesso!');
                                    onDataChanged();
                                  } catch (err: any) {
                                    alert(err.message || 'Erro ao apagar o evento.');
                                  }
                                }
                              }}
                              className="bg-red-50 border border-red-200 hover:bg-red-100 text-red-700 font-bold uppercase text-[9px] tracking-wider py-2 px-3 rounded-lg flex items-center gap-1 cursor-pointer transition-colors max-md:flex-1 justify-center shadow-3xs"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Apagar</span>
                            </button>
                          </>
                        )}

                        <button 
                          type="button"
                          onClick={() => setShowAddWs(showAddWs === ev.id ? null : ev.id)}
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
          )}

        </div>
      )}

      
      {activeTab === 'CREATE_EVENT' && (
        <form onSubmit={handleCreateEventSubmit} className="bg-white rounded-2xl border border-gray-200 p-6 max-w-3xl mx-auto flex flex-col gap-5 shadow-xs">
          <h3 className="text-lg font-black uppercase text-gray-800 tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <span>{isEditingEvent ? 'Editar Evento Acadêmico' : 'Formular Novo Evento'}</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-[10px] text-gray-500 uppercase tracking-wider block font-bold mb-1">Título do Evento</label>
              <input 
                type="text" 
                value={eventName}
                onChange={e => setEventName(e.target.value)}
                placeholder="Exemplo: VII Semana de Engenharia de Software"
                className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-xs text-gray-850 placeholder-gray-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-[10px] text-gray-500 uppercase tracking-wider block font-bold mb-1">Capa / Banner (URL)</label>
              <input 
                type="url" 
                value={eventBanner}
                onChange={e => setEventBanner(e.target.value)}
                placeholder="Insira uma URL de imagem válida de capa"
                className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-xs text-gray-850 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-[10px] text-gray-500 uppercase tracking-wider block font-bold mb-1">Descrição do Evento (Cronograma, Objetivos, etc...)</label>
              <textarea 
                rows={4}
                value={eventDesc}
                onChange={e => setEventDesc(e.target.value)}
                placeholder="Insira detalhes completos sobre o evento acadêmico..."
                className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-xs text-gray-850 placeholder-gray-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
                required
              ></textarea>
            </div>

            <div>
              <label className="text-[10px] text-gray-500 uppercase tracking-wider block font-bold mb-1">Localização</label>
              <input 
                type="text" 
                value={eventLocation}
                onChange={e => setEventLocation(e.target.value)}
                placeholder="Ex: Auditório Central, Bloco 2"
                className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-xs text-gray-850 placeholder-gray-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
                required
              />
            </div>

            <div>
              <label className="text-[10px] text-gray-500 uppercase tracking-wider block font-bold mb-1">Categoria</label>
              <select 
                value={eventCategory}
                onChange={e => setEventCategory(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-xs text-gray-850 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none font-bold"
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
              <label className="text-[10px] text-gray-500 uppercase tracking-wider block font-bold mb-1">Data Início</label>
              <input 
                type="date" 
                value={eventStartDate}
                onChange={e => setEventStartDate(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-xs text-gray-850 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] text-gray-500 uppercase tracking-wider block font-bold mb-1">Data Término</label>
              <input 
                type="date" 
                value={eventEndDate}
                onChange={e => setEventEndDate(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-xs text-gray-850 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] text-gray-500 uppercase tracking-wider block font-bold mb-1">Horário Início</label>
              <input 
                type="time" 
                value={eventStartTime}
                onChange={e => setEventStartTime(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-xs text-gray-850 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] text-gray-500 uppercase tracking-wider block font-bold mb-1">Horário Término</label>
              <input 
                type="time" 
                value={eventEndTime}
                onChange={e => setEventEndTime(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-xs text-gray-850 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] text-gray-500 uppercase tracking-wider block font-bold mb-1">Limite Máximo de Inscritos</label>
              <input 
                type="number" 
                value={eventMaxPart}
                onChange={e => setEventMaxPart(Number(e.target.value))}
                min={1}
                className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-xs text-gray-850 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] text-gray-500 uppercase tracking-wider block font-bold mb-1">Adicionar Custo Base de Ingressos (Opcional)</label>
              <input 
                type="number"
                step="0.01" 
                value={eventPrice}
                onChange={e => setEventPrice(Number(e.target.value))}
                placeholder="R$ 0,00 (Gratuito)"
                min={0}
                className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-xs text-gray-850 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
              />
            </div>

          </div>

          {isEditingEvent && (
            <div className="border-t border-gray-200 pt-6 mt-4">
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-xs font-black uppercase text-gray-700 tracking-wider flex items-center gap-1.5 leading-none">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    <span>Workshops Vinculados a este Evento</span>
                  </h4>
                  <span className="text-[10px] text-gray-505 font-bold uppercase">{workshops.filter(w => w.eventId === isEditingEvent).length} Encontrados</span>
                </div>

                {workshops.filter(w => w.eventId === isEditingEvent).length === 0 ? (
                  <p className="text-gray-500 text-xs italic text-center py-4 bg-white border border-dashed border-gray-200 rounded-xl">Não há workshops vinculados a este evento ainda.</p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {workshops.filter(w => w.eventId === isEditingEvent).map(ws => {
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

          <div className="flex gap-4 mt-4">
            <button 
              type="button"
              onClick={() => { setActiveTab('LIST'); setIsEditingEvent(null); }}
              className="flex-1 bg-white border border-gray-200 text-gray-700 hover:text-gray-800 font-bold uppercase text-xs tracking-wider py-3.5 rounded-xl transition-all cursor-pointer text-center shadow-3xs"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white hover:bg-blue-700 font-bold uppercase text-xs tracking-wider py-3.5 rounded-xl transition-all cursor-pointer text-center shadow-xs"
            >
              {isEditingEvent ? 'Salvar Alterações' : 'Criar Evento e Enviar'}
            </button>
          </div>
        </form>
      )}

      
      {activeTab === 'MANAGE_PARTICIPANTS' && selectedEventId && (() => {
        const evObj = events.find(e => e.id === selectedEventId);
        if (!evObj) return null;
        
        const evWorkshops = workshops.filter(w => w.eventId === selectedEventId);

        
        const totalInscriptions = currentParticipants.length;
        const presentCount = currentParticipants.filter(p => 
          attendances.some(a => a.userId === p.userId && a.eventId === selectedEventId && (selectedWorkshopId === 'GERAL' ? !a.workshopId : a.workshopId === selectedWorkshopId))
        ).length;
        
        const presencePercentage = totalInscriptions > 0 ? Math.round((presentCount / totalInscriptions) * 100) : 0;

        return (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col gap-6 animate-fade-in shadow-xs">
            
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-200 pb-5">
              <div>
                <button 
                  onClick={() => setActiveTab('LIST')}
                  className="text-xs text-blue-600 hover:text-blue-700 font-bold uppercase mb-2 block cursor-pointer"
                >
                  ← Voltar aos Eventos
                </button>
                <h3 className="text-gray-800 font-extrabold text-lg uppercase tracking-tight">{evObj.name}</h3>
                <p className="text-[11px] text-gray-500 mt-1">Sessão de Credenciamento, Presença e Emissão de Listas para Workshops vinculados.</p>
              </div>

              
              <div className="flex gap-2.5 text-xs font-bold w-full md:w-auto">
                <button 
                  onClick={() => handleExportList('EXCEL')}
                  className="flex-1 md:flex-none border border-gray-200 hover:bg-gray-50 text-gray-700 py-2 px-3.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-3xs bg-white"
                  title="Emitir Lista Completa compatível com Excel"
                >
                  <FileSpreadsheet className="w-4 h-4 shrink-0 text-green-600" />
                  <span>Exportar Excel</span>
                </button>
                <button 
                  onClick={() => handleExportList('PDF')}
                  className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white py-2 px-3.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
                >
                  <FileText className="w-4 h-4 shrink-0 text-white" />
                  <span>Emitir PDF</span>
                </button>
              </div>
            </div>

            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 border border-gray-200 p-4 rounded-xl shadow-2xs">
              <div className="flex flex-col">
                <span className="text-[9px] text-gray-500 uppercase tracking-widest font-semibold">Total de Registros</span>
                <span className="text-xl font-black text-gray-800 mt-1">{totalInscriptions} Alunos</span>
              </div>
              <div className="flex flex-col border-l border-gray-200 pl-4">
                <span className="text-[9px] text-gray-500 uppercase tracking-widest font-semibold">Presentes</span>
                <span className="text-xl font-black text-green-650 mt-1">{presentCount} Alunos</span>
              </div>
              <div className="flex flex-col border-l border-gray-200 pl-4">
                <span className="text-[9px] text-gray-500 uppercase tracking-widest font-semibold">Faltantes</span>
                <span className="text-xl font-black text-gray-400 mt-1">{totalInscriptions - presentCount} Alunos</span>
              </div>
              <div className="flex flex-col border-l border-gray-200 pl-4">
                <span className="text-[9px] text-gray-500 uppercase tracking-widest font-semibold">Taxa de Presença</span>
                <span className="text-xl font-black text-blue-600 mt-1">{presencePercentage}%</span>
              </div>
            </div>

            
            <div className="flex flex-col gap-2">
              <label className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Filtro de Grade Acadêmica:</label>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                <button
                  type="button"
                  onClick={() => setSelectedWorkshopId('GERAL')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer border ${
                    selectedWorkshopId === 'GERAL' 
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs' 
                      : 'bg-white border-gray-200 text-gray-500 hover:text-gray-800 shadow-3xs'
                  }`}
                >
                  Presença Geral do Evento
                </button>
                {evWorkshops.map(ws => (
                  <button
                    key={ws.id}
                    type="button"
                    onClick={() => setSelectedWorkshopId(ws.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer border ${
                      selectedWorkshopId === ws.id 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs' 
                        : 'bg-white border-gray-200 text-gray-500 hover:text-gray-800 shadow-3xs'
                    }`}
                  >
                     ⚙ {ws.name}
                  </button>
                ))}
              </div>
            </div>

            
            <div className="border border-gray-200 rounded-xl overflow-hidden bg-white select-none shadow-sm">
              
              <div className="bg-gray-50 text-[10px] font-extrabold uppercase text-gray-500 p-3.5 flex border-b border-gray-200">
                <div className="w-10 text-center shrink-0">Check-In</div>
                <div className="flex-1 pl-4">Aluno / Cadastro</div>
                <div className="w-32 max-md:hidden pl-2">Curso / Período</div>
                <div className="w-32 text-right shrink-0">Presença status</div>
              </div>

              {currentParticipants.length === 0 ? (
                <div className="text-center py-12 text-gray-450 text-xs">
                  Não há inscrições ativas para o filtro selecionado.
                </div>
              ) : (
                <div className="divide-y divide-gray-150 max-h-[300px] overflow-y-auto">
                  {currentParticipants.map((en) => {
                    const isChecked = attendances.some(
                      a => a.userId === en.userId && a.eventId === selectedEventId && (selectedWorkshopId === 'GERAL' ? !a.workshopId : a.workshopId === selectedWorkshopId)
                    );

                    return (
                      <div 
                        key={en.id} 
                        onClick={() => handleToggleCheckin(en.userEmail, en.userId)}
                        className="p-3.5 flex items-center hover:bg-gray-50/50 transition-all cursor-pointer leading-none border-b border-gray-150/70 group"
                      >
                        <div className="w-10 flex items-center justify-center shrink-0">
                          {isChecked ? (
                            <CheckSquare className="w-5 h-5 text-green-600 shrink-0" />
                          ) : (
                            <Square className="w-5 h-5 text-gray-300 shrink-0 group-hover:text-blue-600 transition-colors" />
                          )}
                        </div>

                        
                        <div className="flex-1 pl-4 flex flex-col gap-1 leading-normal truncate font-bold">
                          <span className="text-xs text-gray-800">{en.userName}</span>
                          <span className="text-[10px] text-gray-400 font-mono font-medium">RA: {en.userRa || 'Não inf.'} • {en.userEmail}</span>
                        </div>

                        
                        <div className="w-32 pl-2 text-[11px] text-gray-400 max-md:hidden leading-normal truncate">
                          <span>Ed. Física / SI</span>
                        </div>

                        
                        <div className="w-48 text-right text-xs shrink-0 font-bold flex flex-col items-end gap-1 justify-center pr-2">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] text-gray-400 uppercase font-semibold">Credenciamento:</span>
                            {isChecked ? (
                              <span className="text-green-600 font-extrabold uppercase text-[10px]">Presente</span>
                            ) : (
                              <span className="text-gray-400 uppercase text-[10px]">Ausente</span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] text-gray-400 uppercase font-semibold">Pagamento:</span>
                            <span className={`text-[9px] px-1.5 py-0.2 rounded font-black uppercase ${
                              en.status === 'APROVADO' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {en.status === 'APROVADO' ? 'Aprovado' : 'Pendente'}
                            </span>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}

            </div>

          </div>
        );
      })()}

      
      {showAddWs && (() => {
        const parentEvent = events.find(e => e.id === showAddWs);
        if (!parentEvent) return null;
        
        return (
          <div className="fixed inset-0 z-50 overflow-y-auto px-4 py-12 bg-black/40 backdrop-blur-xs flex items-center justify-center">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 w-full max-w-md shadow-2xl relative select-none animate-fade-in">
              
              <button 
                type="button"
                onClick={() => setShowAddWs(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 cursor-pointer text-sm font-bold"
              >
                ✕
              </button>

              <div className="mb-4">
                <span className="text-[10px] text-blue-600 font-extrabold uppercase tracking-widest block">ADICIONAR GRADE CURRICULAR</span>
                <h4 className="text-md font-extrabold text-gray-800 uppercase mt-0.5 leading-tight">Novo Workshop para "{parentEvent.name.slice(0, 30)}..."</h4>
              </div>

              <form onSubmit={(e) => handleAddWorkshopSubmit(e, parentEvent.id)} className="flex flex-col gap-3.5">
                
                <div>
                  <label className="text-[10px] text-gray-500 uppercase tracking-wider block font-semibold mb-1">Título do Workshop</label>
                  <input 
                    type="text" 
                    value={wsName}
                    onChange={e => setWsName(e.target.value)}
                    placeholder="EX: Introdução a Figma ou Redes"
                    className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-800 placeholder-gray-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] text-gray-500 uppercase tracking-wider block font-semibold mb-1">Instrutor / Palestrante Convidado</label>
                  <input 
                    type="text" 
                    value={wsInstructor}
                    onChange={e => setWsInstructor(e.target.value)}
                    placeholder="EX: Prof. Daniel de Oliveira"
                    className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-800 placeholder-gray-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] text-gray-500 uppercase tracking-wider block font-semibold mb-1">Objetivos / Resumo</label>
                  <textarea 
                    rows={2}
                    value={wsDesc}
                    onChange={e => setWsDesc(e.target.value)}
                    placeholder="Descreva as atividades..."
                    className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-800 placeholder-gray-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
                    required
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-[10px] text-gray-500 uppercase tracking-wider block font-semibold mb-1">Data</label>
                    <input 
                      type="date" 
                      value={wsDate}
                      onChange={e => setWsDate(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-800 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 uppercase tracking-wider block font-semibold mb-1">Horário</label>
                    <input 
                      type="time" 
                      value={wsTime}
                      onChange={e => setWsTime(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-800 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label className="text-[9px] text-gray-500 uppercase tracking-wider block font-bold mb-1">Máximo Vagas</label>
                    <input 
                      type="number" 
                      value={wsMaxVagas}
                      onChange={e => setWsMaxVagas(Number(e.target.value))}
                      min={1}
                      className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-800 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-gray-500 uppercase tracking-wider block font-bold mb-1">Carga Horária (h)</label>
                    <input 
                      type="number" 
                      value={wsHours}
                      onChange={e => setWsHours(Number(e.target.value))}
                      min={1}
                      className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-800 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-gray-500 uppercase tracking-wider block font-bold mb-1">Custo (R$)</label>
                    <input 
                      type="number" 
                      value={wsPrice}
                      onChange={e => setWsPrice(Number(e.target.value))}
                      placeholder="0.00"
                      min={0}
                      className="w-full bg-white border border-gray-205 rounded-lg p-2 text-xs text-gray-800 placeholder-gray-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
                    />
                  </div>
                </div>

                {parentEvent.category === 'SEMANA ACADÊMICA' && (
                  <div className="bg-blue-50 border border-blue-150 p-2.5 rounded-lg text-[10px] text-blue-700 leading-normal font-medium">
                    💡 <strong>Semana Acadêmica Integrada:</strong> Os minicursos deste evento ficarão relacionados de forma unificada. O aluno terá frequência e horas consolidadas no mesmo histórico de participação.
                  </div>
                )}

                <div className="flex gap-3.5 mt-2">
                  <button 
                    type="button" 
                    onClick={() => setShowAddWs(null)}
                    className="flex-1 bg-white text-gray-500 hover:text-gray-800 text-xs font-bold uppercase p-2.5 rounded-lg border border-gray-200 shadow-3xs cursor-pointer"
                  >
                    Mudar de Ideia
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-blue-600 text-white hover:bg-blue-700 text-xs font-bold uppercase p-2.5 rounded-lg cursor-pointer transition-colors shadow-xs"
                  >
                    Confirmar
                  </button>
                </div>

              </form>

            </div>
          </div>
        );
      })()}


      {activeTab === 'REPORT' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs flex flex-col gap-4">
          <div className="border-b border-gray-150 pb-4">
            <h3 className="text-gray-800 font-black text-sm uppercase tracking-wider">Relatório de Frequência do Orientador</h3>
            <p className="text-xs text-gray-500 mt-1">Percentual de presença dos inscritos em eventos que possuem workshops vinculados.</p>
          </div>

          {reportEvents.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-500">
              Nenhum evento com workshops disponível para geração de relatório.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reportEvents.map((ev) => {
                const metrics = getEventAttendanceRate(ev.id);
                const eventWorkshops = workshops.filter(w => w.eventId === ev.id).length;
                return (
                  <div key={ev.id} className="border border-gray-200 rounded-xl p-4 bg-white shadow-3xs">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-bold text-gray-800 leading-tight">{ev.name}</h4>
                        <p className="text-[11px] text-gray-500 mt-1">{eventWorkshops} workshop(s) vinculado(s)</p>
                      </div>
                      <span className="text-lg font-black text-blue-600">{metrics.percentage}%</span>
                    </div>

                    <div className="mt-3 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${metrics.percentage}%` }}
                      />
                    </div>

                    <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                      <div className="bg-gray-50 rounded-lg p-2 border border-gray-150">
                        <div className="text-[10px] text-gray-500 uppercase font-bold">Inscritos</div>
                        <div className="text-sm font-black text-gray-800">{metrics.total}</div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-2 border border-green-150">
                        <div className="text-[10px] text-green-700 uppercase font-bold">Presentes</div>
                        <div className="text-sm font-black text-green-700">{metrics.presentCount}</div>
                      </div>
                      <div className="bg-orange-50 rounded-lg p-2 border border-orange-150">
                        <div className="text-[10px] text-orange-700 uppercase font-bold">Faltas</div>
                        <div className="text-sm font-black text-orange-700">{metrics.absentCount}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
