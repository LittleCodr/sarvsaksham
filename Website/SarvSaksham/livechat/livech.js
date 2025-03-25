let photosTaken = 0;
let userPhotos = [];
const startButton = document.getElementById("startVerification");
const cameraDiv = document.getElementById("camera");

startButton.addEventListener("click", async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    const video = document.createElement("video");
    video.srcObject = stream;
    video.play();
    
    // Clear previous camera content
    cameraDiv.innerHTML = "";
    cameraDiv.appendChild(video);
    
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
            cameraDiv.innerHTML = ""; // Remove video after capturing
            verifyPhotos();
        }
    };
    
    capturePhoto();
});

function verifyPhotos() {
    alert("Photos captured! Now comparing with Aadhaar photo...");
    setTimeout(() => {
        window.location.href = "livech1.html";
    }, 2000);
}

// Dark Mode Toggle Script
document.querySelector(".theme-toggle").addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
});
