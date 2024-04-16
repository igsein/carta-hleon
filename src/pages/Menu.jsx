import { useState, useEffect, useRef } from "react";

import ES from "../ES.json";

import alergenos from "../alergenos/alerjenos.json";
import back from "../assets/back.png";
import logo from "../assets/logo3.png";
import "../App.css";
import up from "../assets/up.png";

function Menu({ intl, setAlergens, setResize }) {
  const [isVisible, setIsVisible] = useState(false);
  const [headerButton, setHeaderButton] = useState("");
  const [count, setCount] = useState(0);
  const [carta, setCarta] = useState("");
  const [viewAddText, setViewAddText] = useState(false);
  const [typesProds, setTypesProds] = useState("");
  const mainRef = useRef(null);
  const [numberElements, setNumberElements] = useState()
  const [printMode,setPrintMode] = useState(false)
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
    if (ES) {
      setCarta(ES);
      allItems(ES)
    }
  }, [ES]);

  const printPage = ()=>{
    setPrintMode(true)
    setResize(true)
    setTimeout(() => {
      
      window.print();
    }, 200);
    setTimeout(() => {
      
      setPrintMode(false)
      setResize(false)
    }, 300);

  }
  useEffect(() => {
    const toggleVisibility = () => {
      const currentScrollPos = window.pageYOffset;

      if (currentScrollPos !== 0) {
        setIsVisible(true);
      } else {
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
    console.log(lower)

    const stringModificado = lower.replace(/(.{30})/g, "$1\n");
    return capitalizeFirstLetter(stringModificado);
  };

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  useEffect(() => {
    if (carta) {
      const tipos = carta.map((typ) => typ.TYPE[intl]);
      let uniqueChars = [...new Set(tipos)];
      console.log(uniqueChars);

      setTypesProds(
        uniqueChars.filter((categories) => categories !== undefined)
      );
    }
  }, [carta]);


  const sliceCarta = ( start, end  ) =>{

 

    const allProducts = typesProds.map((prods, i) => {
      return (
        <>
          <tr key={i} id={prods} >
            <td>
              <h1 style={{fontSize: '1rem', marginTop:       printMode && '-1%', marginBottom:       printMode && '-2%'          }} >{prods}</h1>
            </td>
          </tr>
          {carta
            ? carta
                .filter((cart) => cart.TYPE[intl] === prods)
                .map((prod, i) => {
                  const tipo = prod.TYPE[intl];
                  return (
                    <tr key={i}>

                      {printMode ?
                      
                     <div
                          className={
                            prod.STYLE !== "incremento" &&
                            "container-prod-without-image-hidden"
                          }
                        >
                          <div>
                            <h2 className="h2-without-image-print">
                              {!prod.DESCRIPTION ? (
                                <td
                                  className={
                                    prod.STYLE ? prod.STYLE : ""
                                  }
                                >
                                  {tipo === "PLATOS COMBINADOS"
                                    ? `${i + 1}. `
                                    : ""}
                                  {capitalizeWord(prod.NAME[intl])}
                                </td>
                              ) : (
                                <td>
                                  {tipo === "PLATOS COMBINADOS"
                                    ? `${i + 1}. `
                                    : ""}
                                  {capitalizeWord(prod.NAME[intl])}
                                  {setSelectAlergeno(prod.ALERG)}
                                  <span>
                                    {" "}
                                    {capitalizeWord(
                                      prod.DESCRIPTION
                                    )}
                                  </span>
                                </td>
                              )}
                            </h2>
                          </div>

                          <div>
                            <h3 style={{fontSize: '0.5rem'}}>
                              {" "}
                              {addZeroes(prod.PRICE)}
                              {prod.PRICE ? "€" : ""}
                            </h3>
                          </div>
                          <div className="container-alergenos-without-images">
                            <div className="alergenos">
                              {" "}
                              {setSelectAlergeno(prod.ALERG)}
                            </div>
 
                          </div>
                        </div>
                     :
                     







                     prod.PIC ? (
                      <div
                        className={
                          prod.STYLE !== "incremento" &&
                          "container-prod hidden"
                        }
                      >
                        <div>
                          <h2>
                            {!prod.DESCRIPTION ? (
                              <td
                                className={
                                  prod.STYLE ? prod.STYLE : ""
                                }
                              >
                                {tipo === "PLATOS COMBINADOS"
                                  ? `${i + 1}. `
                                  : ""}
                                {capitalizeWord(prod.NAME[intl])}
                              </td>
                            ) : (
                              <td>
                                {tipo === "PLATOS COMBINADOS"
                                  ? `${i + 1}. `
                                  : ""}
                                {capitalizeWord(prod.NAME[intl])}
                                {setSelectAlergeno(prod.ALERG)}
                                <span>
                                  {" "}
                                  {capitalizeWord(
                                    prod.DESCRIPTION
                                  )}
                                </span>
                              </td>
                            )}
                          </h2>
                        </div>
                        {prod.PIC && printMode  && (
                          <div>
                            <img
                              className="prod-pic"
                              src={`./assets/prods/${prod.PIC}.jpg`}
                            />
                          </div>
                        )}

                        <div>
                          <h3 style={{fontSize: '0.5rem'}}>
                            {" "}
                            {addZeroes(prod.PRICE)}
                            {prod.PRICE ? "€" : ""}
                          </h3>
                        </div>
                        <div className="container-alergenos">
                          <div className="alergenos">
                            {" "}
                            {setSelectAlergeno(prod.ALERG)}
                          </div>
                          {/* <div className="alergenos">
                            {nameAlerg(prod.ALERG)}{" "}
                          </div> */}
                        </div>
                      </div>
                    ) : (
                      <div
                        className={
                          prod.STYLE !== "incremento" &&
                          "container-prod-without-image-hidden"
                        }
                      >
                        <div>
                          <h2 className="h2-without-image-print">
                            {!prod.DESCRIPTION ? (
                              <td
                                className={
                                  prod.STYLE ? prod.STYLE : ""
                                }
                              >
                                {tipo === "PLATOS COMBINADOS"
                                  ? `${i + 1}. `
                                  : ""}
                                {capitalizeWord(prod.NAME[intl])}
                              </td>
                            ) : (
                              <td>
                                {tipo === "PLATOS COMBINADOS"
                                  ? `${i + 1}. `
                                  : ""}
                                {capitalizeWord(prod.NAME[intl])}
                                {setSelectAlergeno(prod.ALERG)}
                                <span>
                                  {" "}
                                  {capitalizeWord(
                                    prod.DESCRIPTION
                                  )}
                                </span>
                              </td>
                            )}
                          </h2>
                        </div>

                        <div>
                          <h3 style={{fontSize: '0.5rem'}}>
                            {" "}
                            {addZeroes(prod.PRICE)}
                            {prod.PRICE ? "€" : ""}
                          </h3>
                        </div>
                        <div className="container-alergenos-without-images">
                          <div className="alergenos">
                            {" "}
                            {setSelectAlergeno(prod.ALERG)}
                          </div>

                        </div>
                      </div>
                    )}





















                     
               
                     </tr>
                  ); 
                })
            : ""}

 
        </>
      );
    }) 
    
    console.log(allProducts.length)
 
   
     return   allProducts.slice(start,end)





  }
 

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

  const setSelectAlergeno = (ids) => {
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

  const nameAlerg = (ids) => {
    if (ids) {
      const arrayAlergenos = [];

      const allids = ids;

      for (let index = 0; index < allids.length; index++) {
        const element = allids[index];

        const filtrado = alergenos.filter((alerg) => alerg.ID === element)[0];
        arrayAlergenos.push(filtrado);
      }

      return arrayAlergenos.map((alerg) => <span>{alerg.NAME}</span>);
    }
  };

  const additionalText = () => {};

  function addZeroes(num) {
    return num.toLocaleString("en", {
      useGrouping: false,
      minimumFractionDigits: 2,
    });
  }

  const menuTexts = {
    es: {
      home: "Inicio",
      alerg: "Alérgenos",
    },
    en: {
      home: "Inicio",
      alerg: "Allergens",
    },
    fr: {
      home: "Inicio",
      alerg: "Allergènes",
    },
  };


 


  const allItems = (ES) =>{

    let numberData =  (ES.length / 3).toFixed(2)
 
    if(!Number.isInteger(numberData)){

      numberData ++

      let numeroSinDecimales = Math.floor(numberData);

      const first =numeroSinDecimales / 3
 
       setNumberElements(first /3)
     }
   }

console.log(intl)

   const textPrint = {

    es: 'Imprimir carta',
    en: 'Print menu',
    fr: 'Imprimer le menu'
   }
 
  return (
    <>
      <div className={ printMode ?"top-container hidden" : "top-container " }  >
        <button
          className="button-two"
          onClick={() => location.reload()}
          style={{ fontWeight: "bolder" }}
        >
          {menuTexts[intl].home}
        </button>
        <button className="button-two" onClick={() => setAlergens(true)}>
          {menuTexts[intl].alerg}
        </button>
      {/*  <button  className="button-two" onClick={()=> printPage()}  >{textPrint[intl]}</button>   */}
        {/*        <img
          src={back}
          style={{height: '50px' }}
          className="backButton"
          onClick={() => location.reload()}
        /> */}
      </div>
      <div className="flip-scale-up-hor">
        <img src={logo} className="logo" />
        <div id="home"   className={printMode &&  "hidden"}   style={{fontSize:  printMode && '1rem' }}>
          {typesProds ?
          
          
          
          
          
          
          
          
          printMode ?


            typesProds.map((prod) => (
              <button className="button">
                <a href={`#${prod}`}>{prod}</a>
              </button>
            )).slice(1,9)
            
            :
            typesProds.map((prod) => (
              <button className="button">
                <a href={`#${prod}`}>{prod}</a>
              </button>
            ))


            : ""
            }
        </div>
        <a href="#">
          {" "}
          {isVisible && (
            <img
              src={up}
              onClick={() => {
                scrollToTop;
              }}
              className="stickybtn"
            />
          )}
        </a>

          { printMode ?  
          
          
          <div className="printer-elements">
          <div>
            <table ref={mainRef} style={{ width: "100%" }}>
              <tr className="separator">
              {typesProds && sliceCarta(0, 3)}
              </tr>
            </table>
          </div>
          <div>
            <table ref={mainRef} style={{ width: "100%" }}>
              <tr className="separator">
                {typesProds && sliceCarta(3, 6)}
              </tr>
            </table>
          </div>
          <div>
            <table ref={mainRef} style={{ width: "100%"  }}>
              <tr className="separator">
                {typesProds &&
                  sliceCarta(6  , 11)}
              </tr>
            </table>
          </div>  
        </div>
           :          
           <table ref={mainRef} style={{ width: "100%" }}>
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
                            .filter((cart) => cart.TYPE[intl] === prods)
                            .map((prod, i) => {
                              const tipo = prod.TYPE[intl];
                              return (
                                <tr key={i}>
                                  {prod.PIC ? (
                                    <div
                                      className={
                                        prod.STYLE !== "incremento" &&
                                        "container-prod"
                                      }
                                    >
                                      <div>
                                        <h2>
                                          {!prod.DESCRIPTION ? (
                                            <td
                                              className={
                                                prod.STYLE ? prod.STYLE : ""
                                              }
                                            >
                                              {tipo === "PLATOS COMBINADOS"
                                                ? `${i + 1}. `
                                                : ""}
                                              {capitalizeWord(prod.NAME[intl])}
                                            </td>
                                          ) : (
                                            <td>
                                              {tipo === "PLATOS COMBINADOS"
                                                ? `${i + 1}. `
                                                : ""}
                                              {capitalizeWord(prod.NAME[intl])}
                                              {setSelectAlergeno(prod.ALERG)}
                                              <span>
                                                {" "}
                                                {capitalizeWord(
                                                  prod.DESCRIPTION
                                                )}
                                              </span>
                                            </td>
                                          )}
                                        </h2>
                                      </div>
                                      {prod.PIC && (
                                        <div>
                                          <img
                                            className="prod-pic"
                                            src={`./assets/prods/${prod.PIC}.jpg`}
                                          />
                                        </div>
                                      )}

                                      <div>
                                        <h3>
                                          {" "}
                                          {addZeroes(prod.PRICE)}
                                          {prod.PRICE ? "€" : ""}
                                        </h3>
                                      </div>
                                      <div className="container-alergenos">
                                        <div className="alergenos">
                                          {" "}
                                          {setSelectAlergeno(prod.ALERG)}
                                        </div>
                                        {/* <div className="alergenos">
                                          {nameAlerg(prod.ALERG)}{" "}
                                        </div> */}
                                      </div>
                                    </div>
                                  ) : (
                                    <div
                                      className={
                                        prod.STYLE !== "incremento" &&
                                        "container-prod-without-image"
                                      }
                                    >
                                      <div>
                                        <h2 className="h2-without-image">
                                          {!prod.DESCRIPTION ? (
                                            <td
                                              className={
                                                prod.STYLE ? prod.STYLE : ""
                                              }
                                            >
                                              {tipo === "PLATOS COMBINADOS"
                                                ? `${i + 1}. `
                                                : ""}
                                              {capitalizeWord(prod.NAME[intl])}
                                            </td>
                                          ) : (
                                            <td>
                                              {tipo === "PLATOS COMBINADOS"
                                                ? `${i + 1}. `
                                                : ""}
                                              {capitalizeWord(prod.NAME[intl])}
                                              {setSelectAlergeno(prod.ALERG)}
                                              <span>
                                                {" "}
                                                {capitalizeWord(
                                                  prod.DESCRIPTION
                                                )}
                                              </span>
                                            </td>
                                          )}
                                        </h2>
                                      </div>

                                      <div>
                                        <h3>
                                          {" "}
                                          {addZeroes(prod.PRICE)}
                                          {prod.PRICE ? "€" : ""}
                                        </h3>
                                      </div>
                                      <div className="container-alergenos-without-images">
                                        <div className="alergenos">
                                          {" "}
                                          {setSelectAlergeno(prod.ALERG)}
                                        </div>
                                        {/* <div className="alergenos">
                                          {nameAlerg(prod.ALERG)}{" "}
                                        </div> */}
                                      </div>
                                    </div>
                                  )}
                                </tr>
                              );
                            })
                        : ""}

                      {/* <tr key={i}>
                      <td>
                        <h1> {prods.TYPE[intl] === "INFO_ADD" ? prods.NAME[intl] : ""}</h1>
                      </td>
                    </tr> */}
                    </>
                  );
                })
              : ""}
          </tr>
        </table>
           }
       </div>
    </>
  );
}

export default Menu;
