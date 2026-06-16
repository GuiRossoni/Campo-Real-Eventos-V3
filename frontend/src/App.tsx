import React, { useState, useEffect } from 'react';
import Header from './shared/components/Header';
import HeroCarrossel from './shared/components/HeroCarrossel';
import EventGrid from './shared/components/EventGrid';
import EventDetailModal from './shared/components/EventDetailModal';
import CheckoutModal from './shared/components/CheckoutModal';
import DashboardAluno from './shared/components/DashboardAluno';
import DashboardProfessor from './shared/components/DashboardProfessor';
import DashboardCoordenador from './shared/components/DashboardCoordenador';
import AuthModal from './shared/components/AuthModal';
import Footer from './shared/components/Footer';
import LoginLanding from './shared/components/LoginLanding';
import SobreNos from './shared/components/SobreNos';
import ComoFunciona from './shared/components/ComoFunciona';
import AjudaFaq from './shared/components/AjudaFaq';
import PoliticaPrivacidade from './shared/components/PoliticaPrivacidade';
import { DB } from './shared/utils/db';
import { User, Event, Workshop, Enrollment, Attendance, HomeBanner, SystemLog, FinancialSettings } from './types';
import { Users, FileCode, Play, AlertCircle, Sparkles, BookOpen } from 'lucide-react';

export default function App() {
  const [dbLoaded, setDbLoaded] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [banners, setBanners] = useState<HomeBanner[]>([]);
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const [activePage, setActivePage] = useState<'home' | 'sobre' | 'como' | 'ajuda' | 'privacidade'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [showCheckoutForWsIds, setShowCheckoutForWsIds] = useState<string[] | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [forceCreateEvent, setForceCreateEvent] = useState(false);
  const [financialSettings, setFinancialSettings] = useState<FinancialSettings>(DB.getFinancialSettings());
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('cre_theme_mode');
    return savedTheme === 'dark' ? 'dark' : 'light';
  });

  const reloadFromDB = () => {
    DB.init();
    setCurrentUser(DB.getCurrentUser());
    setEvents(DB.getEvents());
    setWorkshops(DB.getWorkshops());
    setEnrollments(DB.getEnrollments());
    setAttendances(DB.getAttendance());
    setBanners(DB.getBanners());
    setLogs(DB.getLogs());
    setUsers(DB.getUsers());
    setFinancialSettings(DB.getFinancialSettings());
  };

  useEffect(() => {
    localStorage.setItem('cre_theme_mode', themeMode);
  }, [themeMode]);

  const handleQuickCreateEvent = () => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }
    
    if (currentUser.role === 'PROFESSOR') {
      setForceCreateEvent(true);
      setTimeout(() => {
        const target = document.getElementById('dashboard-top');
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else if (currentUser.role === 'COORDENADOR' || currentUser.role === 'ROOT') {
      const allUsers = DB.getUsers();
      const profUser = allUsers.find(u => u.role === 'PROFESSOR');
      if (profUser) {
        DB.setCurrentUser(profUser);
        setIsGuestMode(false);
        reloadFromDB();
        setForceCreateEvent(true);
        setTimeout(() => {
          const target = document.getElementById('dashboard-top');
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
        alert('Alternando para conta de professor cadastrada para iniciar a criação do evento.');
      } else {
        alert('Erro ao localizar conta docente vinculada para criação de evento.');
      }
    } else {
      alert('Seu perfil de login é de "Aluno" e não possui permissão para criar eventos.');
    }
  };

  useEffect(() => {
    reloadFromDB();
    setDbLoaded(true);
    DB.syncWithBackend(() => {
      reloadFromDB();
    });
  }, []);

  const handleLogout = () => {
    DB.setCurrentUser(null);
    setCurrentUser(null);
    setIsGuestMode(false);
    setActivePage('home');
    reloadFromDB();
    alert('Sessão encerrada com sucesso!');
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setIsGuestMode(false);
    setActivePage('home');
    reloadFromDB();
  };

  const handleConfirmCheckout = (paymentOption: 'PIX' | 'GRATUITO') => {
    if (!selectedEventId) return;

    try {
      let userIdToUse = currentUser?.id;
      if (!userIdToUse) {
        const fallbackEmail = 'visitante.demonstracao@camporeal.edu.br';
        const allU = DB.getUsers();
        let fallbackMatch = allU.find(u => u.email === fallbackEmail);
        if (!fallbackMatch) {
          fallbackMatch = DB.registerUser({
            name: 'Visitante Demonstrativo',
            email: fallbackEmail,
            role: 'ALUNO',
            ra: '202611888',
            course: 'Engenharia de Software',
            period: '1º Período'
          });
        }
        DB.setCurrentUser(fallbackMatch);
        userIdToUse = fallbackMatch.id;
      }

      DB.createEnrollment({
        userId: userIdToUse,
        eventId: selectedEventId,
        selectedWorkshops: showCheckoutForWsIds || [],
        paymentOption
      });

      setShowCheckoutForWsIds(null);
      setSelectedEventId(null);
      reloadFromDB();
    } catch (err: any) {
      alert(err.message || 'Erro ao efetivar checkout.');
    }
  };

  if (!dbLoaded) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] text-gray-800 flex items-center justify-center font-sans tracking-tight">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
          <span className="text-xs text-gray-500 mt-2 font-medium">Buscando tabelas relacionais Campo Real...</span>
        </div>
      </div>
    );
  }

  if (currentUser === null && !isGuestMode && activePage === 'home') {
    return (
      <LoginLanding 
        onLoginSuccess={handleLoginSuccess}
        onContinueAsGuest={() => setIsGuestMode(true)}
        onNavigate={(page) => {
          setActivePage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    );
  }

  const trackingEvent = selectedEventId ? events.find(e => e.id === selectedEventId) : null;
  const trackingWorkshops = selectedEventId ? workshops.filter(w => w.eventId === selectedEventId) : [];
  const trackingAlreadyEnrolled = (currentUser && selectedEventId) 
    ? enrollments.some(e => e.userId === currentUser.id && e.eventId === selectedEventId && e.status !== 'CANCELADO')
    : false;

  const trackingEnrollment = (currentUser && selectedEventId)
    ? enrollments.find(e => e.userId === currentUser.id && e.eventId === selectedEventId && e.status !== 'CANCELADO')
    : null;

  const handleUpdateWorkshops = (selectedWsIds: string[]) => {
    if (!selectedEventId || !trackingEnrollment) return;
    try {
      DB.updateEnrollmentWorkshops(trackingEnrollment.id, selectedWsIds);
      reloadFromDB();
      alert('Grade de workshops atualizada com sucesso!');
    } catch (err: any) {
      alert(err.message || 'Erro ao atualizar workshops.');
    }
  };

  return (
    <div className={`min-h-screen bg-[#F8F9FA] text-gray-950 flex flex-col font-sans antialiased overflow-x-hidden selection:bg-blue-600 selection:text-white ${themeMode === 'dark' ? 'theme-dark' : ''}`}>
      
      <Header 
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenAuth={() => setShowAuthModal(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onQuickCreateEvent={handleQuickCreateEvent}
        onProfileUpdated={reloadFromDB}
        themeMode={themeMode}
        onToggleTheme={() => setThemeMode(prev => prev === 'light' ? 'dark' : 'light')}
        onLogoClick={() => {
          setSearchQuery('');
          setSelectedEventId(null);
          setActivePage('home');
          if (isGuestMode) {
            setIsGuestMode(false);
          }
        }}
      />

      {activePage === 'sobre' && <SobreNos onBackToHome={() => setActivePage('home')} />}
      {activePage === 'como' && <ComoFunciona onBackToHome={() => setActivePage('home')} />}
      {activePage === 'ajuda' && <AjudaFaq onBackToHome={() => setActivePage('home')} />}
      {activePage === 'privacidade' && <PoliticaPrivacidade onBackToHome={() => setActivePage('home')} />}

      {activePage === 'home' && (
        <>
          {!currentUser && (
            <HeroCarrossel 
              banners={banners}
              events={events}
              onSelectEvent={(id) => setSelectedEventId(id)}
            />
          )}

          {currentUser && (
            <main className="flex-1">
              {currentUser.role === 'ALUNO' && (
                <DashboardAluno 
                  currentUser={currentUser}
                  enrollments={enrollments}
                  events={events}
                  workshops={workshops}
                  attendances={attendances}
                  onProfileUpdated={reloadFromDB}
                  onSelectEvent={(id) => setSelectedEventId(id)}
                />
              )}

              {currentUser.role === 'PROFESSOR' && (
                <DashboardProfessor 
                  currentUser={currentUser}
                  events={events}
                  workshops={workshops}
                  enrollments={enrollments}
                  attendances={attendances}
                  onDataChanged={reloadFromDB}
                  forceCreateTab={forceCreateEvent}
                  onTabOpened={() => setForceCreateEvent(false)}
                />
              )}

              {(currentUser.role === 'COORDENADOR' || currentUser.role === 'ROOT') && (
                <DashboardCoordenador 
                  currentUser={currentUser}
                  events={events}
                  workshops={workshops}
                  enrollments={enrollments}
                  logs={logs}
                  banners={banners}
                  systemUsers={users}
                  financialSettings={financialSettings}
                  onDataChanged={reloadFromDB}
                />
              )}
            </main>
          )}

          {(!currentUser || (currentUser.role !== 'PROFESSOR' && currentUser.role !== 'COORDENADOR' && currentUser.role !== 'ROOT')) && (
            <div className="mt-4">
              <EventGrid 
                events={events}
                enrollments={enrollments}
                searchQuery={searchQuery}
                onSelectEvent={(id) => setSelectedEventId(id)}
                onQuickCreateEvent={handleQuickCreateEvent}
              />
            </div>
          )}
        </>
      )}

      <Footer onNavigate={(page) => {
        setActivePage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }} />

      {trackingEvent && showCheckoutForWsIds === null && (
        <EventDetailModal 
          event={trackingEvent}
          workshops={trackingWorkshops}
          alreadyEnrolled={trackingAlreadyEnrolled}
          currentUser={currentUser}
          enrollment={trackingEnrollment}
          onUpdateWorkshops={handleUpdateWorkshops}
          onClose={() => setSelectedEventId(null)}
          onOpenCheckout={(wsIds) => setShowCheckoutForWsIds(wsIds)}
        />
      )}

      {trackingEvent && showCheckoutForWsIds !== null && (
        <CheckoutModal 
          event={trackingEvent}
          selectedWorkshops={workshops.filter(w => showCheckoutForWsIds.includes(w.id))}
          pixKey={financialSettings.pixKey}
          pixReceiverName={financialSettings.pixReceiverName}
          onClose={() => setShowCheckoutForWsIds(null)}
          onConfirm={handleConfirmCheckout}
        />
      )}

      {showAuthModal && (
        <AuthModal 
          onClose={() => setShowAuthModal(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

    </div>
  );
}
