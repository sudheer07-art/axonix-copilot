// ======================================
// AXONIX CONTACT PAGE
// ======================================

console.log("Contact Page Loaded");

// ======================================
// SCROLL ANIMATION
// ======================================

const observer = new IntersectionObserver(

    (entries) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {

                entry.target.classList.add("show");

            }

        });

    },

    {
        threshold:0.15
    }

);

document.querySelectorAll("section").forEach((section)=>{

    section.classList.add("hidden");

    observer.observe(section);

});

// ======================================
// FORM VALIDATION
// ======================================

const form=document.getElementById("contactForm");

const toast=document.getElementById("toast");

form.addEventListener("submit",function(e){

    e.preventDefault();

    const name=
    document.getElementById("name").value.trim();

    const email=
    document.getElementById("email").value.trim();

    const subject=
    document.getElementById("subject").value.trim();

    const message=
    document.getElementById("message").value.trim();

    if(

        name==="" ||

        email==="" ||

        subject==="" ||

        message===""

    ){

        alert("Please fill all fields.");

        return;

    }

    if(

        !email.includes("@") ||

        !email.includes(".")

    ){

        alert("Enter a valid email address.");

        return;

    }

    showToast();

    form.reset();

});

// ======================================
// SUCCESS TOAST
// ======================================

function showToast(){

    toast.style.display="block";

    setTimeout(()=>{

        toast.style.display="none";

    },3000);

}

// ======================================
// HERO TITLE ANIMATION
// ======================================

const heroTitle=document.querySelector(".hero-content h1");

let zoom=1;

setInterval(()=>{

    zoom=(zoom===1)?1.03:1;

    heroTitle.style.transform=`scale(${zoom})`;

},1200);

// ======================================
// INFO CARD HOVER
// ======================================

document.querySelectorAll(".info-card").forEach((card)=>{

    card.addEventListener("mouseenter",()=>{

        card.style.transform="translateY(-10px)";

    });

    card.addEventListener("mouseleave",()=>{

        card.style.transform="translateY(0px)";

    });

});

// ======================================
// SOCIAL ICON EFFECT
// ======================================

document.querySelectorAll(".social-icons a").forEach((icon)=>{

    icon.addEventListener("mouseenter",()=>{

        icon.style.boxShadow=
        "0 0 20px rgba(59,130,246,.6)";

    });

    icon.addEventListener("mouseleave",()=>{

        icon.style.boxShadow="none";

    });

});

// ======================================
// SCROLL PROGRESS BAR
// ======================================

const progress=document.createElement("div");

progress.style.position="fixed";
progress.style.top="0";
progress.style.left="0";
progress.style.width="0%";
progress.style.height="4px";
progress.style.background="#3b82f6";
progress.style.zIndex="9999";

document.body.appendChild(progress);

window.addEventListener("scroll",()=>{

    const scrollTop=
    document.documentElement.scrollTop;

    const scrollHeight=
    document.documentElement.scrollHeight-
    document.documentElement.clientHeight;

    const width=
    (scrollTop/scrollHeight)*100;

    progress.style.width=width+"%";

});

// ======================================
// BUTTON RIPPLE EFFECT
// ======================================

const button=document.querySelector("#contactForm button");

button.addEventListener("click",function(){

    button.style.transform="scale(.97)";

    setTimeout(()=>{

        button.style.transform="scale(1)";

    },120);

});

// ======================================
// FAQ ACCORDION
// ======================================

document.querySelectorAll(".faq-item").forEach((item)=>{

    const answer=item.querySelector("p");

    answer.style.display="none";

    item.style.cursor="pointer";

    item.addEventListener("click",()=>{

        if(answer.style.display==="none"){

            answer.style.display="block";

        }

        else{

            answer.style.display="none";

        }

    });

});

console.log("AXONIX Contact Page Ready");