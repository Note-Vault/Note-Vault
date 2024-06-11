console.log("Public script file");
const navlinks = document.querySelector("#links-nav");
document.querySelector(".menu").addEventListener("click", () => {
	navlinks.classList.toggle("show");
});

document.querySelector(".x").addEventListener("click", () => {
	navlinks.classList.toggle("show");
});

function openUpdateModal(noteId) {
	// Find the modal container element by its ID
	let modalContainer;
	if (noteId === "add-note-modal") {
		modalContainer = document.getElementById(noteId);
	} else {
		modalContainer = document.getElementById(`updateModal${noteId}`);
	}

	// Show the modal container
	modalContainer.style.display = "block";

	// Show the overlay
	const overlay = document.getElementById("overlay");
	overlay.classList.remove("hidden");
}

function closeUpdateModal(noteId) {
	// Find the modal element by its ID

	if (noteId === "add-note-modal") {
		const modal = document.getElementById(noteId);
		// Close the modal
		modal.style.display = "none";
	} else if (noteId.includes("update")) {
		const modal = document.getElementById(noteId);
		// Close the modal
		modal.style.display = "none";
	} else if (noteId.includes("delete")) {
		const modal = document.getElementById(noteId);
		// Close the modal
		modal.style.display = "none";
	}
}
function closeUpdateModal(noteId) {
	// Find the modal container element by its ID
	let modalContainer;
	if (noteId === "add-note-modal") {
		modalContainer = document.getElementById(noteId);
	} else {
		modalContainer = document.getElementById(`updateModal${noteId}`);
	}

	// Check if the modal container is visible
	if (modalContainer.style.display !== "block") {
		return; // If it's not visible, do nothing and exit the function
	}

	// Close the modal container
	modalContainer.style.display = "none";

	// Hide the overlay
	const overlay = document.getElementById("overlay");
	overlay.classList.add("hidden");
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
