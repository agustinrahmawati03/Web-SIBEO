document.addEventListener("DOMContentLoaded", function () {
  const pdfjsLib = window["pdfjs-dist/build/pdf"];
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";

  let pdfDoc = null,
    pageNum = 1,
    pageRendering = false,
    pageNumPending = null,
    scale = 1.0,
    canvas = document.getElementById("pdf-canvas"),
    ctx = canvas.getContext("2d");

  // Load the default PDF file
  const pdfPath = "CPL Prodi.CPLMK.pdf";

  // Render the page
  function renderPage(num) {
    pageRendering = true;

    // Using promise to fetch the page
    pdfDoc.getPage(num).then(function (page) {
      const viewport = page.getViewport({ scale: scale });
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      // Render PDF page into canvas context
      const renderContext = {
        canvasContext: ctx,
        viewport: viewport,
      };

      const renderTask = page.render(renderContext);

      // Wait for rendering to finish
      renderTask.promise.then(function () {
        pageRendering = false;
        if (pageNumPending !== null) {
          // New page rendering is pending
          renderPage(pageNumPending);
          pageNumPending = null;
        }
      });
    });

    // Update page counters
    document.getElementById("page-count").textContent =
      "Page " + num + " of " + pdfDoc.numPages;
  }

  // Go to previous page
  function onPrevPage() {
    if (pageNum <= 1) {
      return;
    }
    pageNum--;
    queueRenderPage(pageNum);
  }
  document.getElementById("prev-page").addEventListener("click", onPrevPage);

  // Go to next page
  function onNextPage() {
    if (pageNum >= pdfDoc.numPages) {
      return;
    }
    pageNum++;
    queueRenderPage(pageNum);
  }
  document.getElementById("next-page").addEventListener("click", onNextPage);

  // Zoom in
  function zoomIn() {
    scale += 0.25;
    queueRenderPage(pageNum);
  }
  document.getElementById("zoom-in").addEventListener("click", zoomIn);

  // Zoom out
  function zoomOut() {
    if (scale <= 0.25) {
      return;
    }
    scale -= 0.25;
    queueRenderPage(pageNum);
  }
  document.getElementById("zoom-out").addEventListener("click", zoomOut);

  // Queue page rendering
  function queueRenderPage(num) {
    if (pageRendering) {
      pageNumPending = num;
    } else {
      renderPage(num);
    }
  }

  // Load the PDF
  pdfjsLib
    .getDocument(pdfPath)
    .promise.then(function (pdfDoc_) {
      pdfDoc = pdfDoc_;
      renderPage(pageNum);
    })
    .catch(function (error) {
      // Display error message
      const errorDiv = document.createElement("div");
      errorDiv.className =
        "text-red-500 p-4 border border-red-200 rounded bg-red-50";
      errorDiv.textContent = "Error loading PDF: " + error.message;
      document.getElementById("pdf-viewer").innerHTML = "";
      document.getElementById("pdf-viewer").appendChild(errorDiv);
    });
});

// Mobile menu toggle
const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");

menuBtn.addEventListener("click", () => {
  navMenu.classList.toggle("show");
});

// Typing animation
const textElements = [
  "Professional Growth",
  "Academic Excellence",
  "Skill Development",
  "Personal Enrichment",
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
