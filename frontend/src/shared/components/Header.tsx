import React, { useState } from 'react';
import { User, UserRole } from '../../types';
import { LogIn, LogOut, UserCheck, ShieldAlert, BookOpen, Search, User as UserIcon, Edit3, Save, X, Moon, Sun } from 'lucide-react';
import Logo from './Logo';
import { DB } from '../utils/db';
import { THEME } from '../styles/designSystem';

interface HeaderProps {
  currentUser: User | null;
  onLogout: () => void;
  onOpenAuth: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  themeMode: 'light' | 'dark';
  onToggleTheme: () => void;
  onQuickCreateEvent?: () => void;
  onProfileUpdated?: () => void;
  onLogoClick?: () => void;
}

export default function Header({
  currentUser,
  onLogout,
  onOpenAuth,
  searchQuery,
  setSearchQuery,
  themeMode,
  onToggleTheme,
  onQuickCreateEvent,
  onProfileUpdated,
  onLogoClick
}: HeaderProps) {
  const [showProfile, setShowProfile] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [editName, setEditName] = useState('');
  const [editCourse, setEditCourse] = useState('');
  const [editInstitution, setEditInstitution] = useState('');
  const [editPeriod, setEditPeriod] = useState('');
  const [editRa, setEditRa] = useState('');

  const openProfile = () => {
    if (currentUser) {
      setEditName(currentUser.name);
      setEditCourse(currentUser.course || '');
      setEditInstitution(currentUser.institution || '');
      setEditPeriod(currentUser.period || '');
      setEditRa(currentUser.ra || '');
      setIsEditing(false);
      setShowProfile(true);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    try {
      DB.updateUser(currentUser.id, {
        name: editName,
        course: editCourse,
        institution: editInstitution,
        period: editPeriod,
        ra: editRa
      });
      setIsEditing(false);
      setShowProfile(false);
      if (onProfileUpdated) {
        onProfileUpdated();
      }
      alert('Perfil atualizado com sucesso!');
    } catch (err: any) {
      alert(err.message || 'Erro ao atualizar perfil.');
    }
  };

  return (
    <header className={THEME.header.navbar}>
      
      <div className={THEME.header.logoWrapper}>
        <div onClick={onLogoClick} className={THEME.header.logoButton}>
          
          <Logo variant="full" className={THEME.header.logoSvg} />
        </div>

        
        <div className={THEME.header.mobileActions}>
          <button
            onClick={onToggleTheme}
            className="text-gray-500 hover:text-blue-700 p-2 cursor-pointer rounded-lg hover:bg-slate-100 transition-colors"
            title={themeMode === 'light' ? 'Ativar tema escuro' : 'Ativar tema claro'}
          >
            {themeMode === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
          {currentUser ? (
            <div className={THEME.header.mobileUserWrapper}>
              <button 
                onClick={openProfile}
                className={`${THEME.header.profileMobileBadge} ${
                  currentUser.role === 'ROOT' 
                    ? 'bg-purple-50 text-purple-600 border-purple-200' 
                    : 'bg-blue-50 text-blue-600 border-blue-200'
                }`}
                title="Ver Perfil"
              >
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full shrink-0"></span>
                {currentUser.role} ({currentUser.name.split(' ')[0]})
              </button>
              <button 
                onClick={onLogout}
                className={THEME.header.mobileLogoutBtn}
                title="Sair da Conta"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button 
              onClick={onOpenAuth}
              className={THEME.header.mobileGuestLoginBtn}
            >
              Acesso
            </button>
          )}
        </div>
      </div>

      <div className={THEME.header.actionsWrapper}>
        <button
          onClick={onToggleTheme}
          className="hidden md:flex items-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold uppercase text-[9px] tracking-wider py-2 px-3 rounded-lg transition-colors cursor-pointer"
          title={themeMode === 'light' ? 'Ativar tema escuro' : 'Ativar tema claro'}
        >
          {themeMode === 'light' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
          <span>{themeMode === 'light' ? 'Tema Escuro' : 'Tema Claro'}</span>
        </button>

        
        {currentUser ? (
          <div className={THEME.header.realUserWrapper}>
            <button 
              onClick={openProfile}
              className={THEME.header.realUserBtn}
              title="Ver Perfil"
            >
              <div className={THEME.header.realUserMeta}>
                <span className={THEME.header.realUserName}>{currentUser.name}</span>
                <span className={`text-[10px] uppercase font-mono tracking-wider font-bold text-right block ${currentUser.role === 'ROOT' ? 'text-purple-600' : 'text-blue-600'}`}>
                  {currentUser.role}
                </span>
              </div>
              <div className={`${THEME.header.realUserAvatar} ${currentUser.role === 'ROOT' ? 'bg-purple-100' : 'bg-blue-100'}`}>
                <div className={`${THEME.header.realUserInitials} ${currentUser.role === 'ROOT' ? 'text-purple-600 border-purple-200' : 'text-blue-600 border-blue-200'}`}>
                  {currentUser.name.charAt(0)}
                </div>
              </div>
            </button>
            <button 
              onClick={onLogout}
              className={THEME.header.logoutBtn}
              title="Sair da Conta"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button 
            onClick={onOpenAuth}
            className={THEME.header.loginBtn}
          >
            <LogIn className="w-3.5 h-3.5" />
            Acesso
          </button>
        )}

      </div>

      
      {showProfile && currentUser && (
        <div className={THEME.profileModal.backdrop}>
          <div className={THEME.profileModal.card}>
            
            
            <div className={THEME.profileModal.header}>
              <div className="flex items-center gap-3">
                <div className={`${THEME.profileModal.avatar} ${currentUser.role === 'ROOT' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                  {currentUser.name.charAt(0)}
                </div>
                <div>
                  <h3 className={THEME.profileModal.metaTitle}>
                    {isEditing ? 'Editar Perfil' : 'Detalhes do Perfil'}
                  </h3>
                  <span className={`${THEME.profileModal.metaBadge} ${
                    currentUser.role === 'ROOT'
                      ? 'bg-purple-50 text-purple-600 border-purple-200'
                      : 'bg-blue-50 text-blue-600 border-gray-200'
                  }`}>
                    {currentUser.role}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setShowProfile(false)}
                className={THEME.profileModal.closeBtn}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            
            <div className={THEME.profileModal.body}>
              {isEditing ? (
                <form onSubmit={handleSaveProfile} className={THEME.profileModal.editForm}>
                  <div>
                    <label className={THEME.input.label}>Nome Completo</label>
                    <input 
                      type="text" 
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      className={THEME.input.text}
                      required
                    />
                  </div>
                  <div>
                    <label className={THEME.input.label}>Registro Acadêmico (RA)</label>
                    <input 
                      type="text" 
                      value={editRa}
                      onChange={e => setEditRa(e.target.value)}
                      placeholder="Ex: 202611888"
                      className={THEME.input.text}
                    />
                  </div>
                  <div>
                    <label className={THEME.input.label}>Instituição</label>
                    <input 
                      type="text" 
                      value={editInstitution}
                      onChange={e => setEditInstitution(e.target.value)}
                      className={THEME.input.text}
                      placeholder="Ex: USP, UNICAMP, Campo Real, etc."
                    />
                  </div>
                  <div>
                    <label className={THEME.input.label}>Curso</label>
                    <input 
                      type="text" 
                      value={editCourse}
                      onChange={e => setEditCourse(e.target.value)}
                      placeholder="Ex: Engenharia de Software"
                      className={THEME.input.text}
                    />
                  </div>
                  <div>
                    <label className={THEME.input.label}>Período / Ano</label>
                    <input 
                      type="text" 
                      value={editPeriod}
                      onChange={e => setEditPeriod(e.target.value)}
                      placeholder="Ex: 5º Período"
                      className={THEME.input.text}
                    />
                  </div>

                  <div className={THEME.profileModal.formActions}>
                    <button 
                      type="button" 
                      onClick={() => setIsEditing(false)}
                      className={THEME.button.secondary + " py-2 px-4"}
                    >
                      Voltar
                    </button>
                    <button 
                      type="submit"
                      className={THEME.button.primary + " py-2 px-4"}
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Salvar</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className={THEME.profileModal.profileDetails}>
                  <div className={THEME.profileModal.infoCard}>
                    <div className="col-span-2">
                      <span className={THEME.profileModal.infoLabel}>E-mail</span>
                      <span className={THEME.profileModal.infoValue}>{currentUser.email}</span>
                    </div>
                    <div>
                      <span className={THEME.profileModal.infoLabel}>Registro Acadêmico (RA)</span>
                      <span className={THEME.profileModal.infoValue}>{currentUser.ra || '—'}</span>
                    </div>
                    <div>
                      <span className={THEME.profileModal.infoLabel}>Instituição</span>
                      <span className={THEME.profileModal.infoValue}>{currentUser.institution || '—'}</span>
                    </div>
                    <div>
                      <span className={THEME.profileModal.infoLabel}>Curso</span>
                      <span className={THEME.profileModal.infoValue}>{currentUser.course || '—'}</span>
                    </div>
                    <div>
                      <span className={THEME.profileModal.infoLabel}>Período / Ano</span>
                      <span className={THEME.profileModal.infoValue}>{currentUser.period || '—'}</span>
                    </div>
                  </div>

                  <div className={THEME.profileModal.profileActions}>
                    <button 
                      onClick={() => {
                        setShowProfile(false);
                        onLogout();
                      }}
                      className={THEME.profileModal.logoutDangerBtn}
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sair da Conta</span>
                    </button>
                    <button 
                      onClick={() => setIsEditing(true)}
                      className={THEME.button.primary + " py-2 px-4 !font-sans"}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Editar Perfil</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </header>
  );
}
