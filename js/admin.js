document.addEventListener('DOMContentLoaded', () => {
  // 🔐 Security check
  if (sessionStorage.getItem('isAdminLoggedIn') !== 'true') {
    window.location.href = 'admin-login.html';
    return;
  }

  // 🌐 Correct API URL for deployed backend
  const API_URL = 'https://ssb-lecturette-app.onrender.com/api/lecturettes';

  // --- DOM Elements ---
  const logoutBtn = document.getElementById('logout-btn');
  const lecturetteListView = document.getElementById('lecturette-list-view');
  const lecturetteFormView = document.getElementById('lecturette-form-view');
  const showAddFormBtn = document.getElementById('show-add-form-btn');
  const lecturetteListAdmin = document.getElementById('lecturette-list-admin');
  const addLecturetteForm = document.getElementById('add-lecturette-form');
  const formTitle = document.getElementById('form-title');
  const cancelBtn = document.getElementById('cancel-btn');
  const successMessage = document.getElementById('success-message');
  const topicNameInput = document.getElementById('topicName');
  const topicContentInput = document.getElementById('topicContent');
  const editLecturetteId = document.getElementById('edit-lecturette-id');

  // --- State Management ---
  const showListView = () => {
    lecturetteListView.style.display = 'block';
    lecturetteFormView.style.display = 'none';
    renderLecturettes();
  };

  const showFormView = async (mode = 'add', lecturetteId = null) => {
    lecturetteListView.style.display = 'none';
    lecturetteFormView.style.display = 'block';

    if (mode === 'add') {
      formTitle.textContent = 'Add New Lecturette';
      topicNameInput.value = '';
      topicContentInput.value = '';
      editLecturetteId.value = '';
    } else if (mode === 'edit' && lecturetteId) {
      formTitle.textContent = 'Edit Lecturette';
      const res = await fetch(`${API_URL}/${lecturetteId}`);
      const lecturette = await res.json();
      topicNameInput.value = lecturette.topicName;
      topicContentInput.value = lecturette.topicContent;
      editLecturetteId.value = lecturette._id;
    }
  };

  const renderLecturettes = async () => {
    const res = await fetch(API_URL);
    const lecturettes = await res.json();

    lecturetteListAdmin.innerHTML = '';
    lecturettes.forEach((item) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <strong>${item.topicName}</strong>
        <button onclick="editLecturette('${item._id}')">✏️</button>
        <button onclick="deleteLecturette('${item._id}')">🗑️</button>
      `;
      lecturetteListAdmin.appendChild(li);
    });
  };

  window.editLecturette = (id) => {
    showFormView('edit', id);
  };

  window.deleteLecturette = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    renderLecturettes();
  };

  // --- Event Listeners ---
  logoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem('isAdminLoggedIn');
    window.location.href = 'admin-login.html';
  });

  showAddFormBtn.addEventListener('click', () => {
    showFormView('add');
  });

  cancelBtn.addEventListener('click', () => {
    showListView();
  });

  addLecturetteForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
      topicName: topicNameInput.value.trim(),
      topicContent: topicContentInput.value.trim(),
    };

    const id = editLecturetteId.value;
    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/${id}` : API_URL;

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      successMessage.textContent = id ? 'Lecturette updated!' : 'Lecturette added!';
      addLecturetteForm.reset();
      setTimeout(() => {
        successMessage.textContent = '';
        showListView();
      }, 1200);
    } else {
      alert('❌ Something went wrong!');
    }
  });

  // --- Initialize ---
  showListView();
});
