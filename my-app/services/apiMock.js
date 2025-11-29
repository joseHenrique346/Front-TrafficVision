// Mock simplificado de autenticação

export const EnumUserRole = {
  Comum: 1,
  Empresarial: 2,
  Policial: 3,
};

let mockUsers = [
    {
      userId: 1,
      userName: "Usuário Teste",
      userEmail: "Carlos@gmail.com",
      userPassword: "123456",
      userRole: EnumUserRole.Comum,
    },
];

const wait = (ms = 600) => new Promise((r) => setTimeout(r, ms));

export async function mockRegister({ userName, userEmail, userPassword, userRole }) {
  await wait();
  const exists = mockUsers.find((u) => u.userEmail === userEmail);
  if (exists) {
    return {
      isSuccess: false,
      content: null,
      listMessageErrors: ["Email já está em uso."],
    };
  }
  const newUser = {
    userId: mockUsers.length + 1,
    userName,
    userEmail,
    userPassword,
    userRole,
  };
  mockUsers.push(newUser);
  return { isSuccess: true, content: newUser, listMessageErrors: [] };
}

export async function mockLogin({ userEmail, userPassword }) {
  await wait();
  const user = mockUsers.find((u) => u.userEmail === userEmail && u.userPassword === userPassword);
  if (!user) {
    return { isSuccess: false, content: null, listMessageErrors: ["Email ou senha inválidos."] };
  }
  return {
    isSuccess: true,
    content: { userId: user.userId, userName: user.userName, userEmail: user.userEmail, userRole: user.userRole },
    listMessageErrors: [],
  };
}
