import { useState } from "react";
import { Alert, Keyboard, KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from "react-native";

import { API_URL } from '../utils/config';

function CreateModal() {
  const [logInModalVisible, setLogInModalVisible] = useState(false);
  const [signUpModalVisible, setSignUpModalVisible] = useState(false);

  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [logInIdentifier, setLogInIdentifier] = useState("");
  const [logInPassword, setLogInPassword] = useState("");

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

      console.log("Successfully logged in:", data);
      // reset
      clearInputs();
      setLogInModalVisible(false);
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
      console.log("Successfully signed up:", data);
      clearInputs();
      Alert.alert("Signup successful", "You can now log in.");
      setSignUpModalVisible(false);
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

  return (
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
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  containerStyles: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%"
  },

  textStyle: {
    textAlign: "center",
    fontSize: 20,
    paddingBottom: 10
  },

  buttonTextStyle: {
    color: "white",
    fontSize: 20,
  },

  inputStyle: {
    color: "black",
    borderWidth: 1,
    borderColor: "gray",
    padding: 5,
    height: 60,
    width: "85%",
    fontSize: 20,
    marginVertical: 10,
    borderRadius: 5,
  },

  buttonStyles: {
    backgroundColor: "rebeccapurple",
    width: "80%",
    paddingVertical: 25,   // instead of height
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  cancelButtonStyles: {
    backgroundColor: "darkred",
    width: "80%",
    paddingVertical: 15,   // instead of height
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});