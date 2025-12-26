import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';

export const ClientHeroVideo: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(false);

  const videoRef = React.useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.play().catch(() => {
        // Fallback for autoplay restrictions
        setIsPlaying(false);
      });
    } else {
      video.pause();
    }

    video.muted = isMuted;
  }, [isPlaying, isMuted]);

  return (
    <div className="relative overflow-hidden rounded-[3rem] shadow-2xl min-h-[400px] md:min-h-[500px] group">
      {/* Background Video */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        loop
        muted
        playsInline
        poster="/atumwa-logo.jpeg" // Fallback image
      >
        <source src="https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4" type="video/mp4" />
        {/* Fallback: Static background if video fails */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-500 via-brand-600 to-purple-600"></div>
      </video>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-brand-600/20 to-black/40"></div>

      {/* Video Controls */}
      <div
        className={`absolute bottom-4 right-4 flex items-center gap-2 bg-black/50 backdrop-blur-md rounded-2xl p-2 transition-opacity ${showControls ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-8 h-8 flex items-center justify-center text-white hover:bg-white/20 rounded-lg transition-colors"
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="w-8 h-8 flex items-center justify-center text-white hover:bg-white/20 rounded-lg transition-colors"
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col justify-center h-full p-8 lg:p-16">
        <div className="max-w-2xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-white/80 text-sm font-medium">Live Platform • 2,547 Active Users</span>
          </div>

          <h1 className="text-4xl lg:text-6xl font-black text-white mb-6 leading-tight">
            Your delivery <span className="text-yellow-400">network</span> is waiting
          </h1>

          <p className="text-white/90 text-lg mb-8 leading-relaxed max-w-lg">
            Connect with trusted messengers across Harare. Get things done faster, safer, and smarter than ever before.
          </p>

          {/* Live Stats */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="text-2xl font-black text-white mb-1">98.5%</div>
              <div className="text-sm text-white/70">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-white mb-1">24/7</div>
              <div className="text-sm text-white/70">Support</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-white mb-1">$2.5M+</div>
              <div className="text-sm text-white/70">Delivered</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4">
            <button className="bg-white text-brand-600 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-xl">
              🚀 Post Your First Gig
            </button>
            <button className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/20 transition-all">
              📍 Track Deliveries
            </button>
          </div>
        </div>
      </div>

      {/* Floating Messenger Icons */}
      <div className="absolute top-8 left-8 flex -space-x-2">
        {[1,2,3,4].map(i => (
          <div key={i} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/30 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-blue-500 animate-pulse"></div>
          </div>
        ))}
      </div>

      {/* Bottom Stats Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-md p-4">
        <div className="flex items-center justify-between text-white/80 text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>1,247 messengers online</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span>342 active deliveries</span>
            </div>
          </div>
          <div className="text-white/60 text-xs">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
};
