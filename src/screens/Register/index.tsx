import React, { useState } from "react";
import { 
  Modal, 
  TouchableWithoutFeedback, 
  Keyboard,
  Alert
} from "react-native";
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup'
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from  'react-native-uuid'
import { useNavigation } from '@react-navigation/native'

import { useForm } from "react-hook-form";

import { InputForm } from "../../components/Form/InputForm";
import { Button } from "../../components/Form/Button";
import { TransitionTypeButton } from "../../components/Form/TransactionTypeButton";
import { CategorySelectButton } from "../../components/Form/CategorySelectButton";

import { CategorySelect } from '../CategorySelect'

import { 
  Container, 
  Header, 
  Title,
  Form,
  Fields,
  TransitionType
} from './styles'
import { useAuth } from "../../Hooks/auth";

interface FormData {
  name: string;
  amount: string;
}

const schema = Yup.object().shape({
  name: Yup
    .string()
    .required('Nome é obrigatório'),
  amount: Yup
    .number()
    .typeError('Informe um valor númerico')
    .positive('O valor não pode ser negativo')
    .required('O valor é obrigatório')
})

export function Register() {
  const [transactionType, setTransactionType] = useState('');
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  
  const { user } = useAuth()

  const [category, setCategory] = useState({
    key: 'category',
    name: 'Categoria',
  });

  type NavigationProps = {
    navigate:(screen:string) => void;
 }

 const navigation = useNavigation<NavigationProps>()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });

  function handleTransitionTypeButtonSelect(type: 'positive' | 'negative') {
    setTransactionType(type);
  }

  function handleCloseSelectCategoryModal() {
    setCategoryModalOpen(false);
  }

  function handleOpenSelectCategoryModal() {
    setCategoryModalOpen(true);
  }

  async function handleRegister(form: FormData) {
    if(!transactionType){
      return Alert.alert('Selecione o tipo da transação')
    }

    if(category.key === 'category') {
      return Alert.alert('Selecione uma Categoria')
    }



    const newTransaction = {
      id: String(uuid.v4()),
      name: form.name,
      amount: form.amount,
      type: transactionType,
      category: category.key,
      date: new Date()
    }
    
    try {
      const dataKey = `@gofinances:transactions_user:${user.id}`

      const data = await AsyncStorage.getItem(dataKey);
      const currentData = data ? JSON.parse(data) : [];

      const dataFormatted = [
        ...currentData,
        newTransaction
      ]

      await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted));

      reset();
      setTransactionType('');
      setCategory({
        key: 'category',
        name: 'Category'
      });

      navigation.navigate('Listagem')

    } catch (error) {
      console.log(error)
      Alert.alert('Não foi possível salvar')
    }

  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <Header>
          <Title>Cadastro</Title>
        </Header>

        <Form>
          <Fields>
            <InputForm
              name="name"
              control={control}
              placeholder="Nome"
              autoCapitalize="sentences"
              autoCorrect={false}
              error={errors.name && errors.name.message}
            />
            <InputForm
              name="amount"
              control={control}
              placeholder="Preço"
              keyboardType="numeric"
              error={errors.amount && errors.amount.message}
            />

            <TransitionType>

              <TransitionTypeButton 
                type="up" 
                title="Income"
                onPress={() => handleTransitionTypeButtonSelect('positive')}
                isActive={transactionType === 'positive'}
              />
              <TransitionTypeButton 
                type="down" 
                title="Outcome"
                onPress={() => handleTransitionTypeButtonSelect('negative')}
                isActive={transactionType === 'negative'}
              />

            </TransitionType>

            <CategorySelectButton 
              title={category.name}
              onPress={handleOpenSelectCategoryModal}
            />

          </Fields>

          <Button 
            title="Enviar"
            onPress={handleSubmit(handleRegister)}
          />
        </Form>

        <Modal visible={categoryModalOpen}>
          <CategorySelect
            category={category}
            setCategory={setCategory}
            closeSelectCategory={handleCloseSelectCategoryModal}
          />
        </Modal>

      </Container>
    </TouchableWithoutFeedback>
  )
}