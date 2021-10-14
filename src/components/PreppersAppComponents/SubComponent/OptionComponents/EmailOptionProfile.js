import React, { useEffect, useState, useRef, useMemo } from 'react';
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
  const valueRef = useRef({});

  const { register, handleSubmit, control, reset } = useForm({
    defaultValues: useMemo(() => {
      return userOptionData
    }, [userOptionData])
  });

  useEffect(() => {
    valueRef.current = {
      dateMailGlobal: userOptionData?.dateMailGlobal,
      dateMailShoppingList: userOptionData?.dateMailShoppingList,
      sendMailGlobal: userOptionData?.sendMailGlobal,
      sendMailShoppingList: userOptionData?.sendMailShoppingList,
    }
    reset(valueRef.current)
  }, [reset, userOptionData]);

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
    <div className="container-data container-option">
      <div className="form-email option-component">
        <form>
          {userOptionData && 
            <>
              <label className="container-checkbox" htmlFor="sendMailGlobal">
                Recevoir le mail d'information sur vos stocks : 
                <input type="checkbox" name="sendMailGlobal" id="sendMailGlobal" defaultChecked={userOptionData.sendMailGlobal} {...register("sendMailGlobal")} />
                <span className="checkmark-checkbox"></span>
              </label>

              <div className="input-group">
                <ReactSelect
                  format="select"
                  label="Interval d'envoi du mail"
                  labelBackWhite={true}
                  respSelect={true}
                  Controller={Controller}
                  name="dateMailGlobal"
                  inputId="date-mail-global"
                  isClearable={false}
                  arrayOptions={dateSendMailGlobal}
                  control={control}
                  defaultValue={""}
                />
              </div>

              <label className="container-checkbox" htmlFor="sendMailShoppingList">
                Recevoir le mail liste de course : 
                <input type="checkbox" name="sendMailShoppingList" id="sendMailShoppingList" {...register("sendMailShoppingList")} />
                <span className="checkmark-checkbox"></span>
              </label>

              <div className="input-group">
                <ReactSelect
                  format="select"
                  label="Interval d'envoi du mail"
                  labelBackWhite={true}
                  respSelect={true}
                  Controller={Controller}
                  name="dateMailShoppingList"
                  inputId="date-mail-shopping-list"
                  isClearable={false}
                  arrayOptions={dateSendMailShoppingList}
                  control={control}
                  defaultValue={""}
                />
              </div>
            </>
          }
        </form>
        <div className="btn-action-container">
          <button className="btn-purple" onClick={() => {
            handleSubmit(updateUserOptionMailingData)();
          }}>
            <FontAwesomeIcon className="btn-icon" icon="pen" /> Éditer
          </button>
          {successFormEmailing && 
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

export default EmailOptionProfile
