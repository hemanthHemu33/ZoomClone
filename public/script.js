document.addEventListener("DOMContentLoaded", () => {
  const socket = io("/");
  const videoGrid = document.getElementById("video-grid");

  const myPeer = new Peer(undefined, {
    host: location.hostname,
    port: location.protocol === "https:" ? 443 : 3001, // Use port 443 for HTTPS, fallback to 3001 locally
    secure: location.protocol === "https:", // Secure connection when on HTTPS
  });

  const peers = {};
  const myVideo = document.createElement("video");
  myVideo.muted = true;

  let myStream; // Declare stream in outer scope

  navigator.mediaDevices
    .getUserMedia({
      video: true,
      audio: true,
    })
    .then((stream) => {
      myStream = stream; // Assign stream to global variable
      myVideo.style.transform = "scaleX(-1)";
      addVideoStream(myVideo, stream);

      // Handle incoming calls (when other users call you)
      myPeer.on("call", (call) => {
        call.answer(stream); // Answer the call with your stream

        const video = document.createElement("video");
        call.on("stream", (userVideoStream) => {
          addVideoStream(video, userVideoStream);
        });

        // Remove the video element when the user disconnects
        call.on("close", () => {
          video.remove();
        });
      });

      // When a new user connects, call them
      socket.on("user-connected", (userId) => {
        setTimeout(() => {
          connectToNewUser(userId, stream); // Ensure that the stream is connected after a slight delay
        }, 1000); // Delay to ensure the new user has fully joined
      });
    });

  // When the PeerJS connection opens
  myPeer.on("open", (id) => {
    socket.emit("join-room", ROOM_ID, id);
    console.log("My peer ID: " + id);
  });

  // Listen for a user disconnecting
  socket.on("user-disconnected", (userId) => {
    console.log("User disconnected: " + userId);
    if (peers[userId]) peers[userId].close();
  });

  // Function to add video stream to the grid
  //   function addVideoStream(video, stream) {
  //     video.srcObject = stream;
  //     video.addEventListener("loadedmetadata", () => {
  //       video.play();
  //     });
  //     videoGrid.append(video);
  //   }

  function addVideoStream(video, stream) {
    video.srcObject = stream;

    // Un-mirror the video if needed
    video.style.transform = "scaleX(-1)";

    video.addEventListener("loadedmetadata", () => {
      video.play();
    });
    videoGrid.append(video);
  }

  // Function to connect to a new user
  function connectToNewUser(userId, stream) {
    if (peers[userId]) return; // Avoid multiple connections for the same user

    const call = myPeer.call(userId, stream); // Call the new user with your stream
    const video = document.createElement("video");

    call.on("stream", (userVideoStream) => {
      addVideoStream(video, userVideoStream); // Show their video when you receive their stream
    });

    call.on("close", () => {
      video.remove(); // Remove the video element when the call closes
    });

    peers[userId] = call; // Store the peer connection
  }
});
