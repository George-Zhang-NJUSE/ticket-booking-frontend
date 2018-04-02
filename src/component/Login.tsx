import * as React from 'react';
import { Form, Icon, Input, Button, Select } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { FormEvent } from 'react';
import { Link } from 'react-router-dom';

const FormItem = Form.Item;
const Option = Select.Option;

type State = {
    role: 'user' | 'venue' | 'manager'
};

type RoleMap = {
    [key in State['role']]: { idText: string, inputType: string, name: string }
};

const roleMap: RoleMap = {
    user: { idText: '邮箱', inputType: 'email', name: '普通用户' },
    venue: { idText: '场馆号', inputType: 'number', name: '场馆工作人员' },
    manager: { idText: '经理号', inputType: 'number', name: '平台经理' }
};

export class Login extends React.Component<FormComponentProps, State> {

    state: State = {
        role: 'user'
    };

    handleSubmit = (e: FormEvent<any>) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                // todo 使用表单值values登录
            }
        });
    }

    handleRoleChange = (value: State['role']) => {
        this.setState({ role: value });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { role } = this.state;
        const idType = roleMap[role];
        return (
            <Form onSubmit={this.handleSubmit} className="login-form">
                <FormItem>
                    {getFieldDecorator('role', {
                        rules: [
                            { required: true, message: '请选择您的身份！' },
                        ],
                    })(
                        <Select placeholder="身份" onChange={this.handleRoleChange}>
                            {Object.getOwnPropertyNames(roleMap).map(key =>
                                <Option key={key} value={key}>{roleMap[key].name}</Option>
                            )}
                        </Select>
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('id', {
                        rules: [{
                            required: true, message: `请输入您的${idType.idText}！`
                        }, {
                            type: idType.inputType, message: '输入格式不正确！'
                        }],
                    })(
                        <Input
                            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            type={idType.inputType}
                            placeholder={idType.idText}
                        />
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: '请输入您的密码！' }],
                    })(
                        <Input
                            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            type="password"
                            placeholder="密码"
                        />
                    )}
                </FormItem>
                <FormItem>
                    <Button type="primary" htmlType="submit" style={{ width: '100%' }}>登录</Button>
                    <Link to="/apply">注册</Link>
                </FormItem>
            </Form>
        );
    }
}