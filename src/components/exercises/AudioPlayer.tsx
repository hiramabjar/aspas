'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Play, Pause, RotateCcw, Volume2, Volume1, VolumeX, FastForward } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Tooltip } from '@/components/ui/tooltip'

interface AudioPlayerProps {
  audioUrl: string
  onPlaybackRateChange?: (rate: number) => void
  onVolumeChange?: (volume: number) => void
  className?: string
}

export function AudioPlayer({ 
  audioUrl, 
  onPlaybackRateChange,
  onVolumeChange,
  className = ''
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(1)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [isLoaded, setIsLoaded] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load()
    }
  }, [audioUrl])

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const restart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      setProgress(0)
      setCurrentTime(0)
      if (isPlaying) {
        audioRef.current.play()
      }
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const value = (audioRef.current.currentTime / audioRef.current.duration) * 100
      setProgress(value)
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleSliderChange = (value: number[]) => {
    if (audioRef.current && !isNaN(audioRef.current.duration)) {
      const time = (value[0] / 100) * audioRef.current.duration
      if (isFinite(time)) {
        audioRef.current.currentTime = time
        setProgress(value[0])
        setCurrentTime(time)
      }
    }
  }

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    if (audioRef.current) {
      audioRef.current.volume = newVolume
      setVolume(newVolume)
      if (onVolumeChange) {
        onVolumeChange(newVolume)
      }
    }
  }

  const handlePlaybackRateChange = (value: number[]) => {
    const newRate = value[0]
    if (audioRef.current) {
      audioRef.current.playbackRate = newRate
      setPlaybackRate(newRate)
      if (onPlaybackRateChange) {
        onPlaybackRateChange(newRate)
      }
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
    setIsLoaded(true)
  }

  const getVolumeIcon = () => {
    if (volume === 0) return <VolumeX className="h-4 w-4" />
    if (volume < 0.5) return <Volume1 className="h-4 w-4" />
    return <Volume2 className="h-4 w-4" />
  }

  return (
    <Card className={`p-4 ${className}`}>
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />
      
      <div className="space-y-4">
        {/* Controles principais */}
        <div className="flex items-center gap-4">
          <Tooltip content={isPlaying ? 'Pausar' : 'Reproduzir'}>
            <Button
              variant="outline"
              size="icon"
              onClick={togglePlay}
              disabled={!isLoaded}
              className="w-10 h-10"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
          </Tooltip>
          
          <Tooltip content="Reiniciar">
            <Button
              variant="outline"
              size="icon"
              onClick={restart}
              disabled={!isLoaded}
              className="w-10 h-10"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </Tooltip>
          
          <div className="flex-1 flex items-center gap-2">
            <span className="text-sm text-gray-500 w-12">
              {formatTime(currentTime)}
            </span>
            <Slider
              value={[progress]}
              onValueChange={handleSliderChange}
              max={100}
              step={1}
              disabled={!isLoaded}
              className="flex-1"
            />
            <span className="text-sm text-gray-500 w-12">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Controles de volume e velocidade */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 flex-1">
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8"
              onClick={() => handleVolumeChange([volume === 0 ? 1 : 0])}
            >
              {getVolumeIcon()}
            </Button>
            <Slider
              value={[volume]}
              onValueChange={handleVolumeChange}
              max={1}
              step={0.1}
              className="w-24"
            />
          </div>

          <div className="flex items-center gap-2">
            <FastForward className="h-4 w-4 text-gray-500" />
            <Slider
              value={[playbackRate]}
              onValueChange={handlePlaybackRateChange}
              min={0.5}
              max={2}
              step={0.25}
              className="w-24"
            />
            <span className="text-sm text-gray-500 w-12">
              {playbackRate}x
            </span>
          </div>
        </div>
      </div>
    </Card>
  )
} 