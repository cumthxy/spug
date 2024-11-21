/**
 * Copyright (c) OpenSpug Organization. https://github.com/openspug/spug
 * Copyright (c) <spug.dev@gmail.com>
 * Released under the AGPL-3.0 License.
 */
import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import { ExclamationCircleOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Modal, Form, Input, Select, Button, Radio, Table, Tooltip, message } from 'antd';
import { ACEditor } from 'components';
import HostSelector from 'pages/host/Selector';
import Parameter from './Parameter';
import { http, cleanCommand } from 'libs';
import lds from 'lodash';
import S from './store';

export default observer(function () {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [body, setBody] = useState(S.record.body);
  const [parameter, setParameter] = useState();
  const [parameters, setParameters] = useState([]);

  useEffect(() => {
    setParameters(S.record.parameters)
  }, [])

  function handleSubmit() {
    setLoading(true);
    const formData = form.getFieldsValue();
    formData['id'] = S.record.id;
    formData['body'] = cleanCommand(body);
    http.post('/api/exec/template/', formData)
      .then(res => {
        message.success('操作成功');
        S.formVisible = false;
        S.fetchRecords()
      }, () => setLoading(false))
  }


  function updateParameter(data) {
    if (data.id) {
      const index = lds.findIndex(parameters, {id: data.id})
      parameters[index] = data
    } else {
      data.id = parameters.length + 1
      parameters.push(data)
    }
    setParameters([...parameters])
    setParameter(null)
  }

  function delParameter(index) {
    parameters.splice(index, 1)
    setParameters([...parameters])
  }

  const info = S.record;
  return (
    <Modal
      visible
      width={800}
      maskClosable={false}
      title={S.record.id ? '编辑接口' : '新建接口'}
      onCancel={() => S.formVisible = false}
      confirmLoading={loading}
      onOk={handleSubmit}>
      <Form form={form} initialValues={info} labelCol={{span: 6}} wrapperCol={{span: 14}}>
        <Form.Item required name="name" label="接口名称">
          <Input placeholder="请输入接口名称"/>
        </Form.Item>
        <Form.Item required label="接口内容" shouldUpdate={(p, c) => p.interpreter !== c.interpreter}>
          {({getFieldValue}) => (
            <ACEditor
              mode={getFieldValue('interpreter')}
              value={body}
              onChange={val => setBody(val)}
              height="50px"/>
          )}
        </Form.Item>
        <Form.Item name="desc" label="备注信息">
          <Input.TextArea placeholder="请输入模板备注信息"/>
        </Form.Item>

      </Form>
      {parameter ? (
        <Parameter
          parameter={parameter}
          parameters={parameters}
          onCancel={() => setParameter(null)}
          onOk={updateParameter}/>
      ) : null}
    </Modal>
  )
})