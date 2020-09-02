import React, { useState, useEffect, useCallback } from 'react';
import Select from 'react-select';

function ReactSelect({ label, Controller, name, inputId, classNamePrefix, placeholder, arrayOptions, control }) {
  const [customStyles, setCustomStyles] = useState(
    {
      control: styles => (
        {
          ...styles,
          width: '100%',
          marginRight: '0.5rem',
          transition: '.2s ease-in-out',
          outline: 'none',
          boxShadow: 'none',
          color: '#002651',
          '&:hover': {
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
    if (windowWidth >= 640) {
      let responsibeStyles = customStyles;
      responsibeStyles.control = styles => (
      {
        ...styles,
        width: '230px',
        marginRight: '0.5rem',
        transition: '.2s ease-in-out',
        outline: 'none',
        boxShadow: 'none',
        color: '#002651',
        '&:hover': {
          borderColor: '#002651'
        }
      });
      setCustomStyles(responsibeStyles)
    }
  }, [customStyles, setCustomStyles, windowWidth]);

  return (
    <>
      <label
        htmlFor={inputId}
        onMouseOver={() => {
          document.getElementsByClassName('select-brand__control')[0].style.borderColor = "#002651";
        }}
        onMouseLeave={() => {
          document.getElementsByClassName('select-brand__control')[0].style.borderColor = null;
        }}
        onClick={() => {
          document.getElementsByClassName('select-brand__control')[0].style.borderColor = null;
        }}
      >
        {label}
      </label>
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
      />
    </>
  )
}

export default ReactSelect
