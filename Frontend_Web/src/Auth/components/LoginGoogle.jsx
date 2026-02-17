// Auth/components/LoginGoogle.jsx
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;


export const LoginGoogle = ({ onSuccess, width }) => {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <GoogleLogin
        onSuccess={onSuccess}
        onError={() => toast.error('Error con Google Login')}
        theme="outline"
        size="large"
        text="continue_with"
        shape="rectangular"
        width={width}  // 👈 recibe el ancho como prop
      />
    </GoogleOAuthProvider>
  );
};