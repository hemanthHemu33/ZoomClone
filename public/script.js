document.addEventListener("DOMContentLoaded", () => {
  const socket = io("/"); // Use the root since Socket.io and PeerJS are on the same port
  const videoGrid = document.getElementById("video-grid");

  // Dynamically set the host (only hostname is needed, port is now the same)
  const host = window.location.hostname;

  const myPeer = new Peer(undefined, {
    host: host,
    port:
      window.location.port ||
      (window.location.protocol === "https:" ? "443" : "80"), // Use the same port as the main app
    path: "/peerjs", // Ensure this matches the PeerJS server's path
  });

  const peers = {};
  const myVideo = document.createElement("video");
  myVideo.muted = true;

  let myStream;

  navigator.mediaDevices
    .getUserMedia({ video: true, audio: true })
    .then((stream) => {
      myStream = stream;
      myVideo.style.transform = "scaleX(-1)";
      addVideoStream(myVideo, stream);

      myPeer.on("call", (call) => {
        call.answer(stream);
        const video = document.createElement("video");
        call.on("stream", (userVideoStream) => {
          addVideoStream(video, userVideoStream);
        });
        call.on("close", () => {
          video.remove();
        });
      });

      socket.on("user-connected", (userId) => {
        setTimeout(() => {
          connectToNewUser(userId, stream);
        }, 1000);
      });
    })
    .catch((error) => {
      console.error("Error accessing media devices.", error);
    });

  myPeer.on("open", (id) => {
    socket.emit("join-room", ROOM_ID, id);
    console.log("My peer ID: " + id);
  });

  socket.on("user-disconnected", (userId) => {
    console.log("User disconnected: " + userId);
    if (peers[userId]) peers[userId].close();
  });

  function addVideoStream(video, stream) {
    video.srcObject = stream;
    video.style.transform = "scaleX(-1)";
    video.addEventListener("loadedmetadata", () => {
      video.play();
    });
    videoGrid.append(video);
  }

  function connectToNewUser(userId, stream) {
    if (peers[userId]) return;
    const call = myPeer.call(userId, stream);
    const video = document.createElement("video");

    call.on("stream", (userVideoStream) => {
      addVideoStream(video, userVideoStream);
    });

    call.on("close", () => {
      video.remove();
    });

    peers[userId] = call;
  }
});
