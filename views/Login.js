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
import AsyncStorage from "@react-native-community/async-storage";

import {gql, useMutation} from "@apollo/client";

const AUTENTICAR_USUARIO = gql`
mutation autenticarUsuario($input: AutenticarInput){
    autenticarUsuario(input: $input){
      token
    }
  }
  `

const Login = () => {
  const [email, guardarEmail] = useState('');
  const [password, guardarPassword] = useState('');
  const [mensaje, guardarMensaje] = useState(null);

  const navigation = useNavigation();

  const [ autenticarUsuario ] = useMutation(AUTENTICAR_USUARIO);

  const handleSubmit = async () => {
    if ( email === '' || password === '') {
        guardarMensaje('Todos los campos son obligatorios');
        return;
      }
      if (password.length < 6) {
        guardarMensaje('El password tiene que tener 6 carácteres como mínimo');
      }

      try {
        const {data} = await autenticarUsuario({
            variables: {
              input: {
                email,
                password,
              },
            },
          });
         
       const { token } = data.autenticarUsuario;
      
       await AsyncStorage.setItem("token", token);

       navigation.navigate("Proyectos");
     
      } catch(err){
         guardarMensaje(err.message.replace("GraphQL error: ", ""));
      }
  }

  
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
              <Input autoCompleteType="email" placeholder="Email" onChangeText={texto => guardarEmail(texto)} />
            </Item>
            <Item inlineLabel last style={globalStyles.input}>
              <Input placeholder="Password" secureTextEntry={true} onChangeText={texto => guardarPassword(texto)} />
            </Item>
          </Form>

          <Button square block style={globalStyles.boton} onPress={handleSubmit}>
            <Text style={globalStyles.botonTexto}>Iniciar Sesión</Text>
          </Button>

          <Text
            onPress={() => navigation.navigate('CrearCuenta')}
            style={globalStyles.enlace}>
            Crear Cuenta
          </Text>

          {mensaje && mostrarAlerta()}
        </View>
      </Container>


    </>
  );
};

export default Login;
