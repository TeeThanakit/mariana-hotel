"use client";

import { useRef, useState, useEffect } from "react";
import Notification from "@/components/ui/notification";
import { FaRegBuilding, FaEnvelope } from "react-icons/fa";
import { MdLocalPhone } from "react-icons/md";

// Fake API
async function sendContactData(contactDetails) {
  const response = await fetch('http://43.229.135.65:5001/api/contacts', {
    method: "POST",
    body: JSON.stringify(contactDetails),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Something went wrong!");
  }
}


export default function ContactForm() {
  const enteredName = useRef();
  const enteredEmail = useRef();
  const enteredMessage = useRef();
  const [requestStatus, setRequestStatus] = useState(); // 'pending', 'success', 'error'
  const [requestError, setRequestError] = useState();

  useEffect(() => {
    if (requestStatus === "success" || requestStatus === "error") {
      const timer = setTimeout(() => {
        setRequestStatus(null);
        setRequestError(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [requestStatus]);

  async function submitHandler(event) {
    event.preventDefault();
    // Client Vaildation????
    setRequestStatus("pending");
    try {
      await sendContactData({
        name: enteredName.current.value,
        email: enteredEmail.current.value,
        message: enteredMessage.current.value,
      });
      setRequestStatus("success");
      enteredName.current.value = "";
      enteredEmail.current.value = "";
      enteredMessage.current.value = "";
    } catch (error) {
      setRequestError(error.message);
      setRequestStatus("error");
    }
  }

  let notification;

  if (requestStatus === "pending") {
    notification = {
      status: "pending",
      title: "Sending message...",
      message: "Your message is on its way!",
    };
  }

  if (requestStatus === "success") {
    notification = {
      status: "success",
      title: "Success!",
      message: "Message sent successfully!",
    };
  }

  if (requestStatus === "error") {
    notification = {
      status: "error",
      title: "Error!",
      message: requestError,
    };
  }

  return (
    <section>
      <div className="mx-auto max-w-4xl justify-start">
        <h1 className="text-5xl pt-10">
          <span className="text-patty-blue">Contact</span> Us
        </h1>
        <p className="py-4">Please fill out the form below to contact us</p>
        <form onSubmit={submitHandler}>
          <p className="flex flex-col pt-3">
            <label>Name</label>
            <input
              type="text"
              required
              ref={enteredName}
              className="border border-solid border-gray-300 p-2"
            />
          </p>
          <p className="flex flex-col pt-3">
            <label>Email</label>
            <input
              type="text"
              required
              ref={enteredEmail}
              className="border border-solid border-gray-300 p-2"
            />
          </p>
          <p className="flex flex-col pt-3">
            <label>Message</label>
            <textarea
              rows={5}
              required
              ref={enteredMessage}
              className="border border-solid border-gray-300 p-2"
            />
          </p>
          <div className="flex justify-end pt-5 pr-4 mb-11">
            <button className="bg-patty-blue p-3 rounded-2xl">Submit</button>
          </div>
        </form>
        {notification && (
          <Notification
            status={notification.status}
            title={notification.title}
            message={notification.message}
          />
        )}
      </div>

      <div className="bg-patty-blue mt-4 h-60">
        <div className="mx-auto max-w-5xl flex h-full">
          <div className="flex flex-col w-1/3 items-center justify-center">
            <i><FaRegBuilding className="size-20"/></i>
            <h3>Location</h3>
            <p>KMUTT</p>
          </div>
          <div className="flex flex-col w-1/3 items-center justify-center">
            <i><MdLocalPhone className="size-20"/></i>
            <h3>Phone Number</h3>
            <p>081-564-8974</p>
          </div>
          <div className="flex flex-col w-1/3 items-center justify-center">
            <i><FaEnvelope className="size-20"/></i>
            <h3>Email</h3>
            <p>cpe36inter@kmutt.com</p>
          </div>
        </div>
      </div>
    </section>
  );
}
