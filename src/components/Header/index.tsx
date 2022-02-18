import React from "react";
import { useAuth } from "../../Hooks/auth";

import { 
  Area,
  UserWrapper,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  Icon,
  LogoutButton
 } from "./styles";

 interface NameProps {
   name: string;
 };

 const { signOut } = useAuth()

export function Header( { name } : NameProps) {
  return (
    <Area>
        <UserWrapper>
          <UserInfo>
            <Photo source={{ uri: 'https://avatars.githubusercontent.com/u/70298807?v=4' }}/>
            <User>
              <UserGreeting>Olá, </UserGreeting>
              <UserName>{ name }</UserName>
            </User>
          </UserInfo>

          <LogoutButton onPress={signOut} >
            <Icon name="power" />
          </LogoutButton>
        </UserWrapper>
      </Area>
  )
}