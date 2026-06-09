const USER_ROLES = {
  ADMIN: "admin",
  USER: "user",
};

const DEMO_ACCOUNTS = [
  {
    name: "Silver Gym Admin",
    email: "admin@silvergym.com",
    password: "admin123",
    role: USER_ROLES.ADMIN,
  },
  {
    name: "Silver Gym Member",
    email: "member@silvergym.com",
    password: "member123",
    role: USER_ROLES.USER,
  },
];

export { DEMO_ACCOUNTS, USER_ROLES };
