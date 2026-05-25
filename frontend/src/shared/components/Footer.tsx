import React from 'react';
import Logo from './Logo';
import { THEME } from '../styles/designSystem';

interface FooterProps {
  onNavigate?: (page: 'home' | 'sobre' | 'como' | 'ajuda' | 'privacidade') => void;
}

export default function Footer({ onNavigate }: FooterProps = {}) {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className={THEME.footer.container}>
      <div className={THEME.footer.grid}>
        
        
        <div className={THEME.footer.columnStart}>
          <div className={THEME.footer.logoButton} onClick={() => { handleScrollToTop(); onNavigate?.('home'); }}>
            <Logo variant="full" className={THEME.footer.logoSvg} />
          </div>
          <p className={THEME.footer.textMuted}>
            Plataforma oficial de eventos do Centro Universitário Campo Real, criada para divulgar experiências acadêmicas, culturais e institicionais.
          </p>
          <p className={THEME.footer.textSmall}>
            © {new Date().getFullYear()} Campo Real Eventos. Todos os direitos reservados.
          </p>
        </div>

        
        <div className={THEME.footer.columnCenter}>
          <div className={THEME.footer.sectionHeaderCenter}>
            <h3 className={`${THEME.footer.title} md:text-center`}>Institucional</h3>
          </div>
          <ul className={THEME.footer.navList}>
            <li><button onClick={() => { handleScrollToTop(); onNavigate?.('sobre'); }} className={THEME.footer.navButton}>Sobre Nós</button></li>
            <li><button onClick={() => { handleScrollToTop(); onNavigate?.('como'); }} className={THEME.footer.navButton}>Como Funciona</button></li>
            <li><button onClick={() => { handleScrollToTop(); onNavigate?.('ajuda'); }} className={THEME.footer.navButton}>Ajuda / FAQ</button></li>
            <li><button onClick={() => { handleScrollToTop(); onNavigate?.('privacidade'); }} className={THEME.footer.navButton}>Política de Privacidade</button></li>
          </ul>
        </div>

        
        <div className={THEME.footer.columnEnd}>
          <div className={THEME.footer.sectionHeaderEnd}>
            <h3 className={`${THEME.footer.title} md:text-right`}>Fale Conosco</h3>
          </div>
          <ul className={THEME.footer.contactList}>
            <li className={THEME.footer.contactItem}>
              <span className={THEME.footer.contactIcon}>✉</span>
              <a href="mailto:eventos@camporeal.edu.br" className={`${THEME.footer.link} break-all md:text-right`}>eventos@camporeal.edu.br</a>
            </li>
            <li className={THEME.footer.contactItem}>
              <span className={THEME.footer.contactIcon}>☎</span>
              <span className={THEME.footer.contactMono}>(42) 3621-5200</span>
            </li>
            <li className={THEME.footer.contactItem}>
              <span className={THEME.footer.contactIcon}>📍</span>
              <span className={THEME.footer.contactText}>Guarapuava - PR</span>
            </li>
          </ul>
        </div>

      </div>
    </footer>
  );
}
