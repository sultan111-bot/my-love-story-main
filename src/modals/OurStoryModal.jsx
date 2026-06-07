import { motion } from "framer-motion";

const ENTRIES = [
  { date: "11/02/2026", title: "Hari Jadian Kitaaa 💕", desc: "mff yhh klo ak kurang romantis pas nembak km bubb HEHEHEHEE" },
  { date: "22/02/2026", title: "Pertama Kali Kita Jalan Berduaa 🤗", desc: "HUAHH akhirnyaa di tanggal ini kita jalan cuma berduaa, yhh walaupun pagi-siang nya ada pani n jeni sikk" },
  { date: "11/04/2026", title: "First Time Ak Main Kerumah Kamuu 💒", desc: "jujurr ini ak reflek jadi anak kalem nan baik hati sikk HAHAHAHAHA NERVOUS BGTT??!!" },
  { date: "17/04/2026", title: "First Time Km Ketemu my familyy 👨‍👩‍👧‍👦", desc: "OMGG kamu ketemu keluarga akuu AKSJKAJKSJKJAJA LUCUKKKK" },
  { date: "Selamanyaa", title: "Sama-Sama Terus yaa sayanggg 🌍", desc: "bareng terus sama akuu yaa sayanggg, pokoknya kita harus sama-sama teruss gmw tw hehehe" },
];

export default function OurStoryModal({ onClose }) {
  return (
    <motion.div
      className="fixed inset-0 z-[150] book-perspective"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="absolute inset-0 overflow-y-auto"
        style={{ background: "var(--theme-bg)", transformOrigin: "left center" }}
        initial={{ rotateY: 90 }}
        animate={{ rotateY: 0 }}
        exit={{ rotateY: -90 }}
        transition={{ duration: 0.8, ease: [0.645, 0.045, 0.355, 1.0] }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between p-4"
             style={{ background: "var(--theme-bg)" }}>
          <h2 className="font-display text-2xl" style={{ color: "#C2185B" }}>Our Story 💑</h2>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white shadow flex items-center justify-center"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="relative mx-auto max-w-md py-6 px-6 pb-24">
          {/* Center line */}
          <div
            className="absolute top-6 bottom-24 w-0.5"
            style={{ background: "#FFB6C1", left: "50%", transform: "translateX(-50%)" }}
          />

          {ENTRIES.map((e, idx) => {
            const left = idx % 2 === 0;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5 }}
                className="relative my-6 flex"
              >
                {/* Dot */}
                <div
                  className="absolute w-4 h-4 rounded-full"
                  style={{
                    background: "#FF6B9D",
                    left: "50%",
                    transform: "translateX(-50%)",
                    boxShadow: "0 0 0 4px var(--theme-bg)",
                    top: 8,
                  }}
                />
                <div
                  className={`w-1/2 ${left ? "pr-6 text-right" : "pl-6 text-left ml-auto"}`}
                  style={{ marginLeft: left ? 0 : "50%" }}
                >
                  <div className="text-[11px] text-gray-500">{e.date}</div>
                  <div className="font-bold text-gray-800 text-sm">{e.title}</div>
                  <div className="text-[13px] text-gray-600 mt-1 font-body leading-relaxed">{e.desc}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
