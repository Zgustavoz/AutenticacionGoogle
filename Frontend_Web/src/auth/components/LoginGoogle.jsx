// auth/components/LoginGoogle.jsx
import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';

export const LoginGoogle = ({ onSuccess, width }) => {
  return (
    <GoogleLogin
      onSuccess={onSuccess}
      onError={() => toast.error('Error con Google Login')}
      theme="outline"
      size="large"
      text="continue_with"
      shape="rectangular"
      width={width}
    />
  );
};