// components/LoginGoogle.jsx
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';

// const GOOGLE_CLIENT_ID = import.meta.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_ID = '395832852196-dmo7tvcbi8acsutcf7s7a2cpcqv21298.apps.googleusercontent.com';

export const LoginGoogle = ({ onSuccess }) => {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <GoogleLogin
        onSuccess={onSuccess}
        onError={() => toast.error('Error con Google Login')}
        theme="outline"
        size="large"
        text="continue_with"
        shape="rectangular"
        width="384"
      />
    </GoogleOAuthProvider>
  );
};