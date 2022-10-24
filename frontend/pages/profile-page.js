import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function profilePage() {
  const router = useRouter();
  const [image, setImage] = useState("N/A");
  const [bio, setBio] = useState("N/A");
  const [email, setEmail] = useState("N/A");
  const [name, setName] = useState("N/A");
  const [phone, setPhone] = useState("N/A");
  const [password, setPassword] = useState("N/A");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
    }
  }, []);
  const fetchProfile = async () => {
    const profile = await axios({
      method: "GET",
      url: "http://localhost:3000/auth/profile",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    console.log("Profile", profile.data);
    if (profile.request.status === 200) {
      setImage(profile.data?.profileImage);
      setBio(profile.data?.bio);
      setEmail(profile.data?.email);
      setName(profile.data?.name);
      setPhone(profile.data?.phone);
      setPassword(profile.data?.password);
    } else {
      alert("Something went wrong while fetching the profile");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-cyan-50">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-50 text-center">
        <div className="p-8">
          <div className="">
            <h2 className="font-bold text-blue-900 mb-5 text-4xl">
              Profile Details
            </h2>
            <div className="bg-blue-900 border-2 w-4 border-blue-900 inline-block mb-2"></div>
            <div className="flex flex-col items-center">
              {image && (
                <div className="bg-gray-100 w-72 p-3 flex items-center mb-3">
                  Image:-
                  {/* <FaEnvelope className="text-gray-400 mr-2" /> */}
                  <input
                    type="text"
                    name="profileImage"
                    placeholder={image}
                    className="bg-gray-100 outline-none text-base flex-2"
                    readOnly={true}
                  />
                </div>
              )}
              <div className="bg-gray-100 w-72 p-3 flex items-center mb-3">
                Bio:-
                {/* <FaEnvelope className="text-gray-400 mr-2" /> */}
                <input
                  type="text"
                  name="bio"
                  placeholder={bio}
                  className="bg-gray-100 outline-none text-base flex-2"
                  readOnly={true}
                />
              </div>
              <div className="bg-gray-100 w-72 p-3 flex items-center mb-3">
                Email:-
                {/* <FaEnvelope className="text-gray-400 mr-2" /> */}
                <input
                  type="email"
                  name="email"
                  placeholder={email}
                  className="bg-gray-100 outline-none text-base flex-2"
                  readOnly={true}
                />
              </div>
              <div className="bg-gray-100 w-72 p-3 flex items-center mb-3">
                Phone:-
                {/* <FaEnvelope className="text-gray-400 mr-2" /> */}
                <input
                  type="phone"
                  name="phone"
                  placeholder={phone}
                  className="bg-gray-100 outline-none text-base flex-2"
                  readOnly={true}
                />
              </div>
              <div className="bg-gray-100 w-72 p-3 flex items-center mb-3">
                Name:-
                {/* <FaEnvelope className="text-gray-400 mr-2" /> */}
                <input
                  type="name"
                  name="name"
                  placeholder={name}
                  className="bg-gray-100 outline-none text-base flex-2"
                  readOnly={true}
                />
              </div>
              <div className="bg-gray-100 w-72 p-3 flex items-center mb-3">
                Password:-
                {/* <FaEnvelope className="text-gray-400 mr-2" /> */}
                <input
                  type="password"
                  name="password"
                  placeholder="******"
                  className="bg-gray-100 outline-none text-base flex-2"
                  readOnly={true}
                />
              </div>
              <a
                href="editprofile"
                className="border-2 text-blue-900 border-blue-800 rounded-full px-12 py-2 inline-block font-semibold hover:bg-blue-900 hover:text-white"
              >
                Update Your Profile
              </a>
              <a
                href="/"
                onClick={() => {
                  localStorage.removeItem("token");
                }}
                className="border-2 text-blue-900 border-blue-800 rounded-full px-12 py-2 my-3 inline-block font-semibold hover:bg-blue-900 hover:text-white"
              >
                SignOut
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
