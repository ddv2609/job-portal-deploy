import React, { useEffect, useState } from 'react';
import { Spin } from "antd";
import { Outlet, useNavigate } from "react-router-dom";

import { LoadingOutlined } from '@ant-design/icons';

import Footer from "../../components/FooterMain/Footer";
import HeaderCadidateIdex from '../../components/Header/Header_CandidateIndex';
import styles from "./CadidateIndex.module.css";
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setCandidateInfo } from '../../actions';
import { API_DOMAIN } from '../../constants';

function CandidateIndex() {
  const nav = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_DOMAIN}/api/candidate/info/`, {
      withCredentials: true,
    })
      .then(res => {
        // console.log(res.data.info);
        setLoading(false);
        dispatch(setCandidateInfo({
          uid: res.data.info._id,
          ...res.data.info.member,
        }));
      })
      .catch(error => {
        console.log(error);
        const code = error.response.status;
        if (code === 401 || code === 403)
          nav("/login");
      })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.container}>
      {loading ? <Spin indicator={<LoadingOutlined style={{ fontSize: 48, color: "#00b14f" }} spin />} fullscreen /> : (
        <>
          <HeaderCadidateIdex />
          <div className={styles.content}>
            <Outlet />
          </div>
          <div className={styles.footer_main}>
            <Footer />
          </div>
        </>
      )}
    </div>
  );
}

export default CandidateIndex;
