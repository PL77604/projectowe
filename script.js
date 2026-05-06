// zmiana motywu kolorystycznego
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

// ukrywanie i pokazywanie sekcji z projektami
const toggleProjectsBtn = document.getElementById('toggleProjectsBtn');
const projectsSection = document.getElementById('projectsSection');

if (toggleProjectsBtn && projectsSection) {
	toggleProjectsBtn.addEventListener('click', () => {
		if (projectsSection.style.display === 'none') {
			projectsSection.style.display = 'block';
			toggleProjectsBtn.textContent = 'Ukryj projekty';
		} else {
			projectsSection.style.display = 'none';
			toggleProjectsBtn.textContent = 'Pokaż projekty';
		}
	});
}

// funkcje pomocnicze do walidacji formularza
function containsDigits(str) {
	return /\d/.test(str);
}

function isValidEmail(email) {
	const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
	return emailRegex.test(email);
}

function clearErrors() {
	const errorSpans = document.querySelectorAll('.error');
	errorSpans.forEach(span => span.textContent = '');

	const inputs = document.querySelectorAll('#contactForm input, #contactForm textarea');
	inputs.forEach(input => input.classList.remove('error-border'));
}

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

function validateForm(event) {
	event.preventDefault();
	clearErrors();

	let isValid = true;

	const name = document.getElementById('name').value.trim();
	if (name === '') {
		showError('name', 'Pole "Imię" jest wymagane');
		isValid = false;
	} else if (containsDigits(name)) {
		showError('name', 'Imię nie może zawierać cyfr');
		isValid = false;
	}

	const surname = document.getElementById('surname').value.trim();
	if (surname === '') {
		showError('surname', 'Pole "Nazwisko" jest wymagane');
		isValid = false;
	} else if (containsDigits(surname)) {
		showError('surname', 'Nazwisko nie może zawierać cyfr');
		isValid = false;
	}

	const email = document.getElementById('email').value.trim();
	if (email === '') {
		showError('email', 'Pole "E-mail" jest wymagane');
		isValid = false;
	} else if (!isValidEmail(email)) {
		showError('email', 'Wprowadź poprawny adres e-mail (np. jan@kowalski.pl)');
		isValid = false;
	}

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

// ładowanie danych z pliku JSON 
async function loadData() {
	try {
		const response = await fetch('data.json');

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();

		const skillsList = document.getElementById('skills-list');
		if (skillsList) {
			skillsList.innerHTML = data.skills.map(skill => `<li>${skill}</li>`).join('');
		}

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

// LocalStorage
const todoInput = document.getElementById('todoInput');
const addTodoBtn = document.getElementById('addTodoBtn');
const todoList = document.getElementById('todoList');

const STORAGE_KEY = 'my_todos';

function loadTodos() {
	const stored = localStorage.getItem(STORAGE_KEY);
	if (stored) {
		return JSON.parse(stored);
	}
	return [];
}

function saveTodos(todos) {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function escapeHtml(text) {
	const div = document.createElement('div');
	div.textContent = text;
	return div.innerHTML;
}

function renderTodos() {
	const todos = loadTodos();

	if (todos.length === 0) {
		todoList.innerHTML = '<li>Brak zadań. Dodaj pierwsze zadanie!</li>';
		return;
	}

	todoList.innerHTML = todos.map((todo, index) => `
        <li>
            <span>${escapeHtml(todo)}</span>
            <button class="delete-todo-btn" data-index="${index}" >Usuń</button>
        </li>
    `).join('');

	document.querySelectorAll('.delete-todo-btn').forEach(btn => {
		btn.addEventListener('click', (e) => {
			const index = parseInt(btn.getAttribute('data-index'));
			deleteTodo(index);
		});
	});
}

function addTodo() {
	const newTodo = todoInput.value.trim();

	if (newTodo === '') {
		alert('Proszę wpisać treść zadania!');
		return;
	}

	const todos = loadTodos();
	todos.push(newTodo);
	saveTodos(todos);

	todoInput.value = '';
	renderTodos();
	console.log('Dodano zadanie:', newTodo);
}

function deleteTodo(index) {
	const todos = loadTodos();
	const deleted = todos.splice(index, 1);
	saveTodos(todos);
	renderTodos();
	console.log(' Usunięto zadanie:', deleted[0]);
}

if (addTodoBtn) {
	addTodoBtn.addEventListener('click', addTodo);
}

if (todoInput) {
	todoInput.addEventListener('keypress', (e) => {
		if (e.key === 'Enter') {
			addTodo();
		}
	});
}

document.addEventListener('DOMContentLoaded', () => {
	loadData();
	renderTodos();
});