import { useState } from "react";
import { Keyboard, KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from "react-native";

import { AppDispatch, RootState } from "@/store";
import { loginThunk, logoutThunk, signupThunk } from "@/store/authSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

function CreateModal() {

  const dispatch = useDispatch<AppDispatch>();

  // read auth state from Redux
  const isLoggedIn = useSelector((s: RootState) => s.auth.isLoggedIn);
  const reduxUsername = useSelector((s: RootState) => s.auth.username);
  const isLoading = useSelector((s: RootState) => s.auth.isLoading);

  // local UI state
  const [logInModalVisible, setLogInModalVisible] = useState(false);
  const [signUpModalVisible, setSignUpModalVisible] = useState(false);

  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [logInIdentifier, setLogInIdentifier] = useState("");
  const [logInPassword, setLogInPassword] = useState("");

  const [loginError, setLoginError] = useState<string | null>(null);
  const [signupError, setSignupError] = useState<string | null>(null);

  const handleLogInRequest = async () => {
    try {
      setLoginError(null); // limpio error previo

      // dispatch thunk and unwrap result (will throw if rejected)
      const action = await dispatch(
        loginThunk({ identifier: logInIdentifier, password: logInPassword })
      );
      const payload = unwrapResult(action); // { token, username, user_id }

      // thunk persisted token/username/user_id via authSlice implementation
      clearInputs();
      setLogInModalVisible(false);
    } catch (err: any) {
      // unwrapResult throws the rejectWithValue payload if rejected
      const message = err;
      setLoginError(message); 
    }
  };

  const handleSignUpRequest = async () => {
    try {
      setSignupError(null); // limpio error previo

      const signUpCredentials = {
        emailAddress: email,
        username: username,
        password: password,
      };

      // dispatch thunk and unwrap result (will throw if rejected)
      const action = await dispatch(
        signupThunk(signUpCredentials)
      );

      const payload = unwrapResult(action); // { token, username, user_id }
      // thunk persisted token/username/user_id via authSlice implementation
      clearInputs();
      setSignUpModalVisible(false);
      setSignupError("Cuenta creada exitosamente!")
    } catch (err: any) {
      const message = err;
      setSignupError(message); 
    }
  };

  const handleLogout = async () => {
    // use thunk which clears SecureStore (you implemented logoutThunk)
    await dispatch(logoutThunk());
    // store is updated in extraReducers logoutThunk.fulfilled
  };

  function clearInputs() {
    setLogInIdentifier("");
    setLogInPassword("");

    setUserName("");
    setEmail("");
    setPassword("");
  }

  return (
    <View style={styles.containerStyles}>
      {isLoggedIn ? (
        <View style={styles.containerStyles}>
          <Text style={styles.textStyle}>Hola { reduxUsername }!</Text>

          <Pressable style={styles.cancelButtonStyles} onPress={handleLogout}>
            <Text style={styles.buttonTextStyle}>Log out</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.containerStyles}>

          {signupError && (
            <Text style={styles.successText}>
              {signupError}
            </Text>
          )}

          <Text style={styles.textStyle} >Por favor ingresá a tu cuenta</Text>

          <Pressable style={styles.buttonStyles} onPress={() => setLogInModalVisible(true)}>
            <Text style={styles.buttonTextStyle}>Log in</Text>
          </Pressable>
          <Pressable style={styles.buttonStyles} onPress={() => setSignUpModalVisible(true)}>
            <Text style={styles.buttonTextStyle}>Sign up</Text>
          </Pressable>

          <Modal visible={logInModalVisible} animationType="slide">
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={{ flex: 1 }}
            >
              <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View style={styles.containerStyles}>
                    {loginError && (
                      <Text style={styles.errorText}>
                        {loginError}
                      </Text>
                    )}

                    <TextInput
                      placeholder="Ingresá tu email o nombre de usuario..."
                      value={logInIdentifier}
                      onChangeText={setLogInIdentifier}
                      autoCorrect={false}         
                      spellCheck={false} 
                      style={styles.inputStyle}
                      placeholderTextColor="white"
                    />
                    <TextInput
                      placeholder="Ingresá tu contraseña..."
                      value={logInPassword}
                      onChangeText={setLogInPassword}
                      autoCorrect={false}         
                      spellCheck={false} 
                      secureTextEntry={true}
                      style={styles.inputStyle}
                      placeholderTextColor="white"
                    />

                    <Pressable style={styles.buttonStyles} onPress={handleLogInRequest}>
                      <Text style={styles.buttonTextStyle}>Log In</Text>
                    </Pressable>

                    <Pressable style={styles.cancelButtonStyles} onPress={() => {setLogInModalVisible(false); clearInputs()}}>
                      <Text style={styles.buttonTextStyle}>Cancelar</Text>
                    </Pressable>
                </View>
              </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
          </Modal>

          <Modal visible={signUpModalVisible} animationType="slide">
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={{ flex: 1 }}
            >
              <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View style={styles.containerStyles}>
                    {signupError && (
                      <Text style={styles.errorText}>
                        {signupError}
                      </Text>
                    )}

                    <TextInput
                      placeholder="Ingresa tu email..."
                      value={email}
                      onChangeText={setEmail}
                      autoCorrect={false}         
                      spellCheck={false} 
                      style={styles.inputStyle}
                      placeholderTextColor="white"
                    />
                    <TextInput
                      placeholder="Ingresá tu nombre de usuario..."
                      value={username}
                      onChangeText={setUserName}
                      autoCorrect={false}         
                      spellCheck={false} 
                      style={styles.inputStyle}
                      placeholderTextColor="white"
                    />
                    <TextInput
                      placeholder="Ingresá tu contraseña..."
                      value={password}
                      onChangeText={setPassword}
                      autoCorrect={false}         
                      spellCheck={false}
                      secureTextEntry={true}
                      style={styles.inputStyle}
                      placeholderTextColor="white"
                    />

                    <Pressable style={styles.buttonStyles} onPress={handleSignUpRequest}>
                      <Text style={styles.buttonTextStyle}>Sign up</Text>
                    </Pressable>

                    <Pressable style={styles.cancelButtonStyles} onPress={() => {setSignUpModalVisible(false); clearInputs()}}>
                      <Text style={styles.buttonTextStyle}>Cancelar</Text>
                    </Pressable>
                </View>
              </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
          </Modal>
        </View>
      )}
    </View>
  );
}

export default function Home() {
  return (
    <View style={styles.container}>
      <CreateModal/>
    </View> 
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C0526", // fondo violeta oscuro
    alignItems: "center",
    justifyContent: "center",
  },

  containerStyles: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#0D3973", // azul profundo, para modales
  },

  textStyle: {
    textAlign: "center",
    fontSize: 22,
    paddingBottom: 12,
    color: "#1EA4D9", // acento celeste brillante
    fontWeight: "600",
  },

  buttonTextStyle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },

  inputStyle: {
    color: "#fff",
    borderWidth: 1,
    borderColor: "#1EA4D9", // borde celeste claro
    backgroundColor: "#116EBF", // fondo de input azul fuerte
    paddingHorizontal: 12,
    height: 55,
    width: "85%",
    fontSize: 18,
    marginVertical: 10,
    borderRadius: 8,
  },

  buttonStyles: {
    backgroundColor: "#1EA4D9", // botón principal (celeste brillante)
    width: "80%",
    paddingVertical: 18,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    shadowColor: "#0D3973",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },

  cancelButtonStyles: {
    backgroundColor: "#116EBF", // azul medio
    width: "80%",
    paddingVertical: 14,
    marginTop: 12,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },

  errorText: {
    color: "#ffb4b4",
    backgroundColor: "rgba(255,0,0,0.15)",
    borderColor: "#ff6b6b",
    borderWidth: 1,
    padding: 10,
    borderRadius: 6,
    width: "85%",
    textAlign: "center",
    marginBottom: 10,
  },

  successText: {
    color: "#b7ffb4ff",
    backgroundColor: "rgba(0, 121, 6, 0.38)",
    borderColor: "#6bff6bff",
    borderWidth: 1,
    padding: 10,
    borderRadius: 6,
    width: "85%",
    textAlign: "center",
    marginBottom: 10,
  },

});