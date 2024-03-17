import {useState} from 'react';
// import {useUser} from '../hooks/apiHooks';
import {useUser} from '../hooks/graphQLHooks';
import { useUserContext } from '../hooks/ContextHooks';
import {useForm} from '../hooks/formHooks';
import { Credentials } from '../types/LocalTypes';

const RegisterForm = () => {
  const {postUser} = useUser();
  const {handleLogin} = useUserContext();
  const [usernameAvailable, setUsernameAvailable] = useState<boolean>(true);
  const [emailAvailable, setEmailAvailable] = useState<boolean>(true);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const initValues = {username: '', password: '', email: ''};

  const validatePassword = (password: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return regex.test(password);
  };

  const doRegister = async () => {
    if (!validatePassword(inputs.password)) {
      setPasswordError('Password must be at least 8 characters long, include uppercase and lowercase letters and a number.');
      return;
    }

    try {
      if (usernameAvailable && emailAvailable) {
        await postUser(inputs);
        await handleLogin(inputs as Credentials);
      }
    } catch (error) {
      console.log((error as Error).message);
    }
  };

  const {handleSubmit, handleInputChange, inputs} = useForm(doRegister, initValues);
  const {getUsernameAvailable, getEmailAvailable} = useUser();

  const handleUsernameBlur = async (event: React.SyntheticEvent<HTMLInputElement>) => {
    const result = await getUsernameAvailable(event.currentTarget.value);
    setUsernameAvailable(result.available);
  };

  const handleEmailBlur = async () => {
    const result = await getEmailAvailable(inputs.email); // voidaan käyttää myös inputs objektia
    setEmailAvailable(result.available);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordError(null); // Reset password error message
    handleInputChange(event); // Update state
  };

  console.log(usernameAvailable, emailAvailable);
  return (
    <>
      <h3 className="text-3xl">Register</h3>
      <form onSubmit={handleSubmit} className="flex flex-col text-center">
        {/* Username input */}
        <div className="flex w-4/5">
          <label className="w-1/3 p-6 text-end" htmlFor="username">Username</label>
          <input
            className="m-3 w-2/3 rounded-md border border-sky-900 p-3 text-black bg-sky-100"
            name="username"
            type="text"
            id="username"
            onChange={handleInputChange}
            onBlur={handleUsernameBlur}
            autoComplete="username"
          />
        </div>
        {!usernameAvailable && (
          <div className="flex w-4/5 justify-end pr-4">
            <p className="text-red-500">Username not available</p>
          </div>
        )}

        {/* Password input */}
        <div className="flex w-4/5">
          <label className="w-1/3 p-6 text-end" htmlFor="password">Password</label>
          <input
            className="m-3 w-2/3 rounded-md border border-sky-900 p-3 text-black bg-sky-100"
            name="password"
            type="password"
            id="password"
            onChange={handlePasswordChange}
            autoComplete="current-password"
          />
        </div>
        {passwordError && (
          <div className="flex w-4/5 justify-end pr-4">
            <p className="text-red-500">{passwordError}</p>
          </div>
        )}

        {/* Email input */}
        <div className="flex w-4/5">
          <label className="w-1/3 p-6 text-end" htmlFor="email">Email</label>
          <input
            className="m-3 w-2/3 rounded-md border border-sky-900 p-3 text-black bg-sky-100"
            name="email"
            type="email"
            id="email"
            onChange={handleInputChange}
            onBlur={handleEmailBlur}
            autoComplete="email"
          />
        </div>
        {!emailAvailable && (
          <div className="flex w-4/5 justify-end pr-4">
            <p className="text-red-500">Email not available</p>
          </div>
        )}

        {/* Submit button */}
        <div className="flex w-4/5 justify-end">
          <button
            className="m-3 w-1/3 rounded-md bg-sky-950 text-sky-50 p-3"
            type="submit"
          >
            Register
          </button>
        </div>
      </form>
    </>
  );
};

export default RegisterForm;
