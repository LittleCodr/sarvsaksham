document.getElementById("startCall").addEventListener("click", async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    const videoElement = document.getElementById("remoteVideo");
    videoElement.srcObject = stream;
});
// Dark Mode Toggle Script
document.querySelector(".theme-toggle").addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
});
