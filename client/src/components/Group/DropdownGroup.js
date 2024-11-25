import React from "react";
import { Dropdown } from "semantic-ui-react";

const options = [
  {
    key: "Private",
    text: "Private",
    value: "Private",
  },
  {
    key: "Public",
    text: "Public",
    value: "Public",
  },
];

const DropdownGroup = () => (
  <Dropdown
    placeholder="Choose privacry"
    fluid
    selection
    options={options}
    className="w-full"
  />
);

export default DropdownGroup;
