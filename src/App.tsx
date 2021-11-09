import React, { useState } from "react";
import "./App.css";
import { Container, Form, InputGroup, Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "bootstrap/dist/css/bootstrap.css";
import { faDollarSign, faPercent } from "@fortawesome/free-solid-svg-icons";
import Intro from "./intro";

interface investmentType {
  before: number,
  after: number,
  targetPercent: number,
  afterPercent: number,
  investment: number
}

interface totalType {
  before: number,
  after: number
}

const toPercent = (x: number) => Math.round(100 * x);

const ResultTable: React.FC<{ name: string, element: investmentType, total: totalType }> = ({ name, element, total }) => {
  return (<tr>
    <td>{name}</td>
    <td><FontAwesomeIcon icon={faDollarSign} />{element.investment}</td>
    <td><FontAwesomeIcon icon={faDollarSign} />{Math.round(element.after)}</td>
    <td>{toPercent(element.afterPercent)}<FontAwesomeIcon icon={faPercent} className="float-end" /></td>
  </tr>);
};


const App = () => {

  const [investment, setInvestment] = useState(0);

  const initialValue = { before: 0, targetPercent: 0, investment: 0, afterPercent: 0, after: 0}

  const [vbtlx, setVbtlx] = useState({...initialValue});
  const [vtiax, setVtiax] = useState({...initialValue});
  const [vtsax, setVtsax] = useState({...initialValue});
  const [total, setTotal] = useState({ before: 0, after: 0 });


  const onClickBefore = (valueString: string, type: string) => {
    const value = parseFloat(valueString);
    let beforeSum: number = 0;

    if (type === "vbtlx") {
      beforeSum = value + vtiax.before + vtsax.before;
      setVbtlx({
        ...vbtlx,
        before: value,
      });
    } else if (type === "vtiax") {
      beforeSum = vbtlx.before + value + vtsax.before;
      setVtiax({
        ...vtiax,
        before: value,
      });
    } else if (type === "vtsax") {
      beforeSum = vbtlx.before + vtiax.before + value;
      setVtsax({
        ...vtsax,
        before: value,
      });
    }
    setTotal({ ...total, before: beforeSum });
  };


  const onClickTargetPercent = (valueString: string, type: string) => {
    const value = parseFloat(valueString) / 100;

    if (type === "vbtlx") {
      setVbtlx({ ...vbtlx, targetPercent: value });
    } else if (type === "vtiax") {
      setVtiax({ ...vtiax, targetPercent: value });
    } else if (type === "vtsax") {
      setVtsax({ ...vtsax, targetPercent: value });
    }
  };

  const computeFinal = (valueString: string) => {
    const value = parseFloat(valueString);
    const totalFinal = value + total.before;
    setTotal({...total, after: totalFinal})

    setInvestment(value);

    let vbtlxInvestment: number = vbtlx.targetPercent * totalFinal - vbtlx.before;
    let vtiaxInvestment: number = vtiax.targetPercent * totalFinal - vtiax.before;
    let vtsaxInvestment: number = vtsax.targetPercent * totalFinal - vtsax.before;


    if (investment > 0) {
      vbtlxInvestment = Math.max(vbtlxInvestment, 0);
      vtiaxInvestment = Math.max(vtiaxInvestment, 0);
      vtsaxInvestment = Math.max(vtsaxInvestment, 0);
    } else if (investment < 0) {
      vbtlxInvestment = Math.min(vbtlxInvestment, 0);
      vtiaxInvestment = Math.min(vtiaxInvestment, 0);
      vtsaxInvestment = Math.min(vtsaxInvestment, 0);
    }

    const normalizationConstant = Math.abs(value / (vbtlxInvestment + vtiaxInvestment + vtsaxInvestment));

    vbtlxInvestment *= normalizationConstant;
    vtiaxInvestment *= normalizationConstant;

    vbtlxInvestment = Math.trunc(vbtlxInvestment);
    vtiaxInvestment = Math.trunc(vtiaxInvestment);
    vtsaxInvestment = value - vbtlxInvestment - vtiaxInvestment;


    setVbtlx({
      ...vbtlx,
      investment: vbtlxInvestment!,
      after: vbtlx.before + vbtlxInvestment,
      afterPercent: (vbtlx.before + vbtlxInvestment) / totalFinal
    });
    setVtiax({
      ...vtiax,
      investment: vtiaxInvestment!,
      after: vtiax.before + vtiaxInvestment,
      afterPercent: (vtiax.before + vtiaxInvestment) / totalFinal
    });
    setVtsax({
      ...vtsax,
      investment: vtsaxInvestment!,
      after: vtsax.before + vtsaxInvestment,
      afterPercent: (vtsax.before + vtsaxInvestment) / totalFinal
    });
  };


  return (
    <Container>
      <Intro />
      <form className="row">
        <div className="col-md-5 py-4">
          <span className="display-6"><p className="bg-primary text-light text-center fs-4 py-2">Before</p></span>
          <Table bordered size="sm">
            <thead className="table-info">
            <tr>
              <th scope="col" style={{ width: "16%" }}>Index</th>
              <th scope="col" style={{ width: "39%" }}>Invested</th>
              <th scope="col" style={{ width: "22%" }}>Invested</th>
              <th scope="col" style={{ width: "23%" }}>Target</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>VBTLX</td>
              <td>
                <InputGroup size="sm" hasValidation>
                  <InputGroup.Text><FontAwesomeIcon icon={faDollarSign} /></InputGroup.Text>
                  <Form.Control min="0"
                                required
                                step="0.01"
                                type="number"
                                value={vbtlx.before}
                                onChange={(event) => onClickBefore(event.currentTarget.value, "vbtlx")} />
                </InputGroup>
              </td>
              <td>
                {((vbtlx.before / (total.before + 0.00000001)) * 100).toFixed(2)}
                <FontAwesomeIcon icon={faPercent} className="float-end" />
              </td>
              <td>
                <InputGroup size="sm" hasValidation>
                  <Form.Control min="0"
                                required
                                step="0.01"
                                type="number"
                                value={vbtlx.targetPercent * 100}
                                onChange={(event) => onClickTargetPercent(event.currentTarget.value, "vbtlx")} />
                  <InputGroup.Text><FontAwesomeIcon icon={faPercent} /></InputGroup.Text>
                </InputGroup>
              </td>
            </tr>
            <tr>
              <td>VTIAX</td>
              <td>
                <InputGroup size="sm" hasValidation>
                  <InputGroup.Text><FontAwesomeIcon icon={faDollarSign} /></InputGroup.Text>
                  <Form.Control min="0"
                                required
                                step="0.01"
                                type="number"
                                value={vtiax.before}
                                onChange={(event) => onClickBefore(event.currentTarget.value, "vtiax")}
                  />
                </InputGroup>
              </td>
              <td>
                {(vtiax.before / (total.before + 0.00000001) * 100).toFixed(2)}
                <FontAwesomeIcon icon={faPercent} className="float-end" />
              </td>
              <td>
                <InputGroup size="sm" hasValidation>
                  <Form.Control min="0"
                                required
                                step="0.01"
                                type="number"
                                value={100 * vtiax.targetPercent}
                                onChange={(event) => onClickTargetPercent(event.currentTarget.value, "vtiax")}
                  />
                  <InputGroup.Text><FontAwesomeIcon icon={faPercent} /></InputGroup.Text>
                </InputGroup>
              </td>
            </tr>
            <tr>
              <td>VTSAX</td>
              <td>
                <InputGroup size="sm" hasValidation>
                  <InputGroup.Text><FontAwesomeIcon icon={faDollarSign} /></InputGroup.Text>
                  <Form.Control min="0"
                                required
                                step="0.01"
                                type="number"
                                value={vtsax.before}
                                onChange={(event) => onClickBefore(event.currentTarget.value, "vtsax")}
                  />
                </InputGroup>
              </td>
              <td>
                {(vtsax.before / total.before * 100).toFixed(2)}
                <FontAwesomeIcon icon={faPercent} className="float-end" />
              </td>
              <td>
                <InputGroup size="sm" hasValidation>
                  <Form.Control min="0"
                                required
                                step="0.01"
                                type="number"
                                value={vtsax.targetPercent * 100}
                                onChange={(event) => onClickTargetPercent(event.currentTarget.value, "vtsax")}
                  />
                  <InputGroup.Text><FontAwesomeIcon icon={faPercent} /></InputGroup.Text>
                </InputGroup>
              </td>
            </tr>
            <tr>
              <td>Total</td>
              <td>
                <FontAwesomeIcon icon={faDollarSign} />
                {total.before}
              </td>
              <td>
                {(100 * (vbtlx.before + vtiax.before + vtsax.before) / (total.before)).toFixed(2)}
                <span className="float-end"><FontAwesomeIcon icon={faPercent} /></span>
              </td>
              <td>
                {(100 * (vbtlx.targetPercent + vtiax.targetPercent + vtsax.targetPercent)).toFixed(2)}
                <span className="float-end"><FontAwesomeIcon icon={faPercent} /></span>
              </td>
            </tr>
            </tbody>
          </Table>
        </div>
        <div className="col-md-2 py-4">
          <span className="display-6"><p className="bg-secondary text-light text-center fs-4 py-2">Investment</p></span>
          <div className="py-4">
            <InputGroup size="sm" className="flex-nowrap">
              <InputGroup.Text><FontAwesomeIcon icon={faDollarSign} /></InputGroup.Text>
              <Form.Control required step="1" type="number" value={investment}
                            onChange={(event) => computeFinal(event.currentTarget.value)} />
            </InputGroup>
          </div>
        </div>
        <div className="col-md-5 py-4">
          <span className="display-6"><p
            className="bg-success text-light color-white text-center fs-4 py-2">After</p></span>
          <Table bordered size="sm">
            <thead className="table-info">
            <tr>
              <th scope="col" style={{ width: "16%" }}>Index</th>
              <th scope="col" style={{ width: "25%" }}>Investment</th>
              <th scope="col" style={{ width: "34%" }}>Result</th>
              <th scope="col" style={{ width: "25%" }}>Result</th>
            </tr>
            </thead>
            <tbody>
          <ResultTable name="VBTLX" element={vbtlx} total={total}/>
          <ResultTable name="VTIAX" element={vtiax} total={total}/>
          <ResultTable name="VTSAX" element={vtsax} total={total}/>
            <tr>
              <td>Total</td>
              <td><FontAwesomeIcon icon={faDollarSign} />{vbtlx.investment + vtiax.investment + vtsax.investment}</td>
              <td><FontAwesomeIcon icon={faDollarSign} />{vbtlx.after + vtiax.after + vtsax.after}</td>
              <td> {toPercent(vbtlx.afterPercent + vtiax.afterPercent + vtsax.afterPercent)}</td>
            </tr>
            </tbody>
          </Table>
        </div>
      </form>
    </Container>);

};

export default App;
