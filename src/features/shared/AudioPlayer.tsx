import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'

interface AudioPlayerProps {
  url: string
}

export function AudioPlayer({ url }: AudioPlayerProps) {
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const togglePlay = () => {
    if (playing) {
      audioRef.current?.pause()
    } else {
      audioRef.current?.play()
    }
    setPlaying(!playing)
  }

  return (
    <div className="flex items-center gap-4">
      <audio ref={audioRef} src={url} onEnded={() => setPlaying(false)} />
      <Button onClick={togglePlay}>
        {playing ? 'Pausar' : 'Ouvir'}
      </Button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.1"
        onChange={(e) => {
          if (audioRef.current) {
            audioRef.current.volume = parseFloat(e.target.value)
          }
        }}
        className="w-24"
      />
    </div>
  )
} 