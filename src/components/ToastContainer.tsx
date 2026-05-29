import { Alert, Box } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";

export interface Toast {
  id: string;
  message: string;
}

interface Props {
  toasts: Toast[];
  onClose: (id: string) => void;
}

const toastVariants: Variants = {
  initial: { opacity: 0, x: 48, scale: 0.9 },
  animate: { 
    opacity: 1, 
    x: 0, 
    scale: 1,
    transition: { type: "spring", stiffness: 350, damping: 25 } 
  },
  exit: { 
    opacity: 0, 
    x: 48, 
    scale: 0.85, 
    transition: { duration: 0.18 } 
  },
};

export function ToastContainer({ toasts, onClose }: Props) {
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 2000,
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
        width: "100%",
        maxWidth: 360,
      }}
    >
      <AnimatePresence initial={false}>
        {toasts.map((toast) => (
          <Box
            key={toast.id}
            component={motion.div}
            layout // Framer Motion automatycznie przesunie pozostałe toasty w górę przy usuwaniu
            variants={toastVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Alert 
              severity="error" 
              variant="filled" 
              onClose={() => onClose(toast.id)}
              sx={{ boxShadow: 4, borderRadius: 2 }}
            >
              {toast.message}
            </Alert>
          </Box>
        ))}
      </AnimatePresence>
    </Box>
  );
}