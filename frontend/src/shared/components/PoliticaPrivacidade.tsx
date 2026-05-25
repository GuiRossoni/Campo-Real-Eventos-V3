import React from 'react';
import { ArrowLeft, ShieldAlert, Lock, Eye } from 'lucide-react';
import { THEME } from '../styles/designSystem';

interface PoliticaPrivacidadeProps {
  onBackToHome: () => void;
}

export default function PoliticaPrivacidade({ onBackToHome }: PoliticaPrivacidadeProps) {
  return (
    <div className={THEME.politicaPrivacidade.container}>
      <button 
        onClick={onBackToHome}
        className={THEME.politicaPrivacidade.backButton}
      >
        <ArrowLeft className={THEME.politicaPrivacidade.backIcon} />
        <span>Voltar ao Início</span>
      </button>

      
      <div className={THEME.politicaPrivacidade.headingWrap}>
        <span className={THEME.politicaPrivacidade.headingBadge}>
          Governança e Segurança de Dados
        </span>
        <h1 className={THEME.politicaPrivacidade.headingTitle}>
          Política de Privacidade
        </h1>
        <p className={THEME.politicaPrivacidade.headingMeta}>
          Última atualização: Maio de 2026
        </p>
      </div>

      <div className={THEME.politicaPrivacidade.sectionsWrap}>
        
        <section className={THEME.politicaPrivacidade.section}>
          <h3 className={THEME.politicaPrivacidade.sectionTitle}>
            <Eye className={THEME.politicaPrivacidade.sectionIcon} />
            <span>1. Coleta de Informações</span>
          </h3>
          <p>
            Para garantir a emissão correta de certificados institucionais com validade curricular e registro oficial, nossa plataforma de eventos do Centro Universitário Campo Real realiza a coleta de dados de registro acadêmico restritos, incluindo: seu nome completo, e-mail institucional, Registro Acadêmico (RA) para alunos, período e curso de graduação.
          </p>
        </section>

        <section className={THEME.politicaPrivacidade.section}>
          <h3 className={THEME.politicaPrivacidade.sectionTitle}>
            <Lock className={THEME.politicaPrivacidade.sectionIcon} />
            <span>2. Uso de Dados</span>
          </h3>
          <p>
            As informações acadêmicas coletadas são estritamente destinadas à organização de listas de ingressos, controle físico de frequência em workshops e palestras e assinatura eletrônica de diplomas com horas de atividades complementares autorizadas. A universidade não repassará, comercializará ou compartilhará estes registros corporativos com empresas ou anunciantes externos sob nenhuma hipótese.
          </p>
        </section>

        <section className={THEME.politicaPrivacidade.section}>
          <h3 className={THEME.politicaPrivacidade.sectionTitle}>
            <ShieldAlert className={THEME.politicaPrivacidade.sectionIcon} />
            <span>3. Cookies e Sessão</span>
          </h3>
          <p>
            Utilizamos recursos de persistência local em seu navegador para permitir login persistente e segurança de token durante suas inscrições em workshops. Nesses registros locais, guardamos provisoriamente suas opções de tickets selecionados de modo a facilitar simulações integradas em checkouts acadêmicos rápidos.
          </p>
        </section>

        <section className={THEME.politicaPrivacidade.section}>
          <h3 className={THEME.politicaPrivacidade.sectionTitleNoIcon}>
            4. Seus Direitos e Consentimento
          </h3>
          <p>
            Ao utilizar a nossa plataforma para efetuar novas inscrições e registrar presenças nas semanas acadêmicas, você consente voluntariamente com as diretrizes e regras desta política organizacional. Para retificações em seus registros, alterações de dados ou exclusão completa de histórico, por favor contate a secretaria acadêmica de eventos utilizando nosso portal de suporte.
          </p>
        </section>

      </div>
    </div>
  );
}
