import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import ScrambleText from './ScrambleText';

// --- CONFIGURATION ---
const EXTERNAL_IMAGE_LINKS = [
  // Existing Photos
  "https://drive.google.com/thumbnail?id=14W6GzlPk2BOvkVFJ7P_IcEM5LRtqTWm9&sz=w1000", 
  "https://drive.google.com/thumbnail?id=1cabHo0wpT6tg4L1mrZwkIRXGxma2UbqV&sz=w1000",
  "https://drive.google.com/thumbnail?id=1DFr9wme6QCNMuqn6LtU4vt0gQhIWS5Af&sz=w1000",
  "https://drive.google.com/thumbnail?id=1AbT2zUppCkaNhUE9xtUQPfwJ-3ZGtmjV&sz=w1000",
  "https://drive.google.com/thumbnail?id=16oi9iGDR5pxRsCGV2G57rpHS5AqaY6MP&sz=w1000",
  // New Photos Requested
  "https://drive.google.com/thumbnail?id=1Eh9TF8qlihFdmIm-p-EJOiugopGSe-yS&sz=w1000",
  "https://drive.google.com/thumbnail?id=1IdRIMOKnBbwYX8yiKG_oW813bFqITIO7&sz=w1000",
  "https://drive.google.com/thumbnail?id=1dyg3RkWqPKIa9ApQGj-XCMRwAZ7i_U7n&sz=w1000",
  "https://drive.google.com/thumbnail?id=1in81F4Yo2rWHFZ593KgJNpQhveBeTZv-&sz=w1000"
];

const PHOTOS = EXTERNAL_IMAGE_LINKS.map((url, index) => ({
  id: index,
  src: url,
  alt: [
    "NIT-R Innovison", 
    "NIT-R TranceNation-1", 
    "NIT-R TranceNation-2",
    "NIT-R Innovison", 
    "TPM 10/05/2025",
    "Installing lights",
    "Christmas in January",
    "Building the setup",
    "NASA"
  ][index] || "Gallery Image",
  description: [
    "Performance pictures from Innovision fest at NIT ROURKELA",
    "Performing live at TranceNation @ NIT Rourkela",
    "Performing my DJ set live at TranceNation @ NIT Rourkela",
    "Performance pictures from Innovision fest at NIT ROURKELA",
    "Still from a video of me performing at the Piano Man, Gurgaon.",
    "The setup in all its glory, after installing a really bad quality LED strip. This is where I do most of my work.",
    "Snowfall in Texas ? Who wouldve thought. This has always been what I imagined christmas would always look like in the USA, its just unfortunate it happened in january.",
    "Building this setup from scratch was an exhausting task. Sourcing the table, monitor and peripherals from different sources, all while working on a shoe string budget, this was worth the effort in the end.",
    "A lifelong dream was fulfilled as I visited NASA this summer."
  ][index] || "Description unavailable."
}));

const features = [
  { title: "Backend Systems", desc: "Java, Python, SQL, FastAPI, Node.js, REST/GraphQL APIs, API Design, PostgreSQL, MySQL, Cloud-Native development." },
  { title: "AI / ML", desc: "Generative AI, NLP, GANs, PyTorch, TensorFlow, Computer Vision, Data Preprocessing, LLM-based automation." },
  { title: "Web Apps", desc: "React, Angular, TypeScript, ShadCN UI, Tailwind CSS, Responsive UI/UX, End-to-end full-stack integration." },
  { title: "Solutions", desc: "Automating workflows, optimizing API performance, building scalable architectures, and solving complex technical challenges." }
];

const About: React.FC = () => {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const nextPhoto = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentPhotoIndex((prev) => (prev + 1) % PHOTOS.length);
  };

  const prevPhoto = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentPhotoIndex((prev) => (prev - 1 + PHOTOS.length) % PHOTOS.length);
  };

  // Pseudo-random positioning for the sticky notes based on index
  const getStickyStyle = (index: number) => {
    const rotations = [-2, 3, -4, 2, -1, 4, -3, 1];
    const yOffsets = [10, -20, 15, -5, 10, -15, 5, -10];
    return {
      rotate: rotations[index % rotations.length],
      y: yOffsets[index % yOffsets.length]
    };
  };

  return (
    <section id="about" className="grid grid-cols-1 md:grid-cols-2">
      {/* Left Col: Sticky Notes Grid */}
      <div className="p-8 md:p-12 border-b md:border-b-0 md:border-r border-fg bg-bg relative min-h-[500px] overflow-hidden">
         {/* Background Grid Pattern */}
         <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
         
         {/* Scatter Container */}
         <div className="relative z-10 w-full h-full flex flex-wrap content-center justify-center gap-6 md:gap-8 p-4">
            {PHOTOS.map((photo, index) => {
              const style = getStickyStyle(index);
              return (
                <motion.div
                  key={photo.id}
                  onClick={() => {
                    setCurrentPhotoIndex(index);
                    setIsGalleryOpen(true);
                  }}
                  className="relative group cursor-pointer w-32 h-40 md:w-36 md:h-44 bg-bg border border-fg p-2 shadow-[4px_4px_0px_0px_var(--fg)] hover:shadow-[8px_8px_0px_0px_var(--fg)] hover:-translate-y-1 transition-all duration-300"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  whileHover={{ 
                    scale: 1.1, 
                    zIndex: 20, 
                    rotate: 0,
                  }}
                  style={{
                    rotate: style.rotate,
                    translateY: style.y,
                  }}
                >
                  {/* Tape Effect */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-4 bg-fg/20 backdrop-blur-[1px] transform -rotate-1 z-10"></div>
                  
                  {/* Image */}
                  <div className="w-full h-[75%] overflow-hidden border-b border-fg bg-fg/5 mb-2 relative">
                     <img 
                       src={photo.src} 
                       alt={photo.alt}
                       className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-300"
                     />
                     <div className="absolute inset-0 bg-fg/0 group-hover:bg-fg/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Maximize2 size={16} className="text-bg drop-shadow-md" />
                     </div>
                  </div>
                  
                  {/* Label */}
                  <div className="h-[25%] flex items-center justify-center">
                    <p className="font-mono text-[9px] text-center leading-tight truncate px-1 uppercase tracking-tighter">
                      {photo.alt}
                    </p>
                  </div>
                </motion.div>
              );
            })}
         </div>
      </div>

      {/* Right Col: Content */}
      <div className="flex flex-col">
        <div className="p-8 md:p-16 border-b border-fg">
          <h2 className="text-4xl font-serif italic mb-8"><ScrambleText text="About Me" /></h2>
          <p className="font-mono text-sm leading-7 mb-6">
            I am a software engineer pursuing an M.S. in Computer Science at UT Dallas with experience in backend systems, AI/ML, and scalable web applications. I approach engineering with a focus on building things that are both practical and expressive, systems that work reliably at scale while still carrying a sense of creativity and intention.
          </p>
          <p className="font-mono text-sm leading-7">
            With a strong foundation in Java, Python, AI/ML, APIs, and cloud-native development, I have worked on everything from cyber situational awareness tools to generative AI pipelines for banking. Beyond engineering, I explore the intersection of technology and art, creating music as Rayjew and experimenting with visual and computational forms of expression.
          </p>
        </div>

        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2">
          {features.map((f, i) => (
            <div key={i} className="p-6 border-b sm:border-b-0 border-r border-fg last:border-r-0 sm:nth-last-child(2):border-b-0 odd:border-r hover-invert transition-colors cursor-default group">
              <h3 className="font-serif text-xl mb-2 group-hover:italic">{f.title}</h3>
              <p className="font-mono text-xs opacity-70">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Full Screen Gallery Modal */}
      <AnimatePresence>
        {isGalleryOpen && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] bg-bg/95 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
                onClick={() => setIsGalleryOpen(false)}
            >
                <button 
                    className="absolute top-4 right-4 md:top-8 md:right-8 p-2 border border-fg hover:bg-fg hover:text-bg transition-colors z-50"
                    onClick={() => setIsGalleryOpen(false)}
                >
                    <X size={24} />
                </button>

                <div 
                    className="relative w-full max-w-6xl h-[85vh] flex flex-col md:grid md:grid-cols-[1fr_300px] border border-fg shadow-[20px_20px_0px_0px_var(--fg)] bg-bg"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Image Container */}
                    <div className="relative h-full overflow-hidden bg-black/5 flex items-center justify-center p-4 md:p-8 border-b md:border-b-0 md:border-r border-fg">
                        <AnimatePresence mode="wait">
                            <motion.img
                                key={currentPhotoIndex}
                                src={PHOTOS[currentPhotoIndex].src}
                                alt={PHOTOS[currentPhotoIndex].alt}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="max-w-full max-h-full object-contain shadow-lg"
                            />
                        </AnimatePresence>

                        {/* Navigation Arrows (Overlay) */}
                        <div className="absolute inset-0 flex items-center justify-between p-2 md:p-4 pointer-events-none">
                            <button 
                                onClick={prevPhoto}
                                className="pointer-events-auto p-3 bg-bg/80 backdrop-blur border border-fg hover:bg-fg hover:text-bg transition-colors rounded-full md:rounded-none"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <button 
                                onClick={nextPhoto}
                                className="pointer-events-auto p-3 bg-bg/80 backdrop-blur border border-fg hover:bg-fg hover:text-bg transition-colors rounded-full md:rounded-none"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </div>
                    </div>

                    {/* Sidebar / Description */}
                    <div className="h-full bg-bg flex flex-col overflow-y-auto">
                        <div className="p-6 border-b border-fg bg-fg text-bg shrink-0">
                            <span className="font-mono text-xs font-bold uppercase tracking-widest">Image Details</span>
                        </div>
                        <div className="p-6 flex-1 flex flex-col justify-between">
                            <div>
                                <h3 className="font-serif text-2xl italic mb-4 leading-tight">{PHOTOS[currentPhotoIndex].alt}</h3>
                                <div className="w-10 h-1 bg-fg mb-6"></div>
                                <p className="font-mono text-xs md:text-sm leading-relaxed opacity-80">
                                    {PHOTOS[currentPhotoIndex].description}
                                </p>
                            </div>
                            
                            <div className="mt-8 pt-6 border-t border-fg/20 flex justify-between items-end">
                                <span className="font-mono text-[10px] uppercase opacity-50">Gallery Index</span>
                                <span className="font-mono text-xl font-bold">{`0${currentPhotoIndex + 1} / 0${PHOTOS.length}`}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default About;