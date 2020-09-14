import React, { useState, useEffect, useCallback } from 'react';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import PropTypes from 'prop-types';

function ReactSelect({ format, label, Controller, name, inputId, classNamePrefix, isClearable, placeholder, arrayOptions, setArrayOptions, control, defaultValue }) {
  const [customStyles, setCustomStyles] = useState(
    {
      control: (styles, { isFocused }) => (
        {
          ...styles,
          width: '100%',
          marginRight: '0.5rem',
          transition: '.2s ease-in-out',
          outline: 'none',
          boxShadow: 'none',
          color: '#002651',
          borderColor: isFocused ? '#28c7fa' : styles.borderColor,
          ':hover': {
            borderColor: '#002651'
          }
        }),
      option: styles => (
        {
          ...styles,
          color: '#002651',
          '&:hover': {
            backgroundColor: '#e1e7ee'
          }
        }),
      singleValue: styles => (
        {
          ...styles,
          color: '#002651',
        }),
      menu: styles => (
        {
          ...styles,
          marginTop: '1px',
        }),
    }
  );
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const responsiveColumns = useCallback(() => {
    setWindowWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    window.addEventListener('resize', responsiveColumns);
    return () => {
      window.removeEventListener('resize', responsiveColumns);
    }
  }, [responsiveColumns]);

  useEffect(() => {
    let responsibeStyles;
    if (windowWidth < 640) {
      responsibeStyles = customStyles;
      responsibeStyles.control = (styles, {isFocused}) => (
      {
        ...styles,
        width: '100%',
        marginRight: '0.5rem',
        transition: '.2s ease-in-out',
        outline: 'none',
        boxShadow: 'none',
        color: '#002651',
        borderColor: isFocused ? '#28c7fa' : styles.borderColor,
        '&:hover': {
          borderColor: '#002651'
        }
      });
      setCustomStyles(responsibeStyles)
    }
    if (windowWidth >= 640) {
      responsibeStyles = customStyles;
      responsibeStyles.control = (styles, {isFocused}) => (
      {
        ...styles,
        width: '230px',
        marginRight: '0.5rem',
        transition: '.2s ease-in-out',
        outline: 'none',
        boxShadow: 'none',
        color: '#002651',
        borderColor: isFocused ? '#28c7fa' : styles.borderColor,
        '&:hover': {
          borderColor: '#002651'
        }
      });
      setCustomStyles(responsibeStyles)
    }
  }, [customStyles, setCustomStyles, windowWidth]);

  const onCreateOption = async (inputValue) => {
    let newOption = { value: inputValue, label: inputValue };
    let newArray = arrayOptions
    newArray.push(newOption)
    setArrayOptions(newArray);
  }

  let formatCreateLabel = inputValue => (
    <span>Ajouter {inputValue}</span>
  );

  return (
    <>
      <label
        htmlFor={inputId}
        onMouseOver={() => {
          document.getElementsByClassName(`${classNamePrefix}__control`)[0].style.borderColor = "#002651";
        }}
        onMouseLeave={() => {
          document.getElementsByClassName(`${classNamePrefix}__control`)[0].style.borderColor = null;
        }}
        onClick={() => {
          document.getElementsByClassName(`${classNamePrefix}__control`)[0].style.borderColor = null;
        }}
      >
        {label}
      </label>
      {isClearable &&
        <>
          {format === "select" && 
            <Controller
              name={name}
              inputId={inputId}
              classNamePrefix={classNamePrefix}
              as={Select}
              isClearable
              styles={customStyles}
              placeholder={placeholder}
              options={arrayOptions}
              control={control}
              defaultValue={defaultValue}
            />
          }

          {format === "creatable" &&
            <Controller
              name={name}
              inputId={inputId}
              classNamePrefix={classNamePrefix}
              as={CreatableSelect}
              formatCreateLabel={formatCreateLabel}
              isClearable
              styles={customStyles}
              placeholder={placeholder}
              options={arrayOptions}
              onCreateOption={onCreateOption}
              control={control}
              defaultValue={""}
            />
          }
        </>
      }
      {!isClearable &&
        <>
          {format === "select" && 
              <Controller
                name={name}
                inputId={inputId}
                classNamePrefix={classNamePrefix}
                as={Select}
                styles={customStyles}
                placeholder={placeholder}
                options={arrayOptions}
                control={control}
                defaultValue={defaultValue}
              />
            }
        </>
      }
    </>
  )
}

ReactSelect.propTypes = {
  format: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  Controller: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  inputId: PropTypes.string.isRequired,
  classNamePrefix: PropTypes.string.isRequired,
  isClearable: PropTypes.bool.isRequired,
  placeholder: PropTypes.string.isRequired,
  arrayOptions: PropTypes.array.isRequired,
  setArrayOptions: PropTypes.func,
  control: PropTypes.object.isRequired,
  defaultValue: PropTypes.string,
}

export default ReactSelect;
