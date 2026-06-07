import { motion } from "framer-motion";

export default function GameModal({ title, children, onClose }) {
  return (
    <motion.div
      className="fixed inset-0 z-[150] book-perspective"
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
        <div className="flex items-center justify-between p-4">
          <div className="font-display text-xl" style={{ color: "var(--theme-accent)" }}>{title}</div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white shadow flex items-center justify-center"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </motion.div>
    </motion.div>
  );
}
