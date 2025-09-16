import React from "react";
import { Button, Form, Input, Modal, message } from "antd";
import {
  CheckCircleOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { registerApi, loginApi } from "../../api/auth";
import useLoginCheck from "../hooks/useLoginCheck";
import "./RegisterModal.scss";

type Props = {
  open: boolean;
  onCancelBackToLogin: () => void;
  onCloseAll: () => void;
  onAutoLoggedIn: (userName: string) => void;
  onNotify: (
    type: "success" | "error" | "warning" | "info",
    text: string
  ) => void;
};

const RegisterModal: React.FC<Props> = ({
  open,
  onCancelBackToLogin,
  onCloseAll,
  onAutoLoggedIn,
  onNotify,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);
  const {
    state,
    onChangeLogin,
    suffix,
    validateStatus,
    help,
    isTaken,
    isChecking,
  } = useLoginCheck({ min: 5, max: 15 });

  const submit = async () => {
    try {
      const v = await form.validateFields();
      if (isChecking) {
        message.warning("Проверяем логин...");
        return;
      }
      if (isTaken) {
        message.error("Логин занят");
        onNotify("error", "Логин занят");
        return;
      }
      setLoading(true);

      const reg = await registerApi({
        login: v.login,
        password: v.password,
        email: v.email,
        phone: v.phone,
      });

      if (!reg.ok) {
        const text = reg.message || "Не удалось зарегистрироваться";
        message.error(text);
        onNotify("error", text);
        return;
      }

      const okText = reg.message || "Регистрация успешна";
      message.success(okText);
      onNotify("success", okText);

      const sig = await loginApi(v.login, v.password);
      if (!sig.ok) {
        message.warning("Регистрация выполнена. Войдите вручную.");
        onNotify("warning", "Регистрация выполнена. Войдите вручную.");
        onCancelBackToLogin();
        window.dispatchEvent(
          new CustomEvent("prefill-login", { detail: v.login })
        );
        return;
      }

      const name = (sig.data as any)?.login || v.login;
      message.success("Вы вошли в систему");
      onNotify("success", "Вы вошли в систему");
      form.resetFields();
      onAutoLoggedIn(name);
    } catch (err: any) {
      if (!(err && Array.isArray(err.errorFields))) {
        message.error("Ошибка. Проверьте подключение к серверу.");
        onNotify("error", "Ошибка. Проверьте подключение к серверу.");
      }
    } finally {
      setLoading(false);
    }
  };

  const confirmOk =
    form.getFieldValue("password") &&
    form.getFieldValue("confirm") &&
    form.getFieldValue("password") === form.getFieldValue("confirm");

  const disableSubmit = loading || isChecking || isTaken;

  return (
    <Modal
      title="Регистрация"
      open={open}
      onCancel={onCloseAll}
      maskClosable
      destroyOnHidden
      rootClassName="register-modal"
      footer={
        <div className="modal-footer">
          <Button onClick={onCancelBackToLogin} disabled={loading}>
            Отмена
          </Button>
          <Button
            type="primary"
            onClick={submit}
            loading={loading}
            disabled={disableSubmit}
          >
            Зарегистрировать
          </Button>
        </div>
      }
    >
      <Form layout="vertical" form={form} name="regForm" autoComplete="off">
        <Form.Item
          label="Логин"
          name="login"
          validateStatus={validateStatus as any}
          help={help}
          rules={[
            { required: true, message: "Введите логин" },
            { min: 5, message: "Не менее 5 символов" },
            { max: 15, message: "Не более 15 символов" },
          ]}
        >
          <Input
            placeholder="от 5 до 15 символов"
            prefix={<UserOutlined />}
            maxLength={15}
            onChange={(e) => onChangeLogin(e.target.value)}
            suffix={suffix}
          />
        </Form.Item>

        <Form.Item
          label="Пароль"
          name="password"
          rules={[
            { required: true, message: "Введите пароль" },
            { min: 5, message: "Не менее 5 символов" },
            { max: 15, message: "Не более 15 символов" },
          ]}
        >
          <Input.Password
            placeholder="от 5 до 15 символов"
            prefix={<LockOutlined />}
            maxLength={15}
          />
        </Form.Item>

        <Form.Item
          label="Повторите пароль"
          name="confirm"
          dependencies={["password"]}
          hasFeedback
          rules={[
            { required: true, message: "Повторите пароль" },
            { min: 5, message: "Не менее 5 символов" },
            { max: 15, message: "Не более 15 символов" },
            ({ getFieldValue }) => ({
              validator(_, val) {
                if (!val || getFieldValue("password") === val)
                  return Promise.resolve();
                return Promise.reject(new Error("пароли не совпадают"));
              },
            }),
          ]}
        >
          <Input.Password
            placeholder="повторите пароль"
            prefix={<LockOutlined />}
            maxLength={15}
            suffix={
              confirmOk ? (
                <CheckCircleOutlined style={{ color: "#52c41a" }} />
              ) : null
            }
          />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Введите email" },
            { max: 50, message: "Не более 50 символов" },
            {
              validator: (_, value?: string) => {
                if (!value) return Promise.reject(new Error("Введите email"));
                const okLen = value.length <= 50;
                const okDomain =
                  value.endsWith("@yandex.ru") || value.endsWith("@mail.com");
                return okLen && okDomain
                  ? Promise.resolve()
                  : Promise.reject(
                      new Error(
                        "Только @yandex.ru или @mail.com, до 50 символов"
                      )
                    );
              },
            },
          ]}
        >
          <Input
            placeholder="user@yandex.ru"
            prefix={<MailOutlined />}
            maxLength={50}
          />
        </Form.Item>

        <Form.Item
          label="Телефон"
          name="phone"
          rules={[
            { required: true, message: "Введите телефон" },
            { pattern: /^\d{11}$/, message: "Ровно 11 цифр" },
          ]}
        >
          <Input
            placeholder="только цифры, 11 символов"
            prefix={<PhoneOutlined />}
            inputMode="numeric"
            maxLength={11}
            onChange={(e) => {
              const digits = e.target.value.replace(/\D/g, "");
              form.setFieldsValue({ phone: digits });
            }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RegisterModal;
