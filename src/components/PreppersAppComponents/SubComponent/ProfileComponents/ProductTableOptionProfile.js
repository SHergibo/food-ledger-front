import React, { useEffect, useState, useRef } from 'react';
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

  const { register : registerFormProductTable, handleSubmit : handleSubmitProductTable } = useForm({
    mode: "onChange"
  });

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
    <form onSubmit={handleSubmitProductTable(updateUserOptionProductTableData)}>
      {userOptionData && 
        <>
          <label className="container-checkbox-input" htmlFor="colorCodeDate">Afficher le code couleur pour les dates de péremption : 
            <input type="checkbox" name="colorCodeDate" id="colorCodeDate" defaultChecked={userOptionData.colorCodeDate} ref={registerFormProductTable()}/>
            <span className="checkmark-checkbox"></span>
          </label>

          <label className="container-checkbox-input" htmlFor="colorCodeStock">
            Afficher le code couleur pour les stock minimum de produits : 
            <input type="checkbox" name="colorCodeStock" id="colorCodeStock" defaultChecked={userOptionData.colorCodeStock} ref={registerFormProductTable()}/>
            <span className="checkmark-checkbox"></span>
          </label>

          <div className="default-action-form-container">
            <button className="default-btn-action-form" type="submit"><FontAwesomeIcon icon="pen" /> Éditer</button>
            {successFormProductTable && 
              <InformationIcon 
                className="success-icon"
                icon={<FontAwesomeIcon icon="check" />}
              />
            }
          </div>
        </>
      }
    </form>
  )
}

export default ProductTableOptionProfile
