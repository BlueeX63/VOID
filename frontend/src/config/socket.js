import io from 'socket.io-client'

let socketInstance = null;

export const initializeSocket = (projectId) => {
    if (socketInstance) {
        socketInstance.disconnect();
    }
    socketInstance = io(import.meta.env.VITE_API_URL, {
        auth: { token: localStorage.getItem('token') },
        query: { projectId },
        forceNew: true
    });
    return socketInstance;
}

export const recieveMessage = (eventName , cb)=>{
    if (socketInstance) {
        socketInstance.off(eventName); // Clear any existing duplicate listeners
        socketInstance.on(eventName , cb);
    }
}

export const removeMessage = (eventName, cb) => {
    if (socketInstance) {
        socketInstance.off(eventName, cb);
    }
}

export const sendMessage = (eventName , data)=>{
    if (socketInstance) {
        socketInstance.emit(eventName , data);
    }
}

export const disconnectSocket = () => {
    if (socketInstance) {
        socketInstance.disconnect();
        socketInstance = null;
    }
}