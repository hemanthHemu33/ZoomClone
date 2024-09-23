document.addEventListener("DOMContentLoaded", () => {
  const socket = io("/");
  const videoGrid = document.getElementById("video-grid");

  // Dynamically set the host
  const host = window.location.hostname; // Gets the current hostname
  const port = window.location.protocol === "https:" ? "443" : "3001"; // Set port based on protocol

  const myPeer = new Peer(undefined, {
    host: host,
    port: port,
    // Ensure this matches your server path if defined
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
