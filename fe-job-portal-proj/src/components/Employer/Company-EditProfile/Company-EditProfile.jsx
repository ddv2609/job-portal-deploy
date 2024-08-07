import React, { useState, useEffect } from 'react';
import styles from './Company-EditProfile.module.css';
import { useNavigate } from 'react-router-dom';
import { Col, message, Form, Button, Input, Select, DatePicker } from "antd";
import { PiBuildingApartmentBold } from "react-icons/pi";
import { HiBuildingOffice2 } from "react-icons/hi2";
import { TbBuildingCommunity } from "react-icons/tb";
import Address from "../../Address/Address";
import axios from "axios";
import Avatar from "../../Avatar/Avatar";
import { useForm } from 'antd/es/form/Form';

const EditCompanyProfile = () => {
  const navigate = useNavigate();

  const [cities, setCities] = useState('Hà Nội');
  const [districts, setDistricts] = useState('Hà Đông');
  const [wards, setWards] = useState('Mỗ Lao');
  const [location, setLocation] = useState('116 Hà Nội');
  const [data, setData] = useState();


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
  const [companyName, setCompanyName] = useState('');
  const [introduction, setIntroduction] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [employees, setEmployees] = useState('');
  const [form] = Form.useForm();
  const [messageApi, contextMessageHolder] = message.useMessage();
  const [loading, setLoading] = useState(true);
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
    form
      .validateFields()
      .then(async (values) => {
        setLoading(true);
        values.locations = [{
          detail: values.detail,
          ward: values.ward,
          district: values.district,
          province: values.province,
        }]
        console.log(values);
        await axios.post('http://localhost:8000/api/company/info',values, {
          withCredentials: true,
        })
          .then(res => {
            console.log(res.data);
            const info = res.data.info;
            
            messageApi.success("Cập nhật thành công!");
          })
          .catch(err => {
            console.error(err);
            messageApi.error(err.response?.data?.message || "Có lỗi xảy ra!");
          })
          .finally(() => {
            setLoading(false);
 //           console.log(values);
          })
      })

  }
  return (
    <div>
    {contextMessageHolder}
    <Form
      form={form}
      name="update_info"
      layout="vertical"
      className={styles.container}
    >
      <h1>Chỉnh sửa hồ sơ công ty</h1>
      <div >
          <Avatar
            API={{
              upload: "http://localhost:8000/api/company/avatar",
              delete: "http://localhost:8000/api/company/avatar"
            }}
          />
      </div>
        <Form.Item
          label="Tên công ty"
          name="companyName"
        >
          <Input placeholder="Tên công ty mới" />
        </Form.Item>

        <Form.Item
          label="Giới thiệu công ty"
          name="introduction"
        >
          <Input placeholder="Hãy nhập lời giới thiệu thật oách" />
        </Form.Item>

        <Form.Item
          label="Địa chỉ"
          name="address"
        >
          <Input placeholder="Nhập địa chỉ của bạn" />
        </Form.Item>

        <Col span={8}></Col>
            <Col span={6}>
              <Address
                label="Tỉnh/thành phố"
                initialValue={data?.locations && data?.locations.length > 0 ? data.locations[0]?.province : "Không xác định"}
                type="province" suffixIcon={<PiBuildingApartmentBold />}
                options={cities}
                required={false}
                placeholder="Chọn tỉnh/thành phố"
                onSelect={handleSelectCitites}
              />
            </Col>
            <Col span={6}>
              <Address
                label="Quận/huyện"
                initialValue={data?.locations && data?.locations.length > 0 ? data.locations[0]?.district : "Không xác định"}
                type="district"
                options={districts} suffixIcon={<HiBuildingOffice2 />}
                required={false}
                placeholder="Chọn quận/huyện"
                onSelect={handleSelectDistricts}
              />
            </Col>
            <Col span={6}>
              <Address
                label="Xã/phường"
                initialValue={data?.locations && data?.locations.length > 0 ? data.locations[0]?.ward : "Không xác định"}
                type="ward"
                options={wards} suffixIcon={<TbBuildingCommunity />}
                required={false}
                placeholder="Chọn xã/phường"
              />
            </Col>

        <Form.Item
          label="Số điện thoại"
          name="phoneNumber"
        >
          <Input placeholder="Nhập số điện thoại tuyển dụng của công ty" />
        </Form.Item>

        <Form.Item
          label="Số lượng nhân lực"
          name="employees"
        >
          <Input placeholder="Nhập quy mô nhân viên của công ty" />
        </Form.Item>

        <Form.Item>
          <div className={styles.formActions}>
            <Button className={styles.saveButton} onClick={handleSave}>Lưu</Button>
            <Button className={styles.cancelButton} onClick={() => navigate('/employer/employer-profile')}>Hủy</Button>
          </div>          
        </Form.Item>
    </Form>
    </div>
  );
};

export default EditCompanyProfile;
