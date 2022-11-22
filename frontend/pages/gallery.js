import React, { useState, useEffect } from "react";
import { Heading } from "../components/Heading";
import { ImageViewer } from "../components/ImageViewer";
import { Loader } from "../components/Loader";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";

import styled from "styled-components";
import { createGlobalStyle } from "styled-components";
import Header from "../components/Header";

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  body {
    font-family: sans-serif;
  }
`;

const WrapperImages = styled.section`
  max-width: 70rem;
  margin: 4rem auto;
  display: grid;
  grid-gap: 1em;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  grid-auto-rows: 300px;
`;

function Gallery() {
  const [images, setImage] = useState([
    {
      _id: "6377d684fb60c9812dac1884",
      url: "http://placehold.it/32x32",
      label: "test",
    },
  ]);

  useEffect(() => {
    fetchImages();
  }, []);

  const [token, setToken] = useState(null);
  useEffect(async () => {
    setToken(localStorage.getItem("token"));
    if (token) {
      await fetchImages();
    } else {
      // do something Abhee!
    }
  }, []);

  const filterImageByLabel = (label) => {
    const filteredImages = images.filter((image) => image.label === label);
    setImage(filteredImages);
  };

  const fetchImages = async (count = 10) => {
    const backendUrl = "http://localhost:3000/auth/all/images";
    const callAPI = await axios({
      method: "GET",
      url: backendUrl,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (callAPI.status === 200) {
      // re-order data in descending date order
      const data = callAPI.data;
      const sortedData = data.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });
      setImage(sortedData);
    } else {
      alert("Something went wrong");
    }
  };

  return (
    <div>
      <Header />
      <Heading />
      <div>
        <form
          className="p-3"
          onSubmit={(e) => {
            e.preventDefault();
            console.log("submit", e.target.label.value);
            filterImageByLabel(e.target.label.value);
            if (!e.target.label.value) {
              fetchImages();
            }
          }}
        >
          <br />
          <div className="col-12 col-md-8 container">
            <input
              id="label"
              type={"text"}
              placeholder="Search by image label..."
            />
            {/* <button className="fas fa-search btn" id="search-btn"></button> */}
          </div>
          <br />
        </form>
      </div>
      <GlobalStyle />
      <InfiniteScroll
        dataLength={images.length}
        next={fetchImages}
        hasMore={false}
        loader={<Loader />}
      >
        <WrapperImages>
          {images.map((image, key) => (
            <div key={key}>
              <ImageViewer url={image.url} key={key} label={image.label} />
            </div>
          ))}
        </WrapperImages>
      </InfiniteScroll>
    </div>
  );
}

export default Gallery;
