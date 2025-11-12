import { useEffect, useState } from "react";
import { Alert, Keyboard, KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from "react-native";

import { clearCredentials, getToken, getUsername, saveToken, saveUserID, saveUsername } from "@/utils/authStorage";
import { API_URL } from '../utils/config';

function CreateModal() {

  const [loggedInUsername, setLoggedInUsername] = useState<string | null>(null);

  const [logInModalVisible, setLogInModalVisible] = useState(false);
  const [signUpModalVisible, setSignUpModalVisible] = useState(false);

  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [logInIdentifier, setLogInIdentifier] = useState("");
  const [logInPassword, setLogInPassword] = useState("");

  const [areWeLoggedIn, setAreWeLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const token = await getToken();
      setAreWeLoggedIn(!!token); // true if token exists
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (areWeLoggedIn) {
        const savedUsername = await getUsername();
        setLoggedInUsername(savedUsername);
      }
    })();
  }, [areWeLoggedIn]);

  const handleLogInRequest = async () => {
    try {
      const logInCredentials = {
        identifier: logInIdentifier,
        password: logInPassword,
      };

      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(logInCredentials),
      });

      const data = await response.json();


      if (!response.ok) {
        // The server returned an error status (400, 404, 500, etc.)
        console.error("Log in error:", data.error || "Unknown error");
        Alert.alert("Signup failed", data.error || "Unknown error");
        return; // stop execution
      }

      // success

      // store token
      await saveToken(data.accessToken);
      await saveUsername(data.user.username)
      await saveUserID(data.user.id);

      setAreWeLoggedIn(true); 

      // reset
      clearInputs();
      setLogInModalVisible(false);

      console.log("Successfully logged in:", data);
      Alert.alert("Log in successful", "You can now upload QRs.");
    } catch (error) {
      console.error("Network or unexpected error:", error);
      Alert.alert("Log in failed", "Network or unexpected error");
    }
  };

  const handleSignUpRequest = async () => {
    try {
      const signUpCredentials = {
        emailAddress: email,
        username: username,
        password: password,
      };

      const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signUpCredentials),
      });

      const data = await response.json();
      
      if (!response.ok) {
        // The server returned an error status (400, 404, 500, etc.)
        console.error("Signup error:", data.error || "Unknown error");
        Alert.alert("Signup failed", data.error || "Unknown error");
        return; // stop execution
      }

      // Success
      
      // store token
      await saveToken(data.accessToken);
      await saveUsername(data.user.username)
      await saveUserID(data.user.id);

      setAreWeLoggedIn(true); 
      
      clearInputs();
      setSignUpModalVisible(false);

      console.log("Successfully signed up, and logged in:", data);
      Alert.alert("Signup successful");
    } catch (error) {
      console.error("Network or unexpected error:", error);
      Alert.alert("Signup failed", "Network or unexpected error");
    }
  };

  function clearInputs() {
    setLogInIdentifier("");
    setLogInPassword("");

    setUserName("");
    setEmail("");
    setPassword("");
  }

  async function logOut() {
    await clearCredentials();
    setAreWeLoggedIn(false); 
  }

  if (areWeLoggedIn === null) {
    // Still checking storage
    return null; // or a loading spinner maybe(?
  }

  return areWeLoggedIn ? (
    <View style={styles.containerStyles}>
      <Text style={styles.textStyle}>Hi { loggedInUsername }</Text>

      <Pressable style={styles.cancelButtonStyles} onPress={() => logOut()}>
        <Text style={styles.buttonTextStyle}>Log out</Text>
      </Pressable>
    </View>
   ) : (
    <View style={styles.containerStyles}>
      <Text style={styles.textStyle} >Please log into your account</Text>

      <Pressable style={styles.buttonStyles} onPress={() => setLogInModalVisible(true)}>
        <Text style={styles.buttonTextStyle}>Log in</Text>
      </Pressable>
      <Pressable style={styles.buttonStyles} onPress={() => setSignUpModalVisible(true)}>
        <Text style={styles.buttonTextStyle}>Sign up</Text>
      </Pressable>

      <Modal visible={logInModalVisible}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.containerStyles}>
                <TextInput
                  placeholder="Enter your email or username..."
                  value={logInIdentifier}
                  onChangeText={setLogInIdentifier}
                  autoCorrect={false}         
                  spellCheck={false} 
                  style={styles.inputStyle}
                  placeholderTextColor="grey"
                />
                <TextInput
                  placeholder="Enter your password..."
                  value={logInPassword}
                  onChangeText={setLogInPassword}
                  autoCorrect={false}         
                  spellCheck={false} 
                  secureTextEntry={true}
                  style={styles.inputStyle}
                  placeholderTextColor="grey"
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

      <Modal visible={signUpModalVisible}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.containerStyles}>
                <TextInput
                  placeholder="Enter your email..."
                  value={email}
                  onChangeText={setEmail}
                  autoCorrect={false}         
                  spellCheck={false} 
                  style={styles.inputStyle}
                  placeholderTextColor="grey"
                />
                <TextInput
                  placeholder="Enter your username..."
                  value={username}
                  onChangeText={setUserName}
                  autoCorrect={false}         
                  spellCheck={false} 
                  style={styles.inputStyle}
                  placeholderTextColor="grey"
                />
                <TextInput
                  placeholder="Enter your password..."
                  value={password}
                  onChangeText={setPassword}
                  autoCorrect={false}         
                  spellCheck={false}
                  secureTextEntry={true}
                  style={styles.inputStyle}
                  placeholderTextColor="grey"
                />

                <Pressable style={styles.buttonStyles} onPress={handleSignUpRequest}>
                  <Text style={styles.buttonTextStyle}>Sign Up</Text>
                </Pressable>

                <Pressable style={styles.cancelButtonStyles} onPress={() => {setSignUpModalVisible(false); clearInputs()}}>
                  <Text style={styles.buttonTextStyle}>Cancelar</Text>
                </Pressable>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>
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
});