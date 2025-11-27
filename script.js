/**
 * YouTube Interaction Warmup Pattern
 * Improves FCP by deferring YouTube iframe loading until first user interaction,
 * then reveals the pre-loaded iframe on click (eliminating the 6s delay)
 */
(function() {
  'use strict';

  let warmedUpIframe = null;
  let isWarmedUp = false;

  /**
   * Build YouTube embed URL with common parameters
   * @param {string} videoId - YouTube video ID
   * @param {boolean} autoplay - Whether to autoplay the video
   * @returns {string} The complete embed URL
   */
  function buildEmbedUrl(videoId, autoplay) {
    const embedUrl = new URL('https://www.youtube.com/embed/' + encodeURIComponent(videoId));
    if (autoplay) {
      embedUrl.searchParams.set('autoplay', '1');
    }
    embedUrl.searchParams.set('rel', '0');
    embedUrl.searchParams.set('modestbranding', '1');
    return embedUrl.toString();
  }

  /**
   * Create and configure a YouTube iframe element
   * @param {string} src - The iframe source URL
   * @param {boolean} hidden - Whether to create the iframe hidden
   * @returns {HTMLIFrameElement} The configured iframe element
   */
  function createIframe(src, hidden) {
    const iframe = document.createElement('iframe');
    iframe.setAttribute('src', src);
    iframe.setAttribute('title', 'Vídeo Hero');
    iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
    iframe.setAttribute('allowfullscreen', '');
    iframe.style.border = 'none';
    
    if (hidden) {
      iframe.style.position = 'absolute';
      iframe.style.top = '0';
      iframe.style.left = '0';
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.opacity = '0';
      iframe.style.pointerEvents = 'none';
    }
    
    return iframe;
  }

  /**
   * Warm up the video by creating a hidden iframe on first user interaction
   * This pre-loads YouTube resources without showing the video
   */
  function warmUpVideo() {
    if (isWarmedUp) return;
    
    const videoWrapper = document.querySelector('.video-wrapper');
    if (!videoWrapper) return;

    const videoId = videoWrapper.dataset.videoId;
    if (!videoId) return;

    // Validate video ID format (YouTube video IDs are 11 characters, alphanumeric with - and _)
    if (!/^[a-zA-Z0-9_-]{11}$/.test(videoId)) return;

    // Create hidden iframe to pre-load YouTube resources
    const iframe = createIframe(buildEmbedUrl(videoId, false), true);

    // Inject hidden iframe into wrapper
    videoWrapper.appendChild(iframe);
    warmedUpIframe = iframe;
    isWarmedUp = true;
  }

  /**
   * Initialize video interaction warmup and click handler
   */
  function initVideoWarmup() {
    const videoWrapper = document.querySelector('.video-wrapper');
    if (!videoWrapper) return;

    const videoId = videoWrapper.dataset.videoId;
    if (!videoId) return;

    // Validate video ID format
    if (!/^[a-zA-Z0-9_-]{11}$/.test(videoId)) return;

    const videoCover = videoWrapper.querySelector('.video-cover');

    // Set up warmup on first user interaction
    var interactionEvents = ['touchstart', 'scroll', 'mousemove'];

    interactionEvents.forEach(function(event) {
      window.addEventListener(event, warmUpVideo, { once: true, passive: true });
    });

    // Handle click on video cover
    videoWrapper.addEventListener('click', function handleClick() {
      if (warmedUpIframe) {
        // Video is warmed up - update src with autoplay and reveal
        warmedUpIframe.setAttribute('src', buildEmbedUrl(videoId, true));
        warmedUpIframe.style.opacity = '1';
        warmedUpIframe.style.pointerEvents = 'auto';
      } else {
        // Fallback: create iframe immediately if not warmed up yet
        var iframe = createIframe(buildEmbedUrl(videoId, true), false);
        videoWrapper.appendChild(iframe);
      }

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
    document.addEventListener('DOMContentLoaded', initVideoWarmup);
  } else {
    initVideoWarmup();
  }
})();
