import React, { useState, useEffect, useRef } from 'react';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import PropTypes from 'prop-types';

function ReactSelect({ format, label, labelBackWhite, Controller, name, inputId, isClearable, arrayOptions, control, defaultValue, success, inputValue, formType }) {
  const [value, setVal] = useState();
  const selectRef = useRef(null);
  const customStyles = {
    control: (styles) => (
      {
        ...styles,
        width: '100%',
        marginRight: '0.5rem',
        padding: '2.5px 10px',
        transition: '.2s ease-in-out',
        outline: 'none',
        boxShadow: 'none',
        backgroundColor: 'transparent',
        color: 'hsl(0, 0%, 35%)',
        borderColor: 'hsl(257, 63%, 52%)',
        borderRadius: '0.625rem',
        '@media (min-width: 768px)': {
          width: '340px',
          padding: '8.5px 10px'
        },
        '&:hover' : {
          borderColor: 'hsl(257, 63%, 52%)'
        }
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
        fontSize: '1.125rem'
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
      })
  };

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

  const onChangeValue = async (inputValue) => {
      setVal(inputValue);
  }

  let formatCreateLabel = inputValue => (
    <span>Ajouter {inputValue}</span>
  );

  return (
    <>
      <label className={`${labelBackWhite? 'form-label' : 'form-label-grey' }`} htmlFor={inputId}>
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
  labelBackWhite: PropTypes.bool,
  Controller: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  inputId: PropTypes.string.isRequired,
  isClearable: PropTypes.bool.isRequired,
  arrayOptions: PropTypes.array.isRequired,
  control: PropTypes.object.isRequired,
  defaultValue: PropTypes.string,
  success: PropTypes.bool,
  formType: PropTypes.string,
}

export default ReactSelect;
