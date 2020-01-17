const socket = new WebSocket('http://localhost:8081')

socket.on('chat-message',data =>{
    console.log(data)
})