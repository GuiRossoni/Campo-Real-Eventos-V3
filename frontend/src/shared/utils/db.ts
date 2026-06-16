import { User, Event, Workshop, Enrollment, Attendance, HomeBanner, SystemLog, PaymentStatus, FinancialExpense, FinancialSettings, PaymentOption } from '../../types';
import {
  SEEDED_USERS,
  SEEDED_EVENTS,
  SEEDED_WORKSHOPS,
  SEEDED_ENROLLMENTS,
  SEEDED_ATTENDANCE,
  SEEDED_BANNERS,
  SEEDED_LOGS,
  SEEDED_EXPENSES
} from '../../data/seedData';

const KEYS = {
  USERS: 'cre_users',
  EVENTS: 'cre_events',
  WORKSHOPS: 'cre_workshops',
  ENROLLMENTS: 'cre_enrollments',
  ATTENDANCE: 'cre_attendance',
  BANNERS: 'cre_banners',
  LOGS: 'cre_logs',
  CURRENT_USER: 'cre_current_user',
  EXPENSES: 'cre_expenses',
  FINANCIAL_SETTINGS: 'cre_financial_settings'
};

const DEFAULT_FINANCIAL_SETTINGS: FinancialSettings = {
  pixKey: '',
  pixReceiverName: 'Campo Real Eventos',
  updatedAt: new Date(0).toISOString()
};

function read<T>(key: string, defaultData: T): T {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(defaultData));
    return defaultData;
  }
  try {
    return JSON.parse(data) as T;
  } catch {
    return defaultData;
  }
}

function write<T>(key: string, data: T): void {
  localStorage.setItem(key, JSON.stringify(data));
}

function apiPost(endpoint: string, body: any): void {
  fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  }).catch(err => {
    console.warn(`[MySQL Sync Warning] Não foi possível sincronizar o endpoint ${endpoint}:`, err.message);
  });
}

export const DB = {
  init(): void {
    read<User[]>(KEYS.USERS, SEEDED_USERS);
    read<Event[]>(KEYS.EVENTS, SEEDED_EVENTS);
    read<Workshop[]>(KEYS.WORKSHOPS, SEEDED_WORKSHOPS);
    read<Enrollment[]>(KEYS.ENROLLMENTS, SEEDED_ENROLLMENTS);
    read<Attendance[]>(KEYS.ATTENDANCE, SEEDED_ATTENDANCE);
    read<HomeBanner[]>(KEYS.BANNERS, SEEDED_BANNERS);
    read<SystemLog[]>(KEYS.LOGS, SEEDED_LOGS);
    read<FinancialExpense[]>(KEYS.EXPENSES, SEEDED_EXPENSES);
    read<FinancialSettings>(KEYS.FINANCIAL_SETTINGS, DEFAULT_FINANCIAL_SETTINGS);
  },

  async syncWithBackend(onSuccess?: () => void): Promise<void> {
    try {
      const response = await fetch('/api/db/get-state');
      const json = await response.json();
      if (json && json.success && json.data) {
        const d = json.data;
        
        write(KEYS.USERS, d.users);
        write(KEYS.EVENTS, d.events);
        write(KEYS.WORKSHOPS, d.workshops);
        write(KEYS.ENROLLMENTS, d.enrollments);
        write(KEYS.ATTENDANCE, d.attendance);
        write(KEYS.BANNERS, d.banners);
        write(KEYS.LOGS, d.logs);
        
        if (d.expenses) {
          write(KEYS.EXPENSES, d.expenses);
        }

        if (d.financialSettings) {
          write(KEYS.FINANCIAL_SETTINGS, d.financialSettings);
        }

        const curUser = this.getCurrentUser();
        if (curUser) {
          const matchedUser = (d.users as User[]).find(u => u.id === curUser.id);
          if (matchedUser) {
            this.setCurrentUser(matchedUser);
          }
        }
        
        console.log('⚡ [MySQL Full-Sync] Cache local sincronizado com tabelas MySQL do servidor!');
        if (onSuccess) onSuccess();
      }
    } catch (e: any) {
      console.warn('⚠️ [MySQL Sync] Servidor inacessível para sincronização total. Operando no modo local cache.', e.message);
    }
  },

  addLog(action: string, email: string, role: string, details: string): void {
    const logs = read<SystemLog[]>(KEYS.LOGS, []);
    const newLog: SystemLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      action,
      userEmail: email,
      userRole: role as any,
      details,
      timestamp: new Date().toISOString()
    };
    logs.unshift(newLog);
    write(KEYS.LOGS, logs);

    apiPost('/api/db/write-log', newLog);
  },

  getLogs(): SystemLog[] {
    return read<SystemLog[]>(KEYS.LOGS, []);
  },

  getCurrentUser(): User | null {
    const u = localStorage.getItem(KEYS.CURRENT_USER);
    if (!u) return null;
    try {
      return JSON.parse(u) as User;
    } catch {
      return null;
    }
  },

  setCurrentUser(user: User | null): void {
    if (user) {
      localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(KEYS.CURRENT_USER);
    }
  },

  getUsers(): User[] {
    return read<User[]>(KEYS.USERS, SEEDED_USERS);
  },

  updateUser(id: string, updatedFields: Partial<User>): User {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === id);
    if (idx === -1) throw new Error('Usuário não encontrado');
    users[idx] = { ...users[idx], ...updatedFields };
    write(KEYS.USERS, users);
    
    const cur = this.getCurrentUser();
    if (cur && cur.id === id) {
      this.setCurrentUser(users[idx]);
    }

    apiPost('/api/db/write-user-update', { id, updatedFields });

    return users[idx];
  },

  registerUser(user: Omit<User, 'id'> & { password?: string }): User {
    const users = this.getUsers();
    if (users.some(u => u.email.toLowerCase() === user.email.toLowerCase())) {
      throw new Error('E-mail já cadastrado no sistema.');
    }
    const newUser: User = {
      ...user,
      id: `user_${Date.now()}`
    };
    users.push(newUser);
    write(KEYS.USERS, users);
    
    this.addLog(
      'USER_REGISTER',
      user.email,
      user.role,
      `Novo usuário registrado: ${user.name} como ${user.role}`
    );

    apiPost('/api/db/write-user-register', newUser);

    return newUser;
  },

  getEvents(): Event[] {
    return read<Event[]>(KEYS.EVENTS, SEEDED_EVENTS);
  },

  saveEvent(event: Omit<Event, 'id' | 'status' | 'creatorId' | 'creatorName'>, creator: User): Event {
    const events = this.getEvents();
    const newEvent: Event = {
      ...event,
      id: `event_${Date.now()}`,
      status: (creator.role === 'COORDENADOR' || creator.role === 'ROOT') ? 'PUBLICADO' : 'ANALISE',
      creatorId: creator.id,
      creatorName: creator.name,
      isFeatured: false
    };
    events.unshift(newEvent);
    write(KEYS.EVENTS, events);
    
    this.addLog(
      'CREATE_EVENT',
      creator.email,
      creator.role,
      `Criou o evento "${event.name}" (Status: ${newEvent.status})`
    );

    apiPost('/api/db/write-event-save', newEvent);

    return newEvent;
  },

  updateEvent(id: string, updatedFields: Partial<Event>, actor: User): Event {
    const events = this.getEvents();
    const idx = events.findIndex(e => e.id === id);
    if (idx === -1) throw new Error('Evento não encontrado');
    
    if (actor.role !== 'COORDENADOR' && actor.role !== 'ROOT' && events[idx].creatorId !== actor.id) {
      throw new Error('Apenas o criador deste evento ou o coordenador/root podem editá-lo.');
    }

    events[idx] = { ...events[idx], ...updatedFields };
    write(KEYS.EVENTS, events);

    this.addLog(
      'UPDATE_EVENT',
      actor.email,
      actor.role,
      `Editou o evento "${events[idx].name}". Mudanças aplicadas.`
    );

    apiPost('/api/db/write-event-update', { id, updatedFields });

    return events[idx];
  },

  approveEvent(id: string, approve: boolean, actor: User): Event {
    if (actor.role !== 'COORDENADOR' && actor.role !== 'ROOT') throw new Error('Apenas o coordenador ou root podem aprovar eventos.');
    const events = this.getEvents();
    const idx = events.findIndex(e => e.id === id);
    if (idx === -1) throw new Error('Evento não encontrado');

    events[idx].status = approve ? 'PUBLICADO' : 'CANCELADO';
    write(KEYS.EVENTS, events);

    this.addLog(
      approve ? 'APPROVE_EVENT' : 'REJECT_EVENT',
      actor.email,
      actor.role,
      `Coordenador ${approve ? 'aprovou' : 'reprovou'} o evento "${events[idx].name}"`
    );

    apiPost('/api/db/write-event-update', { id, updatedFields: { status: events[idx].status } });

    return events[idx];
  },

  deleteEvent(id: string, actor: User): void {
    const events = this.getEvents();
    const idx = events.findIndex(e => e.id === id);
    if (idx === -1) throw new Error('Evento não encontrado');

    if (actor.role !== 'COORDENADOR' && actor.role !== 'ROOT' && events[idx].creatorId !== actor.id) {
      throw new Error('Apenas o criador deste evento ou o coordenador/root podem remover eventos.');
    }

    const filtered = events.filter(e => e.id !== id);
    write(KEYS.EVENTS, filtered);

    this.addLog(
      'DELETE_EVENT',
      actor.email,
      actor.role,
      `Removeu o evento de ID: ${id} e título: "${events[idx].name}"`
    );

    apiPost('/api/db/write-event-delete', { id });
  },

  getWorkshops(eventId?: string): Workshop[] {
    const all = read<Workshop[]>(KEYS.WORKSHOPS, SEEDED_WORKSHOPS);
    if (eventId) {
      return all.filter(w => w.eventId === eventId);
    }
    return all;
  },

  saveWorkshop(workshop: Omit<Workshop, 'id' | 'enrolledCount'>, actor: User): Workshop {
    const workshops = this.getWorkshops();
    const newWs: Workshop = {
      ...workshop,
      id: `ws_${Date.now()}`,
      enrolledCount: 0
    };
    workshops.push(newWs);
    write(KEYS.WORKSHOPS, workshops);

    this.addLog(
      'CREATE_WORKSHOP',
      actor.email,
      actor.role,
      `Criou o workshop "${workshop.name}" para o evento de ID ${workshop.eventId}`
    );

    apiPost('/api/db/write-workshop-save', newWs);

    return newWs;
  },

  updateWorkshop(id: string, updatedFields: Partial<Workshop>, actor: User): Workshop {
    const workshops = this.getWorkshops();
    const idx = workshops.findIndex(w => w.id === id);
    if (idx === -1) throw new Error('Workshop não encontrado');

    const updated = {
      ...workshops[idx],
      ...updatedFields
    };
    workshops[idx] = updated;
    write(KEYS.WORKSHOPS, workshops);

    this.addLog(
      'UPDATE_WORKSHOP',
      actor.email,
      actor.role,
      `Editou o workshop "${updated.name}"`
    );

    apiPost('/api/db/write-workshop-save', updated);

    return updated;
  },

  deleteWorkshop(id: string, actor: User): void {
    const workshops = this.getWorkshops();
    const ws = workshops.find(w => w.id === id);
    const filtered = workshops.filter(w => w.id !== id);
    write(KEYS.WORKSHOPS, filtered);

    this.addLog(
      'DELETE_WORKSHOP',
      actor.email,
      actor.role,
      `Removeu o workshop "${ws?.name || id}"`
    );

    apiPost('/api/db/write-workshop-delete', { id });
  },

  getEnrollments(userId?: string): Enrollment[] {
    const all = read<Enrollment[]>(KEYS.ENROLLMENTS, SEEDED_ENROLLMENTS);
    if (userId) {
      return all.filter(e => e.userId === userId);
    }
    return all;
  },

  createEnrollment(params: {
    userId: string;
    eventId: string;
    selectedWorkshops: string[];
    paymentOption: PaymentOption;
  }): Enrollment {
    const users = this.getUsers();
    const events = this.getEvents();
    const workshops = this.getWorkshops();

    const user = users.find(u => u.id === params.userId);
    const event = events.find(e => e.id === params.eventId);
    if (!user || !event) throw new Error('Usuário ou Evento inválido');

    const existing = this.getEnrollments(params.userId).find(en => en.eventId === params.eventId && en.status !== 'CANCELADO');
    if (existing) {
      throw new Error('Você já possui uma inscrição ativa neste evento principal.');
    }

    const activeEnrollmentsForEvent = this.getEnrollments().filter(e => e.eventId === params.eventId && e.status === 'APROVADO');
    if (activeEnrollmentsForEvent.length >= event.maxParticipants) {
      throw new Error('Desculpe, o limite de vagas para este evento foi atingido.');
    }

    let totalValue = event.price;
    const selectedWsObjects: Workshop[] = [];

    params.selectedWorkshops.forEach(wsId => {
      const ws = workshops.find(w => w.id === wsId);
      if (ws) {
        if (ws.enrolledCount >= ws.maxParticipants) {
          throw new Error(`Desculpe, o workshop "${ws.name}" não possui mais vagas.`);
        }
        selectedWsObjects.push(ws);
        totalValue += ws.price;
      }
    });

    const newEnrollment: Enrollment = {
      id: `enroll_${Date.now()}`,
      userId: user.id,
      userEmail: user.email,
      userName: user.name,
      userRa: user.ra,
      eventId: event.id,
      eventName: event.name,
      selectedWorkshops: params.selectedWorkshops,
      totalValue,
      paymentOption: totalValue > 0 ? params.paymentOption : 'GRATUITO',
      status: totalValue > 0 ? 'PENDENTE' : 'APROVADO',
      createdAt: new Date().toISOString()
    };

    const allEnroll = this.getEnrollments();
    allEnroll.push(newEnrollment);
    write(KEYS.ENROLLMENTS, allEnroll);

    if (newEnrollment.status === 'APROVADO') {
      this.applyEnrollmentCapacityIncreases(params.selectedWorkshops);
    }

    this.addLog(
      'CHECKOUT_CONFIRMED',
      user.email,
      user.role,
      `Criou inscrição no evento "${event.name}" com valor total R$ ${totalValue.toFixed(2)}`
    );

    apiPost('/api/db/write-enrollment-save', newEnrollment);

    return newEnrollment;
  },

  applyEnrollmentCapacityIncreases(workshopIds: string[]): void {
    const workshops = read<Workshop[]>(KEYS.WORKSHOPS, []);
    const updated = workshops.map(w => {
      if (workshopIds.includes(w.id)) {
        return { ...w, enrolledCount: w.enrolledCount + 1 };
      }
      return w;
    });
    write(KEYS.WORKSHOPS, updated);

    apiPost('/api/db/write-workshop-increment', { workshopIds });
  },

  updateEnrollmentStatus(id: string, status: PaymentStatus, actor: User): Enrollment {
    const all = this.getEnrollments();
    const idx = all.findIndex(e => e.id === id);
    if (idx === -1) throw new Error('Inscrição não encontrada');

    const oldStatus = all[idx].status;
    all[idx].status = status;
    write(KEYS.ENROLLMENTS, all);

    if (status === 'APROVADO' && oldStatus !== 'APROVADO') {
      this.applyEnrollmentCapacityIncreases(all[idx].selectedWorkshops);
    }

    this.addLog(
      'UPDATE_PAYMENT',
      actor.email,
      actor.role,
      `Alterou pagamento da inscrição ${id} para ${status}`
    );

    apiPost('/api/db/write-enrollment-status', { id, status });

    return all[idx];
  },

  updateEnrollmentWorkshops(enrollmentId: string, newWorkshopIds: string[]): Enrollment {
    const allEnroll = this.getEnrollments();
    const idx = allEnroll.findIndex(e => e.id === enrollmentId);
    if (idx === -1) throw new Error('Inscrição não encontrada');

    const enrollment = allEnroll[idx];
    const oldWorkshops = enrollment.selectedWorkshops || [];

    const added = newWorkshopIds.filter(id => !oldWorkshops.includes(id));
    const removed = oldWorkshops.filter(id => !newWorkshopIds.includes(id));

    const workshops = this.getWorkshops();
    added.forEach(wsId => {
      const ws = workshops.find(w => w.id === wsId);
      if (ws && ws.enrolledCount >= ws.maxParticipants) {
        throw new Error(`Desculpe, o workshop "${ws.name}" não possui mais vagas.`);
      }
    });

    const updatedWorkshops = workshops.map(w => {
      let enrolledCount = w.enrolledCount;
      if (added.includes(w.id)) {
        enrolledCount = enrolledCount + 1;
      }
      if (removed.includes(w.id)) {
        enrolledCount = Math.max(0, enrolledCount - 1);
      }
      return { ...w, enrolledCount };
    });
    write(KEYS.WORKSHOPS, updatedWorkshops);

    const event = this.getEvents().find(e => e.id === enrollment.eventId);
    let totalValue = event ? event.price : 0;
    newWorkshopIds.forEach(wsId => {
      const ws = updatedWorkshops.find(w => w.id === wsId);
      if (ws) {
        totalValue += ws.price;
      }
    });

    enrollment.selectedWorkshops = newWorkshopIds;
    enrollment.totalValue = totalValue;

    if (totalValue === 0) {
      enrollment.status = 'APROVADO';
    }

    allEnroll[idx] = enrollment;
    write(KEYS.ENROLLMENTS, allEnroll);

    this.addLog(
      'UPDATE_ENROLLMENT_WORKSHOPS',
      enrollment.userEmail,
      'ALUNO',
      `Atualizou workshops da Semana Acadêmica "${enrollment.eventName}"`
    );

    apiPost('/api/db/write-enrollment-save', enrollment);
    apiPost('/api/db/write-workshop-increment', { workshopIds: added });

    return enrollment;
  },

  getAttendance(eventId?: string, workshopId?: string): Attendance[] {
    const all = read<Attendance[]>(KEYS.ATTENDANCE, SEEDED_ATTENDANCE);
    let res = all;
    if (eventId) {
      res = res.filter(a => a.eventId === eventId);
    }
    if (workshopId) {
      res = res.filter(a => a.workshopId === workshopId);
    }
    return res;
  },

  registerAttendance(userId: string, eventId: string, workshopId?: string, checkedInByActor?: User): Attendance {
    const all = this.getAttendance();
    const users = this.getUsers();
    const user = users.find(u => u.id === userId);
    if (!user) throw new Error('Aluno não encontrado para check-in.');

    const exists = all.some(a => a.userId === userId && a.eventId === eventId && a.workshopId === workshopId);
    if (exists) {
      throw new Error(`Check-in já realizado anteriormente para este ${workshopId ? 'Workshop' : 'Evento'}.`);
    }

    const newAtt: Attendance = {
      id: `att_${Date.now()}`,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userRa: user.ra,
      eventId,
      workshopId,
      checkedInAt: new Date().toISOString(),
      checkedInBy: checkedInByActor ? checkedInByActor.name : 'QR Code Scanner'
    };

    all.push(newAtt);
    write(KEYS.ATTENDANCE, all);

    this.addLog(
      'CHECK_IN',
      user.email,
      user.role,
      `Check-in de presença realizado para ${workshopId ? 'Workshop' : 'Evento Geral'} por ${newAtt.checkedInBy}`
    );

    apiPost('/api/db/write-attendance-save', newAtt);

    return newAtt;
  },

  removeAttendance(id: string, actor: User): void {
    const all = read<Attendance[]>(KEYS.ATTENDANCE, []);
    const filtered = all.filter(a => a.id !== id);
    write(KEYS.ATTENDANCE, filtered);

    this.addLog(
      'REMOVE_CHECK_IN',
      actor.email,
      actor.role,
      `Presença de ID ${id} removida pelo professor/coordenador.`
    );

    apiPost('/api/db/write-attendance-remove', { id });
  },

  getFinancialSettings(): FinancialSettings {
    return read<FinancialSettings>(KEYS.FINANCIAL_SETTINGS, DEFAULT_FINANCIAL_SETTINGS);
  },

  saveFinancialSettings(settings: Pick<FinancialSettings, 'pixKey' | 'pixReceiverName'>, actor: User): FinancialSettings {
    if (actor.role !== 'COORDENADOR' && actor.role !== 'ROOT') {
      throw new Error('Apenas coordenador ou root podem alterar configurações financeiras.');
    }

    const next: FinancialSettings = {
      pixKey: settings.pixKey.trim(),
      pixReceiverName: settings.pixReceiverName?.trim() || 'Campo Real Eventos',
      updatedAt: new Date().toISOString()
    };

    write(KEYS.FINANCIAL_SETTINGS, next);

    this.addLog(
      'UPDATE_FINANCIAL_SETTINGS',
      actor.email,
      actor.role,
      `Atualizou chave PIX da plataforma para ${next.pixReceiverName}`
    );

    apiPost('/api/db/write-financial-settings', next);

    return next;
  },

  getBanners(): HomeBanner[] {
    return read<HomeBanner[]>(KEYS.BANNERS, SEEDED_BANNERS);
  },

  saveBanner(banner: Omit<HomeBanner, 'id'>, actor: User): HomeBanner {
    if (actor.role !== 'COORDENADOR' && actor.role !== 'ROOT') throw new Error('Permissão negada');
    const banners = this.getBanners();
    const newB: HomeBanner = {
      ...banner,
      id: `banner_${Date.now()}`
    };
    banners.push(newB);
    write(KEYS.BANNERS, banners);

    apiPost('/api/db/write-banner-save', newB);

    return newB;
  },

  toggleBanner(id: string, actor: User): void {
    if (actor.role !== 'COORDENADOR' && actor.role !== 'ROOT') throw new Error('Permissão negada');
    const banners = this.getBanners();
    const idx = banners.findIndex(b => b.id === id);
    if (idx !== -1) {
      const nextState = !banners[idx].isActive;
      banners[idx].isActive = nextState;
      
      if (nextState) {
        banners.forEach(b => {
          if (b.id !== id) {
            b.isActive = false;
          }
        });
      }
      
      write(KEYS.BANNERS, banners);

      apiPost('/api/db/write-banner-toggle', { id });
    }
  },

  getExpenses(eventId?: string): FinancialExpense[] {
    const all = read<FinancialExpense[]>(KEYS.EXPENSES, SEEDED_EXPENSES);
    if (eventId) {
      return all.filter(e => e.eventId === eventId);
    }
    return all;
  },

  saveExpense(expense: Omit<FinancialExpense, 'id' | 'createdAt'>, actor: User): FinancialExpense {
    if (actor.role !== 'COORDENADOR' && actor.role !== 'ROOT') {
      throw new Error('Apenas o coordenador ou root podem cadastrar despesas.');
    }
    const expenses = this.getExpenses();
    const newExp: FinancialExpense = {
      ...expense,
      id: `exp_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    expenses.unshift(newExp);
    write(KEYS.EXPENSES, expenses);

    this.addLog(
      'CREATE_EXPENSE',
      actor.email,
      actor.role,
      `Registrou ${expense.type === 'ENTRADA' ? 'entrada/patrocínio' : 'despesa/gasto'} de R$ ${expense.value.toFixed(2)} para o evento "${expense.eventName}": "${expense.description}"`
    );

    apiPost('/api/db/write-expense-save', newExp);

    return newExp;
  },

  deleteExpense(id: string, actor: User): void {
    if (actor.role !== 'COORDENADOR' && actor.role !== 'ROOT') {
      throw new Error('Apenas o coordenador ou root podem apagar despesas.');
    }
    const expenses = this.getExpenses();
    const target = expenses.find(e => e.id === id);
    if (!target) throw new Error('Despesa não encontrada');

    const filtered = expenses.filter(e => e.id !== id);
    write(KEYS.EXPENSES, filtered);

    this.addLog(
      'DELETE_EXPENSE',
      actor.email,
      actor.role,
      `Removeu despesa "${target.description}" de R$ ${target.value.toFixed(2)} do evento "${target.eventName}"`
    );

    apiPost('/api/db/write-expense-delete', { id });
  }
};
