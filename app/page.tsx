"use client";

import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Socket, io } from "socket.io-client";
import Chat from "./component/chat"; 
import { DefaultEventsMap } from "@socket.io/component-emitter";

let socket: Socket<DefaultEventsMap, DefaultEventsMap> | null = null;

export default function Home() {
  const [token, setToken] = useState('');
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    socket = io(process.env.REACT_APP_BACKEND_URL || "http://localhost:3939");

    socket.on("connect", () => {
      console.log("connected");
    });

    socket.on("hello", (arg) => {
      console.log(arg); 
      toast(arg);
    });

    socket.on("disconnect", () => {
      console.log("disconnected");
    });
  }, []);

  // useEffect(() => {
  //   const localToken = localStorage.getItem("fake-token");
  //   if(localToken){
  //   setToken(localToken)
  // }
  // }, [token]);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (hasMounted) {
      const localToken = localStorage.getItem("fake-token");
      if(localToken){
        setToken(localToken);
      }
      else{
        setToken('');
      }
    }
  }, [hasMounted, token]);
  

  const joinRoom1 = () => {
    socket!.emit("join-room", "666977d112e818e77e20f5b4");
  };

  // const joinRoom2 = () => {
  //   socket!.emit("join-room", "room-2");
  // };

  const loginAsUser1 = () => {
    localStorage.setItem("fake-token", "6669df169c5c0bcce286e6c6")
    joinRoom1()
    setToken('6669df169c5c0bcce286e6c6')
  }

  const loginAsUser2 = () => {
    localStorage.setItem("fake-token", "6669df269c5c0bcce286e6c8")
    joinRoom1()
    setToken('6669df169c5c0bcce286e6c6')
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">

{token == '' ? (

      <div className="flex space-x-4">
        {/* <button
          onClick={joinRoom1}
          className="px-6 py-3 my-10 text-white bg-blue-600 rounded-lg"
        >
          Join Room 1
        </button>
        <button
          onClick={joinRoom2}
          className="px-6 py-3 my-10 text-white bg-blue-600 rounded-lg"
        >
          Join Room 2
        </button> */}

        <button
          onClick={loginAsUser1}
          className="px-6 py-3 my-10 text-white bg-green-500 rounded-lg"
        >
          User 1
        </button>

        <button
          onClick={loginAsUser2}
          className="px-6 py-3 my-10 text-white bg-green-500 rounded-lg"
        >
          User 2
        </button>
      </div>
      ) : (
        <Chat socket={socket} token={token} />
      )}
      <ToastContainer />
    </main>
  );
}
