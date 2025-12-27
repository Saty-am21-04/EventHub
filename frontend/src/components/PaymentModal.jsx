import React, { useState } from 'react';

const PaymentModal = ({ event, onClose, onSuccess }) => {
  const [step, setStep] = useState('input'); // input | processing | success

  // --- Logic State ---
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [error, setError] = useState("");

  // --- Logic: Formatting Helpers ---
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(" ") : v;
  };

  const formatExpiry = (value) => {
    let val = value.replace(/\D/g, "");
    if (val.length > 2) val = val.slice(0, 2) + "/" + val.slice(2, 4);
    return val;
  };

  // --- Logic: Validation ---
  const validateForm = () => {
    const rawCard = cardNumber.replace(/\s/g, "");
    if (rawCard.length !== 16) return "Card number must be 16 digits";
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) return "Expiry must be MM/YY";
    
    const expYear = parseInt(expiry.split("/")[1], 10);
    // current year is 2025
    if (expYear < 25) return "Card has expired"; 
    
    if (cvv.length !== 3) return "CVV must be 3 digits";
    return null;
  };

  // --- Logic: Pay Handler ---
  const handlePay = (e) => {
    e.preventDefault();
    const validationError = validateForm();
    
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setStep('processing');

    setTimeout(() => {
      const txnId = "TXN" + Date.now();
      localStorage.setItem("payment", JSON.stringify({
        transactionId: txnId,
        amount: event?.price,
        status: "SUCCESS"
      }));

      setStep('success');
      setTimeout(() => {
        onSuccess();
      }, 1500);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-[#0f172a] border border-white/10 rounded-3xl w-full max-w-md p-8 relative shadow-2xl overflow-hidden transition-all">
        
        {/* Background Decorative Glows */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/20 blur-[80px] rounded-full"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-600/20 blur-[80px] rounded-full"></div>

        {/* Close Button - Hidden on success to prevent exit during redirection */}
        {step !== 'success' && (
          <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors z-20">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        )}

        {/* --- STEP 1: INPUT --- */}
        {step === 'input' && (
          <form onSubmit={handlePay} className="relative z-10 space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="text-center">
              <h2 className="text-2xl font-black text-white tracking-tight uppercase">Checkout</h2>
              <p className="text-blue-400 font-bold text-lg mt-1">₹{event?.price?.toLocaleString()}</p>
            </div>

            {/* THE Sleek Card Input Section */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 shadow-xl backdrop-blur-sm">
              <div className="flex justify-between items-center mb-8">
                {/* Chip Icon */}
                <div className="h-10 w-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg shadow-lg"></div>
                <div className="flex gap-1">
                   <div className="w-8 h-5 bg-white/10 rounded"></div>
                   <div className="w-8 h-5 bg-white/10 rounded"></div>
                </div>
              </div>

              <input
                required
                type="text"
                placeholder="0000 0000 0000 0000"
                maxLength="19"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                className="w-full bg-transparent text-white font-mono text-xl outline-none placeholder-gray-600 mb-6 tracking-[0.2em]"
              />

              <div className="flex gap-6 border-t border-white/5 pt-6">
                <div className="w-1/2">
                  <label className="text-[10px] font-black text-gray-500 uppercase block mb-1">Expiry</label>
                  <input
                    required
                    type="text"
                    placeholder="MM/YY"
                    maxLength="5"
                    value={expiry}
                    onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                    className="bg-transparent text-white font-mono outline-none placeholder-gray-600 w-full"
                  />
                </div>

                <div className="w-1/2 text-right">
                  <label className="text-[10px] font-black text-gray-500 uppercase block mb-1">CVC</label>
                  <input
                    required
                    type="password"
                    placeholder="***"
                    maxLength="3"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                    className="bg-transparent text-white font-mono outline-none placeholder-gray-600 w-full text-right"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 py-2 rounded-xl text-red-400 text-xs font-bold text-center animate-bounce">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest shadow-xl shadow-blue-600/20 transition-all active:scale-[0.98]"
            >
              Confirm & Pay
            </button>
          </form>
        )}

        {/* --- STEP 2: PROCESSING (Typewriter Effect) --- */}
        {step === 'processing' && (
          <div className="relative z-10 flex flex-col items-center justify-center py-12 text-center animate-in zoom-in-95 duration-300">
            <div className="loader mb-8">
              <span className="loader-text">Processing...</span>
            </div>
            <p className="text-gray-500 text-sm font-medium animate-pulse">
              Verifying with your bank
            </p>
            <p className="text-gray-600 text-[10px] mt-2 font-mono">Do not close this window</p>

            <style>{`
                .loader {
                  position: relative;
                  overflow: hidden;
                  border-right: 3px solid #3b82f6;
                  width: 0px;
                  animation: typewriter 2s steps(10) infinite alternate, blink 0.5s steps(10) infinite;
                }
                .loader-text {
                  font-size: 28px; 
                  font-weight: 800;
                  background: linear-gradient(to right, #3b82f6, #8b5cf6);
                  -webkit-background-clip: text;
                  -webkit-text-fill-color: transparent;
                  white-space: nowrap;
                  letter-spacing: -1px;
                }
                @keyframes typewriter {
                  0% { width: 0px; }
                  100% { width: 180px; } 
                }
                @keyframes blink {
                  0% { border-right-color: rgba(59, 130, 246, 1); }
                  100% { border-right-color: transparent; }
                }
            `}</style>
          </div>
        )}

        {/* --- STEP 3: SUCCESS --- */}
        {step === 'success' && (
          <div className="relative z-10 flex flex-col items-center justify-center py-12 text-center animate-in zoom-in-95 fade-in duration-500">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/40 mb-8 animate-in slide-in-from-top-8 duration-700">
                <svg className="w-12 h-12 text-white animate-in zoom-in-50 duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <h3 className="text-white font-black text-3xl mb-2">Payment Secured</h3>
            <p className="text-green-400 font-bold text-sm tracking-widest uppercase">Transaction Verified</p>
            <p className="text-gray-500 text-xs mt-6 italic">Redirecting to your digital pass...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;