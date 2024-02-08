import { useUser } from "../hooks/apiHooks";
import useForm from "../hooks/formHooks";
const RegisterForm = () => {
  const {postUser} = useUser();

  const initValues = {username: "", password: "", email: ""}

  const doRegister = async () => {
    try {
    console.log(inputs)
    await postUser(inputs)
  } catch (error) {
    console.error('postUser failed', error);
  }
}

  const {handleSubmit, handleInputChange, inputs} = useForm(doRegister, initValues)

  return  <>
  <h2>Register</h2>
  <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">Username</label>
        <input
          name="username"
          type="text"
          id="username"
          onChange={handleInputChange}
          autoComplete="username"
          />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          name="password"
          type="password"
          id="password"
          onChange={handleInputChange}
          autoComplete="current-password"
        />
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input
          name="email"
          type="email"
          id="email"
          onChange={handleInputChange}
          autoComplete="email"
        />
      </div>
      <button type="submit">Register</button>
  </form>
  </>
}

export default RegisterForm;
