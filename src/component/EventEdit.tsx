import * as React from 'react';
import * as moment from 'moment';
import { Form, Input, Modal, Select, DatePicker } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { Event, eventTypeText } from '../model/models';
import { Moment } from 'moment';

const FormItem = Form.Item;
const Option = Select.Option;

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
        this.props.onCommit({ ...this.props.data, ...values });
      }
    });
  }

  isDisabledDate(value: Moment) {
    // 不能选择今天之前的日期
    return value < moment().startOf('day');
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { data, visible, onCancel, action } = this.props;

    const eventTypeOptions = { ...eventTypeText };
    delete eventTypeOptions.ALL;

    const defaultValues: Partial<Event> = {
      eventName: '',
      description: '',
      hostTime: 0,
      eventType: 'MUSIC',
      posterUrl: '',
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
              rules: [{ required: true, message: '请输入活动名称！', whitespace: true }],
              initialValue: defaultValues.eventName
            })(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="活动类型"
          >
            {getFieldDecorator('eventType', {
              rules: [{
                required: true, message: '请选择活动类型！', whitespace: true
              }],
              initialValue: defaultValues.eventType
            })(
              <Select placeholder="活动类型">
                {Object.getOwnPropertyNames(eventTypeOptions).map(key =>
                  <Option key={key} value={key}>{eventTypeOptions[key]}</Option>
                )}
              </Select>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="举办时间"
          >
            {getFieldDecorator('hostTime', {
              rules: [{
                type: 'number', required: true, message: '请输入活动举办时间！', whitespace: true,
                transform: (value: Moment) => value.toDate().getTime()
              }],
              initialValue: moment(defaultValues.hostTime)
            })(
              <DatePicker
                showTime
                disabledDate={this.isDisabledDate}
                format="YYYY-MM-DD HH:mm:ss"
              />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="活动介绍"
          >
            {getFieldDecorator('description', {
              rules: [{
                required: true, message: '请输入活动介绍！', whitespace: true
              }],
              initialValue: defaultValues.description
            })(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="海报URL"
          >
            {getFieldDecorator('posterUrl', {
              rules: [{
                required: true, message: '请输入活动海报的url！', whitespace: true
              }],
              initialValue: defaultValues.posterUrl
            })(
              <Input />
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export const EventEdit = Form.create()(EventEditForm);