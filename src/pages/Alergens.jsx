import React from "react";
import alergensJson from "../alergenos/alerjenos.json";

const Alergens = ({intl, setAlergens}) => {
 

  const menuTexts = {

    "es": {
      "home": "Inicio",
      "alerg": "Alérgenos"
    
    
    },
    "en": {
      "home": "Inicio",
      "alerg": "Allergens"
    
    
    },
    "fr": {
      "home": "Inicio",
      "alerg": "Allergènes"
    
    
    }
}


  return (<>
        <div className="top-container">
        <button className="button-two"
             onClick={() => location.reload()}
        >
          {menuTexts[intl].home}
        </button>
        <button className="button-two" 
        onClick={()=>setAlergens(false)}
        >
        {menuTexts[intl].alerg}
        </button>
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
              <img  className="table-alerg-img" src={aler.PIC} />
            </td>
          </tr>
        );
      })}
    </table>
  
  </>
   
  );
};

export default Alergens;
