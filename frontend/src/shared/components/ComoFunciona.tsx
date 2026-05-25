import React from 'react';
import { ArrowLeft, BookOpen, Compass, CreditCard, Award, BadgeCheck } from 'lucide-react';
import { THEME, COMPONENT } from '../styles/designSystem';

interface ComoFuncionaProps {
  onBackToHome: () => void;
}

export default function ComoFunciona({ onBackToHome }: ComoFuncionaProps) {
  const steps = [
    {
      index: '01',
      title: 'Acompanhe as Divulgações',
      icon: <Compass className="w-5 h-5 text-blue-600" />,
      description: 'Navegue pelo painel público principal para descobrir os eventos acadêmicos, simpósios de engenharia, feiras de saúde e ciclo de palestras disponíveis no semestre letivo.'
    },
    {
      index: '02',
      title: 'Selecione e Inscreva-se',
      icon: <CreditCard className="w-5 h-5 text-blue-600" />,
      description: 'Registre-se nos workshops e palestras escolhendo suas opções preferidas. O processo suporta pagamentos simulados por cartões, Pix ou workshops inteiramente gratuitos mantidos pela universidade.'
    },
    {
      index: '03',
      title: 'Valide sua Presença',
      icon: <BookOpen className="w-5 h-5 text-blue-600" />,
      description: 'Compareça aos workshops selecionados e garanta a assinatura da lista digital de presenças mantida pelos responsáveis pela disciplina ou instrutores de palestras.'
    },
    {
      index: '04',
      title: 'Emita seus Certificados',
      icon: <Award className="w-5 h-5 text-blue-600" />,
      description: 'Após a chancela da coordenação, as horas complementares são validadas imediatamente. Visualize ou faça o download de seus certificados com design oficial diretamente na sua área do aluno.'
    }
  ];

  return (
    <div className={COMPONENT.comoFunciona.container}>
      <button onClick={onBackToHome} className={COMPONENT.comoFunciona.backButton}>
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Voltar ao Início</span>
      </button>

      <div className="mb-10">
        <span className={COMPONENT.comoFunciona.headingBadge}>
          Trilha do Acadêmico
        </span>
        <h1 className={COMPONENT.comoFunciona.headingTitle}>
          Como Funciona?
        </h1>
        <p className={COMPONENT.comoFunciona.headingText}>
          Entenda os passos fundamentais para participar dos eventos do Centro Universitário Campo Real, validar sua presença e garantir suas horas complementares.
        </p>
      </div>

      <div className="border-t border-gray-150 pt-10">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {steps.map((step, idx) => (
            <div key={idx} className={COMPONENT.comoFunciona.stepCard}>
              
              <span className="absolute right-4 top-4 text-3xl font-black text-gray-100 group-hover:text-blue-50 transition-colors font-mono">
                {step.index}
              </span>

              <div className={COMPONENT.comoFunciona.stepIconWrap}>
                {step.icon}
              </div>

              <div>
                <h3 className="text-base font-black uppercase tracking-tight text-gray-850">
                  {step.title}
                </h3>
                <p className="text-xs text-gray-520 font-medium leading-relaxed mt-2.5">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        
        <div className={COMPONENT.comoFunciona.highlightBanner}>
          <div className={COMPONENT.comoFunciona.highlightIconWrap}>
            <BadgeCheck className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <h4 className="text-sm font-black uppercase tracking-wider text-white">Chancela e Validade das Horas</h4>
            <p className="text-xs text-gray-300 mt-1.5 leading-relaxed font-semibold">
              Todos os certificados gerados pela plataforma digital estão formalmente vinculados ao registro de eventos cadastrado na secretaria de extensão acadêmica da Campo Real. As horas são computadas e validadas eletronicamente, de acordo com as diretrizes do Colegiado de cada curso.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
