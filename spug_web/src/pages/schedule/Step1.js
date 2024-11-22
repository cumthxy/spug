import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import { Form, Input, Select, Modal, Button, message, Upload, Table, Space } from 'antd';
import { ExclamationCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { LinkButton, ACEditor } from 'components';
import TemplateSelector from '../exec/task/TemplateSelector';
import { cleanCommand, http, uniqueId } from 'libs';
import store from './store';
import lds from 'lodash';
import style from './index.module.css';


export default observer(function () {
  const [file, setFile] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [showTmp, setShowTmp] = useState(false);
  const [command, setCommand] = useState(store.record.command || '');
  const [rstValue, setRstValue] = useState({});
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const { mode, value } = store.record.rst_notify
    setRstValue({ [mode]: value })
    http.get('/api/alarm/contact/?only_push=1')
      .then(res => setContacts(res))
  }, []);

  function handleAddZone() {
    let type;
    Modal.confirm({
      icon: <ExclamationCircleOutlined />,
      title: '添加任务类型',
      content: (
        <Form layout="vertical" style={{ marginTop: 24 }}>
          <Form.Item required label="任务类型">
            <Input onChange={e => type = e.target.value} />
          </Form.Item>
        </Form>
      ),
      onOk: () => {
        if (type) {
          store.types.push(type);
          form.setFieldsValue({ type })
        }
      },
    })
  }
  const handleFileChange = ({ file }) => {
    console.log(1);

    setFile(null)
    if (file.status === 'done') {
      // 上传成功后，设置上传的文件
      setFile(file.originFileObj);  // 保存上传的文件
      message.success(`${file.name} 上传成功`);
    } else if (file.status === 'error') {
      message.error(`${file.name} 上传失败`);
    }
  };

  function canNext() {
    const formData = form.getFieldsValue()
    return !(formData.name && command)
  }

  function handleSubmit() {
    // setLoading(true)
    store.record.name = form.getFieldsValue().name;
    store.record.command = command
    const formData = new FormData()
    const Data = lds.pick(store.record, ['id', 'name', 'interpreter', 'command', 'desc', 'rst_notify']);
    formData.append('data', JSON.stringify(Data));  // 将文件添加到 formData
    if (file) {
      formData.append('file', file);  // 将文件添加到 formData
    }
    http.post('/api/schedule/', formData)
      .then(res => {
        message.success('操作成功');
        store.formVisible = false;
        store.fetchRecords()
      }, () => setLoading(false))
  }

  function handleSelect(tpl) {
    let concatenatedBody = '';
    tpl.forEach(item => {
      const { interpreter, body } = item;
      // 设置 command 的值
      concatenatedBody += body + '\n';
      // 更新表单字段的 interpreter 值

    });
    setCommand(concatenatedBody);
    form.setFieldsValue({ concatenatedBody });
  }

  let modePlaceholder;
  switch (store.record.rst_notify.mode) {
    case '0':
      modePlaceholder = '已关闭'
      break
    case '1':
      modePlaceholder = 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=xxx'
      break
  }

  const notifyMode = store.record.rst_notify.mode
  return (
    <Form form={form} initialValues={store.record} labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
      {/* <Form.Item required label="任务类型" style={{marginBottom: 0}}>
        <Form.Item name="type" style={{display: 'inline-block', width: '80%'}}>
          <Select placeholder="请选择任务类型">
            {store.types.map(item => (
              <Select.Option value={item} key={item}>{item}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item style={{display: 'inline-block', width: '20%', textAlign: 'right'}}>
          <Button type="link" onClick={handleAddZone}>添加类型</Button>
        </Form.Item>
      </Form.Item> */}
      <Form.Item required name="name" label="任务名称">
        <Input placeholder="请输入任务名称" />
      </Form.Item>
      <Form.Item required label="测试接口" extra={<LinkButton onClick={() => setShowTmp(true)}>从模板添加</LinkButton>}>
        <Form.Item noStyle shouldUpdate>
          {({ getFieldValue }) => (
            <ACEditor mode={getFieldValue('body')} value={command} width="100%" height="100px"
              onChange={setCommand} />
          )}
        </Form.Item>
      </Form.Item>
      <Form.Item required name="upload" label="上传本地文件">
        {/* <Upload action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload" */}
        <Upload
          customRequest={({ file, onSuccess }) => {
            setFile(file);  // 存储文件
            onSuccess("ok");
          }}

          beforeUpload={(file) => {
    const isAllowedType = [
      'application/pdf', // PDF 文件
      'application/msword', // Word 文件
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // Word 文件（.docx）
      'application/vnd.ms-excel', // Excel 文件
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // Excel 文件（.xlsx）
    ].includes(file.type);

    if (!isAllowedType) {
      message.error('只能上传普通文件，不能上传图片、音频或视频！');
      return Upload.LIST_IGNORE; // 阻止上传
    }

    return true; // 返回 true 表示允许上传
  }}
          listType="picture" maxCount={1} >  <Button icon={<UploadOutlined />}>点击上传</Button> </Upload>
      </Form.Item>

      {/* <Form.Item label="任务成功通知">
        <Input.Group compact>
          <Select style={{width: '25%'}} value={notifyMode}
                  onChange={v => store.record.rst_notify.mode = v}>
            <Select.Option value="0">关闭</Select.Option>
            <Select.Option value="1">企业微信</Select.Option>
          </Select>
          <Select hidden={notifyMode !== '5'} mode="multiple" style={{width: '75%'}} value={rstValue[notifyMode]}
                  onChange={v => setRstValue(Object.assign({}, rstValue, {[notifyMode]: v}))}
                  placeholder="请选择推送对象">
            {contacts.map(item => (
              <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>
            ))}
          </Select>
          <Input
            hidden={notifyMode === '5'}
            style={{width: '75%'}}
            value={rstValue[notifyMode]}
            onChange={e => setRstValue(Object.assign({}, rstValue, {[notifyMode]: e.target.value}))}
            disabled={notifyMode === '0'}
            placeholder={modePlaceholder}/>
        </Input.Group>
      </Form.Item> */}
      <Form.Item shouldUpdate wrapperCol={{ span: 14, offset: 6 }}>
        {() => <Button disabled={canNext()} type="primary" onClick={handleSubmit}>提交</Button>}
      </Form.Item>
      {showTmp && <TemplateSelector data={command} onOk={handleSelect} onCancel={() => setShowTmp(false)} />}
    </Form>
  )
})