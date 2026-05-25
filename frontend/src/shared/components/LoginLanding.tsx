import React, { useState } from 'react';
import { User, UserRole } from '../../types';
import { DB } from '../utils/db';
import { THEME } from '../styles/designSystem';
import Logo from './Logo';
import Footer from './Footer';
import { 
  Mail, 
  Key, 
  UserCheck, 
  BookOpen, 
  ShieldAlert, 
  ShieldCheck,
  ArrowRight, 
  Sparkles, 
  Compass, 
  ChevronRight
} from 'lucide-react';

interface LoginLandingProps {
  onLoginSuccess: (user: User) => void;
  onContinueAsGuest: () => void;
  onNavigate?: (page: 'home' | 'sobre' | 'como' | 'ajuda' | 'privacidade') => void;
}

export default function LoginLanding({ 
  onLoginSuccess, 
  onContinueAsGuest,
  onNavigate
}: LoginLandingProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [role, setRole] = useState<UserRole>('ALUNO');
  const [name, setName] = useState('');
  const [ra, setRa] = useState('');
  const [course, setCourse] = useState('Engenharia de Software');
  const [period, setPeriod] = useState('5º Período');

  const banners = DB.getBanners();
  const activeBanners = banners.filter(b => b.isActive);
  
  const currentBanner = activeBanners[0] || {
    id: 'default',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200',
    title: 'EVENTOS ACADÊMICOS CAMPO REAL',
    subtitle: 'Conecte-se com conhecimento prático, semanas institucionais de workshops e certificados certificados.',
    linkToEventId: undefined
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isRegistering) {
        if (!name || !email || !password) {
          throw new Error('Por favor, preencha todos os campos obrigatórios.');
        }

        const createdUser = DB.registerUser({
          name,
          email,
          role,
          ra: role === 'ALUNO' ? ra : undefined,
          course: role === 'ALUNO' ? course : (role === 'PROFESSOR' ? 'Sistemas de Informação' : undefined),
          period: role === 'ALUNO' ? period : undefined
        });

        DB.setCurrentUser(createdUser);
        DB.addLog('USER_REGISTER', email, role, `Novo cadastro efetuado via Portal: ${name}`);
        onLoginSuccess(createdUser);
      } else {
        if (!email) {
          throw new Error('O e-mail é obrigatório.');
        }

        const users = DB.getUsers();
        const match = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());

        if (!match) {
          throw new Error('E-mail não localizado no sistema. Use uma das contas recomendadas ou crie uma nova em "Cadastre-se"!');
        }

        DB.setCurrentUser(match);
        DB.addLog('USER_LOGIN', match.email, match.role, `Usuário efetuou login via Portal: ${match.name}`);
        onLoginSuccess(match);
      }
    } catch (err: any) {
      alert(err.message || 'Erro ao processar autenticação.');
    }
  };

  const handleQuickLogin = (roleType: UserRole) => {
    const allUsers = DB.getUsers();
    const found = allUsers.find(u => u.role === roleType);
    if (found) {
      DB.setCurrentUser(found);
      DB.addLog(
        'PORTAL_QUICK_LOGIN',
        found.email,
        found.role,
        `Acesso rápido via painel de demonstração: ${found.name}`
      );
      onLoginSuccess(found);
    }
  };

  return (
    <div className={THEME.loginLanding.page}>
      
      
      <div className={THEME.loginLanding.grid}>
        
        
        <div className={THEME.loginLanding.bannerPane}>
          
          
          <img 
            src={currentBanner.imageUrl} 
            alt={currentBanner.title} 
            referrerPolicy="no-referrer"
            className={THEME.loginLanding.bannerImage}
          />
          
          
          <div className={THEME.loginLanding.bannerOverlay}></div>
          
          
          <div className={THEME.loginLanding.logoWrap}>
            <div className={THEME.loginLanding.logoCard}>
              <Logo variant="full" className={THEME.loginLanding.logoImage} />
            </div>
          </div>
          
          
          <div className={THEME.loginLanding.bannerBody}>
            <span className={THEME.loginLanding.bannerTag}>
              <Sparkles className={THEME.loginLanding.bannerTagIcon} />
              <span>Destaque Institucional</span>
            </span>
            <h1 className={THEME.loginLanding.bannerTitle}>
              {currentBanner.title}
            </h1>
            <p className={THEME.loginLanding.bannerSubtitle}>
              {currentBanner.subtitle}
            </p>
            
            {currentBanner.linkToEventId && (
              <button 
                onClick={onContinueAsGuest}
                className={THEME.loginLanding.bannerCta}
              >
                <span>Ver Evento Recomendado</span>
                <ChevronRight className={THEME.loginLanding.bannerCtaIcon} />
              </button>
            )}
          </div>
          
          
          <div className={THEME.loginLanding.bannerFootnote}>
            Campo Real Eventos • Soluções Acadêmicas
          </div>
        </div>

        
        <div className={THEME.loginLanding.formPane}>
          
          <div className={THEME.loginLanding.formWrap}>
            
            
            <div className={THEME.loginLanding.headingWrap}>
              <span className={THEME.loginLanding.headingTag}>PORTAL DO ALUNO OU DOCENTE</span>
              <h2 className={THEME.loginLanding.headingTitle}>
                {isRegistering ? 'Criar Nova Conta' : 'Acesse Sua Conta'}
              </h2>
              <p className={THEME.loginLanding.headingSubtitle}>
                {isRegistering ? 'Insira seus dados universitários abaixo para iniciar seu cadastro acadêmico.' : 'Digite seu e-mail institucional para acessar o painel de eventos.'}
              </p>
            </div>

            
            <form onSubmit={handleLoginSubmit} className={THEME.loginLanding.form}>
              
              {isRegistering && (
                <>
                  
                  <div className={THEME.loginLanding.roleBlock}>
                    <label className={THEME.input.label}>Qual o seu cargo acadêmico?</label>
                    <div className={THEME.loginLanding.roleGrid}>
                      <button
                        type="button"
                        onClick={() => setRole('ALUNO')}
                        className={`${THEME.loginLanding.roleButtonBase} ${
                          role === 'ALUNO' 
                            ? THEME.loginLanding.roleButtonActive
                            : THEME.loginLanding.roleButtonInactive
                        }`}
                      >
                        Aluno / Acadêmico
                      </button>
                      <button
                        type="button"
                        onClick={() => setRole('PROFESSOR')}
                        className={`${THEME.loginLanding.roleButtonBase} ${
                          role === 'PROFESSOR' 
                            ? THEME.loginLanding.roleButtonActive
                            : THEME.loginLanding.roleButtonInactive
                        }`}
                      >
                        Professor / Docente
                      </button>
                    </div>
                  </div>

                  
                  <div className={THEME.loginLanding.fieldBlock}>
                    <label className={THEME.input.label}>Nome Completo</label>
                    <input
                      type="text"
                      className={THEME.input.text}
                      placeholder="Ex: Carlos de Souza Santos"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      required
                    />
                  </div>

                  {role === 'ALUNO' && (
                    <div className={THEME.loginLanding.inlineGridTwo}>
                      <div className={THEME.loginLanding.fieldBlock}>
                        <label className={THEME.input.label}>Registro Acadêmico (RA)</label>
                        <input
                          type="text"
                          className={THEME.input.text}
                          placeholder="EX: 202611993"
                          value={ra}
                          onChange={e => setRa(e.target.value)}
                          required
                        />
                      </div>
                      <div className={THEME.loginLanding.fieldBlock}>
                        <label className={THEME.input.label}>Período Letivo</label>
                        <select
                          className={THEME.input.select}
                          value={period}
                          onChange={e => setPeriod(e.target.value)}
                        >
                          <option value="1º Período">1º Período</option>
                          <option value="3º Período">3º Período</option>
                          <option value="5º Período">5º Período</option>
                          <option value="7º Período">7º Período</option>
                          <option value="9º Período">9º Período</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {role === 'ALUNO' && (
                    <div className={THEME.loginLanding.fieldBlock}>
                      <label className={THEME.input.label}>Curso Superior</label>
                      <select
                        className={THEME.input.select}
                        value={course}
                        onChange={e => setCourse(e.target.value)}
                      >
                        <option value="Engenharia de Software">Engenharia de Software</option>
                        <option value="Sistemas de Informação">Sistemas de Informação</option>
                        <option value="Medicina">Medicina</option>
                        <option value="Administração">Administração</option>
                        <option value="Psicologia">Psicologia</option>
                      </select>
                    </div>
                  )}
                </>
              )}

              
              <div className={THEME.loginLanding.fieldBlock}>
                <label className={THEME.input.label}>E-mail Institucional</label>
                <div className="relative">
                  <Mail className={THEME.loginLanding.inputIcon} />
                  <input
                    type="email"
                    className={`${THEME.input.text} ${THEME.loginLanding.inputWithIcon}`}
                    placeholder="Ex: aluno@camporeal.edu.br"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              
              <div className={THEME.loginLanding.fieldBlock}>
                <label className={THEME.input.label}>Senha</label>
                <div className="relative">
                  <Key className={THEME.loginLanding.inputIcon} />
                  <input
                    type="password"
                    className={`${THEME.input.text} ${THEME.loginLanding.inputWithIcon}`}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              
              <button
                type="submit"
                className={THEME.loginLanding.submitBtn}
              >
                <span>{isRegistering ? 'Efetuar Cadastro Universitário' : 'Entrar no Sistema'}</span>
                <ArrowRight className={THEME.loginLanding.submitIcon} />
              </button>

              
              <div className={THEME.loginLanding.belowActions}>
                {isRegistering ? (
                  <button
                    type="button"
                    onClick={() => setIsRegistering(false)}
                    className={THEME.loginLanding.toggleBtn}
                  >
                    Já tem conta? Clique para Entrar
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsRegistering(true)}
                    className={THEME.loginLanding.toggleBtn}
                  >
                    Não possui login? Cadastre-se agora
                  </button>
                )}

                <div className={THEME.loginLanding.dividerWrap}>
                  <div className={THEME.loginLanding.dividerLine}></div>
                  <span className={THEME.loginLanding.dividerText}>ou</span>
                  <div className={THEME.loginLanding.dividerLine}></div>
                </div>

                <button 
                  type="button"
                  onClick={onContinueAsGuest}
                  className={THEME.loginLanding.guestBtn}
                >
                  <Compass className={THEME.loginLanding.guestIcon} />
                  <span>Visitante público</span>
                </button>
              </div>

            </form>

            
            <div className={THEME.loginLanding.demoCard}>
              <span className={THEME.loginLanding.demoTag}>
                AMBIENTE DE QUALIFICAÇÃO
              </span>
              
              <div className={THEME.loginLanding.demoGrid}>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('ALUNO')}
                  className={`${THEME.loginLanding.quickBtnBase} ${THEME.loginLanding.quickBtnBlue}`}
                >
                  <span className={THEME.loginLanding.quickRoleBlue}>Aluno / Ac.</span>
                  <span className={THEME.loginLanding.quickName}>Guilherme Rossoni</span>
                  <span className={THEME.loginLanding.quickEmail}>gui@</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('PROFESSOR')}
                  className={`${THEME.loginLanding.quickBtnBase} ${THEME.loginLanding.quickBtnGreen}`}
                >
                  <span className={THEME.loginLanding.quickRoleGreen}>Professor</span>
                  <span className={THEME.loginLanding.quickName}>Prof. Enrique</span>
                  <span className={THEME.loginLanding.quickEmail}>Prof@</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('COORDENADOR')}
                  className={`${THEME.loginLanding.quickBtnBase} ${THEME.loginLanding.quickBtnAmber}`}
                >
                  <span className={THEME.loginLanding.quickRoleAmber}>Coord. Col.</span>
                  <span className={THEME.loginLanding.quickName}>Gigi</span>
                  <span className={THEME.loginLanding.quickEmail}>gigi@</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('ROOT')}
                  className={`${THEME.loginLanding.quickBtnBase} ${THEME.loginLanding.quickBtnPurple}`}
                >
                  <span className={THEME.loginLanding.quickRolePurple}>Sys Admin ⚡</span>
                  <span className={THEME.loginLanding.quickName}>Administrador Root</span>
                  <span className={THEME.loginLanding.quickEmail}>admin.root@</span>
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>

      
      <Footer onNavigate={onNavigate} />
    </div>
  );
}
