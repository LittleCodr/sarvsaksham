function filterCards() {
    let input = document.getElementById('searchBar').value.toLowerCase();
    let cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        let title = card.getAttribute('data-title').toLowerCase();
        card.style.display = title.includes(input) ? "block" : "none";
    });
}

// Object containing first aid steps for different conditions
const firstAidData = {
    "Burns": [
        { 
            text: "Cool the burn under running water for 10 minutes. Do not apply ice.", 
            img: "../../images/firstaid/burn_step1.jpg",
            video: "https://www.youtube.com/embed/dQw4w9WgXcQ"
        },
        { 
            text: "Cover the burn with a clean, non-stick bandage.", 
            img: "../../images/firstaid/burn_step2.jpg",
            video: "https://www.youtube.com/embed/example2"
        }
    ],
    "Cuts": [
        { 
            text: "Apply direct pressure to stop bleeding.", 
            img: "../../images/firstaid/cut_step1.jpg",
            video: "https://www.youtube.com/embed/example3"
        },
        { 
            text: "Clean the wound with antiseptic.", 
            img: "../../images/firstaid/cut_step2.jpg",
            video: "https://www.youtube.com/embed/example4"
        }
    ],
    "Choking": [
        { 
            text: "Perform the Heimlich maneuver for adults.", 
            img: "../../images/firstaid/choking_step1.jpg",
            video: "https://www.youtube.com/embed/example5"
        },
        { 
            text: "Use back blows and chest thrusts for infants.", 
            img: "../../images/firstaid/choking_step2.jpg",
            video: "https://www.youtube.com/embed/example6"
        }
    ],
    "Electric Shock": [
        { 
            text: "Turn off the power source before touching the person.", 
            img: "../../images/firstaid/electricshock_step1.jpg",
            video: "https://www.youtube.com/embed/example7"
        },
        { 
            text: "Check for breathing and provide CPR if needed.", 
            img: "../../images/firstaid/electricshock_step2.jpg",
            video: "https://www.youtube.com/embed/example8"
        }
    ],
    "Food Poisoning": [
        { 
            text: "Encourage the person to drink water to stay hydrated.", 
            img: "../../images/firstaid/foodpoison_step1.jpg",
            video: "https://www.youtube.com/embed/example9"
        },
        { 
            text: "Seek medical help if symptoms persist or worsen.", 
            img: "../../images/firstaid/foodpoison_step2.jpg",
            video: "https://www.youtube.com/embed/example10"
        }
    ],
    "Fractures": [
        { 
            text: "Immobilize the affected area using a splint.", 
            img: "../../images/firstaid/fracture_step1.jpg",
            video: "https://www.youtube.com/embed/example11"
        },
        { 
            text: "Apply ice packs to reduce swelling.", 
            img: "../../images/firstaid/fracture_step2.jpg",
            video: "https://www.youtube.com/embed/example12"
        }
    ],
    "Heart Attack": [
        { 
            text: "Call emergency services immediately.", 
            img: "../../images/firstaid/heartattack_step1.jpg",
            video: "https://www.youtube.com/embed/example13"
        },
        { 
            text: "Help the person sit comfortably and loosen tight clothing.", 
            img: "../../images/firstaid/heartattack_step2.jpg",
            video: "https://www.youtube.com/embed/example14"
        }
    ],
    "Heatstroke & Hypothermia": [
        { 
            text: "Move the person to a cooler or warmer environment accordingly.", 
            img: "../../images/firstaid/heatstroke_step1.jpg",
            video: "https://www.youtube.com/embed/example15"
        },
        { 
            text: "Provide fluids for hydration (avoid caffeine or alcohol).", 
            img: "../../images/firstaid/heatstroke_step2.jpg",
            video: "https://www.youtube.com/embed/example16"
        }
    ],
    "Nosebleeds": [
        { 
            text: "Lean the person forward and pinch the nose for 5-10 minutes.", 
            img: "../../images/firstaid/nosebleed_step1.jpg",
            video: "https://www.youtube.com/embed/example17"
        },
        { 
            text: "Apply a cold compress to the nose to reduce bleeding.", 
            img: "../../images/firstaid/nosebleed_step2.jpg",
            video: "https://www.youtube.com/embed/example18"
        }
    ],
    "Road Accident": [
        { 
            text: "Check for responsiveness and breathing, then call emergency services.", 
            img: "../../images/firstaid/roadaccident_step1.jpg",
            video: "https://www.youtube.com/embed/example19"
        },
        { 
            text: "Stop any severe bleeding using direct pressure.", 
            img: "../../images/firstaid/roadaccident_step2.jpg",
            video: "https://www.youtube.com/embed/example20"
        }
    ],
    "Snake Bite": [
        { 
            text: "Keep the affected limb still and below heart level.", 
            img: "../../images/firstaid/snakebite_step1.jpg",
            video: "https://www.youtube.com/embed/example21"
        },
        { 
            text: "Do not suck out the venom; seek medical attention immediately.", 
            img: "../../images/firstaid/snakebite_step2.jpg",
            video: "https://www.youtube.com/embed/example22"
        }
    ]
};


// Variables to track state
let currentCondition = null;
let currentStepIndex = 0;

// Function to change the step in the popup
function changeStep(direction) {
    currentStepIndex += direction;

    // Ensure index stays within bounds
    if (currentStepIndex < 0) {
        currentStepIndex = 0;
    } else if (currentStepIndex >= firstAidData[currentCondition].length) {
        currentStepIndex = firstAidData[currentCondition].length - 1;
    }

    updateStepContent();
}

// Function to update step content dynamically
function updateStepContent() {
    const step = firstAidData[currentCondition][currentStepIndex];
    document.querySelector(".textContent").innerText = step.text;

    // Update image if it exists, otherwise hide the image element
    const imgElement = document.querySelector(".stepImage");
    imgElement.style.display = step.img ? "block" : "none";
    imgElement.src = step.img || "";

    // Update video iframe when switching to the video tab
    if (document.querySelector(".tab-content.video").style.display === "block") {
        document.querySelector(".videoFrame").src = step.video;
    }

    // Update button states
    document.querySelector(".prevBtn").disabled = (currentStepIndex === 0);
    document.querySelector(".nextBtn").disabled = (currentStepIndex === firstAidData[currentCondition].length - 1);
}

// Function to open popup and set the correct data
function openPopup(event) {
    let button = event.currentTarget;
    currentCondition = button.closest(".card").dataset.title; // Get condition from card's data-title
    currentStepIndex = 0; // Reset to first step
    updateStepContent();

    // Show the popup
    document.querySelector(".popup-container").style.display = "flex";

    // Default to "Reading" tab
    showTab("reading");
}

// Function to close popup
function closePopup() {
    document.querySelector(".popup-container").style.display = "none";
    document.querySelector(".videoFrame").src = ""; // Stop video when closing
}

// Attach event listeners to all "Read More" buttons dynamically
document.querySelectorAll(".openPopup").forEach(button => {
    button.addEventListener("click", openPopup);
});

// Attach event listener to close button
document.querySelector(".closePopup").addEventListener("click", closePopup);

// Attach event listeners to navigation buttons
document.querySelector(".prevBtn").addEventListener("click", () => changeStep(-1));
document.querySelector(".nextBtn").addEventListener("click", () => changeStep(1));

// Function to switch between Reading & Video tabs
function showTab(tab) {
    document.querySelectorAll(".tab-button").forEach(button => button.classList.remove("active"));
    document.querySelector(`.tab-button[data-tab="${tab}"]`).classList.add("active");

    document.querySelectorAll(".tab-content").forEach(content => content.style.display = "none");
    document.querySelector(`.tab-content.${tab}`).style.display = "block";

    updateStepContent(); // Update content based on active tab
}
// Dark Mode Toggle Script
document.querySelector(".theme-toggle").addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
});
