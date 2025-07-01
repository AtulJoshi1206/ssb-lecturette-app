document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('topic-list')) {
        initGuestIndex();
    } else if (document.getElementById('lecturette-title')) {
        initLecturetteView();
    }
});

function getLecturettes() {
    return JSON.parse(localStorage.getItem('lecturettes')) || [];
}

function initGuestIndex() {
    // This function remains the same, no changes needed here.
    const topicList = document.getElementById('topic-list');
    const searchBar = document.getElementById('search-bar');
    const lecturettes = getLecturettes();

    function displayTopics(topics) {
        topicList.innerHTML = '';
        if (topics.length === 0) {
            topicList.innerHTML = '<p>No lecturette topics available yet.</p>';
            return;
        }
        topics.forEach((lecturette, index) => {
            const topicLink = document.createElement('a');
            topicLink.href = `lecturette-view.html?topic=${index}`;
            topicLink.className = 'topic-item';
            topicLink.textContent = lecturette.topic;
            topicList.appendChild(topicLink);
        });
    }

    displayTopics(lecturettes);
    searchBar.addEventListener('keyup', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredTopics = lecturettes.filter(l => l.topic.toLowerCase().includes(searchTerm));
        displayTopics(filteredTopics);
    });
}

function initLecturetteView() {
    const titleEl = document.getElementById('lecturette-title');
    const textEl = document.getElementById('lecturette-text');
    const ttsButton = document.getElementById('tts-button');

    const urlParams = new URLSearchParams(window.location.search);
    const topicIndex = parseInt(urlParams.get('topic'));
    const lecturettes = getLecturettes();
    const lecturette = lecturettes[topicIndex];

    if (lecturette) {
        titleEl.textContent = lecturette.topic;
        textEl.textContent = lecturette.content;
    } else {
        titleEl.textContent = 'Topic Not Found';
        textEl.textContent = 'The requested lecturette could not be found.';
    }

    // TTS logic remains the same
    ttsButton.addEventListener('click', () => {
        const synth = window.speechSynthesis;
        const textToSpeak = `${lecturette.topic}. ${lecturette.content}`;
        if (synth.speaking) {
            synth.cancel();
            ttsButton.classList.remove('speaking');
            return;
        }
        if (textToSpeak.trim() !== '') {
            const utterance = new SpeechSynthesisUtterance(textToSpeak);
            utterance.onstart = () => ttsButton.classList.add('speaking');
            utterance.onend = () => ttsButton.classList.remove('speaking');
            utterance.onerror = () => ttsButton.classList.remove('speaking');
            synth.speak(utterance);
        }
    });
    window.addEventListener('beforeunload', () => window.speechSynthesis.cancel());
}