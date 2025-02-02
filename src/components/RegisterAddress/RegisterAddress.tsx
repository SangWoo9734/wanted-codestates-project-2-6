/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import React, { useContext, useState } from "react";
import { BiSearchAlt2, BiX } from "react-icons/bi";
import { AiFillQuestionCircle } from "react-icons/ai";
import axios from "axios";

import * as S from "./style";
import { State, useStaticState } from "src/contexts/StaticContext";
import { log } from "console";
import { useApplicationState } from "src/contexts/ApplicationContext";
import { json } from "stream/consumers";

type RegisterAddressProps = {
  setRoute: React.Dispatch<React.SetStateAction<string>>;
  setDisabled: React.Dispatch<React.SetStateAction<boolean>>;
};

function RegisterAddress({ setRoute, setDisabled }: RegisterAddressProps) {
  const [address, setAddress] = useState([]);
  const [addressInput, setAddressInput] = useState("asdasd");

  const [detailAddress, setDetailAddress] = useState(null);
  const [modalState, setModalState] = useState(false);
  const data = useApplicationState();
  const { covidTestTypes } = useStaticState();
  const [covidTest, setCovidTest] = useState<string | null>(null);
  console.log(covidTestTypes);

  const handleClick = () => {
    // 주소 검색 모달 실행
  };

  async function getAddress(SearchValue: string) {
    try {
      const response = await axios.get<any>("https://www.juso.go.kr/addrlink/addrLinkApi.do", {
        params: {
          currentPage: 1,
          countPerPage: 10,
          keyword: SearchValue,
          confmKey: "devU01TX0FVVEgyMDIyMDEyODIzMjIyNjExMjE5NjE=",
          resultType: "json",
        },
      });
      if (response.data) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        setAddress(response.data.results.juso);
      }
    } catch (error) {
      console.error(error);
    }
  }

  console.log(address);

  // modal address search
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    void getAddress(e.target.value);
  };

  return (
    <div>
      {modalState && (
        <>
          <S.ModalWrap>
            <S.ModalCard>
              <S.ModalContentWrap>
                <S.ModalHeader>
                  <h1>주소검색</h1>
                  <button type="button" onClick={() => setModalState(false)}>
                    <BiX />
                  </button>
                </S.ModalHeader>

                <S.ModalInput>
                  <span>
                    <BiSearchAlt2 className="searchIcon" />
                  </span>
                  <input
                    placeholder="주소 또는 건물명으로 검색"
                    onChange={(e) => handleAddressChange(e)}
                  ></input>
                </S.ModalInput>

                <S.AddressContent>
                  {address !== null ? (
                    address.map((value: any, idx: number) => (
                      <ul key={idx}>
                        <li>{value.roadAddr}</li>
                        <li>{value.jibunAddr}</li>
                        <li>{value.zipNo}</li>
                      </ul>
                    ))
                  ) : (
                    <span>
                      찾으시려는 도로명 주소의 건물번호 또는 시설명까지 상세히 입력 후 검색해주세요.
                      <br />
                      예) 중앙동, 불정로 432번길
                    </span>
                  )}
                </S.AddressContent>

                <S.AddressNotice>
                  <span>
                    · 기본주소 선택 후 상세주소를 반드시 입력해주세요. 상세주소가 없는 경우 주소지
                    특징을 입력해주세요. <br />
                    · 2016년 8월 1일부터는 5가지 우편번호 사용이 의무화됩니다. <br />
                    도로명주소 + 5자리 우편번호로 등록하셔서 서비스 이용에 불편함이 없도록 하시길
                    바랍니다.
                  </span>
                </S.AddressNotice>
              </S.ModalContentWrap>
            </S.ModalCard>
          </S.ModalWrap>
          <S.modalBackground></S.modalBackground>
        </>
      )}
      <S.InfoContainer>
        <div>
          <AiFillQuestionCircle size={18} color="#1971c2" />
        </div>
        <span>
          케어코디 서비스는 현재 서울, 경기도, 인천, 부산 지역에서 이용이 가능합니다. 빠른 시일 내
          서비스 지역을 확대할 수 있도록 노력하겠습니다.
        </span>
      </S.InfoContainer>
      {addressInput ? (
        <S.InputWrapper>
          <S.InputContainer onClick={() => setModalState(true)}>
            <BiSearchAlt2 className="searchIcon" size={15} />
            <span>{addressInput}</span>
            <button type="button" onClick={handleClick}>
              재검색
            </button>
          </S.InputContainer>
        </S.InputWrapper>
      ) : (
        <S.DisplayWrapper onClick={handleClick}>
          <S.DisplayContainer>
            <BiSearchAlt2 className="searchIcon" size={15} />
            <span>주소 또는 건물명으로 검색</span>
          </S.DisplayContainer>
        </S.DisplayWrapper>
      )}
      <S.DetailWrapper>
        <label>
          <input placeholder="상세 주소를 입력해주세요" />
        </label>
      </S.DetailWrapper>
      <S.CovidContainer>
        <h2>코로나 검사가 필요한가요?</h2>
        <ul>
          {covidTestTypes.map((v, idx) => (
            <li key={idx} onClick={() => setCovidTest(v.value)}>
              <label htmlFor={`radioBtn ${idx}`}>
                <input
                  id={`radioBtn ${idx}`}
                  type="radio"
                  checked={covidTest === v.value}
                  readOnly
                />
              </label>
              <span>{v.text}</span>
            </li>
          ))}
        </ul>
      </S.CovidContainer>
    </div>
  );
}

export default RegisterAddress;
