import React, { useState } from "react";
import Logo from "../assets/logo3.png";
import Spain from "../assets/locale/es.png";
import england from "../assets/locale/en.png";
import fr from "../assets/locale/fr.png";
import Menu from "./Menu";
import Alergens from "./Alergens"
import Slider from "./Slider"

const Home = ({setResize}) => {
  const [intl, setIntl] = useState("");
  const [alergens,setAlergens]= useState(false)

  return (
    <>
      {!intl ? (
        <div className="home-container">
          <div className="title-home">
            <p className="p-title">HOSTAL-BAR LEÓN</p>
            <p className="p-title">(TORREORGAZ)</p>
            <p>
              {" "}
              <h6>Telf. 927 20 50 94</h6>
            </p>
            <img src={Logo} className="logo-home" />

            <div className="title-restaurant"></div>
          </div>

          <div className="container-countries">
            <img
              src={Spain}
              alt=""
              className="img-countries"
              onClick={() => setIntl("es")}
            />
            <img
              src={england}
              alt=""
              className="img-countries"
              onClick={() => setIntl("en")}
            />
            <img
              src={fr}
              alt=""
              className="img-countries"
              onClick={() => setIntl("fr")}
            />{" "}
          </div>
          <Slider />
        </div>
      ) : (
        alergens ?
        <Alergens intl={intl} setAlergens={setAlergens} /> :
        <Menu intl={intl} setAlergens={setAlergens} setResize={setResize} />
      )}
    </>
  );
};

export default Home;
