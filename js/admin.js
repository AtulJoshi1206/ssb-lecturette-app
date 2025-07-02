document.addEventListener('DOMContentLoaded', () => {
  // 🔐 Security check
  if (sessionStorage.getItem('isAdminLoggedIn') !== 'true') {
    window.location.href = 'admin-login.html';
    return;
  }

  // 🌐 Use your deployed backend API URL
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

  // --- Show list view ---
  const showListView = () => {
    lecturetteListView.style.display = 'block';
    lecturetteFormView.style.display = 'none';
    renderLecturettes();
  };

  // --- Show form view for add/edit ---
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
      try {
        const res = await fetch(`${API_URL}/${lecturetteId}`);
        const lecturette = await res.json();
        topicNameInput.value = lecturette.topicName;
        topicContentInput.value = lecturette.topicContent;
        editLecturetteId.value = lecturette._id;
      } catch (err) {
        alert('❌ Failed to load lecturette for editing.');
      }
    }
  };

  // --- Render all lecturettes in list ---
  const renderLecturettes = async () => {
    try {
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
    } catch (err) {
      lecturetteListAdmin.innerHTML = '<p>❌ Failed to load topics.</p>';
      console.error('Fetch error:', err);
    }
  };

  // --- Window functions ---
  window.editLecturette = (id) => {
    showFormView('edit', id);
  };

  window.deleteLecturette = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      renderLecturettes();
    } catch (err) {
      alert('❌ Failed to delete lecturette.');
    }
  };

  // --- Event listeners ---
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

    try {
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
        const errorText = await res.text();
        console.error('❌ Server Error:', errorText);
        alert(`❌ Error from server:\n${errorText}`);
      }
    } catch (err) {
      console.error('❌ Fetch error:', err);
      alert('❌ Failed to send request to server.');
    }
  });

  // --- Initialize the page ---
  showListView();
});
