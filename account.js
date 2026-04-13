function getUsers() {
  const stored = localStorage.getItem('learnhub_users');
  return stored ? JSON.parse(stored) : {};
}

function saveUsers(users) {
  localStorage.setItem('learnhub_users', JSON.stringify(users));
}

function getCurrentUserEmail() {
  return localStorage.getItem('learnhub_current_user');
}

function saveCurrentUser(user) {
  if (!user || !user.email) return;
  const users = getUsers();
  users[user.email] = user;
  saveUsers(users);
}

function initializeUserProgress(user) {
  if (!user) return;
  if (!user.courseProgress) user.courseProgress = {};
  if (!user.completedCourses) user.completedCourses = [];
  if (user.coursesEnrolled === undefined) user.coursesEnrolled = user.enrolledCourses?.length ?? 0;
  if (user.completed === undefined) user.completed = 0;
  if (user.averageProgress === undefined) user.averageProgress = '0%';
}

function getCourseProgressIndex(courseName) {
  const user = getCurrentUser();
  if (!user || !user.courseProgress) return 0;
  return Number(user.courseProgress[courseName] ?? 0);
}

function setCourseProgress(courseName, watchedCount) {
  const user = getCurrentUser();
  if (!user) return;

  initializeUserProgress(user);
  const previous = Number(user.courseProgress[courseName] ?? 0);
  if (watchedCount <= previous) return;

  user.courseProgress[courseName] = watchedCount;
  updateUserAverageProgress(user);
  saveCurrentUser(user);
}

function updateUserAverageProgress(user) {
  if (!user) return;
  initializeUserProgress(user);
  if (typeof coursesData === 'undefined') {
    user.averageProgress = user.averageProgress || '0%';
    return;
  }

  const enrolled = user.enrolledCourses || [];
  let totalWatched = 0;
  let totalVideos = 0;

  enrolled.forEach(courseName => {
    const course = coursesData[courseName];
    if (!course) return;
    totalWatched += Math.min(Number(user.courseProgress[courseName] ?? 0), course.videos.length);
    totalVideos += course.videos.length;
  });

  const percentage = totalVideos > 0 ? Math.round((totalWatched / totalVideos) * 100) : 0;
  user.averageProgress = `${percentage}%`;
}

function incrementCompletedCount(courseName) {
  const user = getCurrentUser();
  if (!user) return;
  initializeUserProgress(user);

  if (courseName) {
    if (!user.completedCourses.includes(courseName)) {
      user.completedCourses.push(courseName);
      user.completed = (user.completed ?? 0) + 1;
      updateUserAverageProgress(user);
      saveCurrentUser(user);
    }
    return;
  }

  user.completed = (user.completed ?? 0) + 1;
  updateUserAverageProgress(user);
  saveCurrentUser(user);
}

function getCurrentUser() {
  const email = getCurrentUserEmail();
  if (!email) return null;
  const users = getUsers();
  return users[email] || null;
}

function redirectToLogin() {
  window.location.href = 'logs/login.html';
}

function logoutUser() {
  localStorage.removeItem('learnhub_current_user');
  window.location.href = 'logs/login.html';
}

function fillAccountData() {
  const user = getCurrentUser();
  const nameEl = document.getElementById('studentName');
  const emailEl = document.getElementById('studentEmail');
  const coursesEl = document.getElementById('coursesEnrolled');
  const completedEl = document.getElementById('completedCourses');
  const progressEl = document.getElementById('averageProgress');

  if (user) {
    initializeUserProgress(user);
    updateUserAverageProgress(user);
    saveCurrentUser(user);

    if (nameEl) nameEl.textContent = user.name || '-';
    if (emailEl) emailEl.textContent = user.email || '-';
    if (coursesEl) coursesEl.textContent = user.coursesEnrolled ?? '0';
    if (completedEl) completedEl.textContent = user.completed ?? '0';
    if (progressEl) progressEl.textContent = user.averageProgress || '0%';
  }
}

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

function enrollCourse(courseName) {
  const user = getCurrentUser();
  if (!user) {
    redirectToLogin();
    return;
  }

  // Initialize enrolledCourses array if it doesn't exist
  if (!user.enrolledCourses) {
    user.enrolledCourses = [];
  }

  // Add course if not already enrolled
  if (!user.enrolledCourses.includes(courseName)) {
    user.enrolledCourses.push(courseName);
    user.coursesEnrolled = user.enrolledCourses.length;
    
    // Save updated user
    const users = getUsers();
    users[user.email] = user;
    saveUsers(users);
  }

  // Store the selected course and redirect to course detail page
  localStorage.setItem('selectedCourse', courseName);
  window.location.href = 'course-detail.html';
}

function displayEnrolledCourses() {
  const user = getCurrentUser();
  const myCoursesDiv = document.getElementById('mycourses');

  if (!myCoursesDiv) return;

  if (user && user.enrolledCourses && user.enrolledCourses.length > 0) {
    let coursesList = '<h1>📖 | My Courses :</h1>';
    coursesList += '<ul style="font-size: 16px; margin-left: 20px;">';
    user.enrolledCourses.forEach(course => {
      coursesList += `<li style="margin: 10px 0; color: #4A5A6A;">${course}</li>`;
    });
    coursesList += '</ul>';
    myCoursesDiv.innerHTML = coursesList;
  } else {
    myCoursesDiv.innerHTML = '<h1>📖 | My Courses :</h1><p style="margin-left: 20px; color: #888;">No courses enrolled yet.</p>';
  }
}

window.addEventListener('DOMContentLoaded', () => {
  fillAccountData();
  updateNavButtons();
  displayEnrolledCourses();
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logoutUser);
  }
});