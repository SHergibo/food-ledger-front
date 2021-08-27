import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useUserData, useUserOptionData } from '../../DataContext';
import { useForm } from 'react-hook-form';
import axiosInstance from '../../../../utils/axiosInstance';
import { apiDomain, apiVersion } from '../../../../apiConfig/ApiConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import InformationIcon from '../../UtilitiesComponent/InformationIcons';

function ProductTableOptionProfile() {
  const { userData } = useUserData();
  const { userOptionData, setUserOptionData } = useUserOptionData();
  const [ successFormProductTable, setSuccessFormProductTable ] = useState(false);
  const isMounted = useRef(true);
  const valueRef = useRef({});

  const { register, handleSubmit, reset } = useForm({
    defaultValues: useMemo(() => {
      return userOptionData
    }, [userOptionData])
  });

  useEffect(() => {
    valueRef.current = {
      colorCodeDate: userOptionData?.colorCodeDate,
      colorCodeStock: userOptionData?.colorCodeStock,
    }
    reset(valueRef.current)
  }, [reset, userOptionData]);

  useEffect(() => {
    let timerSuccessProductTable;
    if(successFormProductTable){
      timerSuccessProductTable = setTimeout(() => {
        setSuccessFormProductTable(false);
      }, 5000);
    }
    return () => {
      clearTimeout(timerSuccessProductTable);
    }
  }, [successFormProductTable]);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    }
  }, []);

  const patchOptionData = async (data) => {
    const patchUserOptionDataEndPoint = `${apiDomain}/api/${apiVersion}/options/${userData._id}`;
    await axiosInstance.patch(patchUserOptionDataEndPoint, data)
      .then((response) => {
        if(isMounted.current){
          setUserOptionData(response.data);
          return true;
        }
      });
  }

  const updateUserOptionProductTableData = async (data) => {
    let success = patchOptionData(data);
    if(success){
      setSuccessFormProductTable(true);
    }
  };

  return (
    <div className="container-data container-option">
      <div className="form-table-product option-component">
        <form>
          {userOptionData && 
            <>
              <label className="container-checkbox" htmlFor="colorCodeDate">
                Afficher le code couleur pour les dates de péremption :
                <input type="checkbox" name="colorCodeDate" id="colorCodeDate" {...register("colorCodeDate")} />
                <span className="checkmark-checkbox"></span>
              </label>

              <label className="container-checkbox" htmlFor="colorCodeStock">
                Afficher le code couleur pour les stock minimum de produits : 
                <input type="checkbox" name="colorCodeStock" id="colorCodeStock" {...register("colorCodeStock")} />
                <span className="checkmark-checkbox"></span>
              </label>
            </>
          }
        </form>
        <div className="btn-action-container">
          <button className="btn-purple" type="submit"onClick={() => {
            handleSubmit(updateUserOptionProductTableData)();
          }}>
            <FontAwesomeIcon className="btn-icon" icon="pen" /> Éditer
          </button>
          {successFormProductTable && 
            <InformationIcon 
              className="success-icon"
              icon={<FontAwesomeIcon icon="check" />}
            />
          }
        </div>
      </div>
    </div>
  )
}

export default ProductTableOptionProfile
