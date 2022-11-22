import React, { useState } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import axios from "axios";

const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const ImageViewer = ({ url, label }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const notify = () => {
    let password = "";
    toast.info(
      <div>
        <input
          type="password"
          id="label"
          placeholder="Enter Your password to delete"
          style={{ width: "100%" }}
          onChange={(e) => {
            password = e.target.value;
          }}
        />
        <button
          className="btn"
          style={{
            float: "right",
            fontSize: "20px",
            color: "black",
            border: "none",
            borderRadius: "5px",
            margin: "10px",
            cursor: "pointer",
          }}
          onClick={async () => {
            const label = document.getElementById("label").value;
            await checkPasswordAPI(password);
            deletePictureAPI(label);
            toast.dismiss();
          }}
        >
          Submit
        </button>
      </div>
    );
  };

  const [mouseEntered, setMouseEntered] = useState(false);

  const checkPasswordAPI = async (password) => {
    const backendUrl = "http://localhost:3000/auth/check-password";
    const response = await axios({
      method: "POST",
      url: backendUrl,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      data: {
        password: password,
      },
    });
    if (response.status !== 200 || response.status !== 201) {
      alert("Invalid Password, Can not delete Image!");
      return;
    }
  };

  const deletePictureAPI = async (label) => {
    // alert("password", label);
    const backendUrl = "http://localhost:3000/auth/image/delete";
    const response = await axios({
      method: "DELETE",
      url: backendUrl,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      data: {
        image: url,
      },
    });

    if (response.status === 200) {
      //refresh page
      window.location.reload();
    } else {
      alert("Something went wrong during photo deletion");
    }
  };

  const changePictureAPI = async () => {
    const formData = new FormData();
    formData.append("image", selectedImage);
    formData.append("imageURL", url);
    console.log("formData", formData);

    const backendUrl = "http://localhost:3000/auth/image/update";
    const response = await axios({
      method: "PATCH",
      url: backendUrl,
      data: formData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (response.status === 200) {
      window.location.reload();
    } else {
      alert("Something went wrong during photo update");
    }
  };

  return (
    <React.Fragment>
      <div onMouseLeave={(e) => setMouseEntered(false)}>
        {mouseEntered && (
          <button
            style={{
              float: "right",
              fontSize: "20px",
              color: "blue",
              border: "none",
              borderRadius: "5px",
              margin: "10px",
              cursor: "pointer",
            }}
            onClick={notify}
          >
            Hover Delete
          </button>
        )}
        {mouseEntered && (
          <span
            style={{
              float: "right",
              fontSize: "20px",
              color: "pink",
              border: "none",
              borderRadius: "5px",
              margin: "10px",
            }}
          >
            Image Label:{" " + label}
          </span>
        )}
        {mouseEntered && (
          <div>
            <span
              style={{
                float: "left",
                fontSize: "20px",
                color: "pink",
                border: "none",
                borderRadius: "5px",
                margin: "10px",
              }}
            >
              Change Image:
            </span>
            <input
              style={{
                float: "left",
                fontSize: "14px",
                color: "pink",
                border: "none",
                borderRadius: "5px",
                margin: "10px",
              }}
              type="file"
              name="myImage"
              onChange={(event) => {
                setSelectedImage(event.target.files[0]);
              }}
            />
            <button
              style={{
                float: "left",
                fontSize: "14px",
                color: "black",
                borderRadius: "5px",
                margin: "10px",
              }}
              onClick={changePictureAPI}
            >
              Change Image
            </button>
            <button
              style={{
                float: "left",
                fontSize: "14px",
                color: "black",
                borderRadius: "5px",
                margin: "10px",
              }}
              onClick={() => setSelectedImage(null)}
            >
              Clear
            </button>
          </div>
        )}
        <span>{}</span>
        <Img
          src={selectedImage ? URL.createObjectURL(selectedImage) : url}
          alt=""
          onMouseEnter={(e) => setMouseEntered(true)}
        ></Img>
      </div>
      <button
        style={{
          margin: 10,
        }}
        onClick={notify}
      >
        Delete Image
      </button>
    </React.Fragment>
  );
};
