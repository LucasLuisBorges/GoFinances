import React from "react";

import { 
  Area,
  UserWrapper,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  Icon,
 } from "./styles";

 interface NameProps {
   name: string;
 };

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
          <Icon name="power" />
        </UserWrapper>
      </Area>
  )
}