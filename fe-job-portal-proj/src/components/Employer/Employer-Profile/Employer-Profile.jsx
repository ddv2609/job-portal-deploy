import React from 'react';
import { useEffect, useState } from "react";
import styles from './Employer-Profile.module.css';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import { API_DOMAIN } from '../../../constants';

const CompanyProfile = () => {
    const navigate = useNavigate();
    const[avatar, setAvatar] = useState(null);
    const[id,setId] = useState(null);
    const[name, setName] = useState(null);
    const[dob, setDob] = useState(null);
//    const[address, setAddress] = useState(null);
    const[sex, setSex] = useState(null);
    const[email, setEmail] = useState(null);
    const[phone, setPhone] = useState(null);

    const getEmployer = () => {
        axios.get(`${API_DOMAIN}/api/employer/info`, {
            withCredentials: true,
        })
            .then(res => {
                setName(res.data.info.member.fullName);
                setAvatar(res.data.info.member.avatar);
                setId(res.data.info.member._id);
                setSex(res.data.info.member.gender);
                setDob(res.data.info.member.dob);
                setEmail(res.data.info.member.email);
                setPhone(res.data.info.member.tel);
            })
            .catch(err => {
                console.error(err);
            })
    }
    useEffect(() => {
        getEmployer();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);   

    return (
        <div>

        <div className={styles.container}>
            <div className={styles.header}>
                {avatar ? (
                    <img 
                        style={{width:"200px", height:"200px"}} 
                        src={avatar} alt='anh'
                    />
                ):(
                    <p></p>
                )}
                <h1 className={styles.companyName}>{name}</h1>
            </div>
            
            <div className={styles.details}> 
                <div>
                    <span className={styles.address}>Uid: </span>
                    <span>{id}</span>
                </div>                  
                <div>
                    <span className={styles.gender}>Giới Tính: </span>
                    <span>{sex}</span>
                </div>
                <div>
                    <span className={styles.dob}>Ngày Sinh: </span>
                    <span></span>
                </div>             

                <div>
                    <span className={styles.email}>Email: </span>
                    <span>{email}</span>
                </div>
                <div>
                    <span className={styles.phonenumber}>Số điện thoại: </span>
                    <span>{phone}</span>
                </div>
            </div>
            <div className={styles.jobActions}>
            <button className={styles.editButton} onClick={() => navigate('/employer/employer-editprofile')} >Sửa</button>
          </div>   
            
        </div>
        </div>
    );
};

export default CompanyProfile;

