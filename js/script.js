//CHANGE NAVBAR STYLES ON SCROLL

window.addEventListener("scroll", () => {
  document
    .querySelector("nav")
    .classList.toggle("window-scroll", window.scrollY > 0);
});

//SHOW OR HIDE FAQS

const faqs = document.querySelectorAll(".faq");

faqs.forEach((faq) => {
  faq.addEventListener("click", () => {
    faq.classList.toggle("open");

    //change icon

    const icon = faq.querySelector(".faq__icon i");

    if (icon.className === "fa-solid fa-plus") {
      icon.className = "fa-solid fa-minus";
    } else {
      icon.className = "fa-solid fa-plus";
    }
  });
});

const menu = document.querySelector(".nav__menu");
const menuBtn = document.querySelector("#open-menu-button");
const closeBtn = document.querySelector("#close-menu-button");

// Function to handle window resize
const handleResize = () => {
  if (window.innerWidth >= 1024) {
    menu.style.display = "flex";
    menuBtn.style.display = "none";
    closeBtn.style.display = "none";
  } else {
    menu.style.display = "none";
    menuBtn.style.display = "inline-block";
  }
};

// Initial check when the script runs
handleResize();

// Event listener for window resize
window.addEventListener("resize", handleResize);

menuBtn.addEventListener("click", () => {
  menu.style.display = "flex";
  closeBtn.style.display = "inline-block";
  menuBtn.style.display = "none";
});

closeBtn.addEventListener("click", () => {
  menu.style.display = "none";
  closeBtn.style.display = "none";
  menuBtn.style.display = "inline-block";
});

//=========================KLSI PART==============================================

document.addEventListener("DOMContentLoaded", () => {
  // Load previously saved data
  loadSelections();

  const calculateBtn = document.getElementById("calculate");
  const clearBtn = document.getElementById("clear");

  calculateBtn.addEventListener("click", () => {
    const allAnswered = checkAllAnswered();

    if (allAnswered) {
      const totalAE = calculateTotal("AE");
      const totalRO = calculateTotal("RO");
      const totalAC = calculateTotal("AC");
      const totalCE = calculateTotal("CE");

      // Display results
      document.getElementById("totalAE").textContent = totalAE;
      document.getElementById("totalRO").textContent = totalRO;
      document.getElementById("totalAC").textContent = totalAC;
      document.getElementById("totalCE").textContent = totalCE;

      // Determine learning style
      const learningStyle = determineLearningStyle(
        totalAE,
        totalRO,
        totalAC,
        totalCE
      );
      document.getElementById("style-result").textContent = learningStyle;

      // Save selections to localStorage
      saveSelections();
    } else {
      alert("Sila jawab semua soalan sebelum mengira!");
    }
  });

  clearBtn.addEventListener("click", () => {
    const radios = document.querySelectorAll('input[type="radio"]');
    radios.forEach((radio) => {
      radio.checked = false;
    });

    document.getElementById("totalAE").textContent = "0";
    document.getElementById("totalRO").textContent = "0";
    document.getElementById("totalAC").textContent = "0";
    document.getElementById("totalCE").textContent = "0";
    document.getElementById("style-result").textContent =
      "Sila kira skor anda untuk mengetahui jenis gaya pembelajaran anda.";

    // Clear saved data from localStorage
    localStorage.clear();
  });

  // Function to calculate the total score for a given value
  function calculateTotal(value) {
    const radios = document.querySelectorAll(
      `input[type="radio"][value="${value}"]:checked`
    );
    return radios.length;
  }

  // Function to save selections to localStorage
  function saveSelections() {
    const radios = document.querySelectorAll('input[type="radio"]');
    const selections = {};

    radios.forEach((radio) => {
      if (radio.checked) {
        selections[radio.name] = radio.value;
      }
    });

    localStorage.setItem("selections", JSON.stringify(selections));
  }

  // Function to load saved selections from localStorage
  function loadSelections() {
    const selections = JSON.parse(localStorage.getItem("selections")) || {};

    for (const [name, value] of Object.entries(selections)) {
      const radio = document.querySelector(
        `input[name="${name}"][value="${value}"]`
      );
      if (radio) {
        radio.checked = true;
      }
    }
  }

  // Function to check if all questions are answered
  function checkAllAnswered() {
    let allAnswered = true;
    const questions = document.querySelectorAll("table");

    questions.forEach((table) => {
      const rows = table.querySelectorAll("tbody tr");

      rows.forEach((row) => {
        const radioButtons = row.querySelectorAll('input[type="radio"]');
        const isAnswered = Array.from(radioButtons).some(
          (radio) => radio.checked
        );

        if (!isAnswered) {
          allAnswered = false;
        }
      });
    });

    return allAnswered;
  }

  // Function to determine learning style based on scores
  function determineLearningStyle(ae, ro, ac, ce) {
    if (ae > ro && ce > ac) {
      return "Anda seorang Doer (Accomodator) - Pengalaman Konkrit dan Pengujikajian Aktif";
    } else if (ro > ae && ce > ac) {
      return "Anda seorang Watcher (Diverger) - Pemerhatian Reflektif dan Pengalaman Konkrit";
    } else if (ro > ae && ac > ce) {
      return "Anda seorang Thinker (Assimilator) - Pengkonsepsian Abstrak dan Pemerhatian Reflektif";
    } else if (ac > ro && ae > ce) {
      return "Anda seorang Feeler (Converger) - Pengkonsepsian Abstrak dan Pengujikajian Aktif";
    } else {
      return "Gaya pembelajaran tidak dapat ditentukan. Sila semak semula skor anda.";
    }
  }
});
