import React, { useContext } from "react";
import { RFValue } from "react-native-responsive-fontsize";

import AppleSvg from '../../assets/apple.svg';
import GoogleSvg from '../../assets/google.svg';
import LogoSvg from '../../assets/logo.svg';

import  { useAuth } from '../../Hooks/auth'

import { SignInSocialButton } from '../../components/SignInSocialButton';

import { 
  Container,
  Header,
  TitleWrapper,
  Title,
  SignInTitle,
  Footer,
  FooterWrapper
} from "./styles";

export function SignIn(){
  const { user } = useAuth();
  console.log(user.name)

  return(
    <Container>
      <Header>
        <TitleWrapper>
          <LogoSvg 
            width={RFValue(120)}
            height={RFValue(68)}
          />

          <Title>
            Controle suas {'\n'}
            finanças de forma {'\n'}
            muito simples
          </Title>
        </TitleWrapper>

        <SignInTitle>
          faça seu login com {'\n'}
          uma das contas abaixo
        </SignInTitle>

      </Header>

      <Footer>
        <FooterWrapper>
          <SignInSocialButton 
            title="Entrar com Google"
            svg={GoogleSvg}
            activeOpacity={0.85}
          />

          <SignInSocialButton 
            title="Entrar com Apple"
            svg={AppleSvg}
            activeOpacity={0.85}
          />
        </FooterWrapper>
      </Footer>
    </Container>
  );
}