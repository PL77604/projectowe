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


// Funkcja sprawdzająca, czy tekst zawiera cyfry
function containsDigits(str) {
	return /\d/.test(str);
}

// Funkcja sprawdzająca poprawność adresu email
function isValidEmail(email) {
	const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
	return emailRegex.test(email);
}

// Funkcja czyszcząca błędy
function clearErrors() {
	const errorSpans = document.querySelectorAll('.error');
	errorSpans.forEach(span => span.textContent = '');

	const inputs = document.querySelectorAll('#contactForm input, #contactForm textarea');
	inputs.forEach(input => input.classList.remove('error-border'));
}

// Funkcja wyświetlająca błąd dla konkretnego pola
function showError(fieldId, message) {
	const errorSpan = document.getElementById(fieldId + 'Error');
	if (errorSpan) {
		errorSpan.textContent = message;
	}
	const field = document.getElementById(fieldId);
	if (field) {
		field.classList.add('error-border');
	}
}

// Walidacja całego formularza
function validateForm(event) {
	event.preventDefault();
	clearErrors();

	let isValid = true;

	// 1. Walidacja pola Imię 
	const name = document.getElementById('name').value.trim();
	if (name === '') {
		showError('name', 'Pole "Imię" jest wymagane');
		isValid = false;
	} else if (containsDigits(name)) {
		showError('name', 'Imię nie może zawierać cyfr');
		isValid = false;
	}

	// 2. Walidacja pola Nazwisko 
	const surname = document.getElementById('surname').value.trim();
	if (surname === '') {
		showError('surname', 'Pole "Nazwisko" jest wymagane');
		isValid = false;
	} else if (containsDigits(surname)) {
		showError('surname', 'Nazwisko nie może zawierać cyfr');
		isValid = false;
	}

	// 3. Walidacja pola Email 
	const email = document.getElementById('email').value.trim();
	if (email === '') {
		showError('email', 'Pole "E-mail" jest wymagane');
		isValid = false;
	} else if (!isValidEmail(email)) {
		showError('email', 'Wprowadź poprawny adres e-mail (np. jan@kowalski.pl)');
		isValid = false;
	}

	// 4. Walidacja pola Wiadomość (wymagane)
	const message = document.getElementById('message').value.trim();
	if (message === '') {
		showError('message', 'Pole "Wiadomość" jest wymagane');
		isValid = false;
	}

	if (isValid) {
		alert('Formularz został poprawnie wypełniony!');
		document.getElementById('contactForm').reset();
	}

	return isValid;
}

// Dodajemy nasłuchiwanie na submit formularza
const contactForm = document.getElementById('contactForm');
if (contactForm) {
	contactForm.addEventListener('submit', validateForm);

	const resetBtn = contactForm.querySelector('button[type="reset"]');
	if (resetBtn) {
		resetBtn.addEventListener('click', function () {
			setTimeout(clearErrors, 10);
		});
	}
}

// Funkcja do pobierania danych z JSON i generowania HTML
async function loadData() {
	try {
		const response = await fetch('data.json');

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();

		// Generowanie listy umiejętności
		const skillsList = document.getElementById('skills-list');
		if (skillsList) {
			skillsList.innerHTML = data.skills.map(skill => `<li>${skill}</li>`).join('');
		}

		// Generowanie listy projektów
		const projectsList = document.getElementById('projects-list');
		if (projectsList) {
			projectsList.innerHTML = data.projects.map(project =>
				`<li>${project.name} - ${project.description}</li>`
			).join('');
		}

	} catch (error) {
		console.error('Błąd ładowania danych:', error);

	}
}


// Uruchom ładowanie danych po załadowaniu strony
document.addEventListener('DOMContentLoaded', loadData);