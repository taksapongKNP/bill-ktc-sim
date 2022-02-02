import {
  AlipayCircleOutlined,
  LockOutlined,
  MobileOutlined,
  TaobaoCircleOutlined,
  UserOutlined,
  WeiboCircleOutlined,
} from '@ant-design/icons';
import { Alert, Space, message, Tabs } from 'antd';
import React, { useState, useEffect } from 'react';
import ProForm, { ProFormCaptcha, ProFormCheckbox, ProFormText } from '@ant-design/pro-form';
import { useIntl, Link, history, FormattedMessage, SelectLang, useModel } from 'umi';
import Footer from '@/components/Footer';
import { login } from '@/services/backend/api';
import { getFakeCaptcha } from '@/services/backend/login';

import styles from './index.less';

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginTop: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const goto = () => {
  if (!history) return;
  setTimeout(() => {
    const { query } = history.location;
    const { redirect } = query as { redirect: string };
    history.push(redirect || '/');
  }, 10);
};

const Login: React.FC = () => {
  const [submitting, setSubmitting] = useState(false);
  const [userLoginState, setUserLoginState] = useState<API.LoginResult>({});
  const [type, setType] = useState<string>('account');
  const { initialState, setInitialState } = useModel('@@initialState');
  const [loginStatus, setLoginStatus] = useState(false);

  const intl = useIntl();

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      setInitialState({
        ...initialState,
        currentUser: userInfo,
      });
    }
  };

  // const setToken = async (token: string) => {
  //   await localStorage.setItem('token', token);
  //   setLoginStatus(true);
  // };

  const handleSubmit = async (values: API.LoginParams) => {
    setSubmitting(true);
    try {
      const msg = await login({ ...values, type });
      if (msg.status) {
        await localStorage.setItem('token', `${msg.token}`);
        const defaultloginSuccessMessage = intl.formatMessage({
          id: 'pages.login.success',
        });
        // console.log(defaultloginSuccessMessage)
        message.success(defaultloginSuccessMessage);
        // message.warn(defaultloginSuccessMessage);
        await fetchUserInfo();
        goto();
        return;
        setUserLoginState(msg);
      }else{
        const defaultloginSuccessMessage = intl.formatMessage({
          id: 'pages.login.failure',
        });
        message.error(defaultloginSuccessMessage);
      }
    } catch (error) {
      const defaultloginFailureMessage = intl.formatMessage({
        id: 'pages.login.failure',
      });

      message.error(defaultloginFailureMessage);
    }
    setSubmitting(false);
  };
  const { status, type: loginType } = userLoginState;

  useEffect(() => {
    (async function fetchdata() {
      if (submitting) {
        await localStorage.removeItem('token');
      }
    })();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.lang} data-lang>
        {SelectLang && <SelectLang />}
      </div>
      <div className={styles.content}>
        <div className={styles.top}>
          <div className={styles.header}>
            <Link to="/">
              <span className={styles.title}>D-BILLING</span>
            </Link>
          </div>
        </div>

        <div
          className={styles.main}
          style={{
            marginTop: 30,
          }}
        >
          <ProForm
            initialValues={{
              autoLogin: true,
            }}
            submitter={{
              searchConfig: {
                submitText: intl.formatMessage({
                  id: 'pages.login.submit',
                }),
              },
              render: (_, dom) => dom.pop(),
              submitButtonProps: {
                loading: submitting,
                size: 'large',
                style: {
                  width: '100%',
                },
              },
            }}
            onFinish={async (values) => {
              handleSubmit(values as API.LoginParams);
            }}
          >
            {type === 'account' && (
              <>
                <ProFormText
                  name="username"
                  fieldProps={{
                    size: 'large',
                    prefix: <UserOutlined className={styles.prefixIcon} />,
                  }}
                  placeholder={intl.formatMessage({
                    id: 'pages.login.username.placeholder',
                  })}
                  rules={[
                    {
                      required: true,
                      message: <FormattedMessage id="pages.login.username.required" />,
                    },
                  ]}
                />
                <ProFormText.Password
                  name="password"
                  fieldProps={{
                    size: 'large',
                    prefix: <LockOutlined className={styles.prefixIcon} />,
                  }}
                  placeholder={intl.formatMessage({
                    id: 'pages.login.password.placeholder',
                  })}
                  rules={[
                    {
                      required: true,
                      message: <FormattedMessage id="pages.login.password.required" />,
                    },
                  ]}
                />
              </>
            )}

            <div
              style={{
                marginBottom: 24,
              }}
            >
              <ProFormCheckbox noStyle name="autoLogin">
                <FormattedMessage id="pages.login.rememberMe" />
              </ProFormCheckbox>
              <a
                style={{
                  float: 'right',
                }}
              >
                <FormattedMessage id="pages.login.forgotPassword" />
              </a>
            </div>
          </ProForm>
          {status === 'error' && loginType === 'account' && (
            <LoginMessage
              content={intl.formatMessage({
                id: 'pages.login.accountLogin.errorMessage',
              })}
            />
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
