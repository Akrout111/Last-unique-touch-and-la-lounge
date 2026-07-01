import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import PurpleWaves3D from './PurpleWaves3D';

interface LaLoungeViewProps {
  onBack: () => void;
}

export default function LaLoungeView({ onBack }: LaLoungeViewProps) {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-white flex flex-col items-center justify-center">
      
      {/* High-fidelity 3D Wires Background */}
      <div className="absolute inset-0 z-0">
        <PurpleWaves3D />
      </div>

      {/* Floating Back Button */}
      <div className="absolute top-6 sm:top-10 left-6 sm:left-10 z-20">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          whileHover={{ x: -4, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onBack}
          className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/50 backdrop-blur-md border border-purple-100/30 shadow-sm hover:shadow-md text-purple-800 transition-all font-medium text-xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-sans font-medium tracking-wide">العودة</span>
        </motion.button>
      </div>

      {/* Centered Luxury Brand Title Block */}
      <main className="relative z-10 flex flex-col items-center text-center">
        <motion.h1 
          initial={{ opacity: 0, filter: 'blur(10px)', y: 10 }}
          animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          transition={{ duration: 1.5, delay: 1.2, ease: "easeOut" }}
          className="text-5xl sm:text-7xl md:text-8xl font-serif font-light text-purple-950 tracking-widest drop-shadow-sm pointer-events-none"
        >
          La Lounge
        </motion.h1>
        
        <motion.button
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.8, ease: "easeOut" }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-8 px-10 py-3.5 bg-purple-700 hover:bg-purple-800 text-white rounded-full font-sans tracking-wide text-sm font-medium shadow-[0_4px_20px_rgba(126,34,206,0.3)] hover:shadow-[0_6px_25px_rgba(126,34,206,0.4)] transition-all cursor-pointer border border-purple-500/30"
        >
          استكشف
        </motion.button>
      </main>
    </div>
  );
}
