import { useState, useEffect, useRef } from 'react'
import { ChevronLeft, Plus, Music2, ExternalLink, Trash2, Play, Pause, SkipForward, SkipBack, Volume2, Youtube } from 'lucide-react'
import type { Challenge } from '../types'
import type { Screen } from '../App'
import { storageService } from '../services/storage'
import type { MusicLink, UserSettings } from '../types'

interface MusicProps {
  challenge: Challenge
  onNavigate: (screen: Screen) => void
}

export function Music({ onNavigate }: MusicProps) {
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [showAddLink, setShowAddLink] = useState(false)
  const [newLink, setNewLink] = useState({ name: '', url: '', type: 'spotify' as const })
  const [spotifyUrl, setSpotifyUrl] = useState('')
  const [currentTrack, setCurrentTrack] = useState<MusicLink | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(70)
  const [showYouTubePlayer, setShowYouTubePlayer] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    loadSettings()
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100
    }
  }, [volume])

  const loadSettings = async () => {
    const userSettings = await storageService.getSettings()
    setSettings(userSettings)
    setSpotifyUrl(userSettings.spotifyPlaylistUrl || '')
  }

  const handleAddLink = async () => {
    if (!settings || !newLink.name || !newLink.url) return

    const link: MusicLink = {
      id: `link-${Date.now()}`,
      name: newLink.name,
      url: newLink.url,
      type: detectLinkType(newLink.url),
    }

    const updatedSettings = {
      ...settings,
      musicLinks: [...(settings.musicLinks || []), link],
    }

    await storageService.saveSettings(updatedSettings)
    setSettings(updatedSettings)
    setNewLink({ name: '', url: '', type: 'spotify' })
    setShowAddLink(false)
  }

  const handleDeleteLink = async (id: string) => {
    if (!settings) return

    // Stop if currently playing this track
    if (currentTrack?.id === id) {
      handleStop()
    }

    const updatedSettings = {
      ...settings,
      musicLinks: (settings.musicLinks || []).filter(link => link.id !== id),
    }

    await storageService.saveSettings(updatedSettings)
    setSettings(updatedSettings)
  }

  const handleConnectSpotify = async () => {
    if (!settings || !spotifyUrl) return

    const updatedSettings = {
      ...settings,
      spotifyConnected: true,
      spotifyPlaylistUrl: spotifyUrl,
    }

    await storageService.saveSettings(updatedSettings)
    setSettings(updatedSettings)
  }

  const detectLinkType = (url: string): MusicLink['type'] => {
    if (url.includes('spotify.com')) return 'spotify'
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube'
    if (url.includes('soundcloud.com')) return 'soundcloud'
    return 'other'
  }

  const getYouTubeEmbedUrl = (url: string): string | null => {
    // Handle playlist URLs
    const playlistMatch = url.match(/[?&]list=([^&]+)/)
    if (playlistMatch) {
      return `https://www.youtube.com/embed/videoseries?list=${playlistMatch[1]}&autoplay=1`
    }

    // Handle video URLs
    let videoId = null
    if (url.includes('youtube.com/watch')) {
      const match = url.match(/[?&]v=([^&]+)/)
      videoId = match ? match[1] : null
    } else if (url.includes('youtu.be/')) {
      const match = url.match(/youtu\.be\/([^?]+)/)
      videoId = match ? match[1] : null
    }

    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`
    }

    return null
  }

  const getSpotifyEmbedUrl = (url: string): string | null => {
    // Convert Spotify URL to embed format
    // https://open.spotify.com/playlist/xxx -> https://open.spotify.com/embed/playlist/xxx
    const match = url.match(/spotify\.com\/(playlist|track|album)\/([^?]+)/)
    if (match) {
      return `https://open.spotify.com/embed/${match[1]}/${match[2]}`
    }
    return null
  }

  const getTypeIcon = (type: MusicLink['type']) => {
    switch (type) {
      case 'spotify':
        return '🎵'
      case 'youtube':
        return '▶️'
      case 'soundcloud':
        return '☁️'
      default:
        return '🎧'
    }
  }

  const handlePlayTrack = (link: MusicLink) => {
    // Check if it's a direct audio file
    if (link.url.match(/\.(mp3|wav|ogg|m4a)$/i)) {
      setShowYouTubePlayer(false)
      setCurrentTrack(link)
      if (audioRef.current) {
        audioRef.current.src = link.url
        audioRef.current.play()
        setIsPlaying(true)
      }
    } else if (link.type === 'youtube' || link.type === 'spotify') {
      // Play YouTube/Spotify in embedded player
      setCurrentTrack(link)
      setShowYouTubePlayer(true)
      setIsPlaying(false)
    } else {
      // For other types, open in new tab
      window.open(link.url, '_blank')
    }
  }

  const handlePlayPause = () => {
    if (!audioRef.current || !currentTrack) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    setIsPlaying(false)
    setShowYouTubePlayer(false)
  }

  const handleNext = () => {
    if (!settings?.musicLinks || !currentTrack) return

    const currentIndex = settings.musicLinks.findIndex(link => link.id === currentTrack.id)
    const nextIndex = (currentIndex + 1) % settings.musicLinks.length
    const nextTrack = settings.musicLinks[nextIndex]

    handlePlayTrack(nextTrack)
  }

  const handlePrevious = () => {
    if (!settings?.musicLinks || !currentTrack) return

    const currentIndex = settings.musicLinks.findIndex(link => link.id === currentTrack.id)
    const prevIndex = (currentIndex - 1 + settings.musicLinks.length) % settings.musicLinks.length
    const prevTrack = settings.musicLinks[prevIndex]

    handlePlayTrack(prevTrack)
  }

  const getEmbedUrl = (track: MusicLink): string | null => {
    if (track.type === 'youtube') {
      return getYouTubeEmbedUrl(track.url)
    } else if (track.type === 'spotify') {
      return getSpotifyEmbedUrl(track.url)
    }
    return null
  }

  return (
    <div className="min-h-screen pb-6">
      <audio
        ref={audioRef}
        onEnded={handleNext}
        onError={() => {
          setIsPlaying(false)
          alert('Error playing audio file. Make sure the URL is a direct link to an audio file.')
        }}
      />

      {/* Header */}
      <header className="sticky top-0 bg-background/95 backdrop-blur z-10 border-b border-border">
        <div className="max-w-7xl mx-auto flex items-center gap-3 p-4 lg:p-6">
          <button
            onClick={() => onNavigate('home')}
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl lg:text-2xl font-bold">Workout Music</h1>
            <p className="text-sm text-muted-foreground">Your gym bangers</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4 lg:p-8 space-y-6">
        {/* Now Playing */}
        {currentTrack && (
          <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-2xl p-6">
            <div className="text-sm text-muted-foreground mb-2">NOW PLAYING</div>
            <h3 className="text-2xl font-bold mb-6">{currentTrack.name}</h3>

            {/* YouTube/Spotify Embed */}
            {showYouTubePlayer && getEmbedUrl(currentTrack) && (
              <div className="mb-6 rounded-xl overflow-hidden">
                <iframe
                  width="100%"
                  height="315"
                  src={getEmbedUrl(currentTrack)!}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-xl"
                />
              </div>
            )}

            {/* Audio Player Controls (for MP3s) */}
            {!showYouTubePlayer && (
              <>
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={handlePrevious}
                    className="w-12 h-12 rounded-full bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-colors"
                  >
                    <SkipBack className="w-5 h-5" />
                  </button>

                  <button
                    onClick={handlePlayPause}
                    className="w-16 h-16 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center transition-colors shadow-lg"
                  >
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                  </button>

                  <button
                    onClick={handleNext}
                    className="w-12 h-12 rounded-full bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-colors"
                  >
                    <SkipForward className="w-5 h-5" />
                  </button>
                </div>

                <div className="mt-6 flex items-center gap-3">
                  <Volume2 className="w-5 h-5 text-muted-foreground" />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => setVolume(parseInt(e.target.value))}
                    className="flex-1 h-2 bg-secondary rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${volume}%, hsl(var(--secondary)) ${volume}%, hsl(var(--secondary)) 100%)`
                    }}
                  />
                  <span className="text-sm text-muted-foreground w-10">{volume}%</span>
                </div>
              </>
            )}

            {/* Navigation for embedded content */}
            {showYouTubePlayer && (
              <div className="flex items-center justify-center gap-4 mt-4">
                <button
                  onClick={handlePrevious}
                  className="px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80 flex items-center gap-2 transition-colors"
                >
                  <SkipBack className="w-4 h-4" />
                  Previous
                </button>

                <button
                  onClick={handleNext}
                  className="px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80 flex items-center gap-2 transition-colors"
                >
                  Next
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Spotify Connection */}
        <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
              <Music2 className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Spotify</h3>
              <p className="text-sm text-muted-foreground">
                {settings?.spotifyConnected ? 'Connected' : 'Not connected'}
              </p>
            </div>
          </div>

          {!settings?.spotifyConnected ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Paste your Spotify playlist URL to connect
              </p>
              <input
                type="url"
                placeholder="https://open.spotify.com/playlist/..."
                value={spotifyUrl}
                onChange={(e) => setSpotifyUrl(e.target.value)}
                className="w-full h-12 px-4 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={handleConnectSpotify}
                disabled={!spotifyUrl}
                className="w-full h-12 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Connect Spotify
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <a
                href={settings.spotifyPlaylistUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-background rounded-lg hover:bg-secondary transition-colors"
              >
                <span className="font-medium">Your Workout Playlist</span>
                <ExternalLink className="w-5 h-5 text-muted-foreground" />
              </a>
              <button
                onClick={() => {
                  if (settings) {
                    storageService.saveSettings({
                      ...settings,
                      spotifyConnected: false,
                      spotifyPlaylistUrl: undefined,
                    })
                    setSettings({ ...settings, spotifyConnected: false, spotifyPlaylistUrl: undefined })
                  }
                }}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Disconnect
              </button>
            </div>
          )}
        </div>

        {/* Music Links */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Your Music</h3>
              <p className="text-sm text-muted-foreground">
                Add direct MP3 links to play in-app, or YouTube/Spotify links
              </p>
            </div>
            <button
              onClick={() => setShowAddLink(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>

          {settings?.musicLinks && settings.musicLinks.length > 0 ? (
            <div className="space-y-3">
              {settings.musicLinks.map((link) => {
                const isAudioFile = link.url.match(/\.(mp3|wav|ogg|m4a)$/i)
                const isCurrentTrack = currentTrack?.id === link.id

                return (
                  <div
                    key={link.id}
                    className={`bg-card border rounded-xl p-4 flex items-center gap-4 transition-colors ${
                      isCurrentTrack ? 'border-primary' : 'border-border'
                    }`}
                  >
                    <div className="text-2xl">{getTypeIcon(link.type)}</div>
                    <div className="flex-1">
                      <div className="font-medium">{link.name}</div>
                      <div className="text-sm text-muted-foreground truncate">
                        {isAudioFile ? 'Direct audio file' : link.type}
                      </div>
                    </div>
                    <button
                      onClick={() => handlePlayTrack(link)}
                      className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-primary/10 text-primary transition-colors"
                    >
                      <Play className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteLink(link.id)}
                      className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="bg-card border border-border rounded-xl p-8 text-center">
              <Music2 className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">
                No music added yet
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Add direct MP3 links or streaming service URLs
              </p>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Youtube className="w-5 h-5 text-blue-400" />
            <strong className="text-foreground">YouTube & Spotify Playlists</strong>
          </div>
          <p className="text-sm text-muted-foreground">
            Paste YouTube playlist or video URLs to play them embedded in the app. 
            Spotify playlists also work! Direct MP3 links play with audio controls.
          </p>
          <div className="mt-3 text-sm text-muted-foreground">
            <div>✅ YouTube playlists: Full playlist embedded</div>
            <div>✅ YouTube videos: Single video embedded</div>
            <div>✅ Spotify playlists: Embedded player</div>
            <div>✅ MP3 files: Built-in audio player</div>
          </div>
        </div>
      </div>

      {/* Add Link Modal */}
      {showAddLink && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-end lg:items-center justify-center p-4"
          onClick={() => setShowAddLink(false)}
        >
          <div 
            className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold mb-6">Add Music</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Song/Track Name
                </label>
                <input
                  type="text"
                  placeholder="Eye of the Tiger"
                  value={newLink.name}
                  onChange={(e) => setNewLink({ ...newLink, name: e.target.value })}
                  className="w-full h-12 px-4 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  URL (MP3, YouTube, Spotify, etc.)
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/song.mp3"
                  value={newLink.url}
                  onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                  className="w-full h-12 px-4 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Direct audio files (.mp3, .wav) will play in-app. Other links open in new tab.
                </p>
              </div>

              <button
                onClick={handleAddLink}
                disabled={!newLink.name || !newLink.url}
                className="w-full h-12 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Track
              </button>

              <button
                onClick={() => setShowAddLink(false)}
                className="w-full h-10 text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
