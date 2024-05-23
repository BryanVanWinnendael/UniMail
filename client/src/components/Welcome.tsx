import { useMsal } from '@azure/msal-react';

const Welcome = () => {
  const { accounts } = useMsal();
  const username = accounts[0].username;

  return <p>Welcome, {username}</p>;
}

export default Welcome