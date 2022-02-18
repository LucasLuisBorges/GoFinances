import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { CLIENT_ID } = process.env;
const { REDIRECT_URI } = process.env;

type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
};

type AuthorizationResponse = {
  type: string;
  params: {
    access_token: string;
  };
};

type AuthContextData = {
  user: User;
  userStorageLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

WebBrowser.maybeCompleteAuthSession();

export const AuthContext = createContext({} as AuthContextData);

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User>({} as User);
  const [userStorageLoading, setUserStorageLoading] = useState(true);

  const userStorageKey = '@GoFinances:user';

  useEffect(() => {
    async function loadUser() {
      const asyncUser = await AsyncStorage.getItem(userStorageKey);

      if (asyncUser) setUser(JSON.parse(asyncUser));

      setUserStorageLoading(false);
    }

    loadUser();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const authParams = new URLSearchParams({
        client_id: CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        response_type: 'token',
        scope: encodeURI('profile email'),
      });

      const { type, params } = (await AuthSession.startAsync({
        authUrl: `https://accounts.google.com/o/oauth2/v2/auth?${authParams.toString()}`,
      })) as AuthorizationResponse;

      if (type === 'success') {
        const response = await fetch(
          `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${params.access_token}`,
        );

        const userInfo = await response.json();

        const loadedUser: User = {
          id: String(userInfo.id),
          name: userInfo.given_name,
          email: userInfo.email,
          avatar: userInfo.picture,
        };

        setUser(loadedUser);

        await AsyncStorage.setItem(userStorageKey, JSON.stringify(loadedUser));
      }
    } catch (err) {
      throw new Error(err as undefined);
    }
  };

  const signOut = async () => {
    setUser({} as User);

    await AsyncStorage.removeItem(userStorageKey);
  };

  const value = useMemo(
    () => ({ user, userStorageLoading, signInWithGoogle, signOut }),
    [user, userStorageLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextData => {
  const context = useContext(AuthContext);

  return context;
};





      