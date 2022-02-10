import React from 'react';
import { StatusBar } from 'react-native'
import AppLoading from 'expo-app-loading';
import 'intl'
import 'intl/locale-data/jsonp/pt-BR'
import { ThemeProvider } from 'styled-components';

import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold
} from '@expo-google-fonts/poppins';

import theme from './src/global/styles/theme';

import { SignIn } from './src/screens/SignIn';

import { AuthProvider } from './src/Hooks/auth';

import { NavigationContainer } from '@react-navigation/native';
import { AppRoutes } from './src/routes/app.routes'

export default function App() {
  
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold
  })
  if (!fontsLoaded) {
    return <AppLoading />
  }

  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer>
        <StatusBar 
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />

        <AuthProvider>
          <SignIn /> 
        </AuthProvider>

      </NavigationContainer>
    </ThemeProvider>
  )
}
