# Zoom Clone Backend

This is the backend for a Zoom Clone application. It handles user authentication, video call management, and real-time communication.

## Features

- User Authentication
- Video Call Management
- Real-time Communication
- Chat Functionality
- Peer-to-Peer Communication using PeerJS

## Using PeerJS

PeerJS is used for peer-to-peer communication in this project. It simplifies WebRTC peer-to-peer data, video, and audio calls.

### Installation

To install PeerJS, run the following command: peerjs --port 3001

## Technologies Used

- Node.js
- Express.js
- Socket.io
- MongoDB

## Installation

1. Clone the repository:
    ```
    git clone https://github.com/yourusername/zoom-clone-backend.git
    ```
2. Navigate to the project directory:
    ```
    cd zoom-clone-backend
    ```
3. Install dependencies:
    ```
    npm install
    ```

## Usage

1. Start the server:
    ```
    npm start
    ```
2. The backend server will be running on `http://localhost:3000`.

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a pull request.

## License

This project is licensed under the MIT License.


npm i peer -g


pm2 start ecosystem.config.js --env production
   "start": "concurrently \"node server.js\" \"peerjs --port 3001\"",