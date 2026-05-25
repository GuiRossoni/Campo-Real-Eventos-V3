import React, { useState } from 'react';
import { Event, Enrollment } from '../../types';
import { Calendar, MapPin, Users, Ticket, ArrowUpRight } from 'lucide-react';
import { THEME } from '../styles/designSystem';

interface EventGridProps {
  events: Event[];
  enrollments: Enrollment[];
  searchQuery: string;
  onSelectEvent: (eventId: string) => void;
  onQuickCreateEvent?: () => void;
}

export default function EventGrid({ events, enrollments, searchQuery, onSelectEvent, onQuickCreateEvent }: EventGridProps) {
  const [activeCategory, setActiveCategory] = useState<string>('TODOS');
  const [activeTab, setActiveTab] = useState<'PROXIMOS' | 'ENCERRADOS'>('PROXIMOS');

  const categories = ['TODOS', 'PALESTRA', 'WORKSHOP', 'SEMANA ACADÊMICA', 'CONGRESSO'];

  const nowStr = new Date().toISOString().split('T')[0];

  const getRemainingSeats = (event: Event) => {
    const approvedCount = enrollments.filter(e => e.eventId === event.id && e.status === 'APROVADO').length;
    const remaining = event.maxParticipants - approvedCount;
    return remaining < 0 ? 0 : remaining;
  };

  const filteredEvents = events.filter(event => {
    
    if (event.status !== 'PUBLICADO' && event.status !== 'ENCERRADO') return false;

    
    const matchesSearch = 
      event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    
    if (activeCategory !== 'TODOS' && event.category.toUpperCase() !== activeCategory.toUpperCase()) {
      return false;
    }

    
    const isEnded = event.status === 'ENCERRADO' || event.endDate < '2026-06-01';
    if (activeTab === 'PROXIMOS' && isEnded) return false;
    if (activeTab === 'ENCERRADOS' && !isEnded) return false;

    return true;
  });

  const formatDateBR = (startDateStr: string, endDateStr: string) => {
    const months = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
    const start = new Date(startDateStr + 'T00:00:00');
    
    if (!startDateStr) return '';
    const startDay = start.getDate();
    const startMonthNum = start.getMonth();
    const startMonth = months[startMonthNum];

    if (startDateStr === endDateStr) {
      return `${startDay} ${startMonth}`;
    }

    const end = new Date(endDateStr + 'T00:00:00');
    const endDay = end.getDate();
    const endMonthNum = end.getMonth();
    const endMonth = months[endMonthNum];

    if (startMonth === endMonth) {
      return `${startDay} a ${endDay} ${startMonth}`;
    } else {
      return `${startDay} ${startMonth} a ${endDay} ${endMonth}`;
    }
  };

  return (
    <section id="eventos" className={THEME.eventGrid.section}>
      
      
      <div className={THEME.eventGrid.headerWrap}>
        <div>
          <h2 className={THEME.eventGrid.title}>
            <span>Próximos</span>
            <span className={THEME.eventGrid.titleHighlight}>Eventos</span>
          </h2>
          <p className={THEME.eventGrid.subtitle}>Conheça o que há de melhor em conhecimento aplicado no seu curso acadêmico.</p>
        </div>

        
        <div className={THEME.eventGrid.tabsWrap}>
          <button 
            onClick={() => setActiveTab('PROXIMOS')}
            className={`${THEME.eventGrid.tabBtn} ${activeTab === 'PROXIMOS' ? THEME.eventGrid.tabBtnActive : THEME.eventGrid.tabBtnInactive}`}
          >
            Próximos Eventos
          </button>
          <button 
            onClick={() => setActiveTab('ENCERRADOS')}
            className={`${THEME.eventGrid.tabBtn} ${activeTab === 'ENCERRADOS' ? THEME.eventGrid.tabBtnActive : THEME.eventGrid.tabBtnInactive}`}
          >
            Eventos Encerrados
          </button>
        </div>
      </div>

      
      <div className={THEME.eventGrid.categoriesWrap}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`${THEME.eventGrid.categoryBtn} ${
              activeCategory === cat 
                ? THEME.eventGrid.categoryBtnActive
                : THEME.eventGrid.categoryBtnInactive
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      
      {filteredEvents.length === 0 ? (
        <div className={THEME.eventGrid.emptyWrap}>
          <Ticket className={THEME.eventGrid.emptyIcon} />
          <h3 className={THEME.eventGrid.emptyTitle}>Nenhum evento encontrado</h3>
          <p className={THEME.eventGrid.emptyText}>Tente redefinir seus termos de busca ou mudar a categoria ativa para buscar mais opções.</p>
        </div>
      ) : (
        <div className={THEME.eventGrid.cardsGrid}>
          {filteredEvents.map((event) => {
            const seatsRemaining = getRemainingSeats(event);
            const isSoldOut = seatsRemaining === 0 && event.maxParticipants > 0;
            const eventDateText = formatDateBR(event.startDate, event.endDate);
            const priceText = event.price === 0 ? 'Gratuito' : `R$ ${event.price.toFixed(2)}`;

            return (
              <div
                key={event.id}
                onClick={() => onSelectEvent(event.id)}
                className={THEME.eventGrid.card}
              >
                <div>
                  
                  <div className={THEME.eventGrid.cardMediaWrap}>
                    <img 
                      src={event.banner} 
                      alt={event.name} 
                      referrerPolicy="no-referrer"
                      className={THEME.eventGrid.cardMedia}
                    />
                    
                    
                    <div className={THEME.eventGrid.cardMediaOverlay}></div>

                    
                    <span className={THEME.eventGrid.cardCategory}>
                      {event.category}
                    </span>

                    
                    <span className={THEME.eventGrid.cardPrice}>
                      {priceText}
                    </span>
                  </div>

                  
                  <div className={THEME.eventGrid.cardBody}>
                    
                    
                    <h3 className={THEME.eventGrid.cardTitle}>
                      {event.name}
                    </h3>

                    
                    <div className={THEME.eventGrid.cardMetaRow}>
                      <Calendar className={THEME.eventGrid.iconSmallBlue} />
                      <span>{eventDateText} • {event.startTime}h</span>
                    </div>

                    
                    <div className={THEME.eventGrid.cardMetaRowSecondary}>
                      <MapPin className={THEME.eventGrid.iconSmallGray} />
                      <span className="truncate">{event.location}</span>
                    </div>

                  </div>
                </div>

                
                <div className={THEME.eventGrid.cardFooter}>
                  
                  {isSoldOut ? (
                    <span className={THEME.eventGrid.soldOut}>Esgotado</span>
                  ) : event.maxParticipants > 0 ? (
                    <div className={THEME.eventGrid.seatsWrap}>
                      <Users className={THEME.eventGrid.iconSmallBlue} />
                      <span className={THEME.eventGrid.seatsCount}>{seatsRemaining}</span>
                      <span>vagas restando</span>
                    </div>
                  ) : (
                    <span>Entrada Livre</span>
                  )}

                  <div className={THEME.eventGrid.ctaMini}>
                    <span>Garantir</span>
                    <ArrowUpRight className={THEME.eventGrid.arrowIconSmall} />
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

      
      <div className={THEME.eventGrid.highlightWrap}>
        
        
        <div className={THEME.eventGrid.highlightGlow}></div>

        <div className={THEME.eventGrid.highlightBody}>
          <span className={THEME.eventGrid.highlightLabel}>CRIAR EVENTO</span>
          <h2 className={THEME.eventGrid.highlightTitle}>
            Transforme sua ideia em um grande evento.
          </h2>
          <p className={THEME.eventGrid.highlightText}>
            Publique, divulgue e gerencie seu evento de forma simples, integrada e totalmente eficiente com o aval da nossa coordenação de curso.
          </p>
        </div>

        <div>
          <button
            onClick={onQuickCreateEvent}
            className={THEME.eventGrid.highlightBtn}
          >
            Criar Evento
          </button>
        </div>

      </div>

    </section>
  );
}
