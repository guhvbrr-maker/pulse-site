/**
 * YouTube Interaction Warmup Pattern
 * Improves FCP by deferring YouTube iframe loading until first user interaction,
 * then reveals the pre-loaded iframe on click (eliminating the 6s delay)
 * 
 * Strategy: On user interaction (scroll/mousemove/touchstart), create a hidden
 * iframe with autoplay=1 and mute=1 to silently pre-load the video behind the cover.
 * On click, hide the cover and update src with mute=0 to enable sound.
 * 
 * Note: While the YouTube IFrame Player API could unmute without reload, it requires
 * loading an additional script. This approach pre-loads all YouTube resources (player,
 * scripts, video data) during warmup, so the src update on click only needs to restart
 * the video stream - still significantly faster than loading everything from scratch.
 */
(function() {
  'use strict';

  var warmedUpIframe = null;
  var isWarmedUp = false;

  /**
   * Build YouTube embed URL with parameters for warmup or playback
   * @param {string} videoId - YouTube video ID
   * @param {boolean} muted - Whether to mute the video
   * @returns {string} The complete embed URL
   */
  function buildEmbedUrl(videoId, muted) {
    var baseUrl = 'https://www.youtube.com/embed/' + encodeURIComponent(videoId);
    var params = [
      'autoplay=1',
      'mute=' + (muted ? '1' : '0'),
      'rel=0',
      'modestbranding=1',
      'playsinline=1'
    ];
    return baseUrl + '?' + params.join('&');
  }

  /**
   * Create and configure a YouTube iframe element
   * @param {string} src - The iframe source URL
   * @param {boolean} behindCover - Whether to position behind cover (z-index: 0)
   * @returns {HTMLIFrameElement} The configured iframe element
   */
  function createIframe(src, behindCover) {
    var iframe = document.createElement('iframe');
    iframe.setAttribute('src', src);
    iframe.setAttribute('title', 'Vídeo Hero');
    iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
    iframe.setAttribute('allowfullscreen', '');
    iframe.style.border = 'none';
    iframe.style.position = 'absolute';
    iframe.style.top = '0';
    iframe.style.left = '0';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    
    if (behindCover) {
      // Position behind cover with lower z-index
      iframe.style.zIndex = '0';
    } else {
      iframe.style.zIndex = '2';
    }
    
    return iframe;
  }

  /**
   * Warm up the video by creating a hidden/muted iframe on first user interaction
   * This pre-loads YouTube resources silently behind the cover
   */
  function warmUpVideo() {
    if (isWarmedUp) return;
    
    var videoContainer = document.getElementById('video-container');
    if (!videoContainer) return;

    var videoId = videoContainer.dataset.videoId;
    if (!videoId) return;

    // Validate video ID format (YouTube video IDs are 11 characters, alphanumeric with - and _)
    if (!/^[a-zA-Z0-9_-]{11}$/.test(videoId)) return;

    // Create iframe with autoplay=1 and mute=1 for silent pre-loading
    // Position it behind the cover (z-index: 0)
    var iframe = createIframe(buildEmbedUrl(videoId, true), true);

    // Inject iframe into video-container (behind the cover)
    videoContainer.appendChild(iframe);
    warmedUpIframe = iframe;
    isWarmedUp = true;
  }

  /**
   * Handle click on video cover - reveal video with sound
   */
  function handleCoverClick() {
    var videoContainer = document.getElementById('video-container');
    if (!videoContainer) return;

    var videoId = videoContainer.dataset.videoId;
    if (!videoId) return;

    // Validate video ID format
    if (!/^[a-zA-Z0-9_-]{11}$/.test(videoId)) return;

    var videoCover = videoContainer.querySelector('.video-cover');

    // Hide the cover first
    if (videoCover) {
      videoCover.classList.add('hidden');
    }

    if (warmedUpIframe) {
      // Video is warmed up - update src with mute=0 to enable sound
      // The YouTube resources (player, scripts, video data) are already cached from warmup
      warmedUpIframe.setAttribute('src', buildEmbedUrl(videoId, false));
      warmedUpIframe.style.zIndex = '2';
    } else {
      // Fallback: create iframe immediately if not warmed up yet
      var iframe = createIframe(buildEmbedUrl(videoId, false), false);
      videoContainer.appendChild(iframe);
    }
  }

  /**
   * Initialize video interaction warmup and click handler
   */
  function initVideoWarmup() {
    var videoContainer = document.getElementById('video-container');
    if (!videoContainer) return;

    var videoId = videoContainer.dataset.videoId;
    if (!videoId) return;

    // Validate video ID format
    if (!/^[a-zA-Z0-9_-]{11}$/.test(videoId)) return;

    var videoCover = videoContainer.querySelector('.video-cover');

    // Set up warmup on first user interaction (triggers only once)
    var interactionEvents = ['scroll', 'mousemove', 'touchstart'];

    interactionEvents.forEach(function(eventType) {
      window.addEventListener(eventType, warmUpVideo, { once: true, passive: true });
    });

    // Handle click on video cover to reveal video with sound
    if (videoCover) {
      videoCover.addEventListener('click', handleCoverClick, { once: true });
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initVideoWarmup);
  } else {
    initVideoWarmup();
  }
})();
