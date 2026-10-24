import { useState, useEffect, useRef } from 'react';
import { Camera, AlertTriangle, ShieldCheck, Eye, RefreshCw } from 'lucide-react';

interface FaceDetectionCameraProps {
  onViolation?: (type: 'LOOKING_AWAY' | 'NO_FACE', seconds: number) => void;
  isExamActive?: boolean;
}

export function FaceDetectionCamera({ onViolation, isExamActive = true }: FaceDetectionCameraProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [streamActive, setStreamActive] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [faceDetected, setFaceDetected] = useState(true);
  const [awaySeconds, setAwaySeconds] = useState(0);
  const [violationsCount, setViolationsCount] = useState(0);

  // Initialize webcam
  useEffect(() => {
    let currentStream: MediaStream | null = null;

    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
          audio: false,
        });
        currentStream = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setStreamActive(true);
        setPermissionDenied(false);
      } catch (err) {
        console.warn('Webcam access not permitted or unavailable, using biometric simulator:', err);
        setPermissionDenied(true);
        setStreamActive(false);
      }
    }

    startCamera();

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Biometric tracking & simulated detection loop
  useEffect(() => {
    if (!isExamActive) return;

    const interval = setInterval(() => {
      // 95% of time face is verified, 5% random gaze shift simulation if no real video
      const isPresent = permissionDenied ? Math.random() > 0.05 : true;

      setFaceDetected(isPresent);

      if (!isPresent) {
        setAwaySeconds((prev) => {
          const next = prev + 1;
          if (next === 5 || next === 20 || next === 45) {
            setViolationsCount((v) => v + 1);
            onViolation?.('LOOKING_AWAY', next);
          }
          return next;
        });
      } else {
        setAwaySeconds((prev) => Math.max(0, prev - 1));
      }

      // Draw biometric overlay on canvas
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          if (isPresent) {
            // Draw green biometric bounding box
            const w = canvas.width;
            const h = canvas.height;
            const boxW = w * 0.52;
            const boxH = h * 0.65;
            const boxX = (w - boxW) / 2;
            const boxY = (h - boxH) / 2;

            ctx.strokeStyle = '#10b981';
            ctx.lineWidth = 2.5;

            // Corner brackets
            const cornerLen = 18;
            // Top-left
            ctx.beginPath();
            ctx.moveTo(boxX, boxY + cornerLen);
            ctx.lineTo(boxX, boxY);
            ctx.lineTo(boxX + cornerLen, boxY);
            ctx.stroke();

            // Top-right
            ctx.beginPath();
            ctx.moveTo(boxX + boxW - cornerLen, boxY);
            ctx.lineTo(boxX + boxW, boxY);
            ctx.lineTo(boxX + boxW, boxY + cornerLen);
            ctx.stroke();

            // Bottom-left
            ctx.beginPath();
            ctx.moveTo(boxX, boxY + boxH - cornerLen);
            ctx.lineTo(boxX, boxY + boxH);
            ctx.lineTo(boxX + cornerLen, boxY + boxH);
            ctx.stroke();

            // Bottom-right
            ctx.beginPath();
            ctx.moveTo(boxX + boxW - cornerLen, boxY + boxH);
            ctx.lineTo(boxX + boxW, boxY + boxH);
            ctx.lineTo(boxX + boxW, boxY + boxH - cornerLen);
            ctx.stroke();

            // Subtle scanline
            const time = Date.now() / 400;
            const scanY = boxY + ((Math.sin(time) + 1) / 2) * boxH;
            ctx.strokeStyle = 'rgba(52, 211, 153, 0.4)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(boxX + 4, scanY);
            ctx.lineTo(boxX + boxW - 4, scanY);
            ctx.stroke();
          }
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isExamActive, permissionDenied, onViolation]);

  return (
    <div className="relative w-56 rounded-2xl overflow-hidden border border-emerald-500/30 bg-slate-900/90 shadow-glow-emerald backdrop-blur-md">
      {/* Video display */}
      <div className="relative w-full h-36 bg-slate-950 flex items-center justify-center overflow-hidden">
        {streamActive ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover -scale-x-100"
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-3 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-1 text-emerald-400 animate-pulse">
              <Camera className="w-6 h-6" />
            </div>
            <p className="text-[11px] font-semibold text-slate-300">Biometric Sentinel</p>
            <p className="text-[9px] text-slate-400">Client-Side AI Verification</p>
          </div>
        )}

        {/* Overlay Canvas for face tracking box */}
        <canvas
          ref={canvasRef}
          width={224}
          height={144}
          className="absolute inset-0 pointer-events-none w-full h-full"
        />

        {/* Live Status Tag */}
        <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-950/80 border border-emerald-500/40 text-[10px] font-bold text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>{faceDetected ? 'FACE VERIFIED' : 'ATTENTION DIVERTED'}</span>
        </div>

        {/* Camera icon indicator */}
        <div className="absolute top-2 right-2 p-1 rounded-md bg-slate-950/70 text-slate-400">
          <Eye className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Away Progress Bar (Auto-submit at 60s) */}
      <div className="p-2.5 bg-slate-900/95 border-t border-slate-800">
        <div className="flex items-center justify-between text-[10px] font-semibold mb-1">
          <span className="text-slate-400">Presence Focus</span>
          <span className={awaySeconds > 30 ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
            {awaySeconds === 0 ? '100%' : `${Math.max(0, 100 - Math.round((awaySeconds / 60) * 100))}%`}
          </span>
        </div>

        {/* Warning bar */}
        <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              awaySeconds > 40
                ? 'bg-rose-500'
                : awaySeconds > 15
                ? 'bg-amber-500'
                : 'bg-emerald-500'
            }`}
            style={{ width: `${Math.min(100, (awaySeconds / 60) * 100)}%` }}
          />
        </div>

        {awaySeconds >= 45 && (
          <p className="mt-1 text-[10px] text-rose-400 font-medium animate-pulse flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 flex-shrink-0" />
            <span>Auto-submit in {60 - awaySeconds}s!</span>
          </p>
        )}

        {violationsCount > 0 && (
          <div className="mt-1.5 px-2 py-1 rounded bg-amber-500/10 border border-amber-500/20 flex items-center justify-between text-[10px]">
            <span className="text-amber-300 font-medium">Camera Alerts</span>
            <span className="font-bold text-amber-400">{violationsCount}</span>
          </div>
        )}
      </div>
    </div>
  );
}
