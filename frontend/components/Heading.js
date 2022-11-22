import React from "react";
import styled from "styled-components";
import { useRouter } from "next/router";

const Header = styled.header`
  max-width: 70rem;
  margin: 2rem auto;
  text-align: center;
`;

const H1 = styled.h1`
  font-family: "Oswald", sans-serif;
  margin-bottom: 1em;
`;

export const Heading = () => {
  const router = useRouter();
  return (
    <Header>
      <H1>Image Gallery</H1>
      <button
        style={{
          float: "right",
          fontSize: "20px",
          color: "black",
          border: "none",
          borderRadius: "5px",
          margin: "10px",
          cursor: "pointer",
        }}
        onClick={() => {
          router.push("/upload");
        }}
      >
        Upload Image
      </button>
      {/* <form>
        <Input type="text" placeholder="Search photos" />
        <Button>Search</Button>
      </form> */}
    </Header>
  );
};
