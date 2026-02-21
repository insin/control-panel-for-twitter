// JavaScript Media Spoiler with Hover and Click
// Apply to images/videos with class 'spoiler-media'

void function() {
  'use strict'

  // Add CSS styles
  const style = document.createElement('style')
  style.textContent = `
    .spoiler-media {
      position: relative;
      filter: blur(10px);
      transition: filter 0.3s ease;
      cursor: pointer;
    }

    .spoiler-media:hover {
      filter: blur(0);
    }

    .spoiler-media.revealed {
      filter: blur(0) !important;
    }

    .spoiler-media::before {
      content: "Hover to preview • Click to reveal";
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 10px 20px;
      border-radius: 5px;
      font-size: 14px;
      z-index: 1;
      pointer-events: none;
    }

    .spoiler-media:hover::before {
      content: "Click to reveal permanently";
    }
  `
  document.head.appendChild(style)

  // Add click handlers
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('spoiler-media')) {
      e.target.classList.add('revealed')
    }
  })

  // Optional: Apply to all images/videos with data-spoiler attribute
  document.querySelectorAll('[data-spoiler="true"]').forEach(function(el) {
    el.classList.add('spoiler-media')
  })
}()