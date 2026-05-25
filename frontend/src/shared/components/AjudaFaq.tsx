import React, { useState } from 'react';
import { ArrowLeft, HelpCircle, Mail, MessageSquare, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';
import { THEME, COMPONENT } from '../styles/designSystem';

interface AjudaFaqProps {
  onBackToHome: () => void;
}

export default function AjudaFaq({ onBackToHome }: AjudaFaqProps) {
  const [supportName, setSupportName] = useState('');
  const [supportEmail, setSupportEmail] = useState('');
  const [supportSubject, setSupportSubject] = useState('Dúvida sobre Certificado');
  const [supportMessage, setSupportMessage] = useState('');
  const [formSent, setFormSent] = useState(false);

  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: 'Como faço para baixar o meu certificado?',
      answer: 'Acesse o sistema com o seu login e e-mail institucional. No seu menu do painel de aluno, selecione a aba "Meus Certificados". Se a sua presença na lista oficial do workshop já tiver sido assinada pelo palestrante, o botão para download estará liberado instantaneamente.'
    },
    {
      question: 'Posso alterar meus workshops escolhidos após concluir a inscrição?',
      answer: 'Sim, desde que a data limite de inscrições do evento não tenha expirado. No painel de aluno ou visualizando os detalhes do evento inscrito, clique em "Alterar Grade" para atualizar seus workshops selecionados.'
    },
    {
      question: 'Como funciona o pagamento das taxas de workshops pagos?',
      answer: 'A plataforma oferece opções de simulação em Pix e Cartão de Crédito para workshops autônomos que demandam materiais extras. O processo é totalmente integrado para fins didáticos e atualiza o seu ticket na mesma hora.'
    },
    {
      question: 'Sou um visitante externo da comunidade, posso participar dos eventos?',
      answer: 'Sim! No portal de login, clique no botão "Entrar e navegar como visitante público". Você poderá se inscrever nos eventos abertos à comunidade geral e validar seus certificados acadêmicos normalmente.'
    },
    {
      question: 'Esqueci minha senha institucional ou não consigo logar, o que fazer?',
      answer: 'As credenciais de login estão integradas ao banco universitário local. Caso não lembre do seu e-mail institucional ou senha, você pode usar os acessos automáticos de demonstração rápida presentes na base do login ou solicitar auxílio preenchendo o formulário ao lado.'
    }
  ];

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportName || !supportEmail || !supportMessage) {
      alert('Por favor, preencha todos os campos do formulário de contato.');
      return;
    }

    setFormSent(true);
    setSupportName('');
    setSupportEmail('');
    setSupportMessage('');
    setTimeout(() => {
      setFormSent(false);
    }, 5000);
  };

  const toggleFaq = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  return (
    <div className={COMPONENT.ajudaFaq.container}>
      <button 
        onClick={onBackToHome}
        className={COMPONENT.ajudaFaq.backButton}
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Voltar ao Início</span>
      </button>

      
      <div className="mb-10">
        <span className={COMPONENT.ajudaFaq.headingBadge}>
          Suporte e Dúvidas Frequentes
        </span>
        <h1 className={COMPONENT.ajudaFaq.headingTitle}>
          Ajuda / FAQ
        </h1>
        <p className={COMPONENT.ajudaFaq.headingText}>
          Precisa de auxílio sobre certificados, inscrições ou cadastro? Navegue pelas dúvidas resolvidas abaixo ou envie uma mensagem diretamente para a comissão organizadora de eventos.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 border-t border-gray-150 pt-10">
        <div className="flex flex-col gap-4">
          <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest font-mono flex items-center gap-2 mb-2">
            <HelpCircle className="w-4 h-4 text-blue-600" />
            <span>Perguntas Frequentes</span>
          </h3>

          <div className="flex flex-col gap-4">
              {faqs.map((faq, idx) => {
              const isOpen = expandedIndex === idx;
              return (
                  <div key={idx} className={COMPONENT.ajudaFaq.faqCard}>
                    <button onClick={() => toggleFaq(idx)} className={COMPONENT.ajudaFaq.faqButton}>
                      <span className="uppercase tracking-tight leading-relaxed">{faq.question}</span>
                      {isOpen ? <ChevronUp className={THEME.eventGrid.iconSmallBlue} /> : <ChevronDown className={THEME.eventGrid.iconSmallGray} />}
                    </button>

                    {isOpen && (
                      <div className={COMPONENT.ajudaFaq.faqAnswer}>
                        {faq.answer}
                      </div>
                    )}
                  </div>
              );
            })}
          </div>
        </div>

        
        <div className={COMPONENT.ajudaFaq.supportCard}>
          <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest font-mono flex items-center gap-2 mb-4">
            <Mail className="w-4 h-4 text-blue-600" />
            <span>Formulário de Suporte</span>
          </h3>

          {formSent ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center flex flex-col items-center gap-3">
              <CheckCircle className="w-10 h-10 text-green-600" />
              <h4 className="text-xs font-black text-green-800 uppercase">Mensagem Entregue!</h4>
              <p className="text-[11px] text-green-700 leading-relaxed font-semibold">
                Sua solicitação de suporte acadêmico de eventos foi encaminhada com sucesso! Uma resposta detalhada será enviada em breve ao seu e-mail institucional.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSupportSubmit} className={COMPONENT.ajudaFaq.supportForm}>
              
              <div className="flex flex-col gap-1">
                <label className={THEME.input.label}>Seu Nome Completo</label>
                <input 
                  type="text" 
                  className={THEME.input.text}
                  placeholder="EX: Maria Cecília Santos"
                  value={supportName}
                  onChange={e => setSupportName(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className={THEME.input.label}>E-mail de Contato</label>
                <input 
                  type="email" 
                  className={THEME.input.text}
                  placeholder="Ex: maria.santos@camporeal.edu.br"
                  value={supportEmail}
                  onChange={e => setSupportEmail(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className={THEME.input.label}>Assunto</label>
                <select 
                  className={THEME.input.select}
                  value={supportSubject}
                  onChange={e => setSupportSubject(e.target.value)}
                >
                  <option value="Dúvida sobre Certificado">Dúvida sobre Certificado</option>
                  <option value="Erro no Cadastro/Login">Erro no Cadastro ou Login</option>
                  <option value="Inscrição de workshops">Inscrição em Workshops</option>
                  <option value="Contato com Coordenador">Falar com Coordenação de Eventos</option>
                  <option value="Outros">Outros Casos</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className={THEME.input.label}>Sua Mensagem</label>
                <textarea 
                  rows={4}
                  className={`${THEME.input.text} resize-none`}
                  placeholder="Descreva detalhadamente o ocorrido ou sua dúvida..."
                  value={supportMessage}
                  onChange={e => setSupportMessage(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className={COMPONENT.ajudaFaq.supportSubmit}>
                Enviar Requisição de Suporte
              </button>

            </form>
          )}
        </div>

      </div>
    </div>
  );
}
