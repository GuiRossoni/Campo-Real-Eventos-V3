import React, { useState } from 'react';
import { Event, Workshop } from '../../types';
import { X, ShieldCheck, CreditCard, QrCode, Clipboard, Wallet, CheckCircle2, ShoppingBag } from 'lucide-react';
import { THEME } from '../styles/designSystem';

interface CheckoutModalProps {
  event: Event;
  selectedWorkshops: Workshop[];
  onClose: () => void;
  onConfirm: (paymentOption: 'CREDITO' | 'PIX' | 'GRATUITO') => void;
}

export default function CheckoutModal({
  event,
  selectedWorkshops,
  onClose,
  onConfirm
}: CheckoutModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'CREDITO' | 'PIX'>('PIX');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [copiedPix, setCopiedPix] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'CHECKOUT' | 'SUCCESS'>('CHECKOUT');

  const baseValue = event.price;
  const workshopsTotal = selectedWorkshops.reduce((sum, w) => sum + w.price, 0);
  const finalTotal = baseValue + workshopsTotal;
  const isFree = finalTotal === 0;

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

    if (paymentMethod === 'CREDITO') {
      if (!cardName || !cardNumber || !cardExpiry || !cardCvv) {
        alert('Por favor, preencha todos os campos do cartão para simular.');
        return;
      }
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep('SUCCESS');
    }, 2000);
  };

  const handleSuccessClose = () => {
    onConfirm(isFree ? 'GRATUITO' : paymentMethod);
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
                    <h3 className={THEME.checkoutModal.paymentTitle}>Método de Pagamento Simulado</h3>
                    
                    
                    <div className={THEME.checkoutModal.paymentSwitch}>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('PIX')}
                        className={`${THEME.checkoutModal.paymentSwitchBtn} ${
                          paymentMethod === 'PIX' ? THEME.checkoutModal.paymentSwitchActive : THEME.checkoutModal.paymentSwitchInactive
                        }`}
                      >
                        <QrCode className={THEME.checkoutModal.paymentSwitchIcon} />
                        <span>PIX</span>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('CREDITO')}
                        className={`${THEME.checkoutModal.paymentSwitchBtn} ${
                          paymentMethod === 'CREDITO' ? THEME.checkoutModal.paymentSwitchActive : THEME.checkoutModal.paymentSwitchInactive
                        }`}
                      >
                        <CreditCard className={THEME.checkoutModal.paymentSwitchIcon} />
                        <span>Cartão</span>
                      </button>
                    </div>
                  </div>

                  
                  {paymentMethod === 'PIX' && (
                    <div className={THEME.checkoutModal.pixBox}>
                      
                      
                      <div className={THEME.checkoutModal.qrWrap}>
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&color=1e293b&data=${encodeURIComponent("00020126580014BR.GOV.BCB.PIX0136camporealeventossandbox9284729183749")}`}
                          alt="Pix QR Code Sandbox"
                          className={THEME.checkoutModal.qrImage}
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      <div className="w-full">
                        <p className={THEME.checkoutModal.pixHint}>Escaneie o QR Code ou copie a linha de pagamento digitável:</p>
                        <div className={THEME.checkoutModal.pixCodeRow}>
                          <input 
                            type="text" 
                            readOnly 
                            value="00020126580014BR.GOV.BCB.PIX0136camporealeventossandbox9284729183749"
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
                      </div>

                    </div>
                  )}

                  
                  {paymentMethod === 'CREDITO' && (
                    <div className={THEME.checkoutModal.creditForm}>
                      
                      <div>
                        <label className={THEME.checkoutModal.fieldLabel}>Nome no Cartão</label>
                        <input 
                          type="text"
                          placeholder="EX: GUILHERME S SANTOS"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value.toUpperCase())}
                          className={THEME.checkoutModal.fieldInput}
                        />
                      </div>

                      <div>
                        <label className={THEME.checkoutModal.fieldLabel}>Número do Cartão</label>
                        <input 
                          type="text"
                          placeholder="4444 8888 2222 9999"
                          value={cardNumber}
                          maxLength={16}
                          onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                          className={THEME.checkoutModal.fieldInputMono}
                        />
                      </div>

                      <div className={THEME.checkoutModal.creditGrid}>
                        <div>
                          <label className={THEME.checkoutModal.fieldLabel}>Validade (MM/AA)</label>
                          <input 
                            type="text"
                            placeholder="12/29"
                            maxLength={5}
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className={THEME.checkoutModal.fieldInputMono}
                          />
                        </div>
                        <div>
                          <label className={THEME.checkoutModal.fieldLabel}>CVC (Atrás)</label>
                          <input 
                            type="password"
                            placeholder="123"
                            maxLength={3}
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                            className={THEME.checkoutModal.fieldInputMono}
                          />
                        </div>
                      </div>

                    </div>
                  )}

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
                  disabled={isProcessing}
                  className={THEME.checkoutModal.confirmBtn}
                >
                  {isProcessing ? (
                    <>
                      <div className={THEME.checkoutModal.spinner}></div>
                      <span>Simulando Transação com Mercado Pago...</span>
                    </>
                  ) : (
                    <>
                      <Wallet className={THEME.checkoutModal.walletIcon} />
                      <span>{isFree ? 'Confirmar Reserva de Vaga' : `Emitir Ingressos por R$ ${finalTotal.toFixed(2)}`}</span>
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

            <h3 className={THEME.checkoutModal.successTitle}>Compra e Inscrição Aprovadas!</h3>
            
            <p className={THEME.checkoutModal.successText}>
              Obrigado! Sua vaga foi reservada com êxito no evento <span className={THEME.checkoutModal.successEvent}>"{event.name}"</span>. {selectedWorkshops.length > 0 && `Seus ${selectedWorkshops.length} minicursos adicionais também foram vinculados com sucesso.`}
            </p>

            <div className={THEME.checkoutModal.receiptCard}>
              <div className={THEME.checkoutModal.receiptRow}>
                <span className={THEME.checkoutModal.receiptLabel}>Comprovante ID</span>
                <span className={THEME.checkoutModal.receiptId}>TKT-{Date.now().toString().substr(-8)}</span>
              </div>
              <div className={THEME.checkoutModal.receiptStatusRow}>
                <span className={THEME.checkoutModal.receiptLabel}>Status do Pagamento</span>
                <span className={THEME.checkoutModal.receiptStatus}>Aprovado</span>
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
