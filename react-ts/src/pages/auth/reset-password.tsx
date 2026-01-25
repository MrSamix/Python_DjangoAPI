import React, { useState } from 'react';
import { useParams } from 'react-router';
import { useResetPasswordMutation } from '../../services/apiAuth';
import { Button, message, Form, Input, type FormProps, ConfigProvider } from 'antd';

type FieldType = {
  password: string;
  confirmPassword: string;
};

const ResetPassword: React.FC = () => {
  const { uid, token } = useParams();
  const [resetPassword, {isLoading}] = useResetPasswordMutation();

  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    handleSubmit(values);
  };


  const handleSubmit = async (values: FieldType) => {
    const { password, confirmPassword } = values;
    if (password !== confirmPassword) {
      message.error('Паролі не співпадають');
      return;
    }
    else if (password.length < 8) {
      message.error('Пароль повинен містити щонайменше 8 символів');
      return;
    }
    if (!uid || !token) {
      message.error('Недійсне посилання для скидання паролю');
      return;
    }

    try {
        await resetPassword({ uid, token, new_password: password }).unwrap();
        message.success('Пароль успішно скинуто!');
    } catch (error) {
        message.error('Не вдалося скинути пароль. Спробуйте ще раз.');
        console.error('Error:', error);
    }
  };

  return (
    <div>
      <h2>Скинути пароль</h2>
      <ConfigProvider
          theme={{
            components: {
              Form: {
                labelColor: "gray"
              },
              Modal: {
                contentBg: "gray",
                titleColor: "white"
              }
            }
          }}
        >
        <Form
            name="basic"
            labelCol={{ span: 10 }}
            wrapperCol={{ span: 25 }}
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            autoComplete="off"
        >
            <Form.Item<FieldType>
                label="New Password"
                name="password"
                rules={[{ required: true, message: 'Будь ласка, введіть ваш пароль!' }]}
            >
                <Input.Password />
            </Form.Item>

            <Form.Item<FieldType>
                label="Confirm Password"
                name="confirmPassword"
                rules={[{ required: true, message: 'Будь ласка, введіть ваш пароль ще раз!' }]}
            >
                <Input.Password />
            </Form.Item>


            <Form.Item>
                <Button type="primary" htmlType="submit" loading={isLoading}>
                    Скинути пароль
                </Button>
            </Form.Item>
        </Form>
        </ConfigProvider>
    </div>
  );
};

export default ResetPassword;