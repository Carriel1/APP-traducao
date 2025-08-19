import React, { useState } from 'react';
import { Upload, Link2, Download, Play, Pause, Volume2, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

type ProcessingStep = 'upload' | 'processing' | 'completed';
type ProcessingType = 'subtitle' | 'translate' | 'voice';

interface VideoProcessorProps {
  className?: string;
}

export function VideoProcessor({ className }: VideoProcessorProps) {
  const [step, setStep] = useState<ProcessingStep>('upload');
  const [processingType, setProcessingType] = useState<ProcessingType>('subtitle');
  const [progress, setProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('video/')) {
        setVideoUrl(URL.createObjectURL(file));
        // Usar setTimeout para evitar setState durante render
        setTimeout(() => {
          toast({
            title: "Vídeo carregado!",
            description: "Selecione o tipo de processamento desejado.",
          });
        }, 0);
      } else {
        setTimeout(() => {
          toast({
            title: "Erro",
            description: "Por favor, selecione um arquivo de vídeo válido.",
            variant: "destructive",
          });
        }, 0);
      }
    }
  };

  const handleUrlSubmit = async () => {
    if (videoUrl) {
      try {
        // Simula download do vídeo do link
        const response = await fetch(videoUrl);
        if (response.ok) {
          toast({
            title: "Vídeo carregado!",
            description: "Selecione o tipo de processamento desejado.",
          });
        } else {
          throw new Error('Erro ao carregar vídeo');
        }
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível carregar o vídeo do link fornecido.",
          variant: "destructive",
        });
        setVideoUrl('');
      }
    }
  };

  const startProcessing = () => {
    setIsProcessing(true);
    setStep('processing');
    setProgress(0);
    
    // Simula o processamento
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          setStep('completed');
          toast({
            title: "Processamento concluído!",
            description: "Seu vídeo está pronto para download.",
          });
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };

  const downloadVideo = () => {
    const processedVideoName = `video_processado_${processingType}_${Date.now()}.mp4`;
    
    if (videoUrl.startsWith('blob:')) {
      // Para arquivos locais, baixar o original
      const a = document.createElement('a');
      a.href = videoUrl;
      a.download = processedVideoName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast({
        title: "Download concluído!",
        description: `${processedVideoName} foi baixado com sucesso.`,
      });
    } else {
      // Para URLs externas, criar vídeo demonstrativo processado
      createProcessedVideo(processedVideoName);
    }
  };

  const createProcessedVideo = (fileName: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    const stream = canvas.captureStream(30);
    const mediaRecorder = new MediaRecorder(stream, { 
      mimeType: 'video/webm;codecs=vp9' 
    });
    const chunks: Blob[] = [];
    
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunks.push(event.data);
    };
    
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/mp4' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Download concluído!",
        description: `Vídeo processado baixado com sucesso.`,
      });
    };
    
    mediaRecorder.start();
    
    // Animar por 5 segundos
    let frame = 0;
    const animate = () => {
      // Fundo gradiente
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#1a1a2e');
      gradient.addColorStop(1, '#16213e');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Texto principal
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Vídeo Processado com IA', canvas.width / 2, canvas.height / 2 - 40);
      
      // Tipo de processamento
      ctx.font = '32px Arial';
      const processingText = processingType === 'subtitle' ? 'Com Legendas Automáticas' :
                           processingType === 'translate' ? 'Traduzido para Português' : 'Com Dublagem IA';
      ctx.fillText(processingText, canvas.width / 2, canvas.height / 2 + 40);
      
      // Barra de progresso animada
      const progressWidth = 400;
      const progressHeight = 8;
      const progressX = (canvas.width - progressWidth) / 2;
      const progressY = canvas.height / 2 + 100;
      
      ctx.fillStyle = '#333';
      ctx.fillRect(progressX, progressY, progressWidth, progressHeight);
      
      const progress = (frame % 60) / 60;
      ctx.fillStyle = '#00ff88';
      ctx.fillRect(progressX, progressY, progressWidth * progress, progressHeight);
      
      frame++;
      if (frame < 150) { // 5 segundos a 30 FPS
        requestAnimationFrame(animate);
      } else {
        mediaRecorder.stop();
      }
    };
    
    animate();
  };

  return (
    <div className={className}>
      <Card className="p-8 shadow-card bg-black/40 backdrop-blur-sm border-white/10">
        <Tabs value={step} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/5 border border-white/10">
            <TabsTrigger value="upload" disabled={step !== 'upload'}>
              Upload
            </TabsTrigger>
            <TabsTrigger value="processing" disabled={step === 'upload'}>
              Processamento
            </TabsTrigger>
            <TabsTrigger value="completed" disabled={step !== 'completed'}>
              Download
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6 mt-6">
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold text-white">
                Adicione seu vídeo
              </h3>
              <p className="text-gray-300">
                Faça upload ou cole um link do seu vídeo
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Upload Section */}
              <div className="space-y-4">
                <label className="block">
                  <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-primary/50 transition-smooth cursor-pointer bg-white/5">
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <div className="text-white font-medium mb-2">
                      Clique para fazer upload
                    </div>
                    <div className="text-sm text-gray-400">
                      MP4, AVI, MOV até 500MB
                    </div>
                  </div>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* URL Section */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-white font-medium">
                    Link do vídeo
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="https://..."
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-primary"
                    />
                    <Button 
                      variant="glass" 
                      onClick={handleUrlSubmit}
                      disabled={!videoUrl}
                    >
                      <Link2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {videoUrl && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white">
                  Tipo de processamento
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card 
                    className={`p-4 cursor-pointer transition-smooth border-2 ${
                      processingType === 'subtitle' 
                        ? 'border-primary bg-primary/10' 
                        : 'border-white/20 bg-white/5 hover:border-white/30'
                    }`}
                    onClick={() => setProcessingType('subtitle')}
                  >
                    <div className="text-center space-y-2">
                      <Languages className="mx-auto h-8 w-8 text-primary" />
                      <h5 className="font-medium text-white">Legendas</h5>
                      <p className="text-sm text-gray-400">
                        Adicionar legendas automáticas
                      </p>
                    </div>
                  </Card>

                  <Card 
                    className={`p-4 cursor-pointer transition-smooth border-2 ${
                      processingType === 'translate' 
                        ? 'border-primary bg-primary/10' 
                        : 'border-white/20 bg-white/5 hover:border-white/30'
                    }`}
                    onClick={() => setProcessingType('translate')}
                  >
                    <div className="text-center space-y-2">
                      <Languages className="mx-auto h-8 w-8 text-primary" />
                      <h5 className="font-medium text-white">Tradução</h5>
                      <p className="text-sm text-gray-400">
                        Traduzir para português
                      </p>
                    </div>
                  </Card>

                  <Card 
                    className={`p-4 cursor-pointer transition-smooth border-2 ${
                      processingType === 'voice' 
                        ? 'border-primary bg-primary/10' 
                        : 'border-white/20 bg-white/5 hover:border-white/30'
                    }`}
                    onClick={() => setProcessingType('voice')}
                  >
                    <div className="text-center space-y-2">
                      <Volume2 className="mx-auto h-8 w-8 text-primary" />
                      <h5 className="font-medium text-white">Voz IA</h5>
                      <p className="text-sm text-gray-400">
                        Dublar com voz artificial
                      </p>
                    </div>
                  </Card>
                </div>

                <Button 
                  variant="hero" 
                  size="lg" 
                  onClick={startProcessing}
                  className="w-full"
                >
                  <Play className="h-5 w-5 mr-2" />
                  Iniciar Processamento
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="processing" className="space-y-6 mt-6">
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold text-white">
                Processando seu vídeo
              </h3>
              <p className="text-gray-300">
                Nossa IA está trabalhando na {
                  processingType === 'subtitle' ? 'criação de legendas' :
                  processingType === 'translate' ? 'tradução' : 'dublagem'
                }...
              </p>
            </div>

            <div className="space-y-4">
              <Progress value={progress} className="h-3" />
              <div className="text-center text-white font-medium">
                {progress}% concluído
              </div>
            </div>

            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          </TabsContent>

          <TabsContent value="completed" className="space-y-6 mt-6">
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold text-white">
                Vídeo processado!
              </h3>
              <p className="text-gray-300">
                Seu vídeo está pronto para download
              </p>
            </div>

            <div className="flex justify-center">
              <Button 
                variant="hero" 
                size="lg" 
                onClick={downloadVideo}
                className="min-w-48"
              >
                <Download className="h-5 w-5 mr-2" />
                Baixar Vídeo
              </Button>
            </div>

            <div className="text-center">
              <Button 
                variant="ghost" 
                onClick={() => {
                  setStep('upload');
                  setProgress(0);
                  setVideoUrl('');
                }}
                className="text-gray-400 hover:text-white"
              >
                Processar outro vídeo
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}