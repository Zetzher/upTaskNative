import React, {useState} from 'react';
import {View} from 'react-native';
import {
  Container,
  Button,
  Text,
  H1,
  Input,
  Form,
  Item,
  Toast,
} from 'native-base';
import {useNavigation} from '@react-navigation/native';
import globalStyles from '../styles/global';

import {gql, useMutation} from '@apollo/client';

const NUEVA_CUENTA = gql`
  mutation crearUsuario($input: UsuarioInput) {
    crearUsuario(input: $input)
  }
`;

const CrearCuenta = () => {
  const [nombre, guardarNombre] = useState('');
  const [email, guardarEmail] = useState('');
  const [password, guardarPassword] = useState('');

  const [mensaje, guardarMensaje] = useState(null);

  const navigation = useNavigation();

  const [crearUsuario] = useMutation(NUEVA_CUENTA);

  const handleSubmit = async () => {
    if (nombre === '' || email === '' || password === '') {
      guardarMensaje('Todos los campos son obligatorios');
      return;
    }

    if (password.length < 6) {
      guardarMensaje('El password tiene que tener 6 carácteres como mínimo');
    }

    try {
      const {data} = await crearUsuario({
        variables: {
          input: {
            nombre,
            email,
            password,
          },
        },
      });

      guardarMensaje(data.crearUsuario);
      navigation.navigate('Login');
    } catch (err) {
      guardarMensaje(err.message.replace("GraphQL error:", ""));
    }
  };

  const mostrarAlerta = () => {
    Toast.show({text: mensaje, buttonText: 'OK', duration: 5000});
  };

  return (
    <>
      <Container
        style={[globalStyles.contenedor, {backgroundColor: '#e84347'}]}>
        <View style={globalStyles.contenido}>
          <H1 style={globalStyles.titulo}>UpTask</H1>
          <Form>
            <Item inlineLabel last style={globalStyles.input}>
              <Input
                autoCompleteType="email"
                placeholder="Nombre"
                onChangeText={texto => guardarNombre(texto)}
              />
            </Item>

            <Item inlineLabel last style={globalStyles.input}>
              <Input
                autoCompleteType="email"
                placeholder="Email"
                onChangeText={texto => guardarEmail(texto)}
              />
            </Item>
            <Item inlineLabel last style={globalStyles.input}>
              <Input
                placeholder="Password"
                secureTextEntry={true}
                onChangeText={texto => guardarPassword(texto)}
              />
            </Item>
          </Form>

          <Button
            square
            block
            style={globalStyles.boton}
            onPress={() => handleSubmit()}>
            <Text style={globalStyles.botonTexto}>Crear Cuenta</Text>
          </Button>

          {mensaje && mostrarAlerta()}
        </View>
      </Container>
    </>
  );
};

export default CrearCuenta;
