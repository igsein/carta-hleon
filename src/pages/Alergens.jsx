import React from "react";
import alergensJson from "../alergenos/alerjenos.json";
import ReactToPrint from "react-to-print";
import RenderProducts from "./RenderProducts";

const Alergens = ({ intl, setAlergens }) => {
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

  return (
    <>
      <div className="top-container">
        <button className="button-two" onClick={() => location.reload()}>
          {menuTexts[intl].home}
        </button>
        <button className="button-two" onClick={() => setAlergens(false)}>
          {menuTexts[intl].alerg}
        </button>

        <ReactToPrint
          pageStyle={pageStyle}
          trigger={() => (
            <button
              style={{
                width: "20%",
                margin: "1%",
                paddingTop: "1%",
                paddingLeft: "1.2%",
                paddingRight: "2%",
                paddingBottom: "4%",
                paddingTop: "2%",
                fontSize: "1.4rem",
              }}
              className="header-btn"
            >
              Imprimir Factura
            </button>
          )}
          content={() => componentRef}
        />
        <RenderProducts ref={(el) => (componentRef = el)} />

        {/*        <img
          src={back}
          style={{height: '50px' }}
          className="backButton"
          onClick={() => location.reload()}
        /> */}
      </div>
      <table className="table-alerg">
        {alergensJson.map((aler) => {
          return (
            <tr>
              <td>{aler.NAME[intl]}</td>
              <td>
                <img className="table-alerg-img" src={aler.PIC} />
              </td>
            </tr>
          );
        })}
      </table>
    </>
  );
};

export default Alergens;
