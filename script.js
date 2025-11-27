/**
 * YouTube Facade Pattern - Click to Load
 * Improves FCP by deferring YouTube iframe loading until user interaction
 */
(function() {
  'use strict';

  /**
   * Initialize video facade - creates iframe on click
   */
  function initVideoFacade() {
    const videoWrapper = document.querySelector('.video-wrapper');
    if (!videoWrapper) return;

    const videoId = videoWrapper.dataset.videoId;
    if (!videoId) return;

    const videoCover = videoWrapper.querySelector('.video-cover');

    videoWrapper.addEventListener('click', function handleClick() {
      // Create iframe dynamically
      const iframe = document.createElement('iframe');
      iframe.setAttribute('src', 'https://www.youtube.com/embed/' + videoId + '?autoplay=1&rel=0&modestbranding=1');
      iframe.setAttribute('title', 'Vídeo Hero');
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
      iframe.setAttribute('allowfullscreen', '');

      // Inject iframe into wrapper
      videoWrapper.appendChild(iframe);

      // Hide the cover
      if (videoCover) {
        videoCover.classList.add('hidden');
      }

      // Remove click listener after first click
      videoWrapper.removeEventListener('click', handleClick);
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initVideoFacade);
  } else {
    initVideoFacade();
  }
})();
