import * as React from 'react';
import { Form, Input, Button, Radio, message } from 'antd';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import { FormComponentProps } from 'antd/lib/form';
import { FormEvent } from 'react';
import { modifyUser } from '../netAccess/user';
import { observer, inject } from 'mobx-react';
import { currentAccountInjector, MCurrentAccountProps } from '../store/stores';
import { MCurrentUser } from '../store/currentAccount';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

type Props = FormComponentProps & MCurrentAccountProps & RouteComponentProps<{}>;

@inject(currentAccountInjector)
@observer
class ModifyUserInfoForm extends React.Component<Props> {

  handleSubmit = (e: FormEvent<any>) => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        const account = this.props.currentAccount!.loggedAccount! as MCurrentUser;
        await modifyUser({ ...values, userId: account.profile.userId });
        message.success('修改成功');
        account.refreshProfile();
        this.props.history.goBack();
      }
    });
  }

  render() {
    const { isLoggedIn, loggedAccount } = this.props.currentAccount!;
    if (!isLoggedIn) {
      return <Redirect to="/login" />;
    }

    if (loggedAccount!.role !== 'USER') {
      return <Redirect to="/" />;
    }

    const { getFieldDecorator } = this.props.form;
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
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayout}
          label="姓名"
        >
          {getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入您的姓名！', whitespace: true }],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="性别"
        >
          {getFieldDecorator('gender', {
            rules: [{ required: true, message: '请选择您的性别！' }]
          })(
            <RadioGroup>
              <Radio value="男">男</Radio>
              <Radio value="女">女</Radio>
            </RadioGroup>
          )}
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">确定</Button>
          <Button>取消</Button>
        </FormItem>
      </Form>
    );
  }
}

export const ModifyUserInfo = Form.create()(ModifyUserInfoForm);