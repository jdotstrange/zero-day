import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { Icon, Icons } from '@/components/common'
import { useLocale } from '@/i18n'
import { chatUsers, currentUser } from '@/data/chat'

// Pre-generate random heights for sound wave bars (stable across renders)
const WAVE_BAR_HEIGHTS = [24, 16, 32, 20, 28]

/**
 * Voice Call Page Component
 * Audio call interface with controls
 */
export function VoiceCallPage() {
  const navigate = useNavigate()
  const { t } = useLocale()
  const [searchParams] = useSearchParams()
  const userId = searchParams.get('user') || 'user-1'
  
  const [isMuted, setIsMuted] = useState(false)
  const [isSpeakerOn, setIsSpeakerOn] = useState(true)
  const [callDuration, setCallDuration] = useState(0)
  const [callStatus, setCallStatus] = useState<'connecting' | 'ringing' | 'connected'>('connecting')

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

  return (
    <div className="flex h-[calc(100vh-7rem)] animate-fade-in items-center justify-center overflow-hidden rounded-2xl bg-surface-900">
      <div className="text-center">
        {/* Caller Avatar */}
        <div className="relative mx-auto mb-6">
          {/* Animated rings for ringing state */}
          {callStatus === 'ringing' && (
            <>
              <div className="absolute inset-0 w-32 h-32 mx-auto rounded-full bg-theme-primary/20 animate-ping" style={{ animationDuration: '2s' }} />
              <div className="absolute inset-0 w-32 h-32 mx-auto rounded-full bg-theme-primary/10 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.5s' }} />
            </>
          )}
          
          {/* Connected indicator */}
          {callStatus === 'connected' && (
            <div className="absolute -inset-2 rounded-full bg-success-500/20 animate-pulse" />
          )}
          
          <img
            src={callee.avatar}
            alt={callee.name}
            className="relative w-32 h-32 rounded-full object-cover ring-4 ring-white/20 mx-auto"
          />
        </div>

        {/* Caller Info */}
  <h2 className="heading-3 text-white mb-1">{callee.name}</h2>
        <p className="text-sm text-secondary-400 mb-2">{callee.role}</p>
        
        {/* Call Status */}
        <div className="mb-8">
          {callStatus === 'connecting' && (
            <p className="text-secondary-400 text-sm">{t('apps.chat.connecting_status')}</p>
          )}
          {callStatus === 'ringing' && (
            <p className="text-secondary-400 text-sm">{t('apps.chat.ringing_status')}</p>
          )}
          {callStatus === 'connected' && (
            <p className="text-success-400 text-sm font-medium">{formatDuration(callDuration)}</p>
          )}
        </div>

        {/* Sound Wave Animation (when connected) */}
        {callStatus === 'connected' && !isMuted && (
          <div className="flex items-center justify-center gap-1 mb-8 h-8">
            {WAVE_BAR_HEIGHTS.map((height, i) => (
              <div
                key={i}
                className="w-1 bg-theme-primary rounded-full animate-pulse"
                style={{
                  height: `${height}px`,
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: '0.5s'
                }}
              />
            ))}
          </div>
        )}

        {/* Call Controls */}
        <div className="flex items-center justify-center gap-4">
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
              <Icon icon={Icons.microphone} className="w-6 h-6" width={24} height={24} />
            ) : (
              <Icon icon={Icons.microphone} className="w-6 h-6" width={24} height={24} />
            )}
          </button>

          {/* Speaker */}
          <button
            onClick={() => setIsSpeakerOn(!isSpeakerOn)}
            className={`p-4 rounded-full transition-all ${
              !isSpeakerOn 
                ? 'bg-danger-500 text-white' 
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            {isSpeakerOn ? (
              <Icon icon={Icons.volume} className="w-6 h-6" width={24} height={24} />
            ) : (
              <Icon icon={Icons.volume} className="w-6 h-6" width={24} height={24} />
            )}
          </button>

          {/* End Call */}
          <button
            onClick={handleEndCall}
            className="p-4 bg-danger-500 text-white rounded-full hover:bg-danger-600 transition-colors"
            title={t('apps.chat.end_call')}
          >
            <Icon icon={Icons.phoneOff} className="w-6 h-6" width={24} height={24} />
          </button>

          {/* Add Person */}
          <button 
            className="p-4 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors"
            title={t('apps.chat.add_person_button')}
          >
            <Icon icon={Icons.userPlus} className="w-6 h-6" width={24} height={24} />
          </button>

          {/* Message */}
          <button 
            onClick={() => navigate('/app/chat')}
            className="p-4 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors"
            title={t('apps.chat.open_chat')}
          >
            <Icon icon={Icons.message} className="w-6 h-6" width={24} height={24} />
          </button>
        </div>

        {/* Current User Info */}
        <div className="mt-12 flex items-center justify-center gap-3">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-white/20"
          />
          <div className="text-start">
            <p className="text-sm text-white font-medium">{currentUser.name}</p>
            <p className="text-xs text-secondary-400">
              {isMuted ? t('apps.chat.muted') : t('apps.chat.speaking')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VoiceCallPage
