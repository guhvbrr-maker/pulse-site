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

    // Validate video ID format (YouTube video IDs are 11 characters, alphanumeric with - and _)
    if (!/^[a-zA-Z0-9_-]{11}$/.test(videoId)) return;

    const videoCover = videoWrapper.querySelector('.video-cover');

    videoWrapper.addEventListener('click', function handleClick() {
      // Build URL safely using URL constructor
      const embedUrl = new URL('https://www.youtube.com/embed/' + encodeURIComponent(videoId));
      embedUrl.searchParams.set('autoplay', '1');
      embedUrl.searchParams.set('rel', '0');
      embedUrl.searchParams.set('modestbranding', '1');

      // Create iframe dynamically
      const iframe = document.createElement('iframe');
      iframe.setAttribute('src', embedUrl.toString());
      iframe.setAttribute('title', 'Vídeo Hero');
      iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
      iframe.setAttribute('allowfullscreen', '');
      iframe.style.border = 'none';

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
