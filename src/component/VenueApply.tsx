import * as React from 'react';
import { Form, Input, Button, message } from 'antd';
import { FormComponentProps, ValidationRule } from 'antd/lib/form';
import { FormEvent } from 'react';
import { applyForNewVenue } from '../netAccess/venue';

const FormItem = Form.Item;

type State = {
    isConfirmDirty: boolean
};

class VenueApplyForm extends React.Component<FormComponentProps, State> {

    state: State = {
        isConfirmDirty: false
    };

    handleSubmit = (e: FormEvent<any>) => {
        e.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                delete values.confirm;
                const result = await applyForNewVenue(values);
                message.success(`提交申请成功！您的识别码为${result.venueId}。请等待管理员批准方可登录。`);
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
                    label="场馆名称"
                >
                    {getFieldDecorator('name', {
                        rules: [{ required: true, message: '请输入场馆名称！', whitespace: true }],
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
                <FormItem
                    {...formItemLayout}
                    label="地址"
                >
                    {getFieldDecorator('address', {
                        rules: [{ required: true, message: '请输入场馆地址！', whitespace: true }],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="简介"
                >
                    {getFieldDecorator('description', {
                        rules: [{ required: true, message: '请输入场馆简介！', whitespace: true }],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">注册</Button>
                </FormItem>
            </Form>
        );
    }
}

export const VenueApply = Form.create()(VenueApplyForm);