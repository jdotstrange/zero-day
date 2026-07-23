import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { Icon, Icons } from '@/components/common'
import { useLocale } from '@/i18n'
import { chatUsers, currentUser } from '@/data/chat'

/**
 * Video Call Page Component
 * Video call interface with camera preview and controls
 */
export function VideoCallPage() {
  const navigate = useNavigate()
  const { t } = useLocale()
  const [searchParams] = useSearchParams()
  const userId = searchParams.get('user') || 'user-1'
  const containerRef = useRef<HTMLDivElement>(null)
  
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const [callStatus, setCallStatus] = useState<'connecting' | 'ringing' | 'connected'>('connecting')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [showSettings, setShowSettings] = useState(false)

  // Find the user being called
  const callee = chatUsers.find(u => u.id === userId) || chatUsers[0]

  // Simulate call connection
  useEffect(() => {
    const connectTimer = setTimeout(() => setCallStatus('ringing'), 1500)
    const ringTimer = setTimeout(() => setCallStatus('connected'), 4000)
    
    return () => {
      clearTimeout(connectTimer)
      clearTimeout(ringTimer)
    }
  }, [])

  // Call duration timer
  useEffect(() => {
    if (callStatus !== 'connected') return
    
    const interval = setInterval(() => {
      setCallDuration(prev => prev + 1)
    }, 1000)
    
    return () => clearInterval(interval)
  }, [callStatus])

  // Auto-hide controls
  useEffect(() => {
    if (callStatus !== 'connected') return
    
    const timer = setTimeout(() => setShowControls(false), 3000)
    return () => clearTimeout(timer)
  }, [showControls, callStatus])

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  // Close settings when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowSettings(false)
    if (showSettings) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [showSettings])

  // Format duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // End call
  const handleEndCall = () => {
    navigate('/app/chat')
  }

  // Toggle fullscreen
  const toggleFullscreen = async () => {
    if (!containerRef.current) return
    
    if (!document.fullscreenElement) {
      await containerRef.current.requestFullscreen()
    } else {
      await document.exitFullscreen()
    }
  }

  return (
    <div 
      ref={containerRef}
      className={`relative bg-surface-900 animate-fade-in overflow-hidden ${isFullscreen ? 'h-screen rounded-none' : 'h-[calc(100vh-7rem)] rounded-2xl'}`}
      onMouseMove={() => setShowControls(true)}
    >
      {/* Main Video (Remote User) */}
      <div className="absolute inset-0 bg-surface-900">
        {callStatus === 'connected' ? (
          <div className="w-full h-full flex items-center justify-center">
            {/* Simulated video with avatar as placeholder */}
            <img
              src={callee.avatar}
              alt={callee.name}
              className="w-48 h-48 rounded-full object-cover ring-4 ring-white/10"
            />
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="relative mb-6">
              {callStatus === 'ringing' && (
                <>
                  <div className="absolute inset-0 w-32 h-32 rounded-full bg-theme-primary/20 animate-ping" style={{ animationDuration: '2s' }} />
                  <div className="absolute inset-0 w-32 h-32 rounded-full bg-theme-primary/10 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.5s' }} />
                </>
              )}
              <img
                src={callee.avatar}
                alt={callee.name}
                className="relative w-32 h-32 rounded-full object-cover ring-4 ring-white/20"
              />
            </div>
            <h2 className="text-xl font-semibold text-white mb-1">{callee.name}</h2>
            <p className="text-sm text-secondary-400">
              {callStatus === 'connecting' ? t('apps.chat.connecting_status') : t('apps.chat.ringing_status')}
            </p>
          </div>
        )}
      </div>

      {/* Self Video (Picture-in-Picture) */}
      <div className="absolute bottom-24 right-4 w-40 h-28 bg-surface-800 rounded-xl overflow-hidden ring-2 ring-white/10 shadow-xl">
        {isVideoOn ? (
          <div className="flex h-full w-full items-center justify-center bg-theme-primary/10">
            <img
              src={currentUser.avatar}
              alt="You"
              className="w-16 h-16 rounded-full object-cover"
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-surface-800">
            <div className="text-center">
              <Icon icon={Icons.video} className="w-8 h-8 text-secondary-500 mx-auto mb-1" width={32} height={32} />
              <p className="text-xs text-secondary-500">{t('apps.chat.camera_off')}</p>
            </div>
          </div>
        )}
        
        {/* Mute indicator */}
        {isMuted && (
          <div className="absolute bottom-2 right-2 p-1 bg-danger-500 rounded-full">
            <Icon icon={Icons.microphone} className="w-3 h-3 text-white" width={12} height={12} />
          </div>
        )}
      </div>

      {/* Top Bar */}
      <div className={`absolute top-0 left-0 right-0 bg-black/50 p-4 flex items-center justify-between transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex items-center gap-3">
          <img
            src={callee.avatar}
            alt={callee.name}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-white/20"
          />
          <div>
            <h3 className="text-sm font-medium text-white">{callee.name}</h3>
            {callStatus === 'connected' ? (
              <p className="text-xs text-success-400">{formatDuration(callDuration)}</p>
            ) : (
              <p className="text-xs text-secondary-400">
                {callStatus === 'connecting' ? t('apps.chat.connecting_status') : t('apps.chat.ringing_status')}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Settings Button */}
          <div className="relative">
            <button 
              onClick={(e) => { e.stopPropagation(); setShowSettings(!showSettings) }}
              className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
            >
              <Icon icon={Icons.settings} className="w-5 h-5" width={20} height={20} />
            </button>
            {showSettings && (
              <div onClick={(e) => e.stopPropagation()} className="absolute right-0 top-full mt-2 w-64 bg-surface-800 rounded-xl shadow-lg border border-surface-700 py-2 z-50">
                <div className="px-4 py-2 border-b border-surface-700">
                  <h4 className="text-sm font-medium text-white">{t('apps.chat.call_settings')}</h4>
                </div>
                <div className="p-2 space-y-1">
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-secondary-300 hover:bg-surface-700 rounded-lg transition-colors text-start">
                    <Icon icon={Icons.camera} className="w-4 h-4" width={16} height={16} />
                    <span>{t('apps.chat.camera_default')}</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-secondary-300 hover:bg-surface-700 rounded-lg transition-colors text-start">
                    <Icon icon={Icons.microphone} className="w-4 h-4" width={16} height={16} />
                    <span>{t('apps.chat.microphone_default')}</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-secondary-300 hover:bg-surface-700 rounded-lg transition-colors text-start">
                    <Icon icon={Icons.volume} className="w-4 h-4" width={16} height={16} />
                    <span>{t('apps.chat.speaker_default')}</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-secondary-300 hover:bg-surface-700 rounded-lg transition-colors text-start">
                    <Icon icon={Icons.volume} className="w-4 h-4" width={16} height={16} />
                    <span>{t('apps.chat.test_audio')}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Fullscreen Button */}
          <button 
            onClick={toggleFullscreen}
            className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
            title={isFullscreen ? t('apps.chat.exit_fullscreen') : t('apps.chat.enter_fullscreen')}
          >
            {isFullscreen ? (
              <Icon icon={Icons.minimize} className="w-5 h-5" width={20} height={20} />
            ) : (
              <Icon icon={Icons.maximize} className="w-5 h-5" width={20} height={20} />
            )}
          </button>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className={`absolute bottom-0 left-0 right-0 bg-black/60 p-6 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex items-center justify-center gap-3">
          {/* Mute */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-4 rounded-full transition-all ${
              isMuted 
                ? 'bg-danger-500 text-white' 
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
            title={isMuted ? t('apps.chat.unmute') : t('apps.chat.mute_audio')}
          >
            {isMuted ? (
              <Icon icon={Icons.microphone} className="w-5 h-5" width={20} height={20} />
            ) : (
              <Icon icon={Icons.microphone} className="w-5 h-5" width={20} height={20} />
            )}
          </button>

          {/* Video Toggle */}
          <button
            onClick={() => setIsVideoOn(!isVideoOn)}
            className={`p-4 rounded-full transition-all ${
              !isVideoOn 
                ? 'bg-danger-500 text-white' 
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
            title={isVideoOn ? t('apps.chat.turn_off_camera') : t('apps.chat.turn_on_camera')}
          >
            {isVideoOn ? (
              <Icon icon={Icons.video} className="w-5 h-5" width={20} height={20} />
            ) : (
              <Icon icon={Icons.video} className="w-5 h-5" width={20} height={20} />
            )}
          </button>

          {/* Screen Share */}
          <button
            onClick={() => setIsScreenSharing(!isScreenSharing)}
            className={`p-4 rounded-full transition-all ${
              isScreenSharing 
                ? 'bg-theme-primary text-white' 
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
            title={isScreenSharing ? t('apps.chat.stop_sharing') : t('apps.chat.share_screen')}
          >
            {isScreenSharing ? (
              <Icon icon={Icons.screenShare} className="w-5 h-5" width={20} height={20} />
            ) : (
              <Icon icon={Icons.screenShare} className="w-5 h-5" width={20} height={20} />
            )}
          </button>

          {/* End Call */}
          <button
            onClick={handleEndCall}
            className="p-4 bg-danger-500 text-white rounded-full hover:bg-danger-600 transition-colors"
            title={t('apps.chat.end_call')}
          >
            <Icon icon={Icons.phoneOff} className="w-5 h-5" width={20} height={20} />
          </button>

          {/* Add Person */}
          <button 
            className="p-4 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors"
            title={t('apps.chat.add_person_button')}
          >
            <Icon icon={Icons.userPlus} className="w-5 h-5" width={20} height={20} />
          </button>

          {/* Chat */}
          <button 
            onClick={() => navigate('/app/chat')}
            className="p-4 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors"
            title={t('apps.chat.open_chat')}
          >
            <Icon icon={Icons.message} className="w-5 h-5" width={20} height={20} />
          </button>

          {/* More Options */}
          <button 
            className="p-4 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors"
            title={t('apps.chat.more_options')}
          >
            <Icon icon={Icons.dotsVertical} className="w-5 h-5" width={20} height={20} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default VideoCallPage
