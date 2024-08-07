import React, { useState, useEffect } from 'react';
import styles from './Company-EditProfile.module.css';
import { useNavigate } from 'react-router-dom';
import { Col, Row } from "antd";
import Address from "../../Address/Address";
import axios from "axios";

const EditCompanyProfile = () => {
  const navigate = useNavigate();



  const [cities, setCities] = useState('Hà Nội');
  const [districts, setDistricts] = useState('Hà Đông');
  const [wards, setWards] = useState('Mỗ Lao');
  const [location, setLocation] = useState('116 Hà Nội');


  useEffect(() => {
    axios.get("https://vapi.vnappmob.com/api/province/")
      .then(res => {
        const cities = res.data.results.map((city, index) => ({
          id: index,
          key: city.province_id,
          label: city.province_name,
          value: city.province_name,
        }));
  
        setCities(cities);
  
        // Set initial selected city based on current value
        const selectedCity = cities.find(city => city.value === 'Hà Nội');
        if (selectedCity) {
          handleSelectCitites(selectedCity, { key: selectedCity.key });
        }
      })
  }, []);
  
  const handleSelectCitites = (selectedCity, option) => {
    setLocation(selectedCity.value); 
    setDistricts([]);
    setWards([]);
  
    axios.get(`https://vapi.vnappmob.com/api/province/district/${option.key}`)
      .then(res => {
        const districts = res.data.results.map((district, index) => ({
          id: index,
          key: district.district_id,
          label: district.district_name,
          value: district.district_name,
        }));
  
        setDistricts(districts);
  
        // Set initial selected district based on current value
        const selectedDistrict = districts.find(district => district.value === 'Hà Đông');
        if (selectedDistrict) {
          handleSelectDistricts(selectedDistrict, { key: selectedDistrict.key });
        }
      })
  }
  
  const handleSelectDistricts = (selectedDistrict, option) => {
    setWards([]);
  
    axios.get(`https://vapi.vnappmob.com/api/province/ward/${option.key}`)
      .then(res => {
        const wards = res.data.results.map((ward, index) => ({
          id: index,
          key: ward.ward_id,
          label: ward.ward_name,
          value: ward.ward_name,
        }));
  
        setWards(wards);
  
        // Set initial selected ward based on current value
        const selectedWard = wards.find(ward => ward.value === 'Mỗ Lao');
        if (selectedWard) {
          setWards([selectedWard]);
        }
      })
  }

  // State for form fields
  const [logo, setLogo] = useState(null); // Store the selected file
  const [companyName, setCompanyName] = useState('Ptit');
  const [introduction, setIntroduction] = useState('Chúng tôi là một công ty hàng đầu trong lĩnh vực XYZ, cam kết mang đến sản phẩm và dịch vụ chất lượng cao.');
  const [phoneNumber, setPhoneNumber] = useState('2323232323');
  const [employees, setEmployees] = useState('100');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result); // Store the file data (base64 string) in state
      };
      reader.readAsDataURL(file); // Read the file as a base64 encoded string
    }
  };

  const handleSave = () => {
    navigate('/company-profile');
  };

  return (
    <div className={styles.container}>
      <h1>Chỉnh sửa hồ sơ công ty</h1>
      <div className={styles.formGroup}>
        <label className={styles.label}>Logo</label>
        <input
          className={styles.input}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
        {logo && <img src={logo} alt="Company Logo Preview" className={styles.logoPreview} />}
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Tên công ty</label>
        <input
          className={styles.input}
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Giới thiệu về công ty</label>
        <textarea
          className={styles.textarea}
          value={introduction}
          onChange={(e) => setIntroduction(e.target.value)}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Địa Chỉ</label>
        <input
          className={styles.input}
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      <Row gutter={[32, 0]}>
        <Col lg={12}>
          <Address
            label="Địa điểm làm việc"
            type="province" size="large" 
            options={cities}
            message="Vui lòng chọn tỉnh/thành phố làm việc"
            placeholder="Chọn tỉnh/thành phố"
            onSelect={handleSelectCitites}
          />
        </Col>
        <Col lg={12}>
          <Address
            label="Quận/huyện"
            type="district" size="large"
            options={districts} 
            message="Vui lòng chọn quận/huyện làm việc"
            placeholder="Chọn quận/huyện"
            onSelect={handleSelectDistricts}
          />
        </Col>
        <Col lg={12}>
          <Address
            label="Xã/phường"
            type="ward" size="large"
            options={wards}
            message="Vui lòng chọn xã/phường làm việc"
            placeholder="Chọn xã/phường"
          />
        </Col>
      </Row>


      <div className={styles.formGroup}>
        <label className={styles.label}>Số điện thoại</label>
        <input
          className={styles.input}
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Số lượng nhân lực</label>
        <input
          className={styles.input}
          type="number"
          value={employees}
          onChange={(e) => setEmployees(e.target.value)}
        />
      </div>

      <div className={styles.formActions}>
        <button className={styles.saveButton} onClick={handleSave}>Lưu</button>
        <button className={styles.cancelButton} onClick={() => navigate('/employer/company-profile')}>Hủy</button>
      </div>
    </div>
  );
};

export default EditCompanyProfile;
