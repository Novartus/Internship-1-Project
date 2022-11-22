// import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

import "../styles/search.css";
function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <ToastContainer
        position="top-right"
        autoClose={false}
        hideProgressBar={false}
        newestOnTop={false}
        draggable={false}
        pauseOnVisibilityChange
        closeOnClick={false}
        pauseOnHover
      />
    </>
  );
}

export default MyApp;
