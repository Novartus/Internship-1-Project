import React, { useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import { useRouter } from "next/router";

const UploadAndDisplayImage = () => {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(null);
  const [label, setLabel] = useState("");
  const handleImageUpload = async () => {
    if (!label) {
      alert("Please enter a label for the image");
      return;
    }
    const formData = new FormData();
    formData.append("image", selectedImage);
    formData.append("label", label);
    const uploadImageAPI = "http://localhost:3000/auth/upload";
    const response = await axios({
      method: "POST",
      url: uploadImageAPI,
      data: formData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (response.status !== 201 || response.status !== 200) {
      alert("Image uploaded successfully");
      router.push("/gallery");
    } else {
      alert("Something went wrong during image upload");
    }
  };

  return (
    <div>
      <Header />
      <h1>Upload a new image</h1>
      {selectedImage && (
        <div>
          <img
            alt="not found"
            width={"250px"}
            src={URL.createObjectURL(selectedImage)}
          />
          <br />
          <button
            style={{
              margin: 10,
            }}
            onClick={() => setSelectedImage(null)}
          >
            Remove
          </button>
          <br />

          <input
            type={"text"}
            placeholder="Enter Label for image"
            onChange={(e) => {
              setLabel(e.target.value);
            }}
            required={true}
          />

          <button
            style={{
              margin: 10,
            }}
            onClick={handleImageUpload}
          >
            Upload
          </button>
        </div>
      )}
      <br />
      <br />
      <input
        type="file"
        name="myImage"
        onChange={(event) => {
          setSelectedImage(event.target.files[0]);
        }}
      />
    </div>
  );
};

export default UploadAndDisplayImage;
