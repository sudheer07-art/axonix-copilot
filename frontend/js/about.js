// =======================================
// AXONIX ABOUT PAGE
// =======================================

console.log("About Page Loaded");

// =======================================
// Fade-in Animation
// =======================================

const observer = new IntersectionObserver(

    (entries) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {

                entry.target.classList.add("show");

            }

        });

    },

    {
        threshold: 0.15
    }

);

// Observe all sections

document.querySelectorAll("section").forEach((section) => {

    section.classList.add("hidden");

    observer.observe(section);

});

// =======================================
// Feature Card Hover Effect
// =======================================

document.querySelectorAll(".feature-card").forEach((card) => {

    card.addEventListener("mouseenter", () => {

        card.style.transform = "translateY(-12px) scale(1.03)";

    });

    card.addEventListener("mouseleave", () => {

        card.style.transform = "translateY(0) scale(1)";

    });

});

// =======================================
// Tech Card Animation
// =======================================

document.querySelectorAll(".tech-card").forEach((card) => {

    card.addEventListener("mouseenter", () => {

        card.style.boxShadow =
            "0 0 20px rgba(59,130,246,.5)";

    });

    card.addEventListener("mouseleave", () => {

        card.style.boxShadow = "none";

    });

});

// =======================================
// Hero Text Animation
// =======================================

const heroTitle = document.querySelector(".hero-content h1");

let scale = 1;

setInterval(() => {

    scale = scale === 1 ? 1.03 : 1;

    heroTitle.style.transform = `scale(${scale})`;

}, 1200);

// =======================================
// Scroll Progress Bar
// =======================================

const progress = document.createElement("div");

progress.style.position = "fixed";
progress.style.top = "0";
progress.style.left = "0";
progress.style.height = "4px";
progress.style.background = "#3b82f6";
progress.style.zIndex = "9999";
progress.style.width = "0%";

document.body.appendChild(progress);

window.addEventListener("scroll", () => {

    const scrollTop =
        document.documentElement.scrollTop;

    const scrollHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

    const width =
        (scrollTop / scrollHeight) * 100;

    progress.style.width = width + "%";

});

// =======================================
// CTA Button Animation
// =======================================

const cta = document.querySelector(".cta a");

if (cta) {

    cta.addEventListener("mouseenter", () => {

        cta.style.boxShadow =
            "0 0 25px rgba(37,99,235,.6)";

    });

    cta.addEventListener("mouseleave", () => {

        cta.style.boxShadow = "none";

    });

}

// =======================================
// Smooth Button Click Effect
// =======================================

document.querySelectorAll("a").forEach((btn) => {

    btn.addEventListener("click", () => {

        btn.style.transform = "scale(.95)";

        setTimeout(() => {

            btn.style.transform = "scale(1)";

        }, 120);

    });

});

console.log("AXONIX About Page Ready");