import React, { useState, useEffect, useCallback, useRef } from 'react';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import PropTypes from 'prop-types';

function ReactSelect({ format, label, Controller, name, inputId, classNamePrefix, isClearable, arrayOptions, setArrayOptions, control, defaultValue, setValue, success, inputValue, clearErrors, formType }) {
  const [value, setVal] = useState();
  const [customStyles, setCustomStyles] = useState(
    {
      control: (styles) => (
        {
          ...styles,
          width: '100%',
          marginRight: '0.5rem',
          marginBottom: '1rem',
          padding: '2.5px 10px',
          transition: '.2s ease-in-out',
          outline: 'none',
          boxShadow: 'none',
          backgroundColor: 'transparent',
          color: 'hsl(0, 0%, 35%)',
          borderColor: 'hsl(257, 63%, 52%)',
          borderRadius: '0.625rem',
        }),
      option: (styles, { isFocused, isSelected }) => (
        {
          ...styles,
          color: (isSelected || isFocused) ? '#fff' : 'hsl(0, 0%, 35%)',
          backgroundColor: (isSelected || isFocused) ? 'hsl(257, 63%, 52%)' : '#fff', 
        }),
      singleValue: styles => (
        {
          ...styles,
          color: 'hsl(0, 0%, 35%)',
        }),
      menu: styles => (
        {
          ...styles,
          marginTop: '1px',
          borderRadius: '0.625rem',
          overflow: 'hidden',
          zIndex: "11"
        }),
      dropdownIndicator: styles => (
        {
          ...styles,
          color: 'hsl(257, 63%, 52%)'
        }),
      indicatorSeparator: styles => (
        {
          ...styles,
          backgroundColor: 'transparent'
        }),
    }
  );
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const selectRef = useRef(null);

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
    if (windowWidth < 768) {
      responsibeStyles = customStyles;
      responsibeStyles.control = (styles) => (
      {
        ...styles,
        width: '100%',
        marginRight: '0.5rem',
        marginBottom: '1rem',
        padding: '2.5px 10px',
        transition: '.2s ease-in-out',
        outline: 'none',
        boxShadow: 'none',
        backgroundColor: 'transparent',
        color: 'hsl(0, 0%, 35%)',
        borderColor: 'hsl(257, 63%, 52%)',
        borderRadius: '0.625rem',
      });
      setCustomStyles(responsibeStyles)
    }
    if (windowWidth >= 768) {
      responsibeStyles = customStyles;
      responsibeStyles.control = (styles) => (
      {
        ...styles,
        width: '230px',
        marginRight: '0.5rem',
        marginBottom: '1rem',
        padding: '2.5px 10px',
        transition: '.2s ease-in-out',
        outline: 'none',
        boxShadow: 'none',
        backgroundColor: 'transparent',
        color: 'hsl(0, 0%, 35%)',
        borderColor: 'hsl(257, 63%, 52%)',
        borderRadius: '0.625rem',
      });
      setCustomStyles(responsibeStyles)
    }
  }, [customStyles, setCustomStyles, windowWidth]);

  useEffect(() => {
    if(formType === "add" && format === "creatable" && success){
      setVal(null);
    }
  }, [formType, format, success]);

  useEffect(() => {
    if(inputValue && inputValue.brand){
      setVal({ value: inputValue.brand.brandName.value, label: inputValue.brand.brandName.label });
    }
  }, [inputValue]);

  const onCreateOption = async (inputValue) => {
    let newOption = { value: inputValue, label: inputValue };
    setVal(newOption);
    setValue("brand", newOption);
    setArrayOptions(arrayOptions => [...arrayOptions, newOption]);
    clearErrors('brand');
  }

  const onChangeValue = async (inputValue) => {
      setVal(inputValue);
  }

  let formatCreateLabel = inputValue => (
    <span>Ajouter {inputValue}</span>
  );

  return (
    <>
      <label
        className="form-label-grey"
        htmlFor={inputId}
        // onMouseOver={() => {
        //   if(selectRef.current.select.controlRef) selectRef.current.select.controlRef.style.borderColor = "#002651";
        // }}
        // onMouseLeave={() => {
        //   if(selectRef.current.select.controlRef) selectRef.current.select.controlRef.style.borderColor = null;
        // }}
        // onClick={() => {
        //   if(selectRef.current.select.controlRef) selectRef.current.select.controlRef.style.borderColor = null;
        // }}
      >
        {label}
      </label>
      {isClearable &&
        <>
          {format === "select" && 
            <Controller
              name={name}
              isClearable
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  inputId={inputId}
                  classNamePrefix={classNamePrefix}
                  styles={customStyles}
                  placeholder={""}
                  defaultValue={defaultValue}
                  options={arrayOptions}
                  ref={selectRef}
                />
              )}
            />
          }
          {format === "creatable" &&
          <Controller
            name={name}
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <CreatableSelect
                {...field}
                options={arrayOptions}
                inputId={inputId}
                classNamePrefix={classNamePrefix}
                styles={customStyles}
                placeholder={""}
                defaultValue={""}
                value={value}
                isClearable
                formatCreateLabel={formatCreateLabel}
                onChange={(e)=> {
                  onChangeValue(e)
                  field.onChange(e)
                }}
                onCreateOption={onCreateOption}
                ref={selectRef}
              />
            )}
          />
          }
        </>
      }
      {!isClearable &&
        <>
          {format === "select" && 
            <Controller
              name={name}
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  inputId={inputId}
                  classNamePrefix={classNamePrefix}
                  styles={customStyles}
                  placeholder={""}
                  defaultValue={defaultValue}
                  options={arrayOptions}
                  ref={selectRef}
                />
              )}
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
  arrayOptions: PropTypes.array.isRequired,
  setArrayOptions: PropTypes.func,
  control: PropTypes.object.isRequired,
  defaultValue: PropTypes.string,
  setValue: PropTypes.func,
  success: PropTypes.bool,
  clearErrors: PropTypes.func,
  formType: PropTypes.string,
}

export default ReactSelect;
