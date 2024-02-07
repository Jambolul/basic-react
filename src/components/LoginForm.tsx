import { useAuthentication } from "../hooks/apiHooks";
import useForm from "../hooks/formHooks";
import { Credentials } from "../types/LocalTypes";

const LoginForm = () => {
  const {postLogin} = useAuthentication();
  const initValues: Credentials = {username: "", password: ""}
  const {handleSubmit, handleInputChange, inputs} = useForm(async ()=> {
    console.log("submit callback, inputs:", inputs);
    console.log(await postLogin(inputs));
    // TODO: call postLogin to authenticate wqith server
  }, initValues);

  return (
    <>
    <h2>Login</h2>
    <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="UserWithLevelname">Username</label>
          <input
            name="username"
            type="text"
            id="UserWithLevelname"
            onChange={handleInputChange}
            autoComplete="username"
            />
        </div>
        <div>
          <label htmlFor="loginpassword">Password</label>
          <input
            name="password"
            type="password"
            id="loginpassword"
            onChange={handleInputChange}
            autoComplete="current-password"
          />
        </div>
        <button type="submit">Login</button>
    </form>
    </>
  )
}

export default LoginForm;
