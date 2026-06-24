import { motion } from "framer-motion";

export default function GameModal({ title, children, onExit }) {
  return (
    <motion.div
      className="fixed inset-0 z-[999999999] book-perspective"
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
        {/* Header */}
        <div className="flex items-center justify-between w-full flex-shrink-0">
          <h1
            className="font-display m-0"
            style={{
              color: "var(--theme-accent)",
              fontSize: "clamp(14px, 3.8vw, 48px)",
              padding: "clamp(6px, 1.8vw, 24px)"
            }}
          >
            {title}
          </h1>
          <button
            onClick={onExit}
            className="rounded-full bg-white shadow-lg flex items-center justify-center cursor-pointer border-0 flex-shrink-0"
            style={{
              width: "clamp(32px, 9vw, 72px)",
              height: "clamp(32px, 9vw, 72px)",
              fontSize: "clamp(14px, 3.5vw, 36px)",
              margin: "clamp(6px, 1.8vw, 24px)"
            }}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div
          className="flex-1 w-full overflow-y-auto game-modal-content"
          style={{
            padding: "clamp(4px, 1.5vw, 40px)",
          }}
        >
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}
