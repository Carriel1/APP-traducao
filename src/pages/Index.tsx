import React, { useRef } from 'react';
import { Hero } from '@/components/Hero';
import { VideoProcessor } from '@/components/VideoProcessor';

const Index = () => {
  const processorRef = useRef<HTMLDivElement>(null);

  const scrollToProcessor = () => {
    processorRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'center'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Hero onGetStarted={scrollToProcessor} />
      
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Processe Seu Vídeo
            </h2>
            <p className="text-gray-300 text-lg">
              Faça upload ou adicione um link e deixe nossa IA trabalhar
            </p>
          </div>
          
          <div ref={processorRef}>
            <VideoProcessor />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
