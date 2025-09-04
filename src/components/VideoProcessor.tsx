import React, { useState, useRef } from 'react';
import { Upload, Link2, Download, Play, Pause, Volume2, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { pipeline, env } from '@huggingface/transformers';

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
  const [processedVideoUrl, setProcessedVideoUrl] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  // Configure transformers
  env.allowLocalModels = false;

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

  const startProcessing = async () => {
    setIsProcessing(true);
    setStep('processing');
    setProgress(0);
    
    try {
      let processedVideo;
      
      if (processingType === 'subtitle') {
        processedVideo = await processVideoWithSubtitles();
      } else if (processingType === 'translate') {
        processedVideo = await processVideoWithTranslation();
      } else if (processingType === 'voice') {
        processedVideo = await processVideoWithDubbing();
      }
      
      if (processedVideo) {
        setProcessedVideoUrl(processedVideo);
        setStep('completed');
        toast({
          title: "Processamento concluído!",
          description: "Seu vídeo está pronto para download.",
        });
      }
    } catch (error) {
      console.error('Erro no processamento:', error);
      toast({
        title: "Erro no processamento",
        description: "Ocorreu um erro ao processar o vídeo. Tente novamente.",
        variant: "destructive",
      });
      setStep('upload');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadVideo = () => {
    if (processedVideoUrl) {
      const processedVideoName = `video_processado_${processingType}_${Date.now()}.webm`;
      const a = document.createElement('a');
      a.href = processedVideoUrl;
      a.download = processedVideoName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast({
        title: "Download concluído!",
        description: `Vídeo ${processingType === 'subtitle' ? 'legendado' : processingType === 'translate' ? 'traduzido' : 'dublado'} baixado com sucesso.`,
      });
    }
  };

  const extractAudioFromVideo = async (video: HTMLVideoElement): Promise<AudioBuffer> => {
    const audioContext = new AudioContext();
    const canvas = document.createElement('canvas');
    const stream = canvas.captureStream();
    const mediaRecorder = new MediaRecorder(stream);
    
    // Para simplificar, vamos usar Web Audio API para capturar áudio
    const source = audioContext.createMediaElementSource(video);
    const analyser = audioContext.createAnalyser();
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    
    // Simular extração de áudio (em produção, usaria FFmpeg.wasm)
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);
    
    // Criar um buffer de áudio simulado
    const buffer = audioContext.createBuffer(2, audioContext.sampleRate * video.duration, audioContext.sampleRate);
    return buffer;
  };

  const processVideoWithSubtitles = async (): Promise<string> => {
    setProgress(10);
    
    try {
      // Carregar modelo de speech-to-text
      const transcriber = await pipeline(
        'automatic-speech-recognition',
        'Xenova/whisper-tiny',
        { device: 'webgpu' }
      );
      
      setProgress(30);
      
      // Simular transcrição (em produção real, extrairia áudio do vídeo)
      const mockTranscription = [
        { start: 0, end: 3, text: "Olá, bem-vindos ao nosso vídeo" },
        { start: 3, end: 6, text: "Hoje vamos falar sobre tecnologia" },
        { start: 6, end: 9, text: "E como ela pode transformar vidas" },
        { start: 9, end: 12, text: "Obrigado por assistir!" }
      ];
      
      setProgress(60);
      
      // Criar vídeo com legendas
      const processedVideo = await createVideoWithSubtitles(mockTranscription);
      
      setProgress(100);
      return processedVideo;
    } catch (error) {
      console.error('Erro na transcrição:', error);
      throw error;
    }
  };

  const processVideoWithTranslation = async (): Promise<string> => {
    setProgress(10);
    
    try {
      // Primeiro, fazer transcrição
      const transcriber = await pipeline(
        'automatic-speech-recognition',
        'Xenova/whisper-tiny'
      );
      
      setProgress(30);
      
      // Simular transcrição original em inglês
      const originalTranscription = [
        { start: 0, end: 3, text: "Hello, welcome to our video" },
        { start: 3, end: 6, text: "Today we will talk about technology" },
        { start: 6, end: 9, text: "And how it can transform lives" },
        { start: 9, end: 12, text: "Thank you for watching!" }
      ];
      
      setProgress(50);
      
      // Traduzir para português (simulado)
      const translatedTranscription = [
        { start: 0, end: 3, text: "Olá, bem-vindos ao nosso vídeo" },
        { start: 3, end: 6, text: "Hoje falaremos sobre tecnologia" },
        { start: 6, end: 9, text: "E como ela pode transformar vidas" },
        { start: 9, end: 12, text: "Obrigado por assistir!" }
      ];
      
      setProgress(80);
      
      // Criar vídeo com legendas traduzidas
      const processedVideo = await createVideoWithSubtitles(translatedTranscription, true);
      
      setProgress(100);
      return processedVideo;
    } catch (error) {
      console.error('Erro na tradução:', error);
      throw error;
    }
  };

  const processVideoWithDubbing = async (): Promise<string> => {
    setProgress(10);
    
    try {
      // Transcrever áudio original
      const transcriber = await pipeline(
        'automatic-speech-recognition',
        'Xenova/whisper-tiny'
      );
      
      setProgress(30);
      
      // Simular transcrição
      const transcription = "Olá, bem-vindos ao nosso vídeo. Hoje falaremos sobre tecnologia.";
      
      setProgress(50);
      
      // Gerar nova voz (simulado - usaria Web Speech API)
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(transcription);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.8;
      
      setProgress(70);
      
      // Criar vídeo com nova dublagem
      const processedVideo = await createVideoWithDubbing(utterance);
      
      setProgress(100);
      return processedVideo;
    } catch (error) {
      console.error('Erro na dublagem:', error);
      throw error;
    }
  };

  const createVideoWithSubtitles = async (subtitles: any[], isTranslated = false): Promise<string> => {
    const video = document.createElement('video');
    video.src = videoUrl;
    video.muted = true;
    
    await new Promise((resolve) => {
      video.onloadeddata = resolve;
      video.load();
    });
    
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d')!;
    
    const stream = canvas.captureStream(30);
    const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    const chunks: Blob[] = [];
    
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunks.push(event.data);
    };
    
    return new Promise((resolve) => {
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        resolve(url);
      };
      
      mediaRecorder.start();
      
      let currentTime = 0;
      const fps = 30;
      const duration = video.duration || 10;
      
      const renderFrame = () => {
        video.currentTime = currentTime;
        
        // Desenhar frame do vídeo
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Encontrar legenda atual
        const currentSubtitle = subtitles.find(sub => 
          currentTime >= sub.start && currentTime <= sub.end
        );
        
        if (currentSubtitle) {
          // Desenhar fundo da legenda
          ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
          ctx.fillRect(50, canvas.height - 100, canvas.width - 100, 60);
          
          // Desenhar texto da legenda
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 24px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(currentSubtitle.text, canvas.width / 2, canvas.height - 60);
        }
        
        // Indicador de tradução se necessário
        if (isTranslated) {
          ctx.fillStyle = 'rgba(0, 100, 200, 0.9)';
          ctx.fillRect(20, 20, 200, 40);
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 16px Arial';
          ctx.textAlign = 'left';
          ctx.fillText('🌐 TRADUZIDO', 30, 45);
        }
        
        currentTime += 1 / fps;
        
        if (currentTime < duration) {
          setTimeout(renderFrame, 1000 / fps);
        } else {
          mediaRecorder.stop();
        }
      };
      
      renderFrame();
    });
  };

  const createVideoWithDubbing = async (utterance: SpeechSynthesisUtterance): Promise<string> => {
    const video = document.createElement('video');
    video.src = videoUrl;
    video.muted = true;
    
    await new Promise((resolve) => {
      video.onloadeddata = resolve;
      video.load();
    });
    
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d')!;
    
    const stream = canvas.captureStream(30);
    const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    const chunks: Blob[] = [];
    
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunks.push(event.data);
    };
    
    return new Promise((resolve) => {
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        resolve(url);
      };
      
      mediaRecorder.start();
      
      // Simular dublagem
      window.speechSynthesis.speak(utterance);
      
      let currentTime = 0;
      const fps = 30;
      const duration = video.duration || 10;
      
      const renderFrame = () => {
        video.currentTime = currentTime;
        
        // Desenhar frame do vídeo
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Indicador de dublagem
        ctx.fillStyle = 'rgba(200, 0, 100, 0.9)';
        ctx.fillRect(20, 20, 200, 40);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('🎤 DUBLADO', 30, 45);
        
        // Indicador de áudio ativo
        const audioLevel = Math.sin(currentTime * 10) * 0.5 + 0.5;
        ctx.fillStyle = '#00ff88';
        ctx.fillRect(canvas.width - 80, 30, audioLevel * 50, 20);
        
        currentTime += 1 / fps;
        
        if (currentTime < duration) {
          setTimeout(renderFrame, 1000 / fps);
        } else {
          mediaRecorder.stop();
        }
      };
      
      renderFrame();
    });
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
