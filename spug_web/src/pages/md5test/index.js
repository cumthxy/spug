import React, { useState } from 'react';
import { Row, Col, Input, Button, Card } from 'antd';
import { Breadcrumb } from 'components';
import axios from 'axios';

function Md5test() {
  const [phoneResult, setPhoneResult] = useState('');
  const [ktpResult, setKtpResult] = useState('');
  const [mxPhoneResult, setMxPhoneResult] = useState('');
  
  // 定义每个输入框的 state
  const [phoneMd5, setPhoneMd5] = useState('');
  const [ktpMd5, setKtpMd5] = useState('');
  const [mxPhoneMd5, setMxPhoneMd5] = useState('');

  const handleDecrypt = (type, str) => {
    if (type === 'phone') {
      axios.post('/api/md5', { str })
        .then((response) => {
          setPhoneResult(response.data);  // 更新解密结果
        })
        .catch((error) => {
          console.error('解密失败:', error);
          setPhoneResult('Error decrypting phone data');
        });
    }
  
    if (type === 'ktp') {
      axios.post('/api/md5', { str })
        .then((response) => {
          setKtpResult(response.data);
        })
        .catch((error) => {
          console.error('解密失败:', error);
          setKtpResult('Error decrypting KTP data');
        });
    }
  
    if (type === 'mxphone') {
      axios.post('/api/md5', { str })
        .then((response) => {
          setMxPhoneResult(response.data);
        })
        .catch((error) => {
          console.error('解密失败:', error);
          setMxPhoneResult('Error decrypting MXPhone data');
        });
    }
  };

  return (
    <div>
      <Breadcrumb>
        <Breadcrumb.Item>首页</Breadcrumb.Item>
        <Breadcrumb.Item>MD5测试页面</Breadcrumb.Item>
      </Breadcrumb>

      <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
        <Col span={24}>
          <Card title="Phone MD5">
            <Row gutter={12}>
              <Col span={16}>
                <Input 
                  placeholder="Phone MD5 Value" 
                  value={phoneMd5}  // 绑定数据
                  onChange={(e) => setPhoneMd5(e.target.value)}  // 更新 phoneMd5 状态
                />
              </Col>
              <Col span={8}>
                <Button 
                  type="primary" 
                  onClick={() => handleDecrypt('phone', phoneMd5)}  // 将 phoneMd5 作为参数传递
                >
                  Decrypt
                </Button>
              </Col>
            </Row>
            <div style={{ marginTop: '10px' }}>Result: {phoneResult}</div>
          </Card>
        </Col>

        <Col span={24}>
          <Card title="KTP MD5">
            <Row gutter={12}>
              <Col span={16}>
                <Input 
                  placeholder="KTP MD5 Value" 
                  value={ktpMd5}  // 绑定数据
                  onChange={(e) => setKtpMd5(e.target.value)}  // 更新 ktpMd5 状态
                />
              </Col>
              <Col span={8}>
                <Button 
                  type="primary" 
                  onClick={() => handleDecrypt('ktp', ktpMd5)}  // 将 ktpMd5 作为参数传递
                >
                  Decrypt
                </Button>
              </Col>
            </Row>
            <div style={{ marginTop: '10px' }}>Result: {ktpResult}</div>
          </Card>
        </Col>

        <Col span={24}>
          <Card title="MXPHONE MD5">
            <Row gutter={12}>
              <Col span={16}>
                <Input 
                  placeholder="MXPHONE MD5 Value" 
                  value={mxPhoneMd5}  // 绑定数据
                  onChange={(e) => setMxPhoneMd5(e.target.value)}  // 更新 mxPhoneMd5 状态
                />
              </Col>
              <Col span={8}>
                <Button 
                  type="primary" 
                  onClick={() => handleDecrypt('mxphone', mxPhoneMd5)}  // 将 mxPhoneMd5 作为参数传递
                >
                  Decrypt
                </Button>
              </Col>
            </Row>
            <div style={{ marginTop: '10px' }}>Result: {mxPhoneResult}</div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Md5test;
