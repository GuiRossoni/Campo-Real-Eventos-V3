import React from 'react';
import { Landmark, Target, Award, ArrowLeft } from 'lucide-react';
import { THEME } from '../styles/designSystem';

interface SobreNosProps {
  onBackToHome: () => void;
}

export default function SobreNos({ onBackToHome }: SobreNosProps) {
  return (
    <div className={THEME.sobreNos.container}>
      
      <button 
        onClick={onBackToHome}
        className={THEME.sobreNos.backButton}
      >
        <ArrowLeft className={THEME.sobreNos.backIcon} />
        <span>Voltar ao Início</span>
      </button>

      
      <div className={THEME.sobreNos.heroWrap}>
        <img 
          src="https://wallpapers.com/images/high/superhero-cartoon-network-powerpuff-girls-rylb9457lq7r63s5.webp" 
          alt="Arte estilo cartoon" 
          className={THEME.sobreNos.heroImage}
          referrerPolicy="no-referrer"
        />
        <div className={THEME.sobreNos.heroOverlay}></div>
        <div className={THEME.sobreNos.heroContent}>
          <span className={THEME.sobreNos.heroBadge}>
            Quem Somos
          </span>
          <h1 className={THEME.sobreNos.heroTitle}>
            Sobre Nós
          </h1>
        </div>
      </div>

      
      <div className={THEME.sobreNos.grid}>
        
        
        <div className={THEME.sobreNos.contentColumn}>
          <p className={THEME.sobreNos.leadText}>
            Prezando pela excelência e pela formação integral de nossos acadêmicos, o <strong>Centro Universitário Campo Real</strong> apresenta sua plataforma inteligente unificada para divulgação, gerenciamento e certificação de eventos acadêmicos.
          </p>
          <p className={THEME.sobreNos.bodyText}>
            Nascemos com a premissa de aproximar a comunidade universitária do conhecimento aplicado. Semanas acadêmicas, simpósios integrados, palestras de liderança e workshops técnicos são as bases que sustentam nossos pilares curriculares. Com a nossa ferramenta digital, buscamos desburocratizar as programações e facilitar o acesso de cada acadêmico e palestrante às atividades complementares institucionais.
          </p>
          <p className={THEME.sobreNos.bodyText}>
            De um lado, professores e coordenadores formulam trilhas de conhecimento e gerenciam lotes de inscrições. Do outro, os alunos acompanham em tempo real suas admissões, registram presenças por meio de chamadas eletrônicas integradas, e exportam certificados com validade curricular imediata. Tudo de forma limpa, direta e descomplicada.
          </p>
        </div>

        
        <div className={THEME.sobreNos.sideColumn}>
          <div className={THEME.sobreNos.valuesCard}>
            <h3 className={THEME.sobreNos.valuesHeader}>
              <Landmark className={THEME.sobreNos.valuesHeaderIcon} />
              <span>Nossos Valores</span>
            </h3>
            
            <div className={THEME.sobreNos.valuesList}>
              <div className={THEME.sobreNos.valueItem}>
                <div className={THEME.sobreNos.valueIconWrap}>
                  <Target className={THEME.sobreNos.valueIcon} />
                </div>
                <div>
                  <h4 className={THEME.sobreNos.valueTitle}>Foco Educacional</h4>
                  <p className={THEME.sobreNos.valueText}>Integrar atividades práticas complementares como extensão do aprendizado em sala de aula.</p>
                </div>
              </div>

              <div className={THEME.sobreNos.valueItem}>
                <div className={THEME.sobreNos.valueIconWrap}>
                  <Award className={THEME.sobreNos.valueIcon} />
                </div>
                <div>
                  <h4 className={THEME.sobreNos.valueTitle}>Inovação e Rigor</h4>
                  <p className={THEME.sobreNos.valueText}>Garantia de certificados autênticos e processos auditáveis para nossos alunos.</p>
                </div>
              </div>
            </div>
          </div>

          <div className={THEME.sobreNos.contactCard}>
            <h4 className={THEME.sobreNos.contactTitle}>Precisa de Contato?</h4>
            <p className={THEME.sobreNos.contactText}>
              Tem alguma dúvida sobre os eventos ou gostaria de propor uma parceria de palestras? Visite nossa FAQ ou fale diretamente com a coordenação de extensão através dos canais de atendimento.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
