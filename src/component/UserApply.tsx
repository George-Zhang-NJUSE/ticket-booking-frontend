import * as React from 'react';
import { Form, Input, Button, Radio, message } from 'antd';
import { FormComponentProps, ValidationRule } from 'antd/lib/form';
import { FormEvent } from 'react';
import { applyForNewUser } from '../netAccess/user';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

type State = {
  isConfirmDirty: boolean
};

class UserApplyForm extends React.Component<FormComponentProps, State> {

  state: State = {
    isConfirmDirty: false
  };

  handleSubmit = (e: FormEvent<any>) => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        delete values.confirm;
        try {
          await applyForNewUser(values);
          message.success('注册成功！请前往您的邮箱完成账号激活方可登录。');
        } catch (err) {
          console.log(err);
          message.error('出错啦！请检查你的网络连接。');
        }
      }
    });
  }

  handleConfirmBlur = (e: any) => {
    const value = e.target.value as string;
    this.setState({ isConfirmDirty: this.state.isConfirmDirty || !!value });
  }

  compareToFirstPassword = (rule: ValidationRule, value: any, callback: any) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入的密码不一致！');
    } else {
      callback();
    }
  }

  validateToNextPassword = (rule: ValidationRule, value: any, callback: any) => {
    const form = this.props.form;
    if (value && this.state.isConfirmDirty) {
      form.validateFields(['confirm'], { force: true } as any);
    }
    callback();
  }

  render() {
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
          {getFieldDecorator('gender')(
            <RadioGroup>
              <Radio value="男">男</Radio>
              <Radio value="女">女</Radio>
            </RadioGroup>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="邮箱"
        >
          {getFieldDecorator('email', {
            rules: [{
              type: 'email', message: '邮箱格式不正确！',
            }, {
              required: true, message: '请输入您的邮箱！',
            }],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="密码"
        >
          {getFieldDecorator('password', {
            rules: [{
              required: true, message: '请输入您的密码！',
            }, {
              validator: this.validateToNextPassword,
            }],
          })(
            <Input type="password" />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="确认密码"
        >
          {getFieldDecorator('confirm', {
            rules: [{
              required: true, message: '请再次输入您的密码！',
            }, {
              validator: this.compareToFirstPassword,
            }],
          })(
            <Input type="password" onBlur={this.handleConfirmBlur} />
          )}
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">注册</Button>
        </FormItem>
      </Form>
    );
  }
}

export const UserApply = Form.create()(UserApplyForm);