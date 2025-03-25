document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const patientVideo = document.getElementById('patient-video');
    const doctorVideo = document.getElementById('doctor-video');
    const startVideoBtn = document.getElementById('start-video');
    const stopVideoBtn = document.getElementById('stop-video');
    const startASLBtn = document.getElementById('start-asl');
    const aslTextOutput = document.getElementById('asl-text-output');
    const sendASLTextBtn = document.getElementById('send-asl-text');
    const patientChatMessages = document.getElementById('patient-chat-messages');
    const patientMessageInput = document.getElementById('patient-message-input');
    const patientSendMessageBtn = document.getElementById('patient-send-message');
    const doctorChatMessages = document.getElementById('doctor-chat-messages');
    const doctorMessageInput = document.getElementById('doctor-message-input');
    const doctorSendMessageBtn = document.getElementById('doctor-send-message');
    const patientFileUpload = document.getElementById('patient-file-upload');
    const patientUploadBtn = document.getElementById('patient-upload-btn');
    const patientFileList = document.getElementById('patient-file-list');
    const doctorFileUpload = document.getElementById('doctor-file-upload');
    const doctorUploadBtn = document.getElementById('doctor-upload-btn');
    const doctorFileList = document.getElementById('doctor-file-list');
    const doctorStatus = document.getElementById('doctor-status');

    // Video stream variables
    let patientStream;
    let doctorStream;
    let peerConnection;
    let socket;
    let isASLActive = false;

    // Initialize Socket.io connection
    function initSocket() {
        // In a real app, you would connect to your server
        socket = io.connect('http://localhost:3000'); // Change to your server URL
        
        socket.on('connect', () => {
            console.log('Connected to signaling server');
        });
        
        socket.on('doctor-connected', () => {
            doctorStatus.textContent = 'Doctor connected';
            doctorStatus.classList.add('connected');
            startVideoCall();
        });
        
        socket.on('doctor-disconnected', () => {
            doctorStatus.textContent = 'Doctor not connected';
            doctorStatus.classList.remove('connected');
            if (doctorVideo.srcObject) {
                doctorVideo.srcObject.getTracks().forEach(track => track.stop());
                doctorVideo.srcObject = null;
            }
        });
        
        socket.on('offer', async (offer) => {
            if (!peerConnection) {
                createPeerConnection();
            }
            
            await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);
            socket.emit('answer', answer);
        });
        
        socket.on('answer', async (answer) => {
            await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
        });
        
        socket.on('ice-candidate', async (candidate) => {
            try {
                await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (e) {
                console.error('Error adding ICE candidate:', e);
            }
        });
        
        socket.on('chat-message', (data) => {
            addMessage(data.sender, data.message, data.isFile);
        });
        
        socket.on('file-uploaded', (data) => {
            addFileToList(data.sender, data.fileName, data.fileUrl);
        });
    }

    // Start video call
    async function startVideoCall() {
        try {
            if (!patientStream) {
                patientStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                patientVideo.srcObject = patientStream;
            }
            
            if (!peerConnection) {
                createPeerConnection();
            }
            
            // Add patient stream to peer connection
            patientStream.getTracks().forEach(track => {
                peerConnection.addTrack(track, patientStream);
            });
            
            // Create and send offer
            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);
            socket.emit('offer', offer);
        } catch (err) {
            console.error('Error starting video call:', err);
        }
    }

    // Create RTCPeerConnection
    function createPeerConnection() {
        const configuration = {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' }
                // Add your TURN servers here if needed
            ]
        };
        
        peerConnection = new RTCPeerConnection(configuration);
        
        // Handle ICE candidates
        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit('ice-candidate', event.candidate);
            }
        };
        
        // Handle remote stream
        peerConnection.ontrack = (event) => {
            if (event.streams && event.streams[0]) {
                doctorVideo.srcObject = event.streams[0];
            }
        };
        
        peerConnection.onconnectionstatechange = () => {
            console.log('Connection state:', peerConnection.connectionState);
        };
    }

    // Start patient video
    startVideoBtn.addEventListener('click', async () => {
        try {
            patientStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            patientVideo.srcObject = patientStream;
        } catch (err) {
            console.error('Error accessing media devices:', err);
        }
    });

    // Stop patient video
    stopVideoBtn.addEventListener('click', () => {
        if (patientStream) {
            patientStream.getTracks().forEach(track => track.stop());
            patientVideo.srcObject = null;
            patientStream = null;
        }
    });

    // Start ASL recognition (placeholder for ML model integration)
    startASLBtn.addEventListener('click', () => {
        isASLActive = !isASLActive;
        startASLBtn.textContent = isASLActive ? 'Stop ASL Recognition' : 'Start ASL Recognition';
        
        if (isASLActive) {
            // This is where you would initialize your ASL recognition model
            aslTextOutput.textContent = 'ASL recognition started... (This would connect to your ML model)';
            
            // Simulate ASL recognition for demo purposes
            simulateASLRecognition();
        } else {
            // Stop ASL recognition
            aslTextOutput.textContent = 'ASL recognition stopped';
        }
    });

    // Simulate ASL recognition (replace with actual ML model integration)
    function simulateASLRecognition() {
        if (!isASLActive) return;
        
        const aslPhrases = [
            "Hello doctor",
            "My hand hurts",
            "I have a headache",
            "Can you prescribe medicine?",
            "Thank you",
            "Where is the pain?",
            "I need help",
            "Goodbye"
        ];
        
        const randomPhrase = aslPhrases[Math.floor(Math.random() * aslPhrases.length)];
        
        // Update the ASL text output
        aslTextOutput.textContent = randomPhrase;
        
        // Continue simulating after a delay
        setTimeout(simulateASLRecognition, 3000);
    }

    // Send ASL text to chat
    sendASLTextBtn.addEventListener('click', () => {
        const message = aslTextOutput.textContent.trim();
        if (message) {
            sendMessage('patient', message);
            aslTextOutput.textContent = '';
        }
    });

    // Send chat message
    function sendMessage(sender, message, isFile = false) {
        if (!message) return;
        
        // In a real app, you would send this to the server
        socket.emit('chat-message', { sender, message, isFile });
        
        // For demo, just add to the UI
        addMessage(sender, message, isFile);
        
        // Clear input if it's a regular message
        if (!isFile) {
            if (sender === 'patient') {
                patientMessageInput.value = '';
            } else {
                doctorMessageInput.value = '';
            }
        }
    }

    // Add message to chat UI
    function addMessage(sender, message, isFile = false) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.classList.add(`${sender}-message`);
        
        if (isFile) {
            messageElement.innerHTML = `<a href="${message}" target="_blank">Download file</a>`;
        } else {
            messageElement.textContent = message;
        }
        
        if (sender === 'patient') {
            patientChatMessages.appendChild(messageElement);
            patientChatMessages.scrollTop = patientChatMessages.scrollHeight;
        } else {
            doctorChatMessages.appendChild(messageElement);
            doctorChatMessages.scrollTop = doctorChatMessages.scrollHeight;
        }
    }

    // Handle patient message send
    patientSendMessageBtn.addEventListener('click', () => {
        const message = patientMessageInput.value.trim();
        sendMessage('patient', message);
    });

    patientMessageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const message = patientMessageInput.value.trim();
            sendMessage('patient', message);
        }
    });

    // Handle doctor message send (for demo purposes)
    doctorSendMessageBtn.addEventListener('click', () => {
        const message = doctorMessageInput.value.trim();
        sendMessage('doctor', message);
    });

    doctorMessageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const message = doctorMessageInput.value.trim();
            sendMessage('doctor', message);
        }
    });

    // Handle file upload
    function handleFileUpload(sender, fileInput, fileListElement) {
        const file = fileInput.files[0];
        if (!file) return;
        
        // In a real app, you would upload the file to a server
        // This is just a simulation
        const fileUrl = URL.createObjectURL(file);
        const fileName = file.name;
        
        // Simulate upload delay
        setTimeout(() => {
            socket.emit('file-uploaded', { sender, fileName, fileUrl });
            addFileToList(sender, fileName, fileUrl);
        }, 1000);
    }

    // Add file to file list UI
    function addFileToList(sender, fileName, fileUrl) {
        const fileItem = document.createElement('div');
        fileItem.classList.add('file-item');
        fileItem.innerHTML = `
            <span>${fileName}</span>
            <a href="${fileUrl}" download="${fileName}">Download</a>
        `;
        
        if (sender === 'patient') {
            patientFileList.appendChild(fileItem);
        } else {
            doctorFileList.appendChild(fileItem);
        }
        
        // Also add to chat as a message
        sendMessage(sender, fileUrl, true);
    }

    // Patient file upload
    patientUploadBtn.addEventListener('click', () => {
        handleFileUpload('patient', patientFileUpload, patientFileList);
    });

    // Doctor file upload (for demo purposes)
    doctorUploadBtn.addEventListener('click', () => {
        handleFileUpload('doctor', doctorFileUpload, doctorFileList);
    });

    // Initialize the app
    initSocket();
});