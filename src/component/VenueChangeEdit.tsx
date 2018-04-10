import * as React from 'react';
import { Form, Input, Modal } from 'antd';
import { FormComponentProps } from 'antd/lib/form';

const FormItem = Form.Item;

type Props = FormComponentProps & {
  visible: boolean
  oldName: string
  oldAddress: string
  oldDescription: string
  onCommit: (newName: string, newAddress: string, newDescription: string) => void
  onCancel: () => void
};

class VenueChangeEditForm extends React.Component<Props> {

  handleSubmit = () => {
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        this.props.onCommit(values.newName, values.newAddress, values.newDescription);
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { oldDescription, oldAddress, oldName, visible, onCancel } = this.props;
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
        title="修改场馆信息"
        visible={visible}
        onOk={this.handleSubmit}
        onCancel={onCancel}
        destroyOnClose
      >
        <Form>
          <FormItem
            {...formItemLayout}
            label="场馆名称"
          >
            {getFieldDecorator('newName', {
              rules: [{ required: true, message: '请输入场馆名称！', whitespace: true }],
              initialValue: oldName
            })(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="地址"
          >
            {getFieldDecorator('newAddress', {
              rules: [{ required: true, message: '请输入场馆地址！', whitespace: true }],
              initialValue: oldAddress
            })(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="简介"
          >
            {getFieldDecorator('newDescription', {
              rules: [{ required: true, message: '请输入场馆简介！', whitespace: true }],
              initialValue: oldDescription
            })(
              <Input />
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export const VenueChangeEdit = Form.create()(VenueChangeEditForm);