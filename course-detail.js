// Convert YouTube URL to embed URL
function getYouTubeEmbedUrl(url) {
  if (!url) return '';
  
  let videoId = '';
  
  if (url.includes('youtube.com/watch')) {
    videoId = url.split('v=')[1]?.split('&')[0];
  } else if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1]?.split('?')[0];
  }
  
  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}`;
  }
  
  return '';
}

// Function to save video data and navigate to player
function playVideo(title, link) {
  if (!link) return;

  localStorage.setItem('currentVideoTitle', title);
  localStorage.setItem('currentVideoUrl', link);
  localStorage.setItem('currentVideoDescription', 'جزء من كورس LearnHub - استمتع بالتعلم!');
  window.location.href = 'video-player.html';
}

function getEnabledVideoIndex(courseName) {
  if (typeof getCourseProgressIndex === 'function') {
    return getCourseProgressIndex(courseName);
  }
  return 0;
}

function setEnabledVideoIndex(courseName, index) {
  if (typeof setCourseProgress === 'function') {
    setCourseProgress(courseName, index);
  }
}

function handleVideoButtonClick(event) {
  const button = event.currentTarget;
  if (!button || button.disabled) return;

  const courseName = button.dataset.courseName;
  const index = Number(button.dataset.index);
  const title = button.dataset.title;
  const link = button.dataset.link;
  const totalVideos = Number(button.dataset.totalVideos);

  const currentEnabledIndex = getEnabledVideoIndex(courseName);
  if (index === currentEnabledIndex) {
    setEnabledVideoIndex(courseName, currentEnabledIndex + 1);
    updateVideoButtons(courseName, totalVideos);
  }

  if (index === totalVideos - 1) {
    incrementCompletedCount(courseName);
  }

  playVideo(title, link);
}

function updateVideoButtons(courseName, totalVideos) {
  const enabledIndex = getEnabledVideoIndex(courseName);
  const buttons = document.querySelectorAll('.watch-btn');

  buttons.forEach(button => {
    const index = Number(button.dataset.index);
    if (index <= enabledIndex) {
      button.disabled = false;
      button.classList.remove('disabled');
    } else {
      button.disabled = true;
      button.classList.add('disabled');
    }
  });
}

function loadCourseDetail() {
  const courseName = localStorage.getItem('selectedCourse');
  
  if (!courseName || !coursesData[courseName]) {
    document.body.innerHTML = '<h2 style="text-align: center; margin-top: 50px;">Course not found</h2>';
    return;
  }

  const course = coursesData[courseName];

  // Set course image
  document.getElementById('courseImage').src = course.image;

  // Set course title
  document.getElementById('courseTitle').textContent = course.title;

  // Set course duration
  document.getElementById('courseDuration').textContent = course.duration;

  // Set course description
  document.getElementById('courseDescription').textContent = course.description;

  // Build videos list
  const videosList = document.getElementById('videosList');
  videosList.innerHTML = '';
  const enabledIndex = getEnabledVideoIndex(courseName);
  
  course.videos.forEach((video, index) => {
    const listItem = document.createElement('li');
    listItem.className = 'video-item';

    const numberDiv = document.createElement('div');
    numberDiv.className = 'video-number';
    numberDiv.textContent = index + 1;

    const contentDiv = document.createElement('div');
    contentDiv.className = 'video-content';
    contentDiv.innerHTML = `
      <h3>${video.title}</h3>
      <span class="video-duration">⏱ ${video.duration}</span>
    `;

    listItem.appendChild(numberDiv);
    listItem.appendChild(contentDiv);

    if (video.link) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'watch-btn';
      button.textContent = '▶ Watch';
      button.dataset.index = index;
      button.dataset.title = video.title;
      button.dataset.link = video.link;
      button.dataset.courseName = courseName;
      button.dataset.totalVideos = course.videos.length;
      button.disabled = index > enabledIndex;
      if (button.disabled) {
        button.classList.add('disabled');
      }
      button.addEventListener('click', handleVideoButtonClick);
      listItem.appendChild(button);
    }

    videosList.appendChild(listItem);
  });

  updateVideoButtons(courseName, course.videos.length);
  updateNavButtons();
}

window.addEventListener('DOMContentLoaded', loadCourseDetail);
