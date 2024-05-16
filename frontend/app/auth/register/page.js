"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Notification from "@/components/ui/notification";

async function sendStaffData(staffDetails) {
  const response = await fetch("http://localhost:5001/api/register-staff", {
    method: "POST",
    body: JSON.stringify(staffDetails),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Something went wrong!");
  }
  return data;
}

export default function Register() {
  const [enteredName, setEnteredName] = useState("");
  const [enteredLastName, setEnteredLastName] = useState("");
  const [enteredPhone, setEnteredPhone] = useState("");
  const [enteredEmail, setEnteredEmail] = useState("");

  const [enteredUsername, setEnteredUsername] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");
  const [userPermission, setUserPermission] = useState("");

  const [requestStatus, setRequestStatus] = useState(); // 'pending', 'success', 'error'
  const [requestError, setRequestError] = useState();
  const router = useRouter();

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
    setRequestStatus("pending");

    try {
      await sendStaffData({
        name: enteredName,
        lastname: enteredLastName,
        phoneNumber: enteredPhone,
        email: enteredEmail,
        username: enteredUsername,
        password: enteredPassword,
        permission: userPermission,
      });
      setRequestStatus("success");
      //router.push('/');  // Redirect to home or another page //ดูมีประโยชน์ดี มั้ง
    } catch (error) {
      setRequestError(error.message);
      setRequestStatus("error");
    }
  }

  let notification;

  if (requestStatus === "pending") {
    notification = {
      status: "pending",
      title: "Updating information...",
      message: "Your staff info is on its way!",
    };
  }

  if (requestStatus === "success") {
    notification = {
      status: "success",
      title: "Success!",
      message: "Staff info updated successfully!",
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
    <div className="mx-auto max-w-5xl">
      <form onSubmit={submitHandler}>
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-3xl p-5">Personal Information</h1>
          <div className="flex">
            <p className="p-3">
              <label className="px-3">Name</label>
              <input
                type="text"
                required
                className="border border-solid border-gray-300 p-2"
                onChange={(event) => setEnteredName(event.target.value)}
              />
            </p>
            <p className="p-3">
              <label className="px-3">Last Name</label>
              <input
                type="text"
                required
                className="border border-solid border-gray-300 p-2"
                onChange={(event) => setEnteredLastName(event.target.value)}
              />
            </p>
          </div>

          <div className="flex">
            <p className="p-3">
              <label className="px-3">Phone number</label>
              <input
                type="text"
                required
                className="border border-solid border-gray-300 p-2"
                onChange={(event) => setEnteredPhone(event.target.value)}
              />
            </p>
            <p className="p-3">
              <label className="px-3">Email</label>
              <input
                type="email"
                required
                className="border border-solid border-gray-300 p-2"
                onChange={(event) => setEnteredEmail(event.target.value)}
              />
            </p>
          </div>
        </div>

        <div className="p-8 flex flex-col justify-center items-center">
          <h1 className="text-3xl">Register</h1>
          <div className="flex py-3">
            <p className="">
              <label className="px-3">User name</label>
              <input
                type="text"
                required
                className="border border-solid border-gray-300 p-2"
                onChange={(event) => setEnteredUsername(event.target.value)}
              />
            </p>
            <p className="">
              <label className="px-3">Password</label>
              <input
                type="text"
                required
                className="border border-solid border-gray-300 p-2"
                onChange={(event) => setEnteredPassword(event.target.value)}
              />
            </p>
          </div>
          <fieldset
            required
            onChange={(event) => setUserPermission(event.target.value)}
          >
            <div className="flex items-center">
              <div className="px-3">
                <label>User Permission</label>
              </div>
              <input type="radio" id="admin" value="admin" name="Permission" />
              <label htmlFor="admin" className="pr-2">
                Admin
              </label>
              <input type="radio" id="staff" value="staff" name="Permission" />
              <label htmlFor="staff" className="pr-2">
                Staff
              </label>
              <input
                type="radio"
                id="janitor"
                value="janitor"
                name="Permission"
              />
              <label htmlFor="janitor" className="pr-2">
                Janitor
              </label>
            </div>
          </fieldset>
        </div>
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
  );
}
