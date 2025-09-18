import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Sparkles, Languages, Volume2 } from 'lucide-react';
import heroImage from '@/assets/hero-video-ai.jpg';

interface HeroProps {
  onGetStarted: () => void;
}

export function Hero({ onGetStarted }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-background"></div>
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${heroImage})` }}
      ></div>
      
      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center px-6 space-y-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm text-white">
            <Sparkles className="h-4 w-4 text-primary" />
            Legendas/Tradução/Dublagens 
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
            Traduza Vídeos com
            <span className="bg-gradient-primary bg-clip-text text-transparent"> IA</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Transforme qualquer vídeo em português com legendas automáticas, tradução instantânea e dublagem com voz de IA de última geração.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            variant="hero" 
            size="lg" 
            onClick={onGetStarted}
            className="text-lg px-8 py-6 h-auto"
          >
            <Play className="h-6 w-6 mr-2" />
            Começar Agora
          </Button>
          
          <Button 
            variant="glass" 
            size="lg"
            className="text-lg px-8 py-6 h-auto"
          >
            Ver Demo
          </Button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 text-center">
            <Languages className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Legendas Automáticas
            </h3>
            <p className="text-gray-400">
              Reconhecimento de fala avançado com precisão de 95%
            </p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 text-center">
            <Languages className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Tradução Inteligente
            </h3>
            <p className="text-gray-400">
              Traduções contextuais em tempo real para português
            </p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 text-center">
            <Volume2 className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Voz Natural
            </h3>
            <p className="text-gray-400">
              Dublagem com vozes de IA ultra-realistas
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}