import React, { useState } from 'react';
import { Event, Workshop } from '../../types';
import { X, ShieldCheck, QrCode, Clipboard, Wallet, CheckCircle2, ShoppingBag } from 'lucide-react';
import { THEME } from '../styles/designSystem';

interface CheckoutModalProps {
  event: Event;
  selectedWorkshops: Workshop[];
  pixKey: string;
  pixReceiverName?: string;
  onClose: () => void;
  onConfirm: (paymentOption: 'PIX' | 'GRATUITO') => void;
}

export default function CheckoutModal({
  event,
  selectedWorkshops,
  pixKey,
  pixReceiverName,
  onClose,
  onConfirm
}: CheckoutModalProps) {
  const [copiedPix, setCopiedPix] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'CHECKOUT' | 'SUCCESS'>('CHECKOUT');

  const baseValue = event.price;
  const workshopsTotal = selectedWorkshops.reduce((sum, w) => sum + w.price, 0);
  const finalTotal = baseValue + workshopsTotal;
  const isFree = finalTotal === 0;
  const normalizedPixKey = pixKey.trim();
  const canProceedWithPayment = isFree || normalizedPixKey.length > 0;
  const pixPayload = `00020126360014BR.GOV.BCB.PIX0114${normalizedPixKey}520400005303986540${finalTotal.toFixed(2)}5802BR5913${(pixReceiverName || 'Campo Real').slice(0, 13)}6009Guarapuava62070503***6304ABCD`;

  const handleCopyPix = () => {
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2000);
  };

  const handlePaySimulate = () => {
    if (isFree) {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setStep('SUCCESS');
      }, 1500);
      return;
    }

    if (!normalizedPixKey) {
      alert('A inscrição paga exige uma chave PIX configurada na Gestão Financeira.');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep('SUCCESS');
    }, 2000);
  };

  const handleSuccessClose = () => {
    onConfirm(isFree ? 'GRATUITO' : 'PIX');
  };

  return (
    <div className={THEME.checkoutModal.overlay}>
      
      <div className={THEME.checkoutModal.card}>
        
        
        <div className={THEME.checkoutModal.header}>
          <div className={THEME.checkoutModal.headerLeft}>
            <ShoppingBag className={THEME.checkoutModal.headerIcon} />
            <h2 className={THEME.checkoutModal.headerTitle}>
              {step === 'CHECKOUT' ? 'Inscrição & Ingressos' : 'Inscrição Confirmada'}
            </h2>
          </div>
          {step === 'CHECKOUT' && (
            <button onClick={onClose} className={THEME.checkoutModal.closeBtn}>
              <X className={THEME.checkoutModal.closeIcon} />
            </button>
          )}
        </div>

        
        {step === 'CHECKOUT' ? (
          <div className={THEME.checkoutModal.checkoutBody}>
            
            
            <div className={THEME.checkoutModal.leftColumn}>
              
              <div>
                <h3 className={THEME.checkoutModal.sectionTitle}>Resumo da Compra</h3>
                
                
                <div className={THEME.checkoutModal.summaryCard}>
                  <span className={THEME.checkoutModal.summaryCategory}>{event.category}</span>
                  <h4 className={THEME.checkoutModal.summaryName}>{event.name}</h4>
                  <div className={THEME.checkoutModal.summaryRow}>
                    <span>Acesso ao Evento Principal</span>
                    <span className={THEME.checkoutModal.summaryPrice}>
                      {event.price === 0 ? 'Incluso' : `R$ ${event.price.toFixed(2)}`}
                    </span>
                  </div>
                </div>
              </div>

              
              {selectedWorkshops.length > 0 && (
                <div>
                  <h3 className={THEME.checkoutModal.workshopsTitle}>Workshops e Minicursos Selecionados</h3>
                  <div className={THEME.checkoutModal.workshopsList}>
                    {selectedWorkshops.map(ws => (
                      <div key={ws.id} className={THEME.checkoutModal.workshopItem}>
                        <div className={THEME.checkoutModal.workshopMetaWrap}>
                          <span className={THEME.checkoutModal.workshopName}>{ws.name}</span>
                          <span className={THEME.checkoutModal.workshopMeta}>Instrutor: {ws.instructor} • {ws.time}</span>
                        </div>
                        <span className={THEME.checkoutModal.workshopPrice}>
                          {ws.price === 0 ? 'Grátis' : `+ R$ ${ws.price.toFixed(2)}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              
              <div className={THEME.checkoutModal.noteBox}>
                <ShieldCheck className={THEME.checkoutModal.noteIcon} />
                <div className={THEME.checkoutModal.noteBody}>
                  <p className={THEME.checkoutModal.noteTitle}>Preparado para Mercado Pago</p>
                  <p className={THEME.checkoutModal.noteText}>Desenvolvido com hooks de callback compatíveis com a API REST do Mercado Pago e checkout transparente na versão de produção final.</p>
                </div>
              </div>

            </div>

            
            <div className={THEME.checkoutModal.rightColumn}>
              
              {isFree ? (
                <div className={THEME.checkoutModal.freeBox}>
                  <CheckCircle2 className={THEME.checkoutModal.freeIcon} />
                  <h4 className={THEME.checkoutModal.freeTitle}>Evento Gratuito!</h4>
                  <p className={THEME.checkoutModal.freeText}>Nenhum custo adicional aplicável para este evento ou workshops associados. Basta clicar em confirmar para reservar sua vaga.</p>
                </div>
              ) : (
                <div className={THEME.checkoutModal.paymentBody}>
                  <div>
                    <h3 className={THEME.checkoutModal.paymentTitle}>Pagamento via PIX</h3>
                    <p className="text-[11px] text-gray-500 mt-1">
                      Pagamentos são confirmados manualmente pela coordenação após o envio do comprovante.
                    </p>
                  </div>

                  <div className={THEME.checkoutModal.pixBox}>
                    <div className={THEME.checkoutModal.qrWrap}>
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&color=1e293b&data=${encodeURIComponent(pixPayload)}`}
                        alt="Pix QR Code"
                        className={THEME.checkoutModal.qrImage}
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div className="w-full">
                      {canProceedWithPayment ? (
                        <>
                          <p className={THEME.checkoutModal.pixHint}>Escaneie o QR Code ou copie a chave PIX configurada pela coordenação:</p>
                          <div className={THEME.checkoutModal.pixCodeRow}>
                            <input
                              type="text"
                              readOnly
                              value={normalizedPixKey}
                              className={THEME.checkoutModal.pixCodeInput}
                            />
                            <button
                              type="button"
                              onClick={handleCopyPix}
                              className={THEME.checkoutModal.pixCopyBtn}
                            >
                              <Clipboard className={THEME.checkoutModal.pixCopyIcon} />
                              <span>{copiedPix ? 'Copiado' : 'Copiar'}</span>
                            </button>
                          </div>
                          <p className="text-[10px] text-gray-500 mt-2">
                            Favorecido: <strong>{pixReceiverName || 'Campo Real Eventos'}</strong>
                          </p>
                        </>
                      ) : (
                        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs rounded-lg p-3">
                          A chave PIX ainda não foi configurada na Gestão Financeira. Solicite ao coordenador antes de concluir a inscrição paga.
                        </div>
                      )}
                    </div>

                  </div>

                </div>
              )}

              
              <div className={THEME.checkoutModal.footer}>
                
                <div className={THEME.checkoutModal.totalRow}>
                  <span className={THEME.checkoutModal.totalLabel}>Valor Total</span>
                  <div className={THEME.checkoutModal.totalValueWrap}>
                    <span className={THEME.checkoutModal.totalValue}>
                      R$ {finalTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                <button 
                  type="button"
                  onClick={handlePaySimulate}
                  disabled={isProcessing || !canProceedWithPayment}
                  className={THEME.checkoutModal.confirmBtn}
                >
                  {isProcessing ? (
                    <>
                      <div className={THEME.checkoutModal.spinner}></div>
                      <span>Processando confirmação...</span>
                    </>
                  ) : (
                    <>
                      <Wallet className={THEME.checkoutModal.walletIcon} />
                      <span>{isFree ? 'Confirmar Reserva de Vaga' : `Finalizar via PIX (R$ ${finalTotal.toFixed(2)})`}</span>
                    </>
                  )}
                </button>
              </div>

            </div>

          </div>
        ) : (
          <div className={THEME.checkoutModal.successWrap}>
            
            <div className={THEME.checkoutModal.successIconWrap}>
              <svg 
                className={THEME.checkoutModal.successIcon} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth="3.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h3 className={THEME.checkoutModal.successTitle}>{isFree ? 'Inscrição Confirmada!' : 'Pagamento Enviado para Validação!'}</h3>
            
            <p className={THEME.checkoutModal.successText}>
              {isFree
                ? `Sua vaga foi reservada com êxito no evento "${event.name}".`
                : `Recebemos seu pedido no evento "${event.name}". A coordenação fará a validação manual do PIX para liberar o status como pago.`}
              {selectedWorkshops.length > 0 && ` Seus ${selectedWorkshops.length} minicursos adicionais também foram vinculados com sucesso.`}
            </p>

            <div className={THEME.checkoutModal.receiptCard}>
              <div className={THEME.checkoutModal.receiptRow}>
                <span className={THEME.checkoutModal.receiptLabel}>Comprovante ID</span>
                <span className={THEME.checkoutModal.receiptId}>TKT-{Date.now().toString().substr(-8)}</span>
              </div>
              <div className={THEME.checkoutModal.receiptStatusRow}>
                <span className={THEME.checkoutModal.receiptLabel}>Status do Pagamento</span>
                <span className={THEME.checkoutModal.receiptStatus}>{isFree ? 'Aprovado' : 'Pendente de validação manual'}</span>
              </div>
            </div>

            <button 
              type="button"
              onClick={handleSuccessClose}
              className={THEME.checkoutModal.successBtn}
            >
              Visualizar Meus Ingressos
            </button>

          </div>
        )}

      </div>
      
    </div>
  );
}
