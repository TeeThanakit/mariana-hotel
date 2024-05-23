"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from 'next/dynamic';

const Notification = dynamic(() => import("@/components/ui/notification"));
const FaUserLock = dynamic(() => import("react-icons/fa").then(module => module.FaUserLock));

export default function LoginPage() {
  const enteredUsername = useRef();
  const enteredPassword = useRef();
  const [requestStatus, setRequestStatus] = useState(); // 'pending', 'success', 'error'
  const [requestError, setRequestError] = useState();
  const router = useRouter();

  async function authenticateUser(credentials) {
    console.log('Sending credentials:', credentials);  // Add logging to see exactly what is sent
    try {
      const response = await fetch('http://localhost:5001/api/login', {
        method: "POST",
        body: JSON.stringify(credentials),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Authentication failed");
      }
      return data;
    } catch (error) {
      console.error('Authentication error:', error.message);
      throw error;
    }
  }

  async function submitHandler(event) {
    event.preventDefault();
    const username = enteredUsername.current.value;
    const password = enteredPassword.current.value;

    setRequestStatus("pending");
    try {
      const userData = await authenticateUser({ username, password });
      setRequestStatus("success");

      // Redirect based on role
      switch (userData.role) {
        case "CEO":
          router.push('/ceo');
          break;
        case "janitor":
          router.push('/janitor');
          break;
        case "staff":
          router.push('/staff');
          break;
        default:
          router.push('/');
          break;
      }
    } catch (error) {
      setRequestError(error.message);
      setRequestStatus("error");
    }
  }

  let notification;

  if (requestStatus === "pending") {
    notification = {
      status: "pending",
      title: "Logging in...",
      message: "Please wait while we verify your credentials.",
    };
  }

  if (requestStatus === "success") {
    notification = {
      status: "success",
      title: "Success!",
      message: "Logged in successfully!",
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
          <span className="text-patty-blue">Login</span> Page
        </h1>
        <form onSubmit={submitHandler}>
          <p className="flex flex-col pt-3">
            <label>Username</label>
            <input
              type="text"
              required
              ref={enteredUsername}
              className="border border-solid border-gray-300 p-2"
            />
          </p>
          <p className="flex flex-col pt-3">
            <label>Password</label>
            <input
              type="password"
              required
              ref={enteredPassword}
              className="border border-solid border-gray-300 p-2"
            />
          </p>
          <div className="flex justify-end pt-5 pr-4 mb-11">
            <button className="bg-patty-blue p-3 rounded-2xl">Login</button>
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
    </section>
  );
}
