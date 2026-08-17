import { useEffect, useRef } from 'react';

export default function QuoteSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftCloudRef = useRef<HTMLImageElement>(null);
  const rightCloudRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    let animationFrameId: number;
    let targetProgress = 0;
    let currentProgress = 0;

    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      let progress = (windowHeight - rect.top) / (windowHeight + rect.height);
      targetProgress = Math.max(0, Math.min(1, progress));
    };

    const animate = () => {
      currentProgress += (targetProgress - currentProgress) * 0.06;

      const inView = currentProgress > 0.12 && currentProgress < 0.92;
      const targetOpacity = inView ? 1 : 0;
      
      if (leftCloudRef.current) leftCloudRef.current.style.opacity = targetOpacity.toString();
      if (rightCloudRef.current) rightCloudRef.current.style.opacity = targetOpacity.toString();

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); 
    animate();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden flex items-center justify-center px-6 md:px-12 bg-[#020813]"
    >
      {/* Tech Abstract Background Elements instead of clouds */}
      <div ref={leftCloudRef} className="hidden sm:block absolute left-10 top-20 w-[400px] h-[400px] bg-blue-600/10 blur-[100px] rounded-full will-change-transform opacity-0 transition-opacity duration-1000" />
      <div ref={rightCloudRef} className="absolute right-10 bottom-20 w-[400px] h-[400px] bg-cyan-600/10 blur-[100px] rounded-full will-change-transform opacity-0 transition-opacity duration-1000" />

      {/* Tech Description */}
      <div className="relative z-20 max-w-4xl flex flex-col items-center text-center">
        <h2 className="text-blue-400 font-semibold tracking-widest uppercase mb-6">How it works</h2>
        <p className="font-inter text-white text-xl sm:text-2xl md:text-3xl lg:text-[36px] leading-[1.5] font-light">
          "By integrating Google Earth Engine API with a robust PyTorch-based Siamese U-Net model, our system performs pixel-level semantic segmentation to identify critical land-cover changes between temporal epochs with high precision."
        </p>
        <span className="mt-10 md:mt-12 text-white/50 text-sm md:text-base tracking-widest font-inter uppercase border border-white/10 px-6 py-2 rounded-full">
          SIH Project Core Architecture
        </span>
      </div>
    </section>
  );
}