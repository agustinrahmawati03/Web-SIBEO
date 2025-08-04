// Mobile menu toggle
const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");

menuBtn.addEventListener("click", () => {
  navMenu.classList.toggle("show");
});

// Typing animation
const textElements = [
  "Outcome Based Education"
];

const typingText = document.getElementById("typingText");
let currentTextIndex = 0;
let currentCharIndex = 0;
let isDeleting = false;
let typingSpeed = 150;

function type() {
  const currentText = textElements[currentTextIndex];

  if (isDeleting) {
    typingText.textContent = currentText.substring(0, currentCharIndex - 1);
    currentCharIndex--;
    typingSpeed = 100;

    if (currentCharIndex === 0) {
      isDeleting = false;
      currentTextIndex = (currentTextIndex + 1) % textElements.length;
      typingSpeed = 1000;
    }
  } else {
    typingText.textContent = currentText.substring(0, currentCharIndex + 1);
    currentCharIndex++;
    typingSpeed = 150;

    if (currentCharIndex === currentText.length) {
      isDeleting = true;
      typingSpeed = 1000;
    }
  }

  setTimeout(type, typingSpeed);
}

// Start typing animation
setTimeout(type, 1000);

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    });

    // Close mobile menu if open
    if (navMenu.classList.contains("show")) {
      navMenu.classList.remove("show");
    }
  });
});
