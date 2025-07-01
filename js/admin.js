document.addEventListener('DOMContentLoaded', () => {
    // Security check
    if (sessionStorage.getItem('isAdminLoggedIn') !== 'true') {
        window.location.href = 'admin-login.html';
        return;
    }

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
    
    // --- Form Inputs ---
    const topicNameInput = document.getElementById('topicName');
    const topicContentInput = document.getElementById('topicContent');
    const editLecturetteId = document.getElementById('edit-lecturette-id');

    // --- State Management ---
    const showListView = () => {
        lecturetteListView.style.display = 'block';
        lecturetteFormView.style.display = 'none';
        renderLecturettes();
    };

    const showFormView = (mode = 'add', index = null) => {
        lecturetteListView.style.display = 'none';
        lecturetteFormView.style.display = 'block';
        addLecturetteForm.reset();
        successMessage.textContent = '';
        
        if (mode === 'edit') {
            const lecturettes = getLecturettes();
            const lecturette = lecturettes[index];
            
            formTitle.innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Edit Lecturette';
            topicNameInput.value = lecturette.topic;
            topicContentInput.value = lecturette.content;
            editLecturetteId.value = index;
            addLecturetteForm.querySelector('button[type="submit"]').textContent = 'Update Lecturette';
        } else {
            formTitle.innerHTML = '<i class="fa-solid fa-plus-circle"></i> Add a New Lecturette';
            editLecturetteId.value = '';
            addLecturetteForm.querySelector('button[type="submit"]').textContent = 'Save Lecturette';
        }
    };

    // --- Data Functions ---
    const getLecturettes = () => JSON.parse(localStorage.getItem('lecturettes')) || [];

    const saveLecturettes = (lecturettes) => {
        localStorage.setItem('lecturettes', JSON.stringify(lecturettes));
    };

    const renderLecturettes = () => {
        lecturetteListAdmin.innerHTML = '';
        const lecturettes = getLecturettes();

        if (lecturettes.length === 0) {
            lecturetteListAdmin.innerHTML = '<p class="empty-list-msg">No lecturettes found. Add one to get started!</p>';
            return;
        }

        lecturettes.forEach((lecturette, index) => {
            const item = document.createElement('div');
            item.className = 'lecturette-admin-item';
            item.innerHTML = `
                <span class="topic-title">${lecturette.topic}</span>
                <div class="item-actions">
                    <button class="edit-btn" data-index="${index}"><i class="fa-solid fa-pen"></i> Edit</button>
                    <button class="delete-btn" data-index="${index}"><i class="fa-solid fa-trash"></i> Delete</button>
                </div>
            `;
            lecturetteListAdmin.appendChild(item);
        });
    };
    
    // --- Event Listeners ---
    logoutBtn.addEventListener('click', () => {
        sessionStorage.removeItem('isAdminLoggedIn');
        window.location.href = 'index.html';
    });

    showAddFormBtn.addEventListener('click', () => showFormView('add'));
    cancelBtn.addEventListener('click', showListView);

    lecturetteListAdmin.addEventListener('click', (e) => {
        const index = e.target.closest('button')?.dataset.index;
        if (index === undefined) return;

        if (e.target.closest('.edit-btn')) {
            showFormView('edit', index);
        } else if (e.target.closest('.delete-btn')) {
            if (confirm('Are you sure you want to delete this lecturette?')) {
                const lecturettes = getLecturettes();
                lecturettes.splice(index, 1);
                saveLecturettes(lecturettes);
                renderLecturettes();
            }
        }
    });

    addLecturetteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const lecturettes = getLecturettes();
        const lecturetteData = {
            topic: topicNameInput.value,
            content: topicContentInput.value
        };

        if (editLecturetteId.value !== '') {
            // Edit mode
            lecturettes[editLecturetteId.value] = lecturetteData;
        } else {
            // Add mode
            lecturettes.push(lecturetteData);
        }
        
        saveLecturettes(lecturettes);
        successMessage.textContent = 'Lecturette saved successfully!';
        
        setTimeout(() => {
            showListView();
        }, 1500);
    });

    // --- Initial Load ---
    showListView();
});