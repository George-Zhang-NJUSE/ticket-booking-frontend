import * as React from 'react';
import { Form, Icon, Input, Button, Select } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { FormEvent } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Role } from '../model/models';
import { getAuth } from '../netAccess/authentication';
import { inject, observer } from 'mobx-react';
import { currentAccountInjector, MCurrentAccountProps } from '../store/stores';
import { createAccount } from '../store/currentAccount';

const FormItem = Form.Item;
const Option = Select.Option;

type Props = FormComponentProps & MCurrentAccountProps;

type State = {
    role: Role
};

type RoleMap = {
    [key in State['role']]: { idText: string, inputType: string, name: string }
};

const roleMap: RoleMap = {
    USER: { idText: '邮箱', inputType: 'email', name: '普通用户' },
    VENUE: { idText: '场馆号', inputType: 'number', name: '场馆工作人员' },
    MANAGER: { idText: '经理号', inputType: 'number', name: '平台经理' }
};

@inject(currentAccountInjector)
@observer
export class LoginForm extends React.Component<Props, State> {

    state: State = {
        role: 'USER'
    };

    handleSubmit = (e: FormEvent<any>) => {
        e.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                const role = this.state.role;
                const data = await getAuth(values.id, values.password, role);
                if (data) {
                    this.props.currentAccount!.login(createAccount(role, data)!);
                }
            }
        });
    }

    handleRoleChange = (value: State['role']) => {
        this.setState({ role: value });
    }

    render() {
        if (this.props.currentAccount!.isLoggedIn) {
            return <Redirect to="/" />;
        }

        const { getFieldDecorator } = this.props.form;
        const { role } = this.state;
        const idType = roleMap[role];
        return (
            <Form onSubmit={this.handleSubmit} style={{ maxWidth: '300px' }}>
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
                    <Link to="/apply/user" style={{ marginRight: '16px' }}>用户注册</Link>
                    <Link to="/apply/venue">场馆注册</Link>
                </FormItem>
            </Form>
        );
    }
}

export const Login = Form.create()(LoginForm);