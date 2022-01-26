const db = require("../models");
const Users = db.users;
const Op = db.Sequelize.Op;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { jwtConfig } = require("../config/index");
const { authenticate } = require("ldap-authentication");

//Check Password
const comparePassword = (password, existsPassword) => {
  return new Promise((resolve, reject) => {
    const isPassword = bcrypt.compare(password, existsPassword);
    if (!isPassword) {
      throw new Error("username or password is incorrect");
    }
    return resolve(isPassword);
  });
};

const _loginLdap = (username, password) => {
  return new Promise((resolve, reject) => {
    options = {
      ldapOpts: {
        url: "LDAP://192.168.99.1",
      },
      userDn: `${username}@osd.co.th`,
      userPassword: `${password}`,
    };
    const _login = authenticate(options)
      .then((data) => {
        return data;
      })
      .catch((err) => {
        return false;
      });
    resolve(_login);
  });
};

module.exports = {
  login: (username, password) => {
    return new Promise((resolve, reject) => {
      const _authLdap = _loginLdap(username, password);
      _authLdap.then((statusLogin) => {
        if (statusLogin) {
          const condition = username
            ? { username: { [Op.eq]: `${username}` } }
            : null;
          Users.findAll({ where: condition })
            .then((data) => {
              if (data.length > 0) {
                const existsName = data[0].dataValues.name;
                const existsUsername = data[0].dataValues.username;
                const existsPassword = data[0].dataValues.password;
                const existsCode = data[0].dataValues.code;
                const existsLevel = data[0].dataValues.level;
                const existsType = data[0].dataValues.type;
                const userId = data[0].dataValues.id;
                const token = jwt.sign(
                  {
                    id: userId,
                    name: existsName,
                    username: existsUsername,
                    code: existsCode,
                    level: existsLevel,
                    type: existsType,
                  },
                  jwtConfig.secretKey,
                  {
                    expiresIn: jwtConfig.timeExpired,
                  }
                );
                result = {
                  status: true,
                  message: "login success",
                  token: token,
                  currentAuthority: "users",
                };
                resolve(result);
              } else {
                result = {
                  status: false,
                  message: `can't find data with username : ${username}`,
                  token: null,
                  currentAuthority: "users",
                };
                resolve(result);
              }
            })
            .catch((err) => {
              console.log(err);
              result = {
                status: false,
                message: `can't find data with username : ${username}`,
                token: null,
                currentAuthority: "users",
              };
            });
        } else {
          result = {
            status: false,
            message: "username or password is incorrect",
            token: null,
            currentAuthority: "users",
          };
          resolve(result);
        }
      });
    });
  },
  loginAdmin: (username, password) => {
    return new Promise((resolve, reject) => {
      const condition = username
        ? { username: { [Op.eq]: `${username}` } }
        : null;
      Users.findAll({ where: condition })
        .then((data) => {
          if (data.length > 0) {
            const existsName = data[0].dataValues.name;
            const existsUsername = data[0].dataValues.username;
            const existsPassword = data[0].dataValues.password;
            const existsCode = data[0].dataValues.code;
            const existsLevel = data[0].dataValues.level;
            const existsType = data[0].dataValues.type;
            const userId = data[0].dataValues.id;
            const checkPasswod = comparePassword(password, existsPassword);
            checkPasswod.then((statusLogin) => {
              console.log(statusLogin)
              if (statusLogin) {
                const token = jwt.sign(
                  {
                    id: userId,
                    name: existsName,
                    username: existsUsername,
                    code: existsCode,
                    level: existsLevel,
                    type: existsType,
                  },
                  jwtConfig.secretKey,
                  {
                    expiresIn: jwtConfig.timeExpired,
                  }
                );
                result = {
                  status: true,
                  message: "login success",
                  token: token,
                  currentAuthority: "admin",
                };
                resolve(result);
              } else {
                result = {
                  status: false,
                  message: "password is incorrect",
                  token: null,
                  currentAuthority: "admin",
                };
                resolve(result);
              }
            });
          } else {
            result = {
              status: false,
              message: "username is incorrect",
              token: null,
              currentAuthority: "admin",
            };
            resolve(result);
          }
        })
        .catch((err) => {
          console.log(err);
          result = {
            status: false,
            message: `can't find data with username : ${username}`,
            token: null,
            currentAuthority: "admin",
          };
        });
    });
  },
  create: (users) => {
    return new Promise((resolve, reject) => {
      Users.create(users)
        .then((data) => {
          resolve(data);
        })
        .catch((err) => {
          resolve(err);
        });
    });
  },
  findAll: () => {
    return new Promise((resolve, reject) => {
      Users.findAll()
        .then((data) => {
          resolve(data);
        })
        .catch((err) => {
          resolve(err);
        });
    });
  },
  findByCode: (code) => {
    return new Promise((resolve, reject) => {
      const condition = { code: { [Op.eq]: `${code}` } };
      Users.findAll({ where: condition })
        .then((data) => {
          resolve(data);
        })
        .catch((err) => {
          resolve(err);
        });
    });
  },
  updateByCode: (code, data) => {
    return new Promise((resolve, reject) => {
      Users.update(data, {
        where: { code: code },
      })
        .then((data) => {
          resolve({
            message: "User was update successfully!",
          });
        })
        .catch((err) => {
          resolve(err);
        });
    });
  },
  deleteByCode: (code) => {
    return new Promise((resolve, reject) => {
      Users.destroy({
        where: { code: code },
      })
        .then((num) => {
          if (num == 1) {
            resolve({
              message: "User was deleted successfully!",
            });
          } else {
            resolve({
              message: `Cannot delete User with code=${code}. Maybe Products was not found!`,
            });
          }
        })
        .catch((err) => {
          resolve(err);
        });
    });
  },
  findProfile: (code) => {
    console.log("OK");
    return new Promise((resolve, reject) => {
      const condition = { code: { [Op.eq]: `${code}` } };
      Users.findAll({ where: condition })
        .then((data) => {
          result = {
            name: data[0].dataValues.name,
            avatar:
              "https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png",
            userid: data[0].dataValues.code,
            email: "antdesign@alipay.com",
            signature: `0(-_-)0`,
            title: "Title",
            group: "OSD",
            tags: [
              {
                key: "0",
                label: "很有想法的",
              },
              {
                key: "1",
                label: "专注设计",
              },
              {
                key: "2",
                label: "辣~",
              },
              {
                key: "3",
                label: "大长腿",
              },
              {
                key: "4",
                label: "川妹子",
              },
              {
                key: "5",
                label: "海纳百川",
              },
            ],
            notifyCount: 12,
            unreadCount: 11,
            country: "China",
            access: `admin`,
            geographic: {
              province: {
                label: "浙江省",
                key: "330000",
              },
              city: {
                label: "杭州市",
                key: "330100",
              },
            },
            address: "西湖区工专路 77 号",
            phone: "0752-268888888",
          };
          resolve(result);
        })
        .catch((err) => {
          resolve(err);
        });
    });
  },
};
