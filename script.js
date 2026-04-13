// Zmiana stylu strony po kliknięciu przycisku
const themeBtn = document.getElementById('themeBtn');
const themeStylesheet = document.getElementById('ThemeStylesheet');

let isRed = false;

themeBtn.addEventListener('click', () => {
	if (isRed) {
		themeStylesheet.href = 'green.css';
		isRed = false;
	} else {
		themeStylesheet.href = 'red.css';
		isRed = true;
	}
});

// Ukrywanie / pokazywanie sekcji z projektami
const toggleProjectsBtn = document.getElementById('toggleProjectsBtn');
const projectsSection = document.getElementById('projectsSection');

toggleProjectsBtn.addEventListener('click', () => {
	if (projectsSection.style.display === 'none') {
		projectsSection.style.display = 'block';
		toggleProjectsBtn.textContent = 'Ukryj projekty';
	} else {
		projectsSection.style.display = 'none';
		toggleProjectsBtn.textContent = 'Pokaż projekty';
	}
});
