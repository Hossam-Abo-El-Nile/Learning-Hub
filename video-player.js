// Convert YouTube URL to embed URL
function getYouTubeEmbedUrl(url) {
  if (!url) return '';
  
  let videoId = '';
  
  // Handle different YouTube URL formats
  if (url.includes('youtube.com/watch')) {
    // https://www.youtube.com/watch?v=ID
    videoId = url.split('v=')[1]?.split('&')[0];
  } else if (url.includes('youtu.be/')) {
    // https://youtu.be/ID
    videoId = url.split('youtu.be/')[1]?.split('?')[0];
  }
  
  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}`;
  }
  
  return '';
}

// Load video from URL
function loadVideoFromUrl(youtubeUrl) {
  const embedUrl = getYouTubeEmbedUrl(youtubeUrl);
  if (embedUrl) {
    document.getElementById('videoFrame').src = embedUrl;
  }
}

// Load video data from localStorage
function loadVideoData() {
  const videoTitle = localStorage.getItem('currentVideoTitle');
  const videoUrl = localStorage.getItem('currentVideoUrl');
  const videoDescription = localStorage.getItem('currentVideoDescription');
  
  if (videoTitle) {
    document.getElementById('videoTitle').textContent = videoTitle;
  }
  
  if (videoDescription) {
    document.getElementById('videoDescription').textContent = videoDescription;
  }
  
  if (videoUrl) {
    loadVideoFromUrl(videoUrl);
  }
}

// Load from URL parameter if provided
function loadFromStorage() {
  const storedUrl = localStorage.getItem('videoPlayerUrl');
  if (storedUrl) {
    loadVideoFromUrl(storedUrl);
    localStorage.removeItem('videoPlayerUrl'); // Clear after using
  } else {
    // Try to load from current video data
    loadVideoData();
  }
}

// Update navigation buttons based on user login status
function updateNavButtons() {
  const user = getCurrentUser();
  const loginLink = document.getElementById('loginLink');
  const logoutBtn = document.getElementById('logoutBtn');

  if (user) {
    if (loginLink) loginLink.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'inline-block';
  } else {
    if (loginLink) loginLink.style.display = 'inline-block';
    if (logoutBtn) logoutBtn.style.display = 'none';
  }
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
  updateNavButtons();
  loadFromStorage();
  
  // Add logout event listener
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logoutUser);
  }
  
  // Example: You can manually load a video by calling:
  // loadVideoFromUrl('https://www.youtube.com/watch?v=XXXXX');
  // or loadVideoFromUrl('https://youtu.be/XXXXX');
});

// Make loadVideoFromUrl available globally so you can use it in console or from other pages
window.loadVideoFromUrl = loadVideoFromUrl;
