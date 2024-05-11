import React from "react";
import logo from "../assets/logo.png";

class RenderProducts extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }
  render() {
    return (
      <>
        <div >
          <div className="printer-elements">
            <div>
              <table style={{ width: "100%" }}>
                <tr className="separator">{this.props.columnOne}</tr>
              </table>
            </div>
            <div>
              <table style={{ width: "100%" }}>
                <tr className="separator">{this.props.columnTwo}</tr>
              </table>
            </div>
            <div>
              <table style={{ width: "100%" }}>
                <tr className="separator">{this.props.columnThree}</tr>
              </table>
            </div>
          </div>

          <div className="printer-footer-elements">
            <img src={logo} />
          </div>
        </div>
      </>
    );
  }
}
export default RenderProducts;
