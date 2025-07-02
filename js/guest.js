document.addEventListener('DOMContentLoaded', () => {
  // ✅ Use deployed Render API URL
  const API_URL = 'https://ssb-lecturette-app.onrender.com/';

  if (document.getElementById('topic-list')) {
    initGuestIndex();
  } else if (document.getElementById('lecturette-title')) {
    initLecturetteView();
  }

  // 🔁 Fetch all lecturettes
  async function fetchAllLecturettes() {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch lecturettes:', error);
      return []; // Return empty array on error
    }
  }

  // 📚 Show topic list
  async function initGuestIndex() {
    const topicList = document.getElementById('topic-list');
    const searchBar = document.getElementById('search-bar');
    const allLecturettes = await fetchAllLecturettes();

    function displayTopics(topics) {
      topicList.innerHTML = '';
      if (topics.length === 0) {
        topicList.innerHTML = '<p>No lecturette topics available yet.</p>';
        return;
      }

      topics.forEach((lecturette) => {
        const div = document.createElement('div');
        div.className = 'topic-card';
        div.innerHTML = `
          <h3>${lecturette.topicName}</h3>
          <button class="view-btn">View</button>
        `;

        div.querySelector('.view-btn').addEventListener('click', () => {
          localStorage.setItem('selectedLecturette', JSON.stringify(lecturette));
          window.location.href = 'lecturette-view.html';
        });

        topicList.appendChild(div);
      });
    }

    // 🔍 Search functionality
    searchBar.addEventListener('input', () => {
      const query = searchBar.value.toLowerCase();
      const filtered = allLecturettes.filter((l) =>
        l.topicName.toLowerCase().includes(query)
      );
      displayTopics(filtered);
    });

    displayTopics(allLecturettes);
  }

  // 📖 Lecturette detail page
  function initLecturetteView() {
    const lecturette = JSON.parse(localStorage.getItem('selectedLecturette'));
    if (!lecturette) {
      window.location.href = 'guest-index.html';
      return;
    }

    document.getElementById('lecturette-title').textContent = lecturette.topicName;
    document.getElementById('lecturette-content').textContent = lecturette.topicContent;

    const speakerBtn = document.getElementById('speak-btn');
    const synth = window.speechSynthesis;

    speakerBtn.addEventListener('click', () => {
      const utterance = new SpeechSynthesisUtterance(lecturette.topicContent);
      utterance.lang = 'en-IN'; // Indian English
      synth.cancel(); // Stop previous
      synth.speak(utterance);
    });
  }
});
