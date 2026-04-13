function getUsers() {
  const stored = localStorage.getItem('learnhub_users');
  return stored ? JSON.parse(stored) : {};
}

function saveUsers(users) {
  localStorage.setItem('learnhub_users', JSON.stringify(users));
}

function setCurrentUser(email) {
  localStorage.setItem('learnhub_current_user', email);
}

function getCurrentUserEmail() {
  return localStorage.getItem('learnhub_current_user');
}

function showMessage(elementId, message, type) {
  const messageEl = document.getElementById(elementId);
  if (!messageEl) return;
  messageEl.textContent = message;
  messageEl.className = `message ${type}`;
}

function initLoginPage() {
  const currentUser = getCurrentUserEmail();
  if (currentUser) {
    window.location.href = '../account.html';
    return;
  }

  const loginForm = document.getElementById('loginForm');
  if (!loginForm) return;

  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value.trim().toLowerCase();
    const password = document.getElementById('loginPassword').value;
    const users = getUsers();
    const user = users[email];

    if (!user) {
      showMessage('loginMessage', 'No account found. Please register first.', 'error');
      return;
    }

    if (user.password !== password) {
      showMessage('loginMessage', 'Incorrect password. Try again.', 'error');
      return;
    }

    setCurrentUser(email);
    window.location.href = '../account.html';
  });

  const toggle = document.getElementById('toggleLoginPassword');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const passwordInput = document.getElementById('loginPassword');
      if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggle.textContent = '🙈';
      } else {
        passwordInput.type = 'password';
        toggle.textContent = '👁';
      }
    });
  }
}

function initRegisterPage() {
  const registerForm = document.getElementById('registerForm');
  if (!registerForm) return;

  registerForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.getElementById('fullName').value.trim();
    const email = document.getElementById('registerEmail').value.trim().toLowerCase();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const users = getUsers();

    if (!name || !email || !password || !confirmPassword) {
      showMessage('registerMessage', 'Please fill in all fields.', 'error');
      return;
    }

    if (password.length < 6) {
      showMessage('registerMessage', 'Password must be at least 6 characters.', 'error');
      return;
    }

    if (password !== confirmPassword) {
      showMessage('registerMessage', 'Passwords do not match.', 'error');
      return;
    }

    if (users[email]) {
      showMessage('registerMessage', 'Account already exists. Please log in.', 'error');
      return;
    }

    users[email] = {
      name,
      email,
      password,
      coursesEnrolled: 0,
      completed: 0,
      averageProgress: '0%',
      courseProgress: {},
      completedCourses: []
    };

    saveUsers(users);
    showMessage('registerMessage', 'Account created successfully. Redirecting to login...', 'success');

    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1200);
  });

  const toggle1 = document.getElementById('togglePassword1');
  const toggle2 = document.getElementById('togglePassword2');

  if (toggle1) {
    toggle1.addEventListener('click', () => {
      const input = document.getElementById('registerPassword');
      if (input.type === 'password') {
        input.type = 'text';
        toggle1.textContent = '🙈';
      } else {
        input.type = 'password';
        toggle1.textContent = '👁';
      }
    });
  }

  if (toggle2) {
    toggle2.addEventListener('click', () => {
      const input = document.getElementById('confirmPassword');
      if (input.type === 'password') {
        input.type = 'text';
        toggle2.textContent = '🙈';
      } else {
        input.type = 'password';
        toggle2.textContent = '👁';
      }
    });
  }
}

window.addEventListener('DOMContentLoaded', () => {
  initLoginPage();
  initRegisterPage();
});