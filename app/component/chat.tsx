"use client"

import { useState, useRef, useEffect, JSX, SVGProps } from "react"

type Message = {
  sender: string;
  text: string;
};

type ButtonProps = JSX.IntrinsicAttributes & {
  variant?: string;
  size?: string;
  className?: string;
  onClick?: () => void;
  children?: JSX.Element | string;
};

type AvatarProps = {
  className: string;
  children: JSX.Element | string;
};

type InputProps = {
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  className: string;
};

type ChatProps = {
  socket: any;
    token: string;
};

export default function Chat({ socket, token }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket.on("receive-message", (message: Message) => {
        if(message.sender === localStorage.getItem("fake-token")){
            return;
        }
      setMessages((prevMessages) => [...prevMessages, message]);
      if (chatRef.current) {
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
      }
    });

    return () => {
      socket.off("receive-message");
    };
  }, [socket]);

  useEffect(() => {
    fetch(`https://nf-hw-backend-2.onrender.com/api/v1/messages/chat/666977d112e818e77e20f5b4`)
      .then(response => response.json())
      .then(data => setMessages(data))
      .catch(error => console.error('Error:', error));
  }, []);

//   const handleSendMessage = () => {
//     if (newMessage.trim() !== "") {
//       const newMessageObj = {
//         sender: token, // assuming token is a string representing the sender
//         message: newMessage,
//       };
//       setMessages([...messages, newMessageObj]);
//       setNewMessage("");
//       socket.emit("send-message", newMessage);
//       if (chatRef.current) {
//         chatRef.current.scrollTop = chatRef.current.scrollHeight;
//       }
//     }
//   };

const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      const newMessageObj = {
        sender: token, 
        text: newMessage,
      };
      setMessages([...messages, newMessageObj]);
      setNewMessage("");
      socket.emit("send-message", { room: '666977d112e818e77e20f5b4', text: newMessage, sender: token});
      if (chatRef.current) {
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
      }
    }
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-gray-900 text-white py-4 px-6 flex items-center justify-between">
        <h1 className="text-xl font-bold">Chat App</h1>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-200">
            <SearchIcon className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-200">
            <MenuIcon className="h-5 w-5" />
          </Button>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto" ref={chatRef}>
        <div className="p-6 space-y-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex items-start gap-4 ${message.sender === "You" ? "justify-end" : ""}`}>
              <Avatar className="w-8 h-8 shrink-0">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5SDWnevGNs3Oe-dgAuUECu0aZGzAxoSrSlECxWu1IgQE1lz3bvuyTID-wiKw46JRmXoM&usqp=CAU" alt={message.sender} />
              </Avatar>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 max-w-[75%]">
                <p className="text-sm text-gray-600 dark:text-gray-200 mb-1">{message.sender}</p>
                <p className="text-base text-gray-800 dark:text-gray-100">{message.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white dark:bg-gray-900 p-4">
        <Input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-500 dark:focus:ring-blue-600"
        />
        <Button
          onClick={handleSendMessage}
          className="ml-2 px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none focus:bg-blue-600 dark:focus:bg-blue-700"
        >
          Send
        </Button>
      </div>
    </div>
  );
}

const Button = ({ variant, size, className, onClick, children }: ButtonProps) => (
  <button
    className={`${className} ${variant} ${size}`}
    onClick={onClick}
  >
    {children}
  </button>
);

const Avatar = ({ className, children }: AvatarProps) => (
  <div className={`relative ${className}`}>
    {children}
  </div>
);

const Input = ({ type, placeholder, value, onChange, onKeyDown, className }: InputProps) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    onKeyDown={onKeyDown}
    className={className}
  />
);

const SearchIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 4a4 4 0 00-4 4v12a4 4 0 004 4h12a4 4 0 004-4V8a4 4 0 00-4-4H8z" />
  </svg>
);

const MenuIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
  </svg>
);
