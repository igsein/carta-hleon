import { useState, useEffect } from "react";
import EN from "../EN.json"
import ES from "../ES.json"
import alergenos from "../alergenos/alerjenos.json";
import logo from "../assets/logo3.png";
import "../App.css";

function Menu({intl}) {
  const [count, setCount] = useState(0);
  const [carta,setCarta] = useState("")
  const [viewAddText, setViewAddText] = useState(false);
  const [typesProds, setTypesProds] = useState("");

 
  function addZeroes(num) {
    return num.toLocaleString("en", {
      useGrouping: false,
      minimumFractionDigits: 2,
    });
  }

  const capitalizeWord = (text) => {
    const lower = text.toLowerCase();

    return capitalizeFirstLetter(lower);
  };

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  useEffect(() => {
    if(carta){


        const tipos = carta.map((typ) => typ.TYPE);

        let uniqueChars = [...new Set(tipos)];
    
        setTypesProds(uniqueChars);
    }
 
  }, [carta]);

  useEffect(() => {
   
    
    if(intl){

        intl ==='ES'? setCarta(ES) :setCarta(EN)
    }
  }, [intl])
  

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

      console.log(arrayAlergenos);

      return arrayAlergenos.map((alerg) => {
        return <img className="alergenos-icon" src={alerg.PIC} />;
      });
    }
  };

  const additionalText = () => {};
  return (
    <div className="flip-scale-up-hor">
      <img src={logo} className="logo" />
      <table>
        <tr className="separator">
        {typesProds
          ? typesProds.map((prods, i) => {
              return (
                <>
                  <tr key={i}>
                    <td>
                      <h1>{prods}</h1>
                    </td>
                  </tr>
                  {carta
                    ? carta
                        .filter((cart) => cart.TYPE === prods)
                        .map((prod, i) => {
                          const tipo = prod.TYPE;
                          console.log(prod.DESCRIPTION);
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
