/**
 * Copyright (c) OpenSpug Organization. https://github.com/openspug/spug
 * Copyright (c) <spug.dev@gmail.com>
 * Released under the MIT License.
 */
import React from 'react';
import { observer } from 'mobx-react';
import { SyncOutlined } from '@ant-design/icons';
import { Modal, Table, Input, Button, Select } from 'antd';
import { SearchForm } from 'components';
import store from '../template/store';

@observer
class TemplateSelector extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedRows: [],
    }
  }

  componentDidMount() {
    if (store.records.length === 0) {
      store.fetchRecords()
    }
  }

  handleClick = (record) => {
    this.setState({selectedRows: [record]});
  };

  handleSubmit = () => {
    if (this.state.selectedRows.length > 0) {
      console.log("this.state.selectedRows",this.state.selectedRows)
      this.props.onOk(this.state.selectedRows)
    }
    this.props.onCancel()
  };

  columns = [
    {
      title: '名称',
      dataIndex: 'name',
      ellipsis: true
    },{
      title: '内容',
      dataIndex: 'body',
      ellipsis: true
    }, {
      title: '备注',
      dataIndex: 'desc',
      ellipsis: true
    }];

  render() {
    const {selectedRows} = this.state;
    return (
      <Modal
        visible
        width={1000}
        title="选择执行模板"
        onCancel={this.props.onCancel}
        onOk={this.handleSubmit}
        maskClosable={false}>
        <SearchForm>
          <SearchForm.Item span={8} title="模板名称">
            <Input allowClear value={store.f_name} onChange={e => store.f_name = e.target.value} placeholder="请输入"/>
          </SearchForm.Item>
          <SearchForm.Item span={8}>
            <Button type="primary" icon={<SyncOutlined/>} onClick={store.fetchRecords}>刷新</Button>
          </SearchForm.Item>
        </SearchForm>
        <Table
          rowKey="id"
          rowSelection={{
            type: 'checkbox',
            onChange: (_, selectedRows) => this.setState({selectedRows})
          }}
          dataSource={store.dataSource}
          loading={store.isFetching}
          onRow={record => {
            return {
              onClick: () => this.handleClick(record)
            }
          }}
          columns={this.columns}/>
      </Modal>
    )
  }
}

export default TemplateSelector