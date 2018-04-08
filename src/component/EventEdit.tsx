import * as React from 'react';
import { Form, Input, Modal, InputNumber } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { Event } from '../model/models';

const FormItem = Form.Item;

type Props = FormComponentProps & {
  visible: boolean
  data?: Event  // action为编辑时传入
  action: '编辑' | '增加'
  onCommit: (data: Partial<Event> | Event) => void
  onCancel: () => void
};

class EventEditForm extends React.Component<Props> {

  handleSubmit = () => {
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        this.props.onCommit(values);
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { data, visible, onCancel, action } = this.props;
    const defaultValues = {
      seatType: '',
      totalRowNum: 1,
      totalColumnNum: 1,
      ...data
    };
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    return (
      <Modal
        title={`${action}活动`}
        visible={visible}
        onOk={this.handleSubmit}
        onCancel={onCancel}
        destroyOnClose={action === '增加'}
      >
        <Form>
          <FormItem
            {...formItemLayout}
            label="活动名称"
          >
            {getFieldDecorator('eventName', {
              rules: [{ required: true, message: '请输入座位类型名称！', whitespace: true }],
            })(
              <Input defaultValue={defaultValues} />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="活动类型"
          >
            {getFieldDecorator('eventType', {
              rules: [{
                required: true, message: '请输入该类型座位总行数！', whitespace: true
              }, {
                type: 'number', min: 1, max: 5000
              }],
            })(
              <InputNumber min={1} max={5000} defaultValue={defaultValues.totalRowNum} />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="举办时间"
          >
            {getFieldDecorator('hostTime', {
              rules: [{
                required: true, message: '请输入该类型座位总行数！', whitespace: true
              }, {
                type: 'number', min: 1, max: 5000
              }],
            })(
              <InputNumber min={1} max={5000} defaultValue={defaultValues.totalRowNum} />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="活动介绍"
          >
            {getFieldDecorator('description', {
              rules: [{
                required: true, message: '请输入该类型座位总列数！', whitespace: true
              }, {
                type: 'number', min: 1, max: 5000
              }],
            })(
              <InputNumber min={1} max={5000} defaultValue={defaultValues.totalColumnNum} />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="海报URL"
          >
            {getFieldDecorator('posterUrl', {
              rules: [{
                required: true, message: '请输入该类型座位总列数！', whitespace: true
              }, {
                type: 'number', min: 1, max: 5000
              }],
            })(
              <InputNumber min={1} max={5000} defaultValue={defaultValues.totalColumnNum} />
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export const EventEdit = Form.create()(EventEditForm);