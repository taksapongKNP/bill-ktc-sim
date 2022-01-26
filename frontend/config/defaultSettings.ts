import { Settings as LayoutSettings } from '@ant-design/pro-layout';

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'light',
  primaryColor: '#1890ff',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: 'D-BILLING',
  pwa: false,
  logo: 'icons/OSD-simbol-icon.png',
  iconfontUrl: 'icons/OSD-simbol-icon.png',
};

export default Settings;
