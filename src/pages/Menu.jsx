import { useState, useEffect, useRef } from "react";
import EN from "../EN.json";
import ES from "../ES.json";
import alergenos from "../alergenos/alerjenos.json";
import logo from "../assets/logo3.png";
import "../App.css";
import up from "../assets/up.png";

function Menu({ intl }) {
  const [isVisible, setIsVisible] = useState(false);
  const [count, setCount] = useState(0);
  const [carta, setCarta] = useState("");
  const [viewAddText, setViewAddText] = useState(false);
  const [typesProds, setTypesProds] = useState("");
  const mainRef = useRef(null);
  const [scrollTo, setScrollTo] = useState("none");
  const prevScrollPos = useRef(0);
  function addZeroes(num) {
    return num.toLocaleString("en", {
      useGrouping: false,
      minimumFractionDigits: 2,
    });
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const toggleVisibility = () => {
      const currentScrollPos = window.pageYOffset;
 

      if(currentScrollPos!==0){
        setIsVisible(true);
      }else{
        setIsVisible(false);
      }
      
      // Button is displayed after scrolling for 500 pixels
      
        

      prevScrollPos.current = currentScrollPos;
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, [isVisible]);
  const capitalizeWord = (text) => {
    const lower = text.toLowerCase();

    return capitalizeFirstLetter(lower);
  };

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  useEffect(() => {
    if (carta) {
      const tipos = carta.map((typ) => typ.TYPE);

      let uniqueChars = [...new Set(tipos)];

      setTypesProds(uniqueChars);
    }
  }, [carta]);

 
  useEffect(() => {
    if (intl) {
      intl === "ES" ? setCarta(ES) : setCarta(EN);
    }
  }, [intl]);

  const deleteDuplicates = (array) => {
    var uniq = {};
    var arrFiltered = array
      .filter((obj) => !uniq[obj.name] && (uniq[obj.name] = true))
      .filter((obj) => obj.name !== "");
    return arrFiltered;
  };

  const searchAlergenos = (ids) => {
    if (ids) {
      const arrayAlergenos = [];

      const allids = ids;

      for (let index = 0; index < allids.length; index++) {
        const element = allids[index];

        const filtrado = alergenos.filter((alerg) => alerg.ID === element)[0];
        arrayAlergenos.push(filtrado);
      }

 
      return arrayAlergenos.map((alerg) => {
        return <img className="alergenos-icon" src={alerg.PIC} />;
      });
    }
  };

  const additionalText = () => {};
  return (
    <div className="flip-scale-up-hor">
      <img src={logo} className="logo" /> 
      <div id="home">
        {typesProds &&
          typesProds.map((prod) => (
            <button className="button" >
              <a href={`#${prod}`}>{prod}</a>
            </button>
          ))}
      </div>
      <a href="#">
        {" "}

        {isVisible &&  <img src={up} onClick={()=>{scrollToTop }}  className="stickybtn"   />} 
       
      </a>

      <table ref={mainRef}>
        <tr className="separator">
          {typesProds
            ? typesProds.map((prods, i) => {
                return (
                  <>
                    <tr key={i} id={prods}>
                      <td>
                        <h1>{prods}</h1>
                      </td>
                    </tr>
                    {carta
                      ? carta
                          .filter((cart) => cart.TYPE === prods)
                          .map((prod, i) => {
                            const tipo = prod.TYPE;
                            return (
                              <tr key={i} className="tr-menu">
                                {!prod.DESCRIPTION ? (
                                  <td className={prod.STYLE ? prod.STYLE : ""}>
                                    {tipo === "PLATOS COMBINADOS"
                                      ? `${i + 1}. `
                                      : ""}
                                    {capitalizeWord(prod.NAME)}
                                    {searchAlergenos(prod.ALERG)}
                                  </td>
                                ) : (
                                  <td>
                                    {tipo === "PLATOS COMBINADOS"
                                      ? `${i + 1}. `
                                      : ""}
                                    {capitalizeWord(prod.NAME)}
                                    {searchAlergenos(prod.ALERG)}
                                    <span>
                                      {" "}
                                      {capitalizeWord(prod.DESCRIPTION)}
                                    </span>
                                  </td>
                                )}

                                <td></td>
                                <td className="price">
                                  {addZeroes(prod.PRICE)}
                                  {prod.PRICE ? "€" : ""}
                                </td>
                              </tr>
                            );
                          })
                      : ""}

                    <tr key={i}>
                      <td>
                        <h1> {prods.TYPE === "INFO_ADD" ? prods.NAME : ""}</h1>
                      </td>
                    </tr>
                  </>
                );
              })
            : ""}
        </tr>
      </table>
    </div>
  );
}

export default Menu;
