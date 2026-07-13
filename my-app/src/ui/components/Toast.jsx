import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, X, AlertTriangle, Info } from "lucide-react";

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

const ToastCard = ({ id, type, message, duration = 3000, onClose }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isHovered) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const intervalStep = 50;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= intervalStep) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - intervalStep;
      });
    }, intervalStep);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isHovered, duration]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onClose(id);
    }
  }, [timeLeft, id, onClose]);

  // Color config based on the user screenshot
  const config = {
    success: {
      cardBg: "bg-[#cbebdc]",
      textColor: "text-[#104b38]",
      descColor: "text-[#185e47]",
      titleText: "Success",
      icon: <Check className="text-[#104b38]" size={20} strokeWidth={3.5} />,
      closeColor: "text-[#104b38]/40 hover:text-[#104b38]/80",
    },
    error: {
      cardBg: "bg-[#fad2d2]",
      textColor: "text-[#5e1818]",
      descColor: "text-[#792626]",
      titleText: "Error",
      icon: <span className="text-[#5e1818] font-bold text-xl leading-none ">!</span>,
      closeColor: "text-[#5e1818]/40 hover:text-[#5e1818]/80",
    },
    warning: {
      cardBg: "bg-[#fef3c7]",
      textColor: "text-[#78350f]",
      descColor: "text-[#92400e]",
      titleText: "Warning",
      icon: <AlertTriangle className="text-[#78350f]" size={20} strokeWidth={2.5} />,
      closeColor: "text-[#78350f]/40 hover:text-[#78350f]/80",
    },
    info: {
      cardBg: "bg-[#e0f2fe]",
      textColor: "text-[#0c4a6e]",
      descColor: "text-[#075985]",
      titleText: "Information",
      icon: <Info className="text-[#0c4a6e]" size={20} strokeWidth={2.5} />,
      closeColor: "text-[#0c4a6e]/40 hover:text-[#0c4a6e]/80",
    },
  }[type] || {
    cardBg: "bg-[#cbebdc]",
    textColor: "text-[#104b38]",
    descColor: "text-[#185e47]",
    titleText: "Notification",
    icon: <Check className="text-[#104b38]" size={20} strokeWidth={3.5} />,
    closeColor: "text-[#104b38]/40 hover:text-[#104b38]/80",
  };

  const progressWidth = (timeLeft / duration) * 100;

  // Dynamically split message into title and description if it has a natural boundary
  let title = config.titleText;
  let description = "";

  if (message.includes("\n")) {
    const parts = message.split("\n");
    title = parts[0];
    description = parts.slice(1).join("\n");
  } else if (message.includes("! ") && message.length > 20) {
    const idx = message.indexOf("! ");
    title = message.substring(0, idx + 1);
    description = message.substring(idx + 2);
  } else if (message.includes(". ") && message.length > 20) {
    const idx = message.indexOf(". ");
    title = message.substring(0, idx);
    description = message.substring(idx + 2);
  } else {
    title = message;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.15 } }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative w-[90vw] max-w-[420px] ${config.cardBg} ${config.textColor} px-6 py-5 overflow-hidden rounded-[26px] shadow-[0_10px_35px_rgba(0,0,0,0.07)] border border-white/10`}
    >
      {/* Background organic blobs matching the user's design */}
      <div className="absolute left-0 top-0 bottom-0 w-28 overflow-hidden pointer-events-none select-none rounded-l-[26px]">
        <div className="absolute -left-3 -top-3 w-16 h-16 rounded-full bg-white/20 blur-[1px]" />
        <div className="absolute -left-1 -bottom-4 w-16 h-16 rounded-full bg-white/15 blur-[1px]" />
        <div className="absolute left-8 top-6 w-8 h-8 rounded-full bg-white/10 blur-[1px]" />
      </div>

      <div className="relative z-10 flex gap-4 items-center pr-6">
        {/* White circular icon container */}
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          {config.icon}
        </div>

        <div className="flex-1 min-w-0">
          <span className="text-sm font-bold block leading-tight ">
            {title}
          </span>
          {description && (
            <p className={`text-xs ${config.descColor} font-normal mt-1 leading-snug `}>
              {description}
            </p>
          )}
        </div>

        <button
          onClick={() => onClose(id)}
          className={`absolute top-0 right-0 p-1 rounded-full transition-colors ${config.closeColor}`}
        >
          <X size={16} strokeWidth={2.5} />
        </button>
      </div>

      {/* Subtle Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-black/5">
        <div
          className="h-full bg-white/40 transition-all ease-linear"
          style={{ width: `${progressWidth}%`, transitionDuration: "50ms" }}
        />
      </div>
    </motion.div>
  );
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((type, message, duration) => {
    let id = null;
    setToasts((prev) => {
      // Prevent duplicate active toasts with the same message
      if (prev.some((t) => t.message === message)) {
        return prev;
      }
      id = Math.random().toString(36).substring(2, 9);
      return [...prev, { id, type, message, duration }];
    });
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const toast = {
    success: (message, duration = 3000) => addToast("success", message, duration),
    error: (message, duration = 3000) => addToast("error", message, duration),
    warning: (message, duration = 3000) => addToast("warning", message, duration),
    info: (message, duration = 3000) => addToast("info", message, duration),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast Portal Container at top middle */}
      <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-3 pointer-events-none w-full items-center">
        <div className="flex flex-col gap-3 pointer-events-auto items-center">
          <AnimatePresence mode="popLayout">
            {toasts.map((t) => (
              <ToastCard
                key={t.id}
                id={t.id}
                type={t.type}
                message={t.message}
                duration={t.duration}
                onClose={removeToast}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </ToastContext.Provider>
  );
};
