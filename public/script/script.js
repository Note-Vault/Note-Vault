console.log("Public script file");
function openUpdateModal(noteId) {
	// Find the modal element by its ID
	if (noteId === "add-note-modal") {
		const modal = document.getElementById(noteId);
		modal.style.display = "block";
	} else {
		const modal = document.getElementById(`updateModal${noteId}`);
		// Open the modal
		modal.style.display = "block";
	}
}

function closeUpdateModal(noteId) {
	// Find the modal element by its ID
	if (noteId === "add-note-modal") {
		const modal = document.getElementById(noteId);
		// Close the modal
		modal.style.display = "none";
	} else {
		const modal = document.getElementById(`updateModal${noteId}`);
		// Close the modal
		modal.style.display = "none";
	}
}

const toggleSwitch = document.getElementById("modeToggle");

// Function to set the theme mode
function setThemeMode(mode) {
	document.body.setAttribute("data-theme", mode);
	localStorage.setItem("themeMode", mode); // Save the theme mode to localStorage
}

// Function to toggle the theme mode
function toggleThemeMode() {
	if (toggleSwitch.checked) {
		setThemeMode("dark");
	} else {
		setThemeMode("light");
	}
}

// Event listener for the toggle switch change
toggleSwitch.addEventListener("change", toggleThemeMode);

// Function to load the theme mode from localStorage
function loadThemeMode() {
	const savedMode = localStorage.getItem("themeMode");
	if (savedMode) {
		setThemeMode(savedMode);
		// Update the toggle switch state based on the saved mode
		toggleSwitch.checked = savedMode === "dark";
	}
}

// Call loadThemeMode when the page loads
window.addEventListener("load", loadThemeMode);

let scrollUp = document.querySelector(".scroll-to-top");

window.addEventListener("scroll", () => {
	if (window.scrollY > 100) {
		scrollUp.classList.remove("invisible");
	} else {
		scrollUp.classList.add("invisible");
	}
});
