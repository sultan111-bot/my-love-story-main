import { motion } from "framer-motion";

export default function GameModal({ title, children, onClose }) {
  return (
    <motion.div
      className="fixed inset-0 z-[9999999] book-perspective"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="absolute inset-0 flex flex-col"
        style={{ background: "var(--theme-bg)", transformOrigin: "left center" }}
        initial={{ rotateY: 90 }}
        animate={{ rotateY: 0 }}
        exit={{ rotateY: -90 }}
        transition={{ duration: 0.8, ease: [0.645, 0.045, 0.355, 1.0] }}
      >
        <div className="flex items-center justify-between p-4 sm:p-6 md:p-8 lg:p-10 flex-shrink-0 lg:pt-20">
          <div className="font-display text-xl sm:text-2xl md:text-3xl lg:text-4xl" style={{ color: "var(--theme-accent)" }}>{title}</div>
          <button
            onClick={onClose}
            className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full bg-white shadow flex items-center justify-center text-xl sm:text-2xl md:text-3xl lg:text-4xl"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div 
          className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 lg:p-10 game-modal-content"
        >
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}
