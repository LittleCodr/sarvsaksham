let photosTaken = 0;
let userPhotos = [];
const startButton = document.getElementById("startVerification");

startButton.addEventListener("click", async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    const video = document.createElement("video");
    video.srcObject = stream;
    video.play();
    document.body.appendChild(video);
    
    const capturePhoto = () => {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        userPhotos.push(canvas.toDataURL("image/png"));
        photosTaken++;
        
        if (photosTaken < 3) {
            setTimeout(capturePhoto, 2000);
        } else {
            stream.getTracks().forEach(track => track.stop());
            video.remove();
            verifyPhotos();
        }
    };
    
    capturePhoto();
});

function verifyPhotos() {
    // Simulating Aadhaar photo matching
    alert("Photos captured! Now comparing with Aadhaar photo...");
    setTimeout(() => {
        window.location.href = "livech1.html";
    }, 2000);
}
let slides = document.querySelectorAll(".slide");
let index = 0;
// code for slider
function nextSlide() {
    slides[index].classList.remove("active");
    index = (index + 1) % slides.length; // Loop back to first slide
    slides[index].classList.add("active");
}

// Change image every 2 seconds
setInterval(nextSlide, 2000);
// Dark Mode Toggle Script
document.querySelector(".theme-toggle").addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
});
