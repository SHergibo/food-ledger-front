import React, { useEffect, useState, useRef } from 'react';
import { useUserData, useUserOptionData } from '../../DataContext';
import { useForm, Controller } from 'react-hook-form';
import ReactSelect from '../../UtilitiesComponent/ReactSelect';
import { dateSendMailGlobal, dateSendMailShoppingList } from "../../../../utils/localData";
import axiosInstance from '../../../../utils/axiosInstance';
import { apiDomain, apiVersion } from '../../../../apiConfig/ApiConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import InformationIcon from '../../UtilitiesComponent/InformationIcons';

function EmailOptionProfile() {
  const { userData } = useUserData();
  const { userOptionData, setUserOptionData } = useUserOptionData();
  const [ successFormEmailing, setSuccessFormEmailing ] = useState(false);
  const isMounted = useRef(true);

  const { register, handleSubmit, setValue, control } = useForm({
    mode: "onChange"
  });

  useEffect(() => {
    let timeOut;
    if(userOptionData){
      timeOut = setTimeout(() => {
        if (userOptionData.dateMailGlobal) {
          setValue("dateMailGlobal", { value: userOptionData.dateMailGlobal.value, label: userOptionData.dateMailGlobal.label });
        }
        if (userOptionData.dateMailGlobal) {
          setValue("dateMailShoppingList", { value: userOptionData.dateMailShoppingList.value, label: userOptionData.dateMailShoppingList.label });
        }
      }, 300);
    }
    return () => {
      clearTimeout(timeOut);
    }
  }, [userOptionData, setValue]);

  useEffect(() => {
    let timerSuccessFormEmailing;
    if(successFormEmailing){
      timerSuccessFormEmailing = setTimeout(() => {
        setSuccessFormEmailing(false);
      }, 5000);
    }
    return () => {
      clearTimeout(timerSuccessFormEmailing);
    }
  }, [successFormEmailing]);

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

  const updateUserOptionMailingData = async (data) => {
    let success = patchOptionData(data);
    if(success){
      setSuccessFormEmailing(true);
    }
  };

  return (
    <form className="option-component" onSubmit={handleSubmit(updateUserOptionMailingData)}>
      {userOptionData && 
        <>
          <label className="container-checkbox-input" htmlFor="sendMailGlobal">Recevoir le mail d'information sur vos stocks : 
            <input type="checkbox" name="sendMailGlobal" id="sendMailGlobal" defaultChecked={userOptionData.sendMailGlobal} {...register("sendMailGlobal")}/>
            <span className="checkmark-checkbox"></span>
          </label>

          <div className="input-form-container">
            <ReactSelect
              format="select"
              label="Interval d'envoi du mail d'information"
              Controller={Controller}
              name="dateMailGlobal"
              inputId="date-mail-global"
              classNamePrefix="date-mail-global"
              isClearable={false}
              placeholder="Interval d'envoi..."
              arrayOptions={dateSendMailGlobal}
              control={control}
              defaultValue={""}
            />
          </div>

          <label className="container-checkbox-input" htmlFor="sendMailShoppingList">Recevoir le mail liste de course : 
            <input type="checkbox" name="sendMailShoppingList" id="sendMailShoppingList" defaultChecked={userOptionData.sendMailShoppingList} {...register("sendMailShoppingList")}/>
            <span className="checkmark-checkbox"></span>
          </label>

          <div className="input-form-container">
            <ReactSelect
              format="select"
              label="Interval d'envoi du mail liste de course"
              Controller={Controller}
              name="dateMailShoppingList"
              inputId="date-mail-shopping-list"
              classNamePrefix="date-mail-shopping-list"
              isClearable={false}
              placeholder="Interval d'envoi..."
              arrayOptions={dateSendMailShoppingList}
              control={control}
              defaultValue={""}
            />
          </div>

          <div className="default-action-form-container">
            <button className="default-btn-action-form" type="submit"><FontAwesomeIcon icon="pen" /> Éditer</button>
            {successFormEmailing && 
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

export default EmailOptionProfile
