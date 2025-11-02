'use client'

import { useState, useEffect } from 'react'

const asmrVideos = [
  { id: 'vxOewDbARxk', title: 'Soap Cutting' },
  { id: 'gz3Ou7yNpzU', title: 'Slime Sounds' },
  { id: 'vX7BzvvHxRE', title: 'Kinetic Sand' },
  { id: '9RcXqNzVvK0', title: 'Paint Mixing' },
  { id: 'u6BLnViUVgE', title: 'Oddly Satisfying' },
  { id: '92XVwY54h5k', title: 'Soap Carving' },
  { id: 'TqcLBDzQJLo', title: 'Satisfying Video' },
  { id: 'nCHwJkJxD-Q', title: 'Kinetic Sand Cutting' },
]

export default function Home() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [todayVideo, setTodayVideo] = useState<typeof asmrVideos[0] | null>(null)
  const [timeUntilNext, setTimeUntilNext] = useState('')
  const [notification, setNotification] = useState('')

  useEffect(() => {
    // Get today's video based on date
    const today = new Date()
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24)
    const videoIndex = dayOfYear % asmrVideos.length
    setTodayVideo(asmrVideos[videoIndex])

    // Check if user is subscribed
    const savedEmail = localStorage.getItem('subscribedEmail')
    if (savedEmail) {
      setEmail(savedEmail)
      setSubscribed(true)
    }

    // Setup notification check
    const checkTime = () => {
      const now = new Date()
      const target = new Date()
      target.setHours(13, 0, 0, 0) // 1pm

      if (now.getHours() === 13 && now.getMinutes() === 0) {
        if (Notification.permission === 'granted') {
          new Notification('🎬 Your Daily ASMR is Ready!', {
            body: 'Click to watch today\'s satisfying video',
            icon: '/icon.png'
          })
        }
      }

      // Calculate time until next video
      let diff = target.getTime() - now.getTime()
      if (diff < 0) {
        target.setDate(target.getDate() + 1)
        diff = target.getTime() - now.getTime()
      }

      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setTimeUntilNext(`${hours}h ${minutes}m ${seconds}s`)
    }

    checkTime()
    const interval = setInterval(checkTime, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleSubscribe = async () => {
    if (!email) {
      alert('Please enter your email')
      return
    }

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission()
      if (permission === 'granted') {
        setNotification('Notifications enabled!')
      }
    }

    localStorage.setItem('subscribedEmail', email)
    setSubscribed(true)

    // Show test notification
    if (Notification.permission === 'granted') {
      new Notification('✅ Subscribed!', {
        body: 'You\'ll get a notification every day at 1pm with your ASMR video'
      })
    }
  }

  const handleUnsubscribe = () => {
    localStorage.removeItem('subscribedEmail')
    setSubscribed(false)
    setEmail('')
  }

  return (
    <main style={{
      minHeight: '100vh',
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        maxWidth: '900px',
        width: '100%',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: '2rem',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
      }}>
        <h1 style={{
          fontSize: '3rem',
          textAlign: 'center',
          marginBottom: '1rem',
          fontWeight: 'bold'
        }}>
          🎬 Daily ASMR Agent
        </h1>

        <p style={{
          textAlign: 'center',
          fontSize: '1.2rem',
          marginBottom: '2rem',
          opacity: 0.9
        }}>
          Get a satisfying ASMR short video every day at 1pm
        </p>

        {!subscribed ? (
          <div style={{
            display: 'flex',
            gap: '1rem',
            marginBottom: '2rem',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                padding: '1rem',
                fontSize: '1rem',
                borderRadius: '10px',
                border: 'none',
                width: '100%',
                maxWidth: '400px',
                background: 'rgba(255, 255, 255, 0.9)',
                color: '#333'
              }}
            />
            <button
              onClick={handleSubscribe}
              style={{
                padding: '1rem 2rem',
                fontSize: '1.1rem',
                borderRadius: '10px',
                border: 'none',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                cursor: 'pointer',
                fontWeight: 'bold',
                boxShadow: '0 4px 15px 0 rgba(0, 0, 0, 0.2)'
              }}
            >
              🔔 Subscribe for Daily Videos
            </button>
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            marginBottom: '2rem'
          }}>
            <p style={{
              fontSize: '1.2rem',
              marginBottom: '1rem'
            }}>
              ✅ Subscribed as: <strong>{email}</strong>
            </p>
            <p style={{
              fontSize: '1rem',
              marginBottom: '1rem',
              opacity: 0.8
            }}>
              Next video in: <strong>{timeUntilNext}</strong>
            </p>
            <button
              onClick={handleUnsubscribe}
              style={{
                padding: '0.5rem 1rem',
                fontSize: '0.9rem',
                borderRadius: '8px',
                border: 'none',
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              Unsubscribe
            </button>
          </div>
        )}

        {todayVideo && (
          <div>
            <h2 style={{
              fontSize: '1.8rem',
              textAlign: 'center',
              marginBottom: '1rem'
            }}>
              🌟 Today's ASMR Video
            </h2>
            <div style={{
              position: 'relative',
              paddingBottom: '56.25%',
              height: 0,
              overflow: 'hidden',
              borderRadius: '15px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
            }}>
              <iframe
                src={`https://www.youtube.com/embed/${todayVideo.id}?autoplay=0&rel=0`}
                title={todayVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none'
                }}
              />
            </div>
          </div>
        )}

        {notification && (
          <p style={{
            textAlign: 'center',
            marginTop: '1rem',
            color: '#4ade80',
            fontWeight: 'bold'
          }}>
            {notification}
          </p>
        )}

        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '10px',
          textAlign: 'center',
          fontSize: '0.9rem'
        }}>
          <p>💡 <strong>How it works:</strong></p>
          <p style={{ marginTop: '0.5rem', opacity: 0.9 }}>
            • Subscribe to get browser notifications<br/>
            • Every day at 1pm you'll be notified<br/>
            • Visit this page to watch your daily ASMR video<br/>
            • A new video is selected for you each day
          </p>
        </div>
      </div>
    </main>
  )
}
