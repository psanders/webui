import Users from "@fonoster/users";
import Auth from "@fonoster/auth";

const credentials = {
  accessKeyId: process.env.ACCESS_KEY_ID,
  accessKeySecret: process.env.ACCESS_KEY_SECRET
}

const users = new Users(credentials);
const auth = new Auth(credentials);

export async function userExist(email) {
  return await getUser(email) !== null
}

export async function createUser(user) {
  try {
    await users.createUser(user)
  } catch (e) {
    console.log(e)
  }
}

export async function getUser(email) {
  try {
    // TODO: Fix not using email as a filter
    const list = await users.listUsers({});
    const l = list.users.map(user => {
      if (user.email === email) {
        return user
      }
    })
    return l[0]
  } catch (e) {
    console.log(e)
    // TODO: Check for other errors, such as bad authentication
    return null;
  }
}

export async function createToken(accessKeyId) {
  const response = await auth.createToken({
    accessKeyId: accessKeyId,
    roleName: "USER",
    expirantion: "30d"
  })
  return response.token;
}
