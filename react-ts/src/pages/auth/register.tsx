import type { FormProps, GetProp, UploadFile, UploadProps } from 'antd';
import { Button, ConfigProvider, Form, Image, Input, message, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import ImgCrop from 'antd-img-crop';
import type { AuthRegisterModel } from '../../types/auth/AuthRegisterModel';
import { useRegisterMutation } from '../../services/apiAuth';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];


const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
});

const onFinishFailed: FormProps<AuthRegisterModel>['onFinishFailed'] = (errorInfo) => {
  console.log('Failed:', errorInfo);
};


function RegisterPage() {
  const [register, {isLoading}] = useRegisterMutation();
  const [image, setImage] = useState<File|null>(null);


  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );


  const dummyRequest: UploadProps['customRequest'] = ({ onSuccess }) => {
    // Не робимо мережевий запит: просто позначаємо файл як "успішно завантажений",
    // щоб antd не показував помилку через відсутність action.
    window.setTimeout(() => onSuccess?.('ok'), 0);
  };


  const onFinish: FormProps<AuthRegisterModel>['onFinish'] = async (values) => {
    try {
      const data : AuthRegisterModel = {
        ...values, image: image
      }
      console.log("Form: ", data)
      await register(data).unwrap();
      message.success("Registration success");
    } catch (e) {
      message.error("Registration failed");
      
      console.log(e);
    }

  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    const maybeFile = (newFileList?.[0]?.originFileObj as File | undefined) ?? null;
    setImage(maybeFile);
  };

  return (
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
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 800 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item<AuthRegisterModel>
        label="Username"
        name="username"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item<AuthRegisterModel>
        label="Email"
        name="email"
        rules={[{ required: true, message: 'Please input your email!' }]}
      >
        <Input type={'email'} />
      </Form.Item>

      <Form.Item<AuthRegisterModel>
        label="Firstname"
        name="first_name"
        rules={[{ required: true, message: 'Please input your firstname!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item<AuthRegisterModel>
        label="Lastname"
        name="last_name"
        rules={[{ required: true, message: 'Please input your lastname!' }]}
      >
        <Input />
      </Form.Item>


      <Form.Item<AuthRegisterModel>
        label="Image"
        name="image"
      >
        <ImgCrop rotationSlider>
          <Upload
            customRequest={dummyRequest}
            listType="picture-card"
            accept="image/*"
            maxCount={1}
            onPreview={handlePreview}
            onChange={handleChange}
          >
            { image != null ? null: uploadButton }
          </Upload>
        </ImgCrop>
        
      </Form.Item>

      <Form.Item<AuthRegisterModel>
        label="Phone"
        name="phone"
        rules={[{ required: true, message: 'Please input your phone!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item<AuthRegisterModel>
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }, {min: 6, message: 'Minimum length for password - 6'}]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item label={null}>
        <Button type="primary" htmlType="submit" loading={isLoading}>
          Sign Up
        </Button>
      </Form.Item>
    </Form>
    <div>
      {previewImage && (
          <Image
            style={{ display: 'none' }}
            preview={{
              open: previewOpen,
              onOpenChange: (visible: boolean) => setPreviewOpen(visible),
              afterOpenChange: (visible: boolean) => !visible && setPreviewImage(''),
            }}
            src={previewImage}
          />
        )}
      </div>
  </ConfigProvider>
  )
}

export default RegisterPage;