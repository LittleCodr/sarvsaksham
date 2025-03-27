// Firebase Configuration (Replace with your config)
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCdP8dYYDxUMyhpwE98OfBm5ySaGvM6Bq4",
  authDomain: "sarvsaksham.firebaseapp.com",
  projectId: "sarvsaksham",
  storageBucket: "sarvsaksham.firebasestorage.app",
  messagingSenderId: "999614821531",
  appId: "1:999614821531:web:96ebae782498113830823e",
  measurementId: "G-TEZ531VGRT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// DOM Elements
const localVideo = document.getElementById('local-video');
const remoteVideo = document.getElementById('remote-video');
const startCallBtn = document.getElementById('start-call');
const endCallBtn = document.getElementById('end-call');
const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('message-input');
const sendMessageBtn = document.getElementById('send-message');

// WebRTC Variables
let localStream;
let remoteStream;
let peerConnection;
let roomId = "default-room"; // You can make this dynamic

// Firebase Refs
const messagesRef = database.ref(`chat/${roomId}`);
const offerRef = database.ref(`calls/${roomId}/offer`);
const answerRef = database.ref(`calls/${roomId}/answer`);
const iceCandidatesRef = database.ref(`calls/${roomId}/iceCandidates`);

// Initialize
init();

// Functions
async function init() {
    try {
        // Get user media (video & audio)
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVideo.srcObject = localStream;
        
        // Listen for Firebase messages
        listenForMessages();
        listenForCalls();
        
        // Button events
        startCallBtn.addEventListener('click', startCall);
        endCallBtn.addEventListener('click', endCall);
        sendMessageBtn.addEventListener('click', sendMessage);
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    } catch (err) {
        console.error("Error accessing media devices:", err);
    }
}

// Start a call
async function startCall() {
    peerConnection = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }] // Free STUN server
    });
    
    // Add local stream
    localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
    });
    
    // Handle remote stream
    peerConnection.ontrack = (event) => {
        remoteStream = event.streams[0];
        remoteVideo.srcObject = remoteStream;
    };
    
    // ICE Candidate handling
    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            iceCandidatesRef.push(event.candidate.toJSON());
        }
    };
    
    // Create and send offer
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    offerRef.set(offer.toJSON());
}

// Listen for incoming calls
function listenForCalls() {
    // Listen for offers
    offerRef.on('value', async (snapshot) => {
        const data = snapshot.val();
        if (!peerConnection && data) {
            peerConnection = new RTCPeerConnection({
                iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
            });
            
            // Add local stream
            localStream.getTracks().forEach(track => {
                peerConnection.addTrack(track, localStream);
            });
            
            // Handle remote stream
            peerConnection.ontrack = (event) => {
                remoteStream = event.streams[0];
                remoteVideo.srcObject = remoteStream;
            };
            
            // ICE Candidate handling
            peerConnection.onicecandidate = (event) => {
                if (event.candidate) {
                    iceCandidatesRef.push(event.candidate.toJSON());
                }
            };
            
            // Set remote description
            await peerConnection.setRemoteDescription(new RTCSessionDescription(data));
            
            // Create and send answer
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);
            answerRef.set(answer.toJSON());
        }
    });
    
    // Listen for answers
    answerRef.on('value', async (snapshot) => {
        const data = snapshot.val();
        if (peerConnection && !peerConnection.remoteDescription && data) {
            await peerConnection.setRemoteDescription(new RTCSessionDescription(data));
        }
    });
    
    // Listen for ICE candidates
    iceCandidatesRef.on('child_added', async (snapshot) => {
        const candidate = new RTCIceCandidate(snapshot.val());
        if (peerConnection) {
            await peerConnection.addIceCandidate(candidate);
        }
    });
}

// End the call
function endCall() {
    if (peerConnection) {
        peerConnection.close();
        peerConnection = null;
    }
    if (remoteVideo.srcObject) {
        remoteVideo.srcObject.getTracks().forEach(track => track.stop());
        remoteVideo.srcObject = null;
    }
    offerRef.remove();
    answerRef.remove();
    iceCandidatesRef.remove();
}

// Send a chat message
function sendMessage() {
    const message = messageInput.value.trim();
    if (message) {
        messagesRef.push({
            sender: "User",
            text: message,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        });
        messageInput.value = "";
    }
}

// Listen for chat messages
function listenForMessages() {
    messagesRef.on('child_added', (snapshot) => {
        const message = snapshot.val();
        const messageElement = document.createElement('div');
        messageElement.textContent = `${message.sender}: ${message.text}`;
        messagesDiv.appendChild(messageElement);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    });
}