import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";

/**
 * Wraps page routes to animate book-flip transitions.
 * The leaving page rotates left (Y -90deg). The entering page fades/scales in.
 */
export default function BookFlipTransition({ children }) {
  const location = useLocation();
  return (
    <div className="book-perspective relative min-h-screen">
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ rotateY: 90, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          exit={{ rotateY: -90, opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.645, 0.045, 0.355, 1.0] }}
          style={{ transformOrigin: "left center", transformStyle: "preserve-3d", minHeight: "100vh" }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
