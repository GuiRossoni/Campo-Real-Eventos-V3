import React, { useState } from 'react';
import { User, Enrollment, Attendance, Event, Workshop } from '../../types';
import { UserCircle, Shield, Award, Edit3, ClipboardList, CheckCircle2, QrCode, BookOpen, AlertCircle, Save } from 'lucide-react';

interface DashboardAlunoProps {
  currentUser: User;
  enrollments: Enrollment[];
  events: Event[];
  workshops: Workshop[];
  attendances: Attendance[];
  onProfileUpdated: () => void;
  onSelectEvent?: (id: string) => void;
}

export default function DashboardAluno({
  currentUser,
  enrollments,
  events,
  workshops,
  attendances,
  onProfileUpdated,
  onSelectEvent
}: DashboardAlunoProps) {
  const [selectedTicketForQr, setSelectedTicketForQr] = useState<string | null>(null);

  const studentEnrollments = enrollments.filter(e => e.userId === currentUser.id);

  const isCheckedInForEvent = (eventId: string) => {
    return attendances.some(a => a.userId === currentUser.id && a.eventId === eventId && !a.workshopId);
  };

  const isCheckedInForWorkshop = (eventId: string, wsId: string) => {
    return attendances.some(a => a.userId === currentUser.id && a.eventId === eventId && a.workshopId === wsId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 mt-10 py-2 select-none selection:bg-blue-600 selection:text-white">
      
      <div className="flex flex-col gap-8 text-gray-850">
        
        
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
          <h3 className="text-lg font-black uppercase text-gray-800 tracking-tight flex items-center gap-2 mb-1.5">
            <ClipboardList className="w-5 h-5 text-blue-600" />
            <span>Meus</span>
            <span className="text-blue-600">Ingressos</span>
          </h3>
          <p className="text-xs text-gray-500 mb-5 pb-3 border-b border-gray-150">
            Acompanhe suas confirmações de pagamento, consulte QR Codes de entrada e acompanhe suas presenças.
          </p>

            {studentEnrollments.length === 0 ? (
              <div className="text-center p-8 bg-gray-50 border border-gray-150 rounded-2xl py-12">
                <AlertCircle className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <h4 className="text-gray-700 font-bold text-sm">Você ainda não se inscreveu em nenhum evento</h4>
                <p className="text-xs text-gray-500 mt-1">Busque eventos na nossa página e faça sua inscrição gratuita ou via PIX.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                {studentEnrollments.map((en) => {
                  const ev = events.find(e => e.id === en.eventId);
                  const isApproved = en.status === 'APROVADO';
                  
                  const isPresent = ev?.category === 'SEMANA ACADÊMICA'
                    ? (isCheckedInForEvent(en.eventId) || attendances.some(a => a.userId === currentUser.id && a.eventId === en.eventId && a.workshopId))
                    : isCheckedInForEvent(en.eventId);

                  return (
                    <div 
                      key={en.id} 
                      className="bg-white border border-gray-250 rounded-xl overflow-hidden shadow-xs hover:border-gray-350 transition-colors flex flex-col md:flex-row justify-between"
                    >
                      <div className="p-4 md:p-5 flex-1 flex flex-col gap-3">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            {isApproved ? (
                              <span className="bg-green-50 border border-green-150 text-green-700 font-bold text-[9px] uppercase tracking-wide py-0.5 px-2 rounded">SIMULADO APROVADO</span>
                            ) : (
                              <span className="bg-yellow-50 border border-yellow-150 text-yellow-700 font-bold text-[9px] uppercase tracking-wide py-0.5 px-2 rounded">AGUARDANDO SIMULAÇÃO</span>
                            )}
                            
                            {isPresent ? (
                              <span className="bg-blue-50 border border-blue-150 text-blue-700 font-bold text-[9px] uppercase tracking-wide py-0.5 px-2 rounded">PRESENÇA CONFIRMADA</span>
                            ) : (
                              <span className="bg-gray-100 text-gray-500 font-bold text-[9px] uppercase tracking-wide py-0.5 px-2 rounded border border-gray-200">Aguardando Check-In</span>
                            )}
                          </div>

                          <h4 className="text-gray-900 font-bold text-sm leading-tight mt-1">{en.eventName}</h4>
                          {ev && (
                            <p className="text-[10px] text-gray-500 mt-1 font-semibold">Data: {ev.startDate.split('-').reverse().join('/')} • {ev.startTime}h • {ev.location}</p>
                          )}
                        </div>

                        
                        {ev?.category === 'SEMANA ACADÊMICA' ? (
                          <div className="border-t border-gray-150 pt-2.5 mt-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] text-blue-600 uppercase font-bold tracking-wider">Minicursos & Oficinas:</span>
                              <button 
                                onClick={() => onSelectEvent && onSelectEvent(en.eventId)}
                                className="text-[10px] text-blue-650 hover:text-blue-750 font-extrabold uppercase hover:underline cursor-pointer flex items-center gap-0.5 bg-blue-50 px-2 py-1 rounded"
                              >
                                {en.selectedWorkshops.length > 0 ? '✏️ Alterar Grade' : '➕ Escolher Grade'}
                              </button>
                            </div>
                            {en.selectedWorkshops.length === 0 ? (
                              <p className="text-[11px] text-gray-450 italic mt-1">Nenhum minicurso selecionado para esta Semana Acadêmica.</p>
                            ) : (
                              <div className="flex flex-col gap-1.5 mt-1.5">
                                {en.selectedWorkshops.map(wsId => {
                                  const wsObj = workshops.find(w => w.id === wsId);
                                  const wsPresent = isCheckedInForWorkshop(en.eventId, wsId);
                                  if (!wsObj) return null;
                                  return (
                                    <div key={wsId} className="flex items-center justify-between text-xs text-gray-700">
                                      <span className="truncate max-w-[200px] block">• {wsObj.name}</span>
                                      <span className={`text-[9px] font-bold ${wsPresent ? 'text-blue-600' : 'text-gray-400'}`}>
                                        {wsPresent ? '✓ Presente' : 'Não credenciado'}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        ) : (
                          en.selectedWorkshops.length > 0 && (
                            <div className="border-t border-gray-150 pt-2.5">
                              <span className="text-[10px] text-blue-600 uppercase font-bold tracking-wider">Minicursos Contatados:</span>
                              <div className="flex flex-col gap-1.5 mt-1">
                                {en.selectedWorkshops.map(wsId => {
                                  const wsObj = workshops.find(w => w.id === wsId);
                                  const wsPresent = isCheckedInForWorkshop(en.eventId, wsId);
                                  if (!wsObj) return null;
                                  return (
                                    <div key={wsId} className="flex items-center justify-between text-xs text-gray-700">
                                      <span className="truncate max-w-[200px] block">• {wsObj.name}</span>
                                      <span className={`text-[9px] font-bold ${wsPresent ? 'text-blue-600' : 'text-gray-400'}`}>
                                        {wsPresent ? '✓ Presente' : 'Não credenciado'}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )
                        )}

                        
                        {isPresent ? (
                          <div className="mt-2 bg-green-50 border border-green-100 p-2 rounded-lg flex items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-1.5 text-green-700 font-semibold">
                              <Award className="w-4 h-4" />
                              <span>Presença confirmada! Horas registradas no sistema.</span>
                            </div>
                          </div>
                        ) : (
                          <div className="mt-2 bg-gray-50 border border-gray-150 p-2.5 rounded-lg flex items-center gap-2 text-[10px] text-gray-500 italic">
                            <AlertCircle className="w-4 h-4 text-blue-600 shrink-0" />
                            <span>Controle de presença pendente. Apresente seu QR Code de entrada para contabilizar sua frequência.</span>
                          </div>
                        )}

                      </div>

                      
                      <div className="bg-gray-50 md:w-44 border-l max-md:border-t max-md:border-l-0 border-gray-200 p-5 flex flex-col items-center justify-center text-center gap-2">
                        {isApproved ? (
                          <>
                            <button 
                              onClick={() => {
                                setSelectedTicketForQr(selectedTicketForQr === en.id ? null : en.id);
                              }}
                              className="bg-white p-2.5 rounded-lg hover:bg-gray-100 cursor-pointer border border-gray-200 group transition-all"
                            >
                              <QrCode className="w-14 h-14 text-blue-600 group-hover:scale-103 transition-transform" />
                            </button>
                            <span className="text-[10px] font-mono tracking-tight font-black text-gray-500 uppercase mt-1">Check-in Pass</span>
                            <span className="text-[9px] text-gray-455 font-medium">Clique para abrir</span>
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center p-3 text-yellow-600">
                            <span className="text-[11px] font-bold uppercase block">Pendente</span>
                            <span className="text-[9px] text-gray-400 mt-1">Aguardando simulação de aprovação.</span>
                          </div>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>
            )}

          </div>

          
          {selectedTicketForQr && (() => {
            const ticket = studentEnrollments.find(e => e.id === selectedTicketForQr);
            if (!ticket) return null;
            return (
              <div className="bg-white border border-gray-250 rounded-2xl p-6 flex flex-col items-center justify-center text-center max-w-sm mx-auto shadow-2xl relative animate-in zoom-in-95 duration-100 text-gray-800">
                <button 
                  onClick={() => setSelectedTicketForQr(null)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-blue-600 cursor-pointer text-xs font-bold"
                >
                  ✕
                </button>
                
                <h4 className="text-gray-950 font-extrabold text-sm uppercase tracking-tight mb-1">Entrada Credencial</h4>
                <p className="text-[10px] text-gray-505 mb-4">{ticket.eventName}</p>

                
                <div className="relative bg-white p-4 rounded-xl border border-gray-200 shadow-inner mb-4 overflow-hidden group">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&color=1e293b&data=${encodeURIComponent(ticket.id)}`} 
                    alt="Digital Checkin QR Code"
                    className="w-40 h-40 object-contain mix-blend-multiply select-none"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute left-0 right-0 top-0 h-[2px] bg-blue-650 shadow shadow-blue-500/80 animate-bounce"></div>
                </div>

                <span className="text-xs font-mono font-black text-gray-700 bg-gray-105 py-1 px-3 rounded-md uppercase">
                  ID: {ticket.id.toUpperCase()}
                </span>
                
                <p className="text-[10px] text-gray-500 mt-3.5 max-w-[250px] leading-relaxed">
                  Apresente este código para o credenciador ou professor da palestra na entrada para registrar sua presença.
                </p>
              </div>
            );
          })()}

      </div>

    </div>
  );
}
