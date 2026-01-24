import type { FormProps } from 'antd';
import { Button, ConfigProvider, Form, Input, message } from 'antd';
import type { AuthLoginModel } from '../../types/auth/AuthLoginModel';
import { useLoginMutation } from '../../services/apiAuth';
import { useNavigate } from 'react-router';



function LoginPage() {
    const [login, {isLoading}] = useLoginMutation();
    const navigate = useNavigate();

    const onFinish: FormProps<AuthLoginModel>['onFinish'] = async (values) => {
        console.log('Success:', values);
        try {
            const response = await login(values).unwrap();
            if (response.access && response.refresh) {
                localStorage.setItem("accessToken", response.access);
                localStorage.setItem("refreshToken", response.refresh);
            }
            navigate("/auth/profile");
            message.success("Успішний вхід");
        } catch (e) {
            message.error("Авторизація не вдалася");
      
            console.log(e);
        }
    };

    const onFinishFailed: FormProps<AuthLoginModel>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
        message.error("Помилка валідації форми");
    };

    return (
      <ConfigProvider
        theme={{
          components: {
            Form: {
              labelColor: "gray",
            },
            Modal: {
              contentBg: "gray",
              titleColor: "white",
            },
          },
        }}
      >
        <Form
          name="loginForm"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item<AuthLoginModel>
            label="Username"
            name="username"
            rules={[{ required: true, message: "Введіть ім'я користувача!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<AuthLoginModel>
            label="Password"
            name="password"
            rules={[{ required: true, message: "Введіть пароль!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item label={null}>
            <Button type="primary" htmlType="submit" loading={isLoading}>
              Вхід
            </Button>
          </Form.Item>
        </Form>
      </ConfigProvider>
    );
  
};

export default LoginPage;