import { ListGroup } from "react-bootstrap";
import React from "react";

const Intro = () => (
  <div className="bg-light text-dark p-5 m-3">
    <h1 className="text-center display-5">Three-fund portfolio calculator</h1>
    <p className="text-center lead">This WebApp helps to compute investments to the base index funds.</p>
    <hr className="my-4" />
    <p>
      In the book <a href="https://amzn.to/3wtFLz8">The Bogleheads' Guide to the Three-Fund Portfolio</a> authors
      recommend investing in three main index funds.
    </p>
    <p>We want funds that are <b>diverse, uncorrelated</b>, and have <b> minimal possible fees.</b></p>
    <p>Authors propose to use:</p>
    <ListGroup>
      <ListGroup.Item>
        <a href="https://investor.vanguard.com/mutual-funds/profile/VBTLX">VBTLX: Vanguard Total Bond Market Index
          Fund Admiral Shares</a>
      </ListGroup.Item>
      <ListGroup.Item><a href="https://investor.vanguard.com/mutual-funds/profile/VTIAX">VTIAX: Vanguard Total
        International Stock Index Fund Admiral Shares</a></ListGroup.Item>
      <ListGroup.Item><a href="https://investor.vanguard.com/mutual-funds/profile/VTSAX">VTSAX: Vanguard Total Stock
        Market Index Fund Admiral Shares</a></ListGroup.Item>
    </ListGroup>
    <p>or similar.</p>

    <p>They suggest the following numbers as a baseline:</p>
    <ListGroup>
      <ListGroup.Item><b>VBTLX</b>: Your age - 20</ListGroup.Item>
      <ListGroup.Item><b>VTIAX</b>: 20%</ListGroup.Item>
      <ListGroup.Item><b>VTSAX</b>: 120% - <b>VTIAX</b>% - (your age)%</ListGroup.Item>
    </ListGroup>
    <p>
      You can use the above values or increase the bond component if you are risk-averse and decrease otherwise.
    </p>
  </div>
);

export default Intro;
