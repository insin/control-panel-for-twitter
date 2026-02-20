// Advanced Media Spoiler Solution
// Supports images, videos, and custom reveal animations

void function() {
  'use strict'

  const SpoilerManager = {
    init: function() {
      this.addStyles()
      this.bindEvents()
      this.applyToElements()
    },

    addStyles: function() {
      const style = document.createElement('style')
      style.textContent = `
        .media-spoiler {
          position: relative;
          overflow: hidden;
          cursor: pointer;
        }

        .media-spoiler img,
        .media-spoiler video {
          filter: blur(15px) brightness(0.8);
          transition: all 0.4s ease;
          transform: scale(1.05);
        }

        .media-spoiler:hover img,
        .media-spoiler:hover video {
          filter: blur(5px) brightness(0.9);
          transform: scale(1.02);
        }

        .media-spoiler.revealed img,
        .media-spoiler.revealed video {
          filter: blur(0) brightness(1);
          transform: scale(1);
        }

        .spoiler-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, rgba(0,0,0,0.7), rgba(50,50,50,0.7));
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 16px;
          font-weight: bold;
          text-align: center;
          padding: 20px;
          transition: opacity 0.3s ease;
          z-index: 2;
        }

        .media-spoiler:hover .spoiler-overlay {
          opacity: 0.8;
        }

        .media-spoiler.revealed .spoiler-overlay {
          display: none;
        }

        .spoiler-text {
          background: rgba(0,0,0,0.9);
          padding: 15px 25px;
          border-radius: 8px;
          border: 2px solid rgba(255,255,255,0.3);
        }

        .spoiler-text:hover {
          background: rgba(0,0,0,0.95);
          border-color: rgba(255,255,255,0.5);
        }
      `
      document.head.appendChild(style)
    },

    bindEvents: function() {
      document.addEventListener('click', (e) => {
        const spoiler = e.target.closest('.media-spoiler')
        if (spoiler && !spoiler.classList.contains('revealed')) {
          this.reveal(spoiler)
        }
      })
    },

    applyToElements: function() {
      // Auto-apply to elements with data-spoiler attribute
      document.querySelectorAll('[data-spoiler]').forEach(el => {
        this.makeSpoiler(el)
      })
    },

    makeSpoiler: function(element) {
      if (element.classList.contains('media-spoiler')) return

      element.classList.add('media-spoiler')

      const overlay = document.createElement('div')
      overlay.className = 'spoiler-overlay'

      const text = document.createElement('div')
      text.className = 'spoiler-text'
      text.textContent = element.getAttribute('data-spoiler-text') || '⚠️ Sensitive Content\nHover to preview • Click to reveal'

      overlay.appendChild(text)
      element.appendChild(overlay)
    },

    reveal: function(element) {
      element.classList.add('revealed')

      // Optional: Add reveal animation
      const media = element.querySelector('img, video')
      if (media) {
        media.style.animation = 'spoiler-reveal 0.6s ease-out'
      }
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => SpoilerManager.init())
  } else {
    SpoilerManager.init()
  }

  // Expose for manual use
  window.MediaSpoiler = SpoilerManager
}()