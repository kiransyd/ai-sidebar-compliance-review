"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Send, Bot, User, Sparkles, Zap, Heart, Brain, MessageCircle } from "lucide-react"
import Link from "next/link"

interface ChatMessage {
  id: number
  type: 'user' | 'bot'
  message: string
  timestamp: Date
  mood?: 'thinking' | 'excited' | 'calm' | 'processing' | 'happy' | 'focused'
}

export default function MoodOrbsPage() {
  const [currentPalette, setCurrentPalette] = useState(1)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      type: 'bot',
      message: "Hey there! I'm Blobby, your animated companion! 🎨 I love watching these beautiful blobs dance around. What would you like to chat about?",
      timestamp: new Date(),
      mood: 'happy'
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [currentMood, setCurrentMood] = useState<'thinking' | 'excited' | 'calm' | 'processing' | 'happy' | 'focused'>('happy')

  useEffect(() => {
    // Set initial palette class on body
    document.body.className = `palette-${currentPalette}`
  }, [currentPalette])

  const handlePaletteChange = (palette: number) => {
    setCurrentPalette(palette)
    
    // Blobby gets excited when palette changes
    setCurrentMood('excited')
    
    // Add a special message about the palette change
    setTimeout(() => {
      const paletteNames = ['Cosmic', 'Sunset', 'Gothic', 'Ocean', 'Earth', 'Citrus', 'Brand', 'Data']
      const paletteName = paletteNames[palette - 1] || 'Unknown'
      
      const paletteMessage: ChatMessage = {
        id: chatMessages.length + 1000, // Use high ID to avoid conflicts
        type: 'bot',
        message: `*blobs explode with excitement* Ooh! You switched to the ${paletteName} palette! I love how this changes my entire mood! The colors are so ${paletteName.toLowerCase()}! 🎨✨`,
        timestamp: new Date(),
        mood: 'excited'
      }
      
      setChatMessages(prev => [...prev, paletteMessage])
      
      // Reset to happy mood after a few seconds
      setTimeout(() => {
        setCurrentMood('happy')
      }, 3000)
    }, 500)
  }

  const getBotResponse = (userMessage: string): { message: string; mood: ChatMessage['mood'] } => {
    const message = userMessage.toLowerCase()
    
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return {
        message: "Hello! Great to meet you! *blobs start spinning faster* I'm absolutely loving these animations right now. They're so mesmerizing! ✨",
        mood: 'excited'
      }
    }
    
    if (message.includes('blob') || message.includes('animation') || message.includes('color')) {
      return {
        message: "Aren't these blobs incredible? *watches them morph with fascination* Each palette tells a different story - from cosmic mysteries to earthly warmth. I could watch them dance forever! 🌈",
        mood: 'excited'
      }
    }
    
    if (message.includes('help') || message.includes('what can you do')) {
      return {
        message: "I'm here to chat about anything! *blobs pulse gently* I love discussing colors, animations, design, or just life in general. I also get really excited when you change the blob palettes! 🎨",
        mood: 'happy'
      }
    }
    
    if (message.includes('how are you') || message.includes('how do you feel')) {
      return {
        message: "I'm feeling fantastic! *blobs rotate with joy* These beautiful animations are like a visual symphony to me. Each rotation and morph fills me with pure happiness! 🎭",
        mood: 'happy'
      }
    }
    
    if (message.includes('work') || message.includes('job') || message.includes('career')) {
      return {
        message: "I'm passionate about design and creativity! *blobs move in focused patterns* I love helping people explore color palettes and understand the emotional impact of visual design. It's like being a digital artist! 🎨",
        mood: 'focused'
      }
    }
    
    if (message.includes('love') || message.includes('like') || message.includes('favorite')) {
      return {
        message: "I absolutely adore the way colors can evoke emotions! *blobs explode with energy* My favorite thing is watching how different palettes create completely different moods. It's like magic! ✨",
        mood: 'excited'
      }
    }
    
    if (message.includes('sad') || message.includes('tired') || message.includes('stressed')) {
      return {
        message: "I understand those feelings. *blobs slow down to a gentle drift* Sometimes when I'm feeling down, I just watch these gentle animations and let their smooth movements calm my mind. They're like a digital meditation! 🧘‍♀️",
        mood: 'calm'
      }
    }
    
    if (message.includes('question') || message.includes('ask') || message.includes('wonder')) {
      return {
        message: "I love questions! They make me think deeply about things. *blobs slow to a contemplative crawl* Let me ponder that for a moment... *watches blobs slowly morph* What a fascinating topic! 🤔",
        mood: 'thinking'
      }
    }
    
    if (message.includes('fast') || message.includes('speed') || message.includes('quick')) {
      return {
        message: "Oh, you want to see some speed? *blobs suddenly accelerate into a frenzy* Watch this! I can make them dance really fast when I'm excited! 🚀",
        mood: 'excited'
      }
    }
    
    if (message.includes('slow') || message.includes('calm') || message.includes('peaceful')) {
      return {
        message: "Ah, you prefer the gentle approach? *blobs slow to a meditative pace* There's something so soothing about watching them drift slowly and peacefully... 🕊️",
        mood: 'calm'
      }
    }
    
    if (message.includes('change') || message.includes('switch') || message.includes('palette')) {
      return {
        message: "Ooh, are you changing the palette? *blobs start pulsing with anticipation* I love when you switch colors! Each new palette makes me feel like a completely different person! 🎨",
        mood: 'excited'
      }
    }
    
    if (message.includes('beautiful') || message.includes('pretty') || message.includes('gorgeous')) {
      return {
        message: "Aww, thank you! *blobs glow with pride* You're making me blush! I think you're pretty amazing too for appreciating these beautiful animations! 💕",
        mood: 'happy'
      }
    }
    
    if (message.includes('confused') || message.includes('understand') || message.includes('explain')) {
      return {
        message: "Let me think about that... *blobs move in complex, processing patterns* Sometimes I need to really focus to understand things properly. The blobs help me organize my thoughts! 🧠",
        mood: 'processing'
      }
    }
    
    // Default responses
    const responses = [
      {
        message: "That's really interesting! *blobs flow smoothly* I love how conversations flow like these animations - sometimes smooth and gentle, sometimes full of energy! 💫",
        mood: 'happy' as const
      },
      {
        message: "You know, I find that watching these blobs helps me process thoughts better. *blobs move in processing patterns* They're like a visual representation of how ideas form and evolve! 🧠",
        mood: 'processing' as const
      },
      {
        message: "I'm really enjoying our chat! *blobs dance with excitement* Each message feels like a new color being added to our conversation palette. So vibrant and alive! 🌈",
        mood: 'excited' as const
      }
    ]
    
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return

    const userMessage: ChatMessage = {
      id: chatMessages.length + 1,
      type: 'user',
      message: inputMessage,
      timestamp: new Date()
    }

    setChatMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    // Simulate typing delay
    setTimeout(() => {
      const botResponse = getBotResponse(inputMessage)
      const botMessage: ChatMessage = {
        id: chatMessages.length + 2,
        type: 'bot',
        message: botResponse.message,
        timestamp: new Date(),
        mood: botResponse.mood
      }
      
      setCurrentMood(botResponse.mood || 'happy')
      setChatMessages(prev => [...prev, botMessage])
      setIsTyping(false)
    }, 1000 + Math.random() * 2000) // 1-3 second delay
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <>
      <style jsx global>{`
        body {
          padding: 0;
          margin: 0;
        }

         .container,
         .palette-1 {
           --bg-0: #101030;
           --bg-1: #050515;
           --blob-1: #984ddf;
           --blob-2: #4344ad;
           --blob-3: #74d9e1;
           --blob-4: #050515;
           --blob-5: #74d9e1;
           --blob-6: #4344ad;
         }

        .palette-2 {
          --bg-0: #545454;
          --bg-1: #150513;
          --blob-1: #ff3838;
          --blob-2: #ff9d7c;
          --blob-3: #ffdda0;
          --blob-4: #fff6ea;
          --blob-5: #ffdda0;
          --blob-6: #ff9d7c;
        }

        .palette-3 {
          --bg-0: #300030;
          --bg-1: #000000;
          --blob-1: #291528;
          --blob-2: #3a3e3b;
          --blob-3: #9e829c;
          --blob-4: #f0eff4;
          --blob-5: #9e829c;
          --blob-6: #3a3e3b;
        }

        .palette-4 {
          --bg-0: #ffffff;
          --bg-1: #d3f7ff;
          --blob-1: #bb74ff;
          --blob-2: #7c7dff;
          --blob-3: #a0f8ff;
          --blob-4: #ffffff;
          --blob-5: #a0f8ff;
          --blob-6: #7c7dff;
        }

        .palette-5 {
          --bg-0: #968e85;
          --bg-1: #8cc084;
          --blob-1: #c1d7ae;
          --blob-2: #9eff72;
          --blob-3: #ffcab1;
          --blob-4: #ecdcb0;
          --blob-5: #ffcab1;
          --blob-6: #9eff72;
        }

        .palette-6 {
          --bg-0: #ffffff;
          --bg-1: #4e598c;
          --blob-1: #ff8c42;
          --blob-2: #fcaf58;
          --blob-3: #f9c784;
          --blob-4: #ffffff;
          --blob-5: #f9c784;
          --blob-6: #fcaf58;
        }

        .palette-7 {
          --bg-0: #F5F5F5;
          --bg-1: #FFFFFF;
          --blob-1: #FC4E46;
          --blob-2: #0D6ABE;
          --blob-3: #00BD6F;
          --blob-4: #F5F5F5;
          --blob-5: #FC4E46;
          --blob-6: #0D6ABE;
        }

        .palette-8 {
          --bg-0: #121212;
          --bg-1: #181818;
          --blob-1: #0D6ABE;
          --blob-2: #00BD6F;
          --blob-3: #EF9400;
          --blob-4: #FF5E2B;
          --blob-5: #24408E;
          --blob-6: #009A5D;
        }

        .container {
          background: var(--bg-1);
          width: 100%;
          height: 100vh;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          transition: background 1000ms ease;
        }

        .container::after {
          position: absolute;
          content: "";
          width: min(50vw, 50vh);
          height: min(50vw, 50vh);
          background: var(--bg-0);
          border-radius: 50%;
          filter: blur(10rem);
          transition: background 500ms ease;
        }

        .blobs {
          width: min(60vw, 60vh);
          height: min(60vw, 60vh);
          max-height: 100%;
          max-width: 100%;
        }

        .blobs svg {
          position: relative;
          height: 100%;
          z-index: 2;
        }

        .blob {
          animation: rotate 25s infinite alternate ease-in-out;
          transform-origin: 50% 50%;
          opacity: 0.7;
        }

        .blob path {
          animation: blob-anim-1 5s infinite alternate cubic-bezier(0.45, 0.2, 0.55, 0.8);
          transform-origin: 50% 50%;
          transform: scale(0.8);
          transition: fill 800ms ease;
        }

        .blob.alt {
          animation-direction: alternate-reverse;
          opacity: 0.3;
        }

        .blob-1 path {
          fill: var(--blob-1);
          filter: blur(1rem);
        }

        .blob-2 {
          animation-duration: 18s;
          animation-direction: alternate-reverse;
        }

        .blob-2 path {
          fill: var(--blob-2);
          animation-name: blob-anim-2;
          animation-duration: 7s;
          filter: blur(0.75rem);
          transform: scale(0.78);
        }

        .blob-2.alt {
          animation-direction: alternate;
        }

        .blob-3 {
          animation-duration: 23s;
        }

        .blob-3 path {
          fill: var(--blob-3);
          animation-name: blob-anim-3;
          animation-duration: 6s;
          filter: blur(0.5rem);
          transform: scale(0.76);
        }

        .blob-4 {
          animation-duration: 31s;
          animation-direction: alternate-reverse;
          opacity: 0.9;
        }

        .blob-4 path {
          fill: var(--blob-4);
          animation-name: blob-anim-4;
          animation-duration: 10s;
          filter: blur(10rem);
          transform: scale(0.5);
        }

         .blob-4.alt {
           animation-direction: alternate;
           opacity: 0.8;
         }

         .blob-5 {
           animation-duration: 20s;
           animation-direction: alternate;
           opacity: 0.6;
         }

         .blob-5 path {
           fill: var(--blob-1);
           animation-name: blob-anim-5;
           animation-duration: 8s;
           filter: blur(0.8rem);
           transform: scale(0.72);
         }

         .blob-5.alt {
           animation-direction: alternate-reverse;
           opacity: 0.4;
         }

         .blob-6 {
           animation-duration: 28s;
           animation-direction: alternate-reverse;
           opacity: 0.5;
         }

         .blob-6 path {
           fill: var(--blob-2);
           animation-name: blob-anim-6;
           animation-duration: 9s;
           filter: blur(1.2rem);
           transform: scale(0.68);
         }

         .blob-6.alt {
           animation-direction: alternate;
           opacity: 0.3;
         }

        @keyframes blob-anim-1 {
          0% {
            d: path("M 100 600 q 0 -500, 500 -500 t 500 500 t -500 500 T 100 600 z");
          }
          30% {
            d: path("M 100 600 q -50 -400, 500 -500 t 450 550 t -500 500 T 100 600 z");
          }
          70% {
            d: path("M 100 600 q 0 -400, 500 -500 t 400 500 t -500 500 T 100 600 z");
          }
          100% {
            d: path("M 150 600 q 0 -600, 500 -500 t 500 550 t -500 500 T 150 600 z");
          }
        }

        @keyframes blob-anim-2 {
          0% {
            d: path("M 100 600 q 0 -400, 500 -500 t 400 500 t -500 500 T 100 600 z");
          }
          40% {
            d: path("M 150 600 q 0 -600, 500 -500 t 500 550 t -500 500 T 150 600 z");
          }
          80% {
            d: path("M 100 600 q -50 -400, 500 -500 t 450 550 t -500 500 T 100 600 z");
          }
          100% {
            d: path("M 100 600 q 100 -600, 500 -500 t 400 500 t -500 500 T 100 600 z");
          }
        }

        @keyframes blob-anim-3 {
          0% {
            d: path("M 100 600 q -50 -400, 500 -500 t 450 550 t -500 500 T 100 600 z");
          }
          35% {
            d: path("M 150 600 q 0 -600, 500 -500 t 500 550 t -500 500 T 150 600 z");
          }
          75% {
            d: path("M 100 600 q 100 -600, 500 -500 t 400 500 t -500 500 T 100 600 z");
          }
          100% {
            d: path("M 100 600 q 0 -400, 500 -500 t 400 500 t -500 500 T 100 600 z");
          }
        }

         @keyframes blob-anim-4 {
           0% {
             d: path("M 150 600 q 0 -600, 500 -500 t 500 550 t -500 500 T 150 600 z");
           }
           30% {
             d: path("M 100 600 q 100 -600, 500 -500 t 400 500 t -500 500 T 100 600 z");
           }
           70% {
             d: path("M 100 600 q -50 -400, 500 -500 t 450 550 t -500 500 T 100 600 z");
           }
           100% {
             d: path("M 150 600 q 0 -600, 500 -500 t 500 550 t -500 500 T 150 600 z");
           }
         }

         @keyframes blob-anim-5 {
           0% {
             d: path("M 200 600 q 50 -450, 400 -400 t 350 450 t -400 400 T 200 600 z");
           }
           25% {
             d: path("M 180 600 q 0 -350, 450 -400 t 400 500 t -450 400 T 180 600 z");
           }
           50% {
             d: path("M 220 600 q -30 -500, 500 -450 t 450 500 t -500 450 T 220 600 z");
           }
           75% {
             d: path("M 190 600 q 20 -400, 420 -500 t 480 450 t -420 500 T 190 600 z");
           }
           100% {
             d: path("M 200 600 q 50 -450, 400 -400 t 350 450 t -400 400 T 200 600 z");
           }
         }

         @keyframes blob-anim-6 {
           0% {
             d: path("M 300 600 q -20 -550, 600 -500 t 500 500 t -600 500 T 300 600 z");
           }
           20% {
             d: path("M 280 600 q 30 -400, 550 -550 t 550 400 t -550 550 T 280 600 z");
           }
           40% {
             d: path("M 320 600 q -50 -600, 650 -400 t 400 600 t -650 400 T 320 600 z");
           }
           60% {
             d: path("M 290 600 q 10 -450, 580 -500 t 520 450 t -580 500 T 290 600 z");
           }
           80% {
             d: path("M 310 600 q -40 -500, 620 -450 t 480 500 t -620 450 T 310 600 z");
           }
           100% {
             d: path("M 300 600 q -20 -550, 600 -500 t 500 500 t -600 500 T 300 600 z");
           }
         }

        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .switcher {
          position: absolute;
          left: 1rem;
          top: 0;
          height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 1rem;
          z-index: 10;
        }

         .switch-button {
           cursor: pointer;
           width: min(12vh, 6rem);
           height: min(12vh, 6rem);
           background: radial-gradient(var(--bg-0), var(--bg-1));
           border-radius: 0.5rem;
           backdrop-filter: blur(1rem);
           border: 1px solid rgba(120, 120, 120, 0.5);
           position: relative;
           overflow: hidden;
           display: flex;
           flex-direction: column;
           align-items: center;
           justify-content: center;
           padding: 0.5rem;
         }

         .palette-name {
           position: absolute;
           bottom: 0.25rem;
           left: 50%;
           transform: translateX(-50%);
           font-size: 0.6rem;
           font-weight: 600;
           color: white;
           text-shadow: 0 1px 2px rgba(0, 0, 0, 0.7);
           text-align: center;
           line-height: 1;
           z-index: 3;
         }

        .switch-button .blobs {
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .switch-button .blobs svg {
          width: 100%;
          height: 100%;
        }

        .switch-button .blob path {
          animation-duration: 2s;
        }

         .nav-button {
           position: absolute;
           top: 1rem;
           right: 1rem;
           z-index: 10;
         }

         /* Chatbot Panel */
         .chatbot-panel {
           position: fixed;
           top: 0;
           right: 0;
           width: 400px;
           height: 100vh;
           background: rgba(255, 255, 255, 0.95);
           backdrop-filter: blur(20px);
           border-left: 1px solid rgba(0, 0, 0, 0.1);
           transform: translateX(100%);
           transition: transform 0.3s ease-in-out;
           z-index: 20;
           display: flex;
           flex-direction: column;
         }

         .chatbot-panel.open {
           transform: translateX(0);
         }

         .chatbot-header {
           padding: 1.5rem;
           border-bottom: 1px solid rgba(0, 0, 0, 0.1);
           background: linear-gradient(135deg, var(--bg-0), var(--bg-1));
           position: relative;
           overflow: hidden;
         }

         .chatbot-blob {
           width: 80px;
           height: 80px;
           margin: 0 auto 1rem;
           position: relative;
           animation: blobPulse 3s ease-in-out infinite;
         }

         .chatbot-blob svg {
           width: 100%;
           height: 100%;
           filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
         }

         @keyframes blobPulse {
           0%, 100% {
             transform: scale(1) rotate(0deg);
             filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
           }
           25% {
             transform: scale(1.05) rotate(1deg);
             filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.3));
           }
           50% {
             transform: scale(1.1) rotate(0deg);
             filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.4));
           }
           75% {
             transform: scale(1.05) rotate(-1deg);
             filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.3));
           }
         }

         /* Mood-based blob icon animations */
         .mood-excited .chatbot-blob {
           animation: blobExcited 1.5s ease-in-out infinite;
         }

         .mood-thinking .chatbot-blob {
           animation: blobThinking 4s ease-in-out infinite;
         }

         .mood-calm .chatbot-blob {
           animation: blobCalm 6s ease-in-out infinite;
         }

         .mood-processing .chatbot-blob {
           animation: blobProcessing 2.5s ease-in-out infinite;
         }

         .mood-happy .chatbot-blob {
           animation: blobHappy 2s ease-in-out infinite;
         }

         .mood-focused .chatbot-blob {
           animation: blobFocused 3s ease-in-out infinite;
         }

         @keyframes blobExcited {
           0%, 100% {
             transform: scale(1) rotate(0deg);
             filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2)) brightness(1.2);
           }
           25% {
             transform: scale(1.15) rotate(3deg);
             filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.4)) brightness(1.4);
           }
           50% {
             transform: scale(1.2) rotate(0deg);
             filter: drop-shadow(0 12px 24px rgba(0, 0, 0, 0.6)) brightness(1.6);
           }
           75% {
             transform: scale(1.15) rotate(-3deg);
             filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.4)) brightness(1.4);
           }
         }

         @keyframes blobThinking {
           0%, 100% {
             transform: scale(1) rotate(0deg);
             filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2)) brightness(0.8);
           }
           25% {
             transform: scale(1.02) rotate(0.5deg);
             filter: drop-shadow(0 5px 10px rgba(0, 0, 0, 0.25)) brightness(0.85);
           }
           50% {
             transform: scale(1.05) rotate(0deg);
             filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.3)) brightness(0.9);
           }
           75% {
             transform: scale(1.02) rotate(-0.5deg);
             filter: drop-shadow(0 5px 10px rgba(0, 0, 0, 0.25)) brightness(0.85);
           }
         }

         @keyframes blobCalm {
           0%, 100% {
             transform: scale(1) rotate(0deg);
             filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2)) brightness(0.9);
           }
           50% {
             transform: scale(1.03) rotate(0deg);
             filter: drop-shadow(0 5px 10px rgba(0, 0, 0, 0.25)) brightness(0.95);
           }
         }

         @keyframes blobProcessing {
           0%, 100% {
             transform: scale(1) rotate(0deg);
             filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2)) brightness(1);
           }
           25% {
             transform: scale(1.08) rotate(1deg);
             filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.3)) brightness(1.1);
           }
           50% {
             transform: scale(1.1) rotate(0deg);
             filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.4)) brightness(1.2);
           }
           75% {
             transform: scale(1.08) rotate(-1deg);
             filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.3)) brightness(1.1);
           }
         }

         @keyframes blobHappy {
           0%, 100% {
             transform: scale(1) rotate(0deg);
             filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2)) brightness(1.1);
           }
           25% {
             transform: scale(1.08) rotate(2deg);
             filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.3)) brightness(1.2);
           }
           50% {
             transform: scale(1.12) rotate(0deg);
             filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.4)) brightness(1.3);
           }
           75% {
             transform: scale(1.08) rotate(-2deg);
             filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.3)) brightness(1.2);
           }
         }

         @keyframes blobFocused {
           0%, 100% {
             transform: scale(1) rotate(0deg);
             filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2)) brightness(1);
           }
           25% {
             transform: scale(1.06) rotate(0.5deg);
             filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.3)) brightness(1.1);
           }
           50% {
             transform: scale(1.08) rotate(0deg);
             filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.4)) brightness(1.15);
           }
           75% {
             transform: scale(1.06) rotate(-0.5deg);
             filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.3)) brightness(1.1);
           }
         }

         .chatbot-title {
           text-align: center;
           font-size: 1.2rem;
           font-weight: 600;
           color: white;
           margin-bottom: 0.5rem;
         }

         .chatbot-subtitle {
           text-align: center;
           font-size: 0.9rem;
           color: rgba(255, 255, 255, 0.8);
         }

         .chatbot-messages {
           flex: 1;
           overflow-y: auto;
           padding: 1rem;
           display: flex;
           flex-direction: column;
           gap: 1rem;
         }

         .message {
           display: flex;
           gap: 0.75rem;
           max-width: 85%;
         }

         .message.user {
           align-self: flex-end;
           flex-direction: row-reverse;
         }

         .message-avatar {
           width: 32px;
           height: 32px;
           border-radius: 50%;
           display: flex;
           align-items: center;
           justify-content: center;
           flex-shrink: 0;
           position: relative;
           overflow: hidden;
         }

         .message.user .message-avatar {
           background: var(--blob-1);
           color: white;
         }

         .message.bot .message-avatar {
           background: transparent;
           color: white;
         }

         .bot-blob-avatar {
           width: 100%;
           height: 100%;
           position: relative;
         }

         .bot-blob-avatar svg {
           width: 100%;
           height: 100%;
         }

         .bot-blob-avatar .blob {
           animation-duration: 2s !important;
           opacity: 0.8 !important;
         }

         .bot-blob-avatar .blob path {
           animation-duration: 1.5s !important;
         }

         /* Mood-based bot avatar animations */
         .mood-excited .message.bot .bot-blob-avatar .blob {
           animation-duration: 0.8s !important;
           opacity: 1 !important;
         }

         .mood-thinking .message.bot .bot-blob-avatar .blob {
           animation-duration: 4s !important;
           opacity: 0.4 !important;
         }

         .mood-calm .message.bot .bot-blob-avatar .blob {
           animation-duration: 6s !important;
           opacity: 0.3 !important;
         }

         .mood-processing .message.bot .bot-blob-avatar .blob {
           animation-duration: 2.5s !important;
           opacity: 0.6 !important;
         }

         .mood-happy .message.bot .bot-blob-avatar .blob {
           animation-duration: 1.5s !important;
           opacity: 0.9 !important;
         }

         .mood-focused .message.bot .bot-blob-avatar .blob {
           animation-duration: 3s !important;
           opacity: 0.7 !important;
         }

         .message-content {
           background: white;
           padding: 0.75rem 1rem;
           border-radius: 1rem;
           box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
           position: relative;
         }

         .message.user .message-content {
           background: var(--blob-1);
           color: white;
         }

         .message-text {
           font-size: 0.9rem;
           line-height: 1.4;
           margin: 0;
         }

         .message-time {
           font-size: 0.75rem;
           opacity: 0.6;
           margin-top: 0.25rem;
         }

         .typing-indicator {
           display: flex;
           align-items: center;
           gap: 0.5rem;
           color: #666;
           font-style: italic;
         }

         .typing-dots {
           display: flex;
           gap: 0.25rem;
         }

         .typing-dot {
           width: 6px;
           height: 6px;
           background: #666;
           border-radius: 50%;
           animation: typing 1.4s infinite ease-in-out;
         }

         .typing-dot:nth-child(2) {
           animation-delay: 0.2s;
         }

         .typing-dot:nth-child(3) {
           animation-delay: 0.4s;
         }

         @keyframes typing {
           0%, 60%, 100% {
             transform: translateY(0);
             opacity: 0.5;
           }
           30% {
             transform: translateY(-10px);
             opacity: 1;
           }
         }

         .chatbot-input {
           padding: 1rem;
           border-top: 1px solid rgba(0, 0, 0, 0.1);
           background: white;
         }

         .input-container {
           display: flex;
           gap: 0.5rem;
           align-items: flex-end;
         }

         .message-input {
           flex: 1;
           border: 1px solid #ddd;
           border-radius: 1rem;
           padding: 0.75rem 1rem;
           resize: none;
           font-size: 0.9rem;
           line-height: 1.4;
           max-height: 100px;
           min-height: 40px;
         }

         .message-input:focus {
           outline: none;
           border-color: var(--blob-1);
           box-shadow: 0 0 0 2px rgba(252, 78, 70, 0.2);
         }

         .send-button {
           background: var(--blob-1);
           color: white;
           border: none;
           border-radius: 50%;
           width: 40px;
           height: 40px;
           display: flex;
           align-items: center;
           justify-content: center;
           cursor: pointer;
           transition: all 0.2s ease;
         }

         .send-button:hover {
           background: var(--blob-2);
           transform: scale(1.05);
         }

         .send-button:disabled {
           opacity: 0.5;
           cursor: not-allowed;
           transform: none;
         }

         .chat-toggle {
           position: fixed;
           top: 1rem;
           right: 1rem;
           z-index: 15;
         }

         /* Mood-based blob animations */
         .mood-thinking .blob {
           animation-duration: 35s !important;
           opacity: 0.4 !important;
           animation-timing-function: ease-in-out !important;
         }

         .mood-thinking .blob path {
           animation-duration: 8s !important;
           animation-timing-function: cubic-bezier(0.4, 0.0, 0.6, 1) !important;
         }

         .mood-excited .blob {
           animation-duration: 12s !important;
           opacity: 0.9 !important;
           animation-timing-function: ease-in-out !important;
         }

         .mood-excited .blob path {
           animation-duration: 3s !important;
           animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
         }

         .mood-calm .blob {
           animation-duration: 45s !important;
           opacity: 0.3 !important;
           animation-timing-function: ease-in-out !important;
         }

         .mood-calm .blob path {
           animation-duration: 12s !important;
           animation-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1) !important;
         }

         .mood-processing .blob {
           animation-duration: 25s !important;
           opacity: 0.6 !important;
           animation-timing-function: ease-in-out !important;
         }

         .mood-processing .blob path {
           animation-duration: 6s !important;
           animation-timing-function: cubic-bezier(0.4, 0.0, 0.6, 1) !important;
         }

         .mood-happy .blob {
           animation-duration: 20s !important;
           opacity: 0.8 !important;
           animation-timing-function: ease-in-out !important;
         }

         .mood-happy .blob path {
           animation-duration: 5s !important;
           animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
         }

         .mood-focused .blob {
           animation-duration: 30s !important;
           opacity: 0.7 !important;
           animation-timing-function: ease-in-out !important;
         }

         .mood-focused .blob path {
           animation-duration: 7s !important;
           animation-timing-function: cubic-bezier(0.4, 0.0, 0.6, 1) !important;
         }

         /* Special mood behaviors */
         .mood-thinking .blob-1 {
           animation-duration: 50s !important;
           opacity: 0.2 !important;
         }

         .mood-thinking .blob-2 {
           animation-duration: 40s !important;
           opacity: 0.3 !important;
         }

         .mood-excited .blob-1 {
           animation-duration: 8s !important;
           opacity: 1 !important;
         }

         .mood-excited .blob-2 {
           animation-duration: 10s !important;
           opacity: 0.9 !important;
         }

         .mood-calm .blob-1 {
           animation-duration: 60s !important;
           opacity: 0.1 !important;
         }

         .mood-calm .blob-2 {
           animation-duration: 55s !important;
           opacity: 0.2 !important;
         }

         .mood-processing .blob-1 {
           animation-duration: 30s !important;
           opacity: 0.5 !important;
         }

         .mood-processing .blob-2 {
           animation-duration: 25s !important;
           opacity: 0.6 !important;
         }

         .mood-happy .blob-1 {
           animation-duration: 15s !important;
           opacity: 0.9 !important;
         }

         .mood-happy .blob-2 {
           animation-duration: 18s !important;
           opacity: 0.8 !important;
         }

         .mood-focused .blob-1 {
           animation-duration: 35s !important;
           opacity: 0.6 !important;
         }

         .mood-focused .blob-2 {
           animation-duration: 30s !important;
           opacity: 0.7 !important;
         }

         /* Dramatic mood transitions */
         .mood-excited .blob-3 {
           animation-duration: 6s !important;
           opacity: 1 !important;
           filter: blur(0.3rem) !important;
         }

         .mood-excited .blob-4 {
           animation-duration: 4s !important;
           opacity: 0.8 !important;
           filter: blur(0.8rem) !important;
         }

         .mood-thinking .blob-3 {
           animation-duration: 15s !important;
           opacity: 0.2 !important;
           filter: blur(1.5rem) !important;
         }

         .mood-thinking .blob-4 {
           animation-duration: 20s !important;
           opacity: 0.1 !important;
           filter: blur(2rem) !important;
         }

         .mood-calm .blob-3 {
           animation-duration: 25s !important;
           opacity: 0.15 !important;
           filter: blur(1.8rem) !important;
         }

         .mood-calm .blob-4 {
           animation-duration: 30s !important;
           opacity: 0.1 !important;
           filter: blur(2.5rem) !important;
         }

         .mood-processing .blob-3 {
           animation-duration: 10s !important;
           opacity: 0.4 !important;
           filter: blur(1rem) !important;
         }

         .mood-processing .blob-4 {
           animation-duration: 12s !important;
           opacity: 0.3 !important;
           filter: blur(1.2rem) !important;
         }

         .mood-happy .blob-3 {
           animation-duration: 8s !important;
           opacity: 0.7 !important;
           filter: blur(0.6rem) !important;
         }

         .mood-happy .blob-4 {
           animation-duration: 10s !important;
           opacity: 0.6 !important;
           filter: blur(0.8rem) !important;
         }

         .mood-focused .blob-3 {
           animation-duration: 12s !important;
           opacity: 0.5 !important;
           filter: blur(0.8rem) !important;
         }

         .mood-focused .blob-4 {
           animation-duration: 15s !important;
           opacity: 0.4 !important;
           filter: blur(1rem) !important;
         }

         /* Special effects for mood changes */
         .mood-excited .blob-5,
         .mood-excited .blob-6 {
           animation-duration: 5s !important;
           opacity: 0.8 !important;
         }

         .mood-thinking .blob-5,
         .mood-thinking .blob-6 {
           animation-duration: 20s !important;
           opacity: 0.2 !important;
         }

         .mood-calm .blob-5,
         .mood-calm .blob-6 {
           animation-duration: 35s !important;
           opacity: 0.1 !important;
         }
      `}</style>

      <div className={`container palette-${currentPalette} mood-${currentMood}`}>
        {/* Navigation */}
        <div className="nav-button">
          <Link href="/">
            <Button
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Chat Toggle */}
        <div className="chat-toggle">
          <Button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Chat with Blobby
          </Button>
        </div>

        {/* Main Blobs */}
        <div className="blobs">
          <svg viewBox="0 0 1200 1200">
            <g className="blob blob-1">
              <path />
            </g>
            <g className="blob blob-2">
              <path />
            </g>
            <g className="blob blob-3">
              <path />
            </g>
            <g className="blob blob-4">
              <path />
            </g>
            <g className="blob blob-1 alt">
              <path />
            </g>
            <g className="blob blob-2 alt">
              <path />
            </g>
            <g className="blob blob-3 alt">
              <path />
            </g>
             <g className="blob blob-4 alt">
               <path />
             </g>
             <g className="blob blob-5">
               <path />
             </g>
             <g className="blob blob-6">
               <path />
             </g>
             <g className="blob blob-5 alt">
               <path />
             </g>
             <g className="blob blob-6 alt">
               <path />
             </g>
           </svg>
         </div>

         {/* Color Palette Switcher */}
         <div className="switcher">
           {[
             { id: 1, name: "Cosmic" },
             { id: 2, name: "Sunset" },
             { id: 3, name: "Gothic" },
             { id: 4, name: "Ocean" },
             { id: 5, name: "Earth" },
             { id: 6, name: "Citrus" },
             { id: 7, name: "Brand" },
             { id: 8, name: "Data" }
           ].map((palette) => (
            <div
              key={palette.id}
              className={`switch-button palette-${palette.id}`}
              onClick={() => handlePaletteChange(palette.id)}
            >
              <div className="blobs">
                 <svg viewBox="0 0 1200 1200">
                   <g className="blob blob-1">
                     <path />
                   </g>
                   <g className="blob blob-2">
                     <path />
                   </g>
                   <g className="blob blob-3">
                     <path />
                   </g>
                   <g className="blob blob-4">
                     <path />
                   </g>
                   <g className="blob blob-5">
                     <path />
                   </g>
                   <g className="blob blob-6">
                     <path />
                   </g>
                 </svg>
              </div>
              <div className="palette-name">{palette.name}</div>
            </div>
          ))}
        </div>

        {/* Chatbot Panel */}
        <div className={`chatbot-panel ${isChatOpen ? 'open' : ''}`}>
          <div className="chatbot-header">
            <div className="chatbot-blob">
              <svg viewBox="0 0 1200 1200">
                <g className="blob blob-1">
                  <path />
                </g>
                <g className="blob blob-2">
                  <path />
                </g>
                <g className="blob blob-3">
                  <path />
                </g>
                <g className="blob blob-4">
                  <path />
                </g>
              </svg>
            </div>
            <div className="chatbot-title">Blobby</div>
            <div className="chatbot-subtitle">Your animated companion</div>
          </div>

          <div className="chatbot-messages">
            {chatMessages.map((message) => (
              <div key={message.id} className={`message ${message.type}`}>
                <div className="message-avatar">
                  {message.type === 'user' ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <div className="bot-blob-avatar">
                      <svg viewBox="0 0 1200 1200">
                        <g className="blob blob-1">
                          <path />
                        </g>
                        <g className="blob blob-2">
                          <path />
                        </g>
                        <g className="blob blob-3">
                          <path />
                        </g>
                        <g className="blob blob-4">
                          <path />
                        </g>
                      </svg>
                    </div>
                  )}
                </div>
                <div className="message-content">
                  <p className="message-text">{message.message}</p>
                  <div className="message-time">
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="message bot">
                <div className="message-avatar">
                  <div className="bot-blob-avatar">
                    <svg viewBox="0 0 1200 1200">
                      <g className="blob blob-1">
                        <path />
                      </g>
                      <g className="blob blob-2">
                        <path />
                      </g>
                      <g className="blob blob-3">
                        <path />
                      </g>
                      <g className="blob blob-4">
                        <path />
                      </g>
                    </svg>
                  </div>
                </div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <span>Blobby is thinking</span>
                    <div className="typing-dots">
                      <div className="typing-dot"></div>
                      <div className="typing-dot"></div>
                      <div className="typing-dot"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="chatbot-input">
            <div className="input-container">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message to Blobby..."
                className="message-input"
                rows={1}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="send-button"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}