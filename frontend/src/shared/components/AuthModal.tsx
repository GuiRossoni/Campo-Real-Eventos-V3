import React, { useState } from 'react';
import { User, UserRole } from '../../types';
import { Mail, Shield, Eye, EyeOff, Key, UserIcon, ArrowLeft, ArrowUpRight, CheckCircle } from 'lucide-react';
import { DB } from '../utils/db';
import Logo from './Logo';
import { THEME } from '../styles/designSystem';

interface AuthModalProps {
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export default function AuthModal({ onClose, onLoginSuccess }: AuthModalProps) {
  const [formType, setFormType] = useState<'LOGIN' | 'REGISTER' | 'RECOVER'>('LOGIN');
  const [role, setRole] = useState<UserRole>('ALUNO');
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [ra, setRa] = useState('');
  const [course, setCourse] = useState('Engenharia de Software');
  const [period, setPeriod] = useState('5º Período');
  const [recoverSent, setRecoverSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (formType === 'LOGIN') {
        const users = DB.getUsers();
        const match = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
        
        if (!match) {
          throw new Error('E-mail não cadastrado no sistema.');
        }

        DB.setCurrentUser(match);
        DB.addLog('USER_LOGIN', match.email, match.role, `Usuário efetuou login: ${match.name}`);
        onLoginSuccess(match);
        onClose();
      } else if (formType === 'REGISTER') {
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
        onLoginSuccess(createdUser);
        onClose();
      } else if (formType === 'RECOVER') {
        if (!email) {
          throw new Error('E-mail é obrigatório.');
        }
        setRecoverSent(true);
        DB.addLog('PASSWORD_RECOVER', email, 'ALUNO' as any, `Solicitacao de recuperacao de senha enviada para ${email}`);
      }
    } catch (err: any) {
      alert(err.message || 'Houve um erro.');
    }
  };

  return (
    <div className={THEME.authModal.overlay}>
      
      <div className={THEME.authModal.card}>
        
        <button 
          onClick={onClose}
          type="button"
          className={THEME.authModal.backButton}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Voltar</span>
        </button>

        
        <div className={THEME.authModal.logoWrapper}>
          <Logo variant="full" className={THEME.authModal.logoSvg} />
        </div>

        
        {formType === 'LOGIN' && (
          <div className={`${THEME.authModal.headingWrapper} mb-6`}>
            <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest font-mono">ACESSO</span>
            <h3 className={THEME.authModal.headingTitle}>Bem-vindo de volta!</h3>
            <p className={THEME.authModal.headingSubtitle}>Entre na sua conta para continuar.</p>
          </div>
        )}

        {formType === 'REGISTER' && (
          <div className={`${THEME.authModal.headingWrapper} mb-4`}>
            <span className="text-[10px] text-blue-600 font-extrabold uppercase tracking-widest font-mono">CADASTRO</span>
            <h3 className={THEME.authModal.headingTitle}>Crie sua Conta</h3>
            <p className="text-gray-505 text-xs mt-1.5 leading-relaxed">Cadastre seu perfil discente ou docente completo.</p>
          </div>
        )}

        {formType === 'RECOVER' && (
          <div className={`${THEME.authModal.headingWrapper} mb-6`}>
            <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest font-mono">SEGURANÇA</span>
            <h3 className={THEME.authModal.headingTitle}>Recuperar Senha</h3>
            <p className={THEME.authModal.headingSubtitle}>Enviaremos instruções para o seu e-mail institucional.</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className={THEME.authModal.form}>
          
          {formType === 'RECOVER' ? (
            recoverSent ? (
              <div className={THEME.authModal.recoverCard}>
                <CheckCircle className="w-8 h-8 shrink-0 text-green-550" />
                <span className={THEME.authModal.recoverCardTitle}>Aviso de Recuperação Enviado!</span>
                <p className={THEME.authModal.recoverCardText}>Simulamos o envio com sucesso. Um link temporário para cadastro de nova credencial foi emitido para {email}. Verifique sua caixa de spam.</p>
                <button 
                  onClick={() => { setFormType('LOGIN'); setRecoverSent(false); }}
                  className={THEME.authModal.recoverBackBtn}
                >
                  Voltar ao Login
                </button>
              </div>
            ) : (
              <div className={THEME.authModal.block}>
                <div>
                  <label className={THEME.authModal.labelAlt}>E-mail Corporativo</label>
                  <div className="relative">
                    <input 
                      type="email" 
                      placeholder="seuemail@camporeal.edu.br"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className={THEME.authModal.inputEmailRecover}
                      required
                    />
                    <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>

                <button 
                  type="submit"
                  className={THEME.authModal.submitBtnSimple}
                >
                  Confirmar E-mail
                </button>
              </div>
            )
          ) : (
            <>
              
              {formType === 'REGISTER' && (
                <div>
                  <label className={THEME.authModal.labelWithGap}>Quem é Você?</label>
                  <div className={THEME.authModal.roleToggleWrap}>
                    <button
                      type="button"
                      onClick={() => setRole('ALUNO')}
                      className={`${THEME.authModal.roleToggleBtn} ${role === 'ALUNO' ? THEME.authModal.roleToggleActive : THEME.authModal.roleToggleInactive}`}
                    >
                      Aluno (Discente)
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('PROFESSOR')}
                      className={`${THEME.authModal.roleToggleBtn} ${role === 'PROFESSOR' ? THEME.authModal.roleToggleActive : THEME.authModal.roleToggleInactive}`}
                    >
                      Prof. (Docente)
                    </button>
                  </div>
                </div>
              )}

              
              {formType === 'REGISTER' && (
                <div>
                  <label className={THEME.authModal.label}>Nome Completo</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="EX: Guilherme de Oliveira"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className={THEME.authModal.inputTextNoIcon}
                      required
                    />
                    <UserIcon className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>
              )}

              
              <div>
                <label className={THEME.authModal.label}>E-mail</label>
                <div className="relative">
                  <input 
                    type="email" 
                    placeholder="seuemail@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className={THEME.authModal.inputText}
                    required
                  />
                  <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>

              
              {formType === 'REGISTER' && role === 'ALUNO' && (
                <div className="grid grid-cols-2 gap-3 animate-in slide-in-from-top-1.5 duration-105">
                  <div className="col-span-2">
                    <label className={THEME.authModal.label}>Registro Acadêmico (RA)</label>
                    <input 
                      type="text" 
                      placeholder="EX: 202611029"
                      value={ra}
                      onChange={e => setRa(e.target.value)}
                      className={THEME.authModal.inputTextNoIcon}
                      required
                    />
                  </div>
                  <div>
                    <label className={THEME.authModal.labelAlt}>Curso</label>
                    <select 
                      value={course}
                      onChange={e => setCourse(e.target.value)}
                      className={THEME.authModal.selectText}
                    >
                      <option value="Engenharia de Software">Engenharia de Software</option>
                      <option value="Sistemas de Informação">Sistemas de Informação</option>
                      <option value="Administração">Administração</option>
                      <option value="Medicina">Medicina</option>
                      <option value="Direito">Direito</option>
                    </select>
                  </div>
                  <div>
                    <label className={THEME.authModal.labelAlt}>Período</label>
                    <select
                      value={period}
                      onChange={e => setPeriod(e.target.value)}
                      className={THEME.authModal.selectText}
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

              
              <div className="relative">
                <div className={THEME.authModal.passwordLabelRow}>
                  <label className="text-[10px] text-gray-455 uppercase tracking-widest font-bold block">Senha</label>
                  {formType === 'LOGIN' && (
                    <button 
                      type="button"
                      onClick={() => setFormType('RECOVER')}
                      className="text-[10px] text-blue-605 hover:text-blue-700 font-extrabold tracking-tight cursor-pointer"
                    >
                      Esqueceu sua senha?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className={THEME.authModal.passwordInput}
                    required
                  />
                  
                  
                  <div className={THEME.authModal.passwordIcons}>
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={THEME.authModal.eyeBtn}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <Key className="w-4 h-4 cursor-help text-gray-400" />
                  </div>
                </div>
              </div>

              
              <button 
                type="submit"
                className={THEME.authModal.submitBtn}
              >
                {formType === 'LOGIN' ? 'Entrar' : 'Cadastrar-se'}
              </button>
            </>
          )}

        </form>

        
        <div className={THEME.authModal.footerTextWrap}>
          {formType === 'LOGIN' ? (
            <p>
              Não tem uma conta?{' '}
              <button 
                type="button"
                onClick={() => setFormType('REGISTER')}
                className={THEME.authModal.footerLink}
              >
                Cadastre-se
              </button>
            </p>
          ) : (
            <p className="flex items-center gap-1 justify-center">
              <span>Já possui uma conta?</span>
              <button 
                type="button"
                onClick={() => setFormType('LOGIN')}
                className={`${THEME.authModal.footerLink} pl-0.5`}
              >
                Entrar
              </button>
            </p>
          )}
        </div>

      </div>

    </div>
  );
}
