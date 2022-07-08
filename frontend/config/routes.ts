export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/Login',
          },
          
        ],
      },
    ],
  },
  
  // {
  //   path: '/home',
  //   name: 'Home',
  //   icon: 'barChart',
  //   component: './Home',
  // },

  // {
  //   name: 'Survey',
  //   icon: 'fileText',
  //   path: '/list',
  //   component: './Servey',
  // },
  {
    name: 'Statement',
    icon: 'fileText',
    path: '/billing/statement',
    component: './Statement',
  },
  {
    name: 'Invoice',
    icon: 'fileText',
    path: '/billing/invoice',
    component: './Invoice',
  },
  
  // {
  //   path: '/setting',
  //   name: 'Setting',
  //   icon: 'setting',
  //   access: 'canAdmin',
  //   component: './Products',
  //   routes: [
  //     {
  //       path: '/setting/products',
  //       name: 'Products',
  //       icon: 'smile',
  //       component: './Products',
  //     },
  //   ],
  // },
  {
    path: '/',
    component: './Home',
  },
  {
    component: './404',
  },
];
