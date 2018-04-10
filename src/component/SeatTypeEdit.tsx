import * as React from 'react';
import { Form, Input, Modal, InputNumber } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { VenueSeatType } from '../model/models';

const FormItem = Form.Item;

type Props = FormComponentProps & {
  visible: boolean
  data?: VenueSeatType  // action为编辑时传入
  action: '编辑' | '增加'
  onCommit: (data: Partial<VenueSeatType> | VenueSeatType) => void
  onCancel: () => void
};

class SeatTypeEditForm extends React.Component<Props> {

  handleSubmit = () => {
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        this.props.onCommit({ ...this.props.data, ...values });
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { data, visible, onCancel, action } = this.props;
    const defaultValues: Partial<VenueSeatType> = {
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
        title={`${action}座位类型`}
        visible={visible}
        onOk={this.handleSubmit}
        onCancel={onCancel}
        destroyOnClose
      >
        <Form>
          <FormItem
            {...formItemLayout}
            label="名称"
          >
            {getFieldDecorator('seatType', {
              rules: [{ required: true, message: '请输入座位类型名称！', whitespace: true }],
              initialValue: defaultValues.seatType
            })(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="行数"
          >
            {getFieldDecorator('totalRowNum', {
              rules: [{
                required: true, message: '请输入该类型座位总行数！', whitespace: true,
                type: 'number', min: 1, max: 5000
              }],
              initialValue: defaultValues.totalRowNum
            })(
              <InputNumber min={1} max={5000} />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="列数"
          >
            {getFieldDecorator('totalColumnNum', {
              rules: [{
                required: true, message: '请输入该类型座位总列数！', whitespace: true,
                type: 'number', min: 1, max: 5000
              }],
              initialValue: defaultValues.totalColumnNum
            })(
              <InputNumber min={1} max={5000} />
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export const SeatTypeEdit = Form.create()(SeatTypeEditForm);