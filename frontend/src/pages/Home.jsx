import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Carousel } from "react-bootstrap";
import SubscriptionBox from './SubscriptionBox';
import Carouselandsub from './Carouselandsubs.jsx'

const Home = () => {

  async function checkout() {
    console.log("asdasd");
    try {
      const response = await axios({
        method: "post",
        url: `http://localhost:${import.meta.env.VITE_PORT}/payment`,
        headers: { "Content-Type": "application/json" },
        //data will equal to payment fee of service id instead of items
        data: {
          id: 1,
          // items: [
          //   { id: 1, quantity: 3 },
          //   { id: 2, quantity: 1 },
          // ],
        },
      });
      console.log(response);
      if (response) {
        window.location = response.data.url;
      }
    } catch (e) {
      console.log(e);
    }
    // () => {
    //   fetch("http://localhost:3001/payment", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       items: [
    //         { id: 1, quantity: 3 },
    //         { id: 2, quantity: 1 },
    //       ],
    //     }),
    //   })
    //     .then((res) => {
    //       console.log(res)
    //       if (res.ok) return res.json();
    //       return res.json().then((json) => Promise.reject(json));
    //     })
    //     .then(({ url }) => {
    //       window.location = url;
    //     })
    //     .catch((e) => {
    //       console.error(e.error);
    //     });
    // };
  }

  const navigate = useNavigate();

  return (
    <div>
      <div className="App">
        <h1>This is the home page.</h1>
        <div className="card"></div>
        <button onClick={checkout}>Checkout</button>
        <button onClick={() => navigate("auth/signup")}>Signup</button>
        <button onClick={() => navigate("provierlogin")}>Login</button>
        <button onClick={() => navigate("clientlogin")}>Client Login</button>
        <button onClick={() => navigate("/customeraccount")}>Customer Accunt Contact</button>
      </div>
    <Carouselandsub />
    </div>
  );
};

export default Home;
