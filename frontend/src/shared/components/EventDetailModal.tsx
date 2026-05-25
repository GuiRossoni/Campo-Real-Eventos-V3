import React, { useState } from 'react';
import { Event, Workshop, User } from '../../types';
import { X, Calendar, MapPin, Users, CheckCircle2, Ticket, Sparkles } from 'lucide-react';
import { THEME } from '../styles/designSystem';

interface EventDetailModalProps {
  event: Event;
  workshops: Workshop[];
  alreadyEnrolled: boolean;
  onClose: () => void;
  onOpenCheckout: (selectedWorkshopIds: string[]) => void;
  currentUser: User | null;
  enrollment?: any;
  onUpdateWorkshops?: (selectedWorkshopIds: string[]) => void;
}

export default function EventDetailModal({
  event,
  workshops,
  alreadyEnrolled,
  onClose,
  onOpenCheckout,
  currentUser,
  enrollment,
  onUpdateWorkshops
}: EventDetailModalProps) {
  const [selectedWorkshops, setSelectedWorkshops] = useState<string[]>([]);

  React.useEffect(() => {
    if (alreadyEnrolled && enrollment && enrollment.selectedWorkshops) {
      setSelectedWorkshops(enrollment.selectedWorkshops);
    }
  }, [alreadyEnrolled, enrollment]);

  const basePrice = event.price;
  const workshopsPrice = selectedWorkshops.reduce((sum, id) => {
    const ws = workshops.find(w => w.id === id);
    return sum + (ws ? ws.price : 0);
  }, 0);
  const totalPrice = basePrice + workshopsPrice;

  const toggleWorkshop = (wsId: string) => {
    setSelectedWorkshops(prev => {
      if (prev.includes(wsId)) {
        return prev.filter(id => id !== wsId);
      } else {
        return [...prev, wsId];
      }
    });
  };

  const handleEnrollClick = () => {
    onOpenCheckout(selectedWorkshops);
  };

  return (
    <div className={THEME.eventDetailModal.overlay}>
      
      <div className={THEME.eventDetailModal.card}>
        
        <div className={THEME.eventDetailModal.sidePanel}>
          
          
          <div className={THEME.eventDetailModal.mediaWrap}>
            <img 
              src={event.banner} 
              alt={event.name} 
              referrerPolicy="no-referrer"
              className={THEME.eventDetailModal.mediaImage}
            />
            
            <div className={THEME.eventDetailModal.mediaOverlay}></div>
          </div>

          
          <div className={THEME.eventDetailModal.sideBody}>
            <span className={THEME.eventDetailModal.categoryBadge}>
              {event.category}
            </span>
            <h2 className={THEME.eventDetailModal.title}>
              {event.name}
            </h2>

            <div className={THEME.eventDetailModal.sideMetaList}>
              <div className={THEME.eventDetailModal.sideMetaRow}>
                <Calendar className={THEME.eventDetailModal.sideMetaIcon} />
                <span>{event.startDate.split('-').reverse().join('/')} {event.startDate !== event.endDate && ` a ${event.endDate.split('-').reverse().join('/')}`} às {event.startTime}h</span>
              </div>
              <div className={THEME.eventDetailModal.sideMetaRow}>
                <MapPin className={THEME.eventDetailModal.sideMetaIcon} />
                <span className="truncate">{event.location}</span>
              </div>
              <div className={THEME.eventDetailModal.sideMetaRow}>
                <Users className={THEME.eventDetailModal.sideMetaIcon} />
                <span>Capacidade: {event.maxParticipants} participantes</span>
              </div>
            </div>
            
            <div className={THEME.eventDetailModal.organizerWrap}>
              <div className={THEME.eventDetailModal.organizerAvatar}>
                {event.creatorName.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-gray-200 leading-none">Organizado por:</p>
                <p className="text-[10px] text-gray-300 mt-0.5">{event.creatorName}</p>
              </div>
            </div>
          </div>

          
          <button 
            onClick={onClose}
            className={THEME.eventDetailModal.mobileCloseBtn}
            aria-label="Minimizar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        
        <div className={THEME.eventDetailModal.contentWrap}>
          
          
          <button 
            onClick={onClose} 
            className={THEME.eventDetailModal.desktopCloseBtn}
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>

          <div className={THEME.eventDetailModal.contentBody}>
            
            
            <div>
              <h3 className={THEME.eventDetailModal.sectionTitleMuted}>Sobre o evento</h3>
              <p className={THEME.eventDetailModal.sectionText}>
                {event.description}
              </p>
            </div>

            
            <div>
              <div className={THEME.eventDetailModal.workshopsHeader}>
                <h3 className={THEME.eventDetailModal.workshopsTitle}>
                  Minicursos & Workshops Integrados
                </h3>
                <span className={THEME.eventDetailModal.workshopsHint}>Selecione para turbinar seu dia</span>
              </div>

              {workshops.length === 0 ? (
                <div className={THEME.eventDetailModal.emptyWorkshops}>
                  <p className={THEME.eventDetailModal.emptyWorkshopsText}>Nenhum workshop associado disponível para este evento acadêmico.</p>
                </div>
              ) : (
                <div className={THEME.eventDetailModal.workshopsList}>
                  {workshops.map((ws) => {
                    const wsRemaining = ws.maxParticipants - ws.enrolledCount;
                    const wsSoldOut = wsRemaining <= 0;
                    const isSelected = selectedWorkshops.includes(ws.id);
                    const isWsPaidObj = ws.price > 0;

                    return (
                      <div 
                        key={ws.id}
                        onClick={() => {
                          if (event.category === 'SEMANA ACADÊMICA' || !alreadyEnrolled) {
                            if (!wsSoldOut || isSelected) {
                              toggleWorkshop(ws.id);
                            }
                          }
                        }}
                        className={`${THEME.eventDetailModal.workshopItem} ${
                          isSelected 
                            ? THEME.eventDetailModal.workshopItemActive
                            : THEME.eventDetailModal.workshopItemDefault
                        } ${(wsSoldOut && !isSelected) ? THEME.eventDetailModal.workshopItemDisabled : ''}`}
                      >
                        
                        
                        <div className={THEME.eventDetailModal.workshopCheckWrap}>
                          <input 
                            type="checkbox"
                            checked={isSelected}
                            disabled={(event.category !== 'SEMANA ACADÊMICA' && alreadyEnrolled) || (wsSoldOut && !isSelected)}
                            onChange={() => {}}
                            className={THEME.eventDetailModal.workshopCheck}
                          />
                        </div>

                        <div className={THEME.eventDetailModal.workshopBody}>
                          <div className={THEME.eventDetailModal.workshopTop}>
                            <h4 className={THEME.eventDetailModal.workshopName}>
                              {ws.name}
                            </h4>
                            {isWsPaidObj && (
                              <span className={THEME.eventDetailModal.workshopPrice}>
                                + R$ {ws.price.toFixed(2)}
                              </span>
                            )}
                          </div>
                          
                          <p className={THEME.eventDetailModal.workshopDescription}>{ws.description}</p>
                          
                          <div className={THEME.eventDetailModal.workshopMeta}>
                            <span className={THEME.eventDetailModal.workshopInstructor}>Instrutor: {ws.instructor}</span>
                            <span>•</span>
                            <span>Horá: {ws.time}</span>
                            <span>•</span>
                            <span className={wsSoldOut ? THEME.eventDetailModal.workshopSpotsSoldOut : THEME.eventDetailModal.workshopSpots}>
                              {wsSoldOut ? 'Esgotado' : `${wsRemaining} vagas restantes`}
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

          
          <div className={THEME.eventDetailModal.footerWrap}>
            
            <div className={THEME.eventDetailModal.subtotalRow}>
              <div className={THEME.eventDetailModal.subtotalLeft}>
                <span className={THEME.eventDetailModal.subtotalLabel}>Resumo de Subtotal</span>
                <span className={THEME.eventDetailModal.subtotalHint}>Base (R$ {basePrice.toFixed(2)}) + Minicursos (R$ {workshopsPrice.toFixed(2)})</span>
              </div>
              <div className={THEME.eventDetailModal.totalWrap}>
                <span className={THEME.eventDetailModal.totalLabel}>Valor Total</span>
                <span className={THEME.eventDetailModal.totalValue}>
                  R$ {totalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            {alreadyEnrolled ? (
              <div className={THEME.eventDetailModal.alreadyWrap}>
                {event.category === 'SEMANA ACADÊMICA' ? (
                  <>
                    <div className={THEME.eventDetailModal.weekAlert}>
                      <Sparkles className="w-4 h-4 text-blue-650 shrink-0 mt-0.5 animate-pulse" />
                      <div className={THEME.eventDetailModal.weekAlertText}>
                        <strong className="text-blue-800">Inscrição Confirmada!</strong> Como este evento é uma <strong>Semana Acadêmica</strong>, você pode selecionar ou retirar suas oficinas e minicursos favoritos abaixo para atualizar sua grade de presença unificada.
                      </div>
                    </div>
                    
                    <div className={THEME.eventDetailModal.actionRow}>
                      <button 
                        onClick={onClose}
                        className={THEME.eventDetailModal.secondaryActionBtn}
                      >
                        Fechar
                      </button>
                      <button 
                        onClick={() => {
                          if (onUpdateWorkshops) {
                            onUpdateWorkshops(selectedWorkshops);
                          }
                        }}
                        className={THEME.eventDetailModal.primaryActionBtn}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Salvar Minha Grade de Workshops</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className={THEME.eventDetailModal.alreadyOk}>
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span className="font-semibold">Você já está inscrito neste evento! Consulte seus ingressos no perfil.</span>
                  </div>
                )}
              </div>
            ) : (
              <div className={THEME.eventDetailModal.actionRow}>
                <button 
                  onClick={onClose}
                  className={THEME.eventDetailModal.secondaryActionBtn}
                >
                  Fechar
                </button>
                <button 
                  onClick={handleEnrollClick}
                  className={THEME.eventDetailModal.primaryActionBtn}
                >
                  <Ticket className="w-4 h-4" />
                  <span>Inscrever-se Agora</span>
                </button>
              </div>
            )}

            {!currentUser && (
              <p className={THEME.eventDetailModal.guestHint}>
                📌 Você não possui sessão ativa. Uma conta temporária será criada automaticamente ou faça login primeiro para vincular.
              </p>
            )}

          </div>

        </div>

      </div>
      
    </div>
  );
}
