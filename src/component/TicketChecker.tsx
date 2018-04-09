import * as React from 'react';
import { Form, Modal, InputNumber } from 'antd';
import { FormComponentProps } from 'antd/lib/form';

const FormItem = Form.Item;

type Props = FormComponentProps & {
  visible: boolean
  onCommit: (ticketId: number) => void
  onCancel: () => void
};

class TicketCheckerForm extends React.Component<Props> {

  handleSubmit = () => {
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        this.props.onCommit(values.ticketId);
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { visible, onCancel } = this.props;
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
        title="检票"
        visible={visible}
        onOk={this.handleSubmit}
        onCancel={onCancel}
        destroyOnClose
      >
        <Form>
          <FormItem
            {...formItemLayout}
            label="门票号"
          >
            {getFieldDecorator('ticketId', {
              rules: [{ type: 'number', required: true, message: '请输入门票号！', whitespace: true }],
            })(
              <InputNumber />
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export const TicketChecker = Form.create()(TicketCheckerForm);