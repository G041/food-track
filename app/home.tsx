import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { API_URL } from "../utils/config";

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
      const logInCredentials = { identifier: logInIdentifier, password: logInPassword };
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(logInCredentials),
      });
      const data = await response.json();
      console.log("Successfully logged in:", data);
      clearInputs();
    } catch (error) {
      console.error("Error when trying to log in:", error);
    }
  };

  const handleSignUpRequest = async () => {
    try {
      const signUpCredentials = { emailAddress: email, username, password };
      const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signUpCredentials),
      });
      const data = await response.json();
      console.log("Successfully signed up:", data);
      clearInputs();
    } catch (error) {
      console.error("Error when trying to sign up:", error);
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
      <Text style={styles.titleText}>Bienvenido 👋</Text>
      <Text style={styles.subtitleText}>Iniciá sesión o creá una cuenta</Text>

      <Pressable style={styles.mainButton} onPress={() => setLogInModalVisible(true)}>
        <Text style={styles.buttonText}>Iniciar sesión</Text>
      </Pressable>

      <Pressable style={[styles.mainButton, styles.secondaryButton]} onPress={() => setSignUpModalVisible(true)}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </Pressable>

      {/* Login Modal */}
      <Modal visible={logInModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Iniciar sesión</Text>

          <TextInput
            placeholder="Email o nombre de usuario"
            value={logInIdentifier}
            onChangeText={setLogInIdentifier}
            style={styles.input}
            placeholderTextColor="#ddd"
          />
          <TextInput
            placeholder="Contraseña"
            value={logInPassword}
            onChangeText={setLogInPassword}
            secureTextEntry
            style={styles.input}
            placeholderTextColor="#ddd"
          />

          <Pressable style={styles.mainButton} onPress={handleLogInRequest}>
            <Text style={styles.buttonText}>Entrar</Text>
          </Pressable>

          <Pressable style={styles.cancelButton} onPress={() => { setLogInModalVisible(false); clearInputs(); }}>
            <Text style={styles.buttonText}>Cancelar</Text>
          </Pressable>
        </View>
      </Modal>

      {/* Sign Up Modal */}
      <Modal visible={signUpModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Crear cuenta</Text>

          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            placeholderTextColor="#ddd"
          />
          <TextInput
            placeholder="Nombre de usuario"
            value={username}
            onChangeText={setUserName}
            style={styles.input}
            placeholderTextColor="#ddd"
          />
          <TextInput
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            placeholderTextColor="#ddd"
          />

          <Pressable style={styles.mainButton} onPress={handleSignUpRequest}>
            <Text style={styles.buttonText}>Registrarme</Text>
          </Pressable>

          <Pressable style={styles.cancelButton} onPress={() => { setSignUpModalVisible(false); clearInputs(); }}>
            <Text style={styles.buttonText}>Cancelar</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}

export default function Home() {
  return (
    <View style={styles.container}>
      <CreateModal />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#400101",
    alignItems: "center",
    justifyContent: "center",
  },

  containerStyles: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#400101",
    width: "100%",
    padding: 24,
  },

  titleText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#F2A413",
    marginBottom: 4,
  },

  subtitleText: {
    fontSize: 16,
    color: "#F28E13",
    marginBottom: 24,
  },

  mainButton: {
    backgroundColor: "#D9601A",
    width: "80%",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginVertical: 8,
    elevation: 3,
  },

  secondaryButton: {
    backgroundColor: "#730202",
  },

  cancelButton: {
    backgroundColor: "#730202",
    width: "80%",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
  },

  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },

  input: {
    backgroundColor: "#400101",
    borderWidth: 1,
    borderColor: "#F28E13",
    borderRadius: 10,
    width: "85%",
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    color: "white",
    marginVertical: 8,
  },

  modalContainer: {
    flex: 1,
    backgroundColor: "#400101",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  modalTitle: {
    color: "#F2A413",
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 16,
  },
});
