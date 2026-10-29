document.addEventListener("DOMContentLoaded", () => {
  // =========================
  // 1. MOBILE NAVIGATION
  // =========================
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  const navItems = document.querySelectorAll(".nav-link");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");

      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.innerHTML = isOpen
        ? '<i class="fa-solid fa-xmark"></i>'
        : '<i class="fa-solid fa-bars"></i>';
    });

    navItems.forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
      });
    });

    document.addEventListener("click", (event) => {
      if (
        !navLinks.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
      }
    });
  }

  // =========================
  // 2. CURRENT YEAR
  // =========================
  const yearElement = document.getElementById("year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // =========================
  // 3. REVEAL ANIMATIONS
  // =========================
  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -30px 0px"
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("visible");
    });
  }

  // =========================
  // 4. ACTIVE NAVIGATION LINK
  // =========================
  const sections = document.querySelectorAll("main section[id]");

  if ("IntersectionObserver" in window && sections.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navItems.forEach((link) => {
              const isActive =
                link.getAttribute("href") === `#${entry.target.id}`;

              link.classList.toggle("active", isActive);
            });
          }
        });
      },
      {
        rootMargin: "-25% 0px -60% 0px",
        threshold: 0
      }
    );

    sections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }

  // =========================
  // 5. BACK TO TOP BUTTON
  // =========================
  const backToTop = document.getElementById("backToTop");

  if (backToTop) {
    const updateBackToTop = () => {
      backToTop.classList.toggle("visible", window.scrollY > 400);
    };

    window.addEventListener("scroll", updateBackToTop, {
      passive: true
    });

    updateBackToTop();

    backToTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches
          ? "auto"
          : "smooth"
      });
    });
  }

  // =========================
  // 6. CONTACT FORM
  // =========================
  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");

  if (contactForm && formStatus) {
    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (!contactForm.reportValidity()) {
        return;
      }

      const submitButton = contactForm.querySelector(
        'button[type="submit"]'
      );

      const originalButtonHTML = submitButton
        ? submitButton.innerHTML
        : "";

      const formData = new FormData(contactForm);

      const data = {
        name: String(formData.get("name") || "").trim(),
        email: String(formData.get("email") || "").trim(),
        subject: String(formData.get("subject") || "").trim(),
        message: String(formData.get("message") || "").trim()
      };

      if (!data.name || !data.email || !data.subject || !data.message) {
        showStatus("Please fill in all fields.", "error");
        return;
      }

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerHTML =
          'Sending... <i class="fa-solid fa-spinner fa-spin"></i>';
      }

      showStatus("Sending your message...", "");

      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        });

        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            result.message || "Unable to send your message."
          );
        }

        showStatus(
          result.message || "Message sent successfully!",
          "success"
        );

        contactForm.reset();
      } catch (error) {
        console.error("Contact form error:", error);

        showStatus(
          error.message ||
            "Something went wrong. Please try again later.",
          "error"
        );
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.innerHTML = originalButtonHTML;
        }
      }
    });
  }

  function showStatus(message, type) {
    if (!formStatus) return;

    formStatus.textContent = message;
    formStatus.className = "form-status";

    if (type) {
      formStatus.classList.add(type);
    }
  }
});
        
