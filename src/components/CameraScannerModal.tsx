import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Camera,
  X,
  RefreshCw,
  Zap,
  ZapOff,
  SwitchCamera,
  AlertCircle,
  Sparkles,
  Smartphone,
  Check,
  Timer,
  CheckCircle2,
} from 'lucide-react';

interface CameraScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (base64Data: string, mimeType: string) => void;
}

export const CameraScannerModal: React.FC<CameraScannerModalProps> = ({
  isOpen,
  onClose,
  onCapture,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fallbackInputRef = useRef<HTMLInputElement>(null);
  const motionCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const prevFrameDataRef = useRef<Uint8ClampedArray | null>(null);
  const steadyTimeRef = useRef<number>(0);
  const autoCaptureTriggeredRef = useRef<boolean>(false);
  const checkIntervalRef = useRef<number | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [isTorchOn, setIsTorchOn] = useState<boolean>(false);
  const [isTorchSupported, setIsTorchSupported] = useState<boolean>(false);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);

  // Auto-capture states
  const [isAutoCaptureEnabled, setIsAutoCaptureEnabled] = useState<boolean>(true);
  const [autoCaptureProgress, setAutoCaptureProgress] = useState<number>(0); // 0 to 100%
  const [isSteady, setIsSteady] = useState<boolean>(false);
  const [statusText, setStatusText] = useState<string>('Đang căn chỉnh nhãn...');
  const [flashEffect, setFlashEffect] = useState<boolean>(false);

  // Play subtle shutter sound
  const playShutterSound = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        const audioCtx = new AudioContextClass();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(900, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(350, audioCtx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.09);
      }
    } catch (e) {
      // Audio autoplay policy might restrict, safely ignore
    }
  };

  // Stop current active stream
  const stopStream = () => {
    if (checkIntervalRef.current) {
      window.clearInterval(checkIntervalRef.current);
      checkIntervalRef.current = null;
    }
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  // Start camera stream
  const startCamera = async (targetFacingMode: 'environment' | 'user') => {
    setIsInitializing(true);
    setCameraError(null);
    stopStream();
    autoCaptureTriggeredRef.current = false;
    steadyTimeRef.current = 0;
    setAutoCaptureProgress(0);
    setIsSteady(false);
    setStatusText('Đang kết nối máy ảnh...');

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('Trình duyệt của bạn không hỗ trợ truy cập camera trực tiếp. Vui lòng sử dụng tính năng chụp bằng máy ảnh hệ thống.');
      setIsInitializing(false);
      return;
    }

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: targetFacingMode },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      };

      let newStream: MediaStream;
      try {
        newStream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (err) {
        newStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      }

      setStream(newStream);

      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        await videoRef.current.play().catch((e) => console.warn('Video play error:', e));
      }

      // Check if torch/flash is supported on video track
      const videoTrack = newStream.getVideoTracks()[0];
      if (videoTrack) {
        const capabilities = (videoTrack.getCapabilities ? videoTrack.getCapabilities() : {}) as any;
        setIsTorchSupported(Boolean(capabilities?.torch));
      }

      setIsInitializing(false);
      setStatusText('Giữ yên điện thoại để tự động chụp nhãn...');
    } catch (err: any) {
      console.warn('Camera access error:', err);
      let errorMsg = 'Không thể truy cập camera. Vui lòng cho phép quyền truy cập camera trong cài đặt trình duyệt.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorMsg = 'Bạn chưa cấp quyền sử dụng camera. Bạn có thể bấm nút bên dưới để chụp qua ứng dụng máy ảnh của điện thoại.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        errorMsg = 'Không tìm thấy thiết bị camera trên thiết bị.';
      }
      setCameraError(errorMsg);
      setIsInitializing(false);
    }
  };

  // Capture frame from video to high-res optimized canvas
  const handleCaptureFrame = useCallback(() => {
    if (!videoRef.current || isCapturing || autoCaptureTriggeredRef.current) return;

    autoCaptureTriggeredRef.current = true;
    setIsCapturing(true);

    // Screen flash visual effect
    setFlashEffect(true);
    setTimeout(() => setFlashEffect(false), 250);

    // Audio & Haptic feedback
    playShutterSound();
    if (typeof navigator.vibrate === 'function') {
      try {
        navigator.vibrate([60, 40, 60]);
      } catch (e) {
        // ignore
      }
    }

    const video = videoRef.current;
    const width = video.videoWidth || 1280;
    const height = video.videoHeight || 720;

    // Downscale proportionally to max 1200px for speedy OCR transmission
    const maxDim = 1200;
    let targetWidth = width;
    let targetHeight = height;

    if (width > maxDim || height > maxDim) {
      if (width > height) {
        targetHeight = Math.round((height * maxDim) / width);
        targetWidth = maxDim;
      } else {
        targetWidth = Math.round((width * maxDim) / height);
        targetHeight = maxDim;
      }
    }

    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.drawImage(video, 0, 0, targetWidth, targetHeight);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.86);

      stopStream();
      setIsCapturing(false);
      onCapture(dataUrl, 'image/jpeg');
      onClose();
    } else {
      setIsCapturing(false);
      autoCaptureTriggeredRef.current = false;
    }
  }, [isCapturing, onCapture, onClose]);

  // Motion analysis loop to detect stability and auto-snap
  useEffect(() => {
    if (!isOpen || isInitializing || cameraError || !isAutoCaptureEnabled || isCapturing) {
      if (checkIntervalRef.current) {
        window.clearInterval(checkIntervalRef.current);
        checkIntervalRef.current = null;
      }
      return;
    }

    // Create downscaled canvas for lightweight motion estimation
    if (!motionCanvasRef.current) {
      motionCanvasRef.current = document.createElement('canvas');
      motionCanvasRef.current.width = 120;
      motionCanvasRef.current.height = 90;
    }

    const mCanvas = motionCanvasRef.current;
    const mCtx = mCanvas.getContext('2d', { willReadFrequently: true });

    // Every 120ms sample video and calculate frame difference
    checkIntervalRef.current = window.setInterval(() => {
      if (!videoRef.current || videoRef.current.readyState < 2 || autoCaptureTriggeredRef.current) {
        return;
      }

      if (!mCtx) return;

      const v = videoRef.current;
      mCtx.drawImage(v, 0, 0, 120, 90);
      const frame = mCtx.getImageData(0, 0, 120, 90);
      const data = frame.data;

      if (!prevFrameDataRef.current) {
        prevFrameDataRef.current = new Uint8ClampedArray(data);
        return;
      }

      const prev = prevFrameDataRef.current;
      let totalDiff = 0;
      let samples = 0;

      // Sample every 4th pixel in center 60% region (where label is positioned)
      const startX = 20;
      const endX = 100;
      const startY = 15;
      const endY = 75;

      for (let y = startY; y < endY; y += 2) {
        for (let x = startX; x < endX; x += 2) {
          const idx = (y * 120 + x) * 4;
          // Luminance difference
          const diff = Math.abs(data[idx] - prev[idx]) + Math.abs(data[idx + 1] - prev[idx + 1]);
          totalDiff += diff;
          samples++;
        }
      }

      // Save current frame for next comparison
      prev.set(data);

      const avgDiff = samples > 0 ? totalDiff / samples : 999;
      // Motion threshold: under 14 means the device is being held relatively steady
      const isDeviceSteady = avgDiff < 16;

      if (isDeviceSteady) {
        setIsSteady(true);
        // Increment steady timer (120ms per tick)
        steadyTimeRef.current += 120;

        // Target: 1200ms of holding steady = auto capture!
        const requiredSteadyTime = 1200;
        const progress = Math.min(100, Math.round((steadyTimeRef.current / requiredSteadyTime) * 100));
        setAutoCaptureProgress(progress);

        if (progress < 50) {
          setStatusText('Đã nhận diện nhãn... Giữ yên máy!');
        } else if (progress < 90) {
          setStatusText('Đang khóa nét... Đang tự động chụp!');
        } else {
          setStatusText('📸 Tự động chụp!');
        }

        if (steadyTimeRef.current >= requiredSteadyTime && !autoCaptureTriggeredRef.current) {
          // Auto fire shutter!
          handleCaptureFrame();
        }
      } else {
        // Camera is moving too quickly, gently decay progress to prevent blurry photos
        setIsSteady(false);
        steadyTimeRef.current = Math.max(0, steadyTimeRef.current - 160);
        const progress = Math.min(100, Math.round((steadyTimeRef.current / 1200) * 100));
        setAutoCaptureProgress(progress);
        setStatusText('Căn chỉnh nhãn vào khung & giữ yên máy');
      }
    }, 120);

    return () => {
      if (checkIntervalRef.current) {
        window.clearInterval(checkIntervalRef.current);
        checkIntervalRef.current = null;
      }
    };
  }, [isOpen, isInitializing, cameraError, isAutoCaptureEnabled, isCapturing, handleCaptureFrame]);

  useEffect(() => {
    if (isOpen) {
      startCamera(facingMode);
    } else {
      stopStream();
      setIsTorchOn(false);
      autoCaptureTriggeredRef.current = false;
      steadyTimeRef.current = 0;
      setAutoCaptureProgress(0);
    }

    return () => {
      stopStream();
    };
  }, [isOpen, facingMode]);

  if (!isOpen) return null;

  // Toggle torch/flashlight if supported
  const toggleTorch = async () => {
    if (!stream) return;
    const track = stream.getVideoTracks()[0];
    if (track) {
      try {
        const nextTorch = !isTorchOn;
        await (track as any).applyConstraints({
          advanced: [{ torch: nextTorch }],
        });
        setIsTorchOn(nextTorch);
      } catch (e) {
        console.warn('Torch toggle failed:', e);
      }
    }
  };

  // Flip between front and rear camera
  const switchCamera = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Handle native fallback file input with capture="environment"
  const handleFallbackCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const rawBase64 = reader.result as string;
        const img = new Image();
        img.onload = () => {
          const maxDim = 1200;
          let { width, height } = img;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const optimized = canvas.toDataURL('image/jpeg', 0.86);
            stopStream();
            onCapture(optimized, 'image/jpeg');
            onClose();
          } else {
            stopStream();
            onCapture(rawBase64, file.type || 'image/jpeg');
            onClose();
          }
        };
        img.onerror = () => {
          stopStream();
          onCapture(rawBase64, file.type || 'image/jpeg');
          onClose();
        };
        img.src = rawBase64;
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      {/* Hidden native camera capture input for seamless OS camera fallback */}
      <input
        ref={fallbackInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFallbackCapture}
        className="hidden"
        id="native-camera-fallback-input"
      />

      <div className="bg-slate-900 text-white rounded-2xl border border-slate-700 w-full max-w-xl max-h-[95vh] flex flex-col overflow-hidden shadow-2xl relative">
        {/* White Shutter Flash Animation */}
        {flashEffect && (
          <div className="absolute inset-0 bg-white z-50 animate-out fade-out duration-250 pointer-events-none" />
        )}

        {/* Top Control Bar */}
        <div className="px-4 py-3 bg-slate-900/90 backdrop-blur-xs border-b border-slate-800 flex items-center justify-between z-20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/30 text-indigo-400 border border-indigo-500/40 flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>Quét nhãn qua Camera</span>
                <span className="text-3xs px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase font-mono">
                  LIVE
                </span>
              </h3>
              <p className="text-2xs text-slate-400">
                {isAutoCaptureEnabled ? '⚡ Tự động chụp khi giữ yên máy' : 'Bấm nút tròn để chụp ảnh'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Auto-capture toggle pill */}
            <button
              type="button"
              onClick={() => setIsAutoCaptureEnabled(!isAutoCaptureEnabled)}
              className={`text-2xs px-2.5 py-1 rounded-full border font-semibold flex items-center gap-1 transition cursor-pointer ${
                isAutoCaptureEnabled
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
              title="Bật/Tắt tự động chụp khi phát hiện nhãn"
            >
              <Zap className={`w-3 h-3 ${isAutoCaptureEnabled ? 'fill-current text-emerald-400' : ''}`} />
              <span>{isAutoCaptureEnabled ? 'Tự chụp: BẬT' : 'Tự chụp: TẮT'}</span>
            </button>

            <button
              onClick={() => {
                stopStream();
                onClose();
              }}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
              title="Đóng camera"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Viewfinder Video Area */}
        <div className="relative flex-1 bg-black min-h-[320px] sm:min-h-[420px] flex items-center justify-center overflow-hidden">
          {/* Active Live Video */}
          <video
            ref={videoRef}
            playsInline
            autoPlay
            muted
            className="w-full h-full object-cover max-h-[65vh]"
          />

          {/* Loading state indicator */}
          {isInitializing && (
            <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center gap-3 p-4 z-10 text-center">
              <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
              <p className="text-xs sm:text-sm text-slate-300 font-medium">
                Đang khởi động camera điện thoại...
              </p>
              <p className="text-2xs text-slate-500">
                Hãy cho phép trình duyệt truy cập máy ảnh khi có thông báo
              </p>
            </div>
          )}

          {/* Camera Access Error Screen */}
          {cameraError && (
            <div className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center gap-3.5 p-6 z-10 text-center">
              <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/40">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="max-w-md">
                <h4 className="text-sm sm:text-base font-bold text-white mb-1">
                  Chưa thể mở khung quét trực tiếp
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {cameraError}
                </p>
              </div>

              {/* One-click native phone camera trigger */}
              <div className="flex flex-col sm:flex-row items-center gap-2.5 mt-2 w-full max-w-xs">
                <button
                  onClick={() => fallbackInputRef.current?.click()}
                  className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Chụp bằng máy ảnh điện thoại</span>
                </button>
                <button
                  onClick={() => startCamera(facingMode)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition cursor-pointer"
                >
                  Thử lại
                </button>
              </div>
            </div>
          )}

          {/* Viewfinder Target Framing Guidelines (Overlay) */}
          {!isInitializing && !cameraError && (
            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-6">
              {/* Guidance Box Frame */}
              <div
                className={`w-full max-w-[340px] aspect-[4/3] sm:aspect-[16/10] rounded-2xl relative shadow-[0_0_0_9999px_rgba(0,0,0,0.45)] transition-all duration-300 border-2 ${
                  isSteady && autoCaptureProgress > 30
                    ? 'border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.35)]'
                    : 'border-dashed border-cyan-400/80'
                }`}
              >
                {/* 4 Corner Markers */}
                <div
                  className={`absolute -top-1 -left-1 w-6 h-6 border-t-3 border-l-3 rounded-tl-lg transition-colors duration-200 ${
                    isSteady && autoCaptureProgress > 30 ? 'border-emerald-400' : 'border-cyan-400'
                  }`}
                />
                <div
                  className={`absolute -top-1 -right-1 w-6 h-6 border-t-3 border-r-3 rounded-tr-lg transition-colors duration-200 ${
                    isSteady && autoCaptureProgress > 30 ? 'border-emerald-400' : 'border-cyan-400'
                  }`}
                />
                <div
                  className={`absolute -bottom-1 -left-1 w-6 h-6 border-b-3 border-l-3 rounded-bl-lg transition-colors duration-200 ${
                    isSteady && autoCaptureProgress > 30 ? 'border-emerald-400' : 'border-cyan-400'
                  }`}
                />
                <div
                  className={`absolute -bottom-1 -right-1 w-6 h-6 border-b-3 border-r-3 rounded-br-lg transition-colors duration-200 ${
                    isSteady && autoCaptureProgress > 30 ? 'border-emerald-400' : 'border-cyan-400'
                  }`}
                />

                {/* Scanning sweep laser line */}
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-cyan-300 to-transparent shadow-[0_0_12px_#22d3ee] animate-pulse" />

                {/* Circular Auto-Capture Progress in Center */}
                {isAutoCaptureEnabled && autoCaptureProgress > 0 && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <div className="relative w-20 h-20 flex items-center justify-center bg-slate-950/60 rounded-full backdrop-blur-xs border border-emerald-400/30 shadow-lg">
                      <svg className="w-18 h-18 -rotate-90">
                        <circle
                          cx="36"
                          cy="36"
                          r="30"
                          className="stroke-slate-700"
                          strokeWidth="5"
                          fill="transparent"
                        />
                        <circle
                          cx="36"
                          cy="36"
                          r="30"
                          className="stroke-emerald-400 transition-all duration-100 ease-out"
                          strokeWidth="5"
                          strokeDasharray={188.4}
                          strokeDashoffset={188.4 - (188.4 * autoCaptureProgress) / 100}
                          strokeLinecap="round"
                          fill="transparent"
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center justify-center">
                        <span className="text-xs font-mono font-bold text-white">
                          {autoCaptureProgress}%
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Status Badge */}
                <div className="absolute -bottom-10 inset-x-0 flex justify-center">
                  <div
                    className={`px-3 py-1.5 rounded-full backdrop-blur-md text-2xs font-semibold flex items-center gap-1.5 shadow-md border transition-all duration-200 ${
                      isSteady && autoCaptureProgress > 30
                        ? 'bg-emerald-950/90 text-emerald-200 border-emerald-400/60'
                        : 'bg-slate-900/85 text-cyan-200 border-cyan-400/40'
                    }`}
                  >
                    {isSteady && autoCaptureProgress > 30 ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    )}
                    <span>{statusText}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Floating Controls (Torch & Camera Switch) */}
          {!isInitializing && !cameraError && (
            <div className="absolute top-3 right-3 flex items-center gap-2 z-20">
              {isTorchSupported && (
                <button
                  onClick={toggleTorch}
                  className={`p-2.5 rounded-full backdrop-blur-md transition shadow-md cursor-pointer ${
                    isTorchOn
                      ? 'bg-amber-400 text-slate-950 font-bold'
                      : 'bg-slate-800/80 text-white hover:bg-slate-700/90'
                  }`}
                  title={isTorchOn ? 'Tắt đèn Flash' : 'Bật đèn Flash'}
                >
                  {isTorchOn ? <Zap className="w-4 h-4 fill-current" /> : <ZapOff className="w-4 h-4" />}
                </button>
              )}

              <button
                onClick={switchCamera}
                className="p-2.5 rounded-full bg-slate-800/80 hover:bg-slate-700/90 text-white backdrop-blur-md transition shadow-md cursor-pointer"
                title="Đổi camera trước/sau"
              >
                <SwitchCamera className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Bottom Shutter & Action Bar */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-col items-center justify-center gap-3">
          <div className="flex items-center justify-between w-full max-w-sm px-2">
            {/* Quick button to open native camera */}
            <button
              type="button"
              onClick={() => fallbackInputRef.current?.click()}
              className="text-2xs text-slate-400 hover:text-slate-200 flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-slate-800 transition cursor-pointer"
              title="Mở ứng dụng chụp ảnh của điện thoại"
            >
              <Smartphone className="w-4 h-4 text-slate-400" />
              <span>Máy ảnh gốc</span>
            </button>

            {/* Big Center Shutter Button */}
            <button
              type="button"
              disabled={isInitializing || Boolean(cameraError) || isCapturing}
              onClick={handleCaptureFrame}
              className={`relative w-16 h-16 sm:w-18 sm:h-18 rounded-full p-1 flex items-center justify-center shadow-lg active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer group ${
                isSteady && autoCaptureProgress > 30
                  ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 shadow-emerald-500/30 ring-4 ring-emerald-400/40'
                  : 'bg-gradient-to-tr from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 shadow-cyan-500/25'
              }`}
              title="Chụp ngay hoặc giữ yên để máy tự chụp"
            >
              <div className="w-full h-full rounded-full border-2 border-white/80 flex items-center justify-center bg-white/20 group-hover:bg-white/30 transition">
                {isCapturing ? (
                  <RefreshCw className="w-6 h-6 animate-spin text-white" />
                ) : isAutoCaptureEnabled && isSteady ? (
                  <div className="flex flex-col items-center">
                    <Check className="w-6 h-6 text-white animate-pulse" />
                  </div>
                ) : (
                  <Camera className="w-7 h-7 text-white" />
                )}
              </div>
            </button>

            {/* Cancel Button */}
            <button
              type="button"
              onClick={() => {
                stopStream();
                onClose();
              }}
              className="text-2xs text-slate-400 hover:text-slate-200 flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-4 h-4 text-slate-400" />
              <span>Hủy</span>
            </button>
          </div>

          <p className="text-3xs text-slate-400 text-center flex items-center justify-center gap-1.5">
            {isAutoCaptureEnabled ? (
              <>
                <Zap className="w-3 h-3 text-emerald-400 fill-current inline" />
                <span>Chỉ cần đưa camera vào nhãn và giữ yên 1 giây, máy sẽ <strong>tự động chụp ngay</strong></span>
              </>
            ) : (
              <span>Bấm nút tròn ở giữa để chụp • AI sẽ tự động phân tích 5 góc ngay sau khi chụp</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
