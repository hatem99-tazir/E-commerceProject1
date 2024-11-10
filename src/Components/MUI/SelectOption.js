import React, { useEffect } from "react";
import styled from "styled-components";



const SelectOption = ({ options, labelBgColor, textColor, onOptionSelect }) => {
  const SelectOptionContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const Label = styled.div`
  background-color: ${(props) => props.labelBgColor};
  color: ${(props) => props.textColor};
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  padding-left: 30px;
  box-sizing: border-box;
  border: 1px #9babb8 solid;
  color: grey !important;
  height: 35px;
  margin-top: 5px;
  width: 190px;
`;

const Options = styled.ul`
  list-style: none;

  margin: 0;
  padding: 0;
  position: absolute;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1;
  width: 100%;
  overflow: hidden;
`;

const Option = styled.li`
  padding: 8px 12px;
  cursor: pointer;
  height: 30px;
  width: 100%;
  color: grey !important;
  display: flex;
  align-items: center;
  font-size: 12px;
  &:hover {
    background-color: #f5f5f5;
  }
`;


  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedOption, setSelectedOption] = React.useState(options[0]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
    onOptionSelect(option);
  };


  useEffect(() => {
    handleOptionSelect(options[0]);
  },[]);
  

  return (
    <SelectOptionContainer className="select-option">
      <label htmlFor="select-option"></label>
      <Label
        labelBgColor={labelBgColor}
        textColor={textColor}
        onClick={toggleDropdown}
      >
        {selectedOption ? selectedOption : <p>Select an option</p>}
        <span>&#9662;</span>
      </Label>
      {isOpen && (
        <Options>
          {options.map((option) => (
            <Option
              key={option.value}
              onClick={() => handleOptionSelect(option)}
            >
              <p>{option}</p>
            </Option>
          ))}
        </Options>
      )}
    </SelectOptionContainer>
  );
};

export default SelectOption;
