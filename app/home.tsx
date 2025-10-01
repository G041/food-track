import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

function CreateModal() {
  const [modalVisible, setModalVisible] = useState(false);
  const [user, setUserName] = useState({ name: "Jorge Perez" });
  const [input, setInputText] = useState("");

  function updateUserName(newName : string){
    setUserName({ name: newName })
  };

  function saveNewName(){
    setModalVisible(false);
    updateUserName(input);
    setInputText("");
  }

  return (
    <View style={styles.containerStyles}>
      <Text style={styles.textStyle} >{user.name}</Text>

      <Pressable style={styles.buttonStyles} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonTextStyle}>Cambiar Nombre</Text>
      </Pressable>

      <Modal visible={modalVisible}>
        <View style={styles.containerStyles}>
            <Text style={styles.textStyle}>Elije un nuevo nombre:</Text>
            <TextInput style={styles.inputStyle} onChangeText={setInputText} onSubmitEditing={saveNewName} placeholder="Ingrese nuevo nombre"/>
            
            <Pressable style={styles.buttonStyles} onPress={() => saveNewName()}>
              <Text style={styles.buttonTextStyle}>Guardar</Text>
            </Pressable>

            <Pressable style={styles.cancelButtonStyles} onPress={() => {setModalVisible(false); setInputText("")}}>
              <Text style={styles.buttonTextStyle}>Cancelar</Text>
            </Pressable>
        </View>
      </Modal>
    </View>
  );
}

export default function Home() {
  return (
    <View style={styles.overallContainerStyles}>
      <CreateModal/>
    </View> 
  );
}

const styles = StyleSheet.create({
  
  overallContainerStyles: {
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
  },

  containerStyles: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%"
  },

  textStyle: {
    textAlign: "center",
    fontSize: 32,
    paddingBottom: 10
  },

  buttonTextStyle: {
    color: "white",
    fontSize: 20,
  },

  inputStyle: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    width: "80%",
    height: "15%",
    fontSize: 20,
    marginVertical: 10,
    borderRadius: 5,
  },

  buttonStyles: {
    backgroundColor: "rebeccapurple",
    width: "80%",
    height: "15%",
    marginTop: 10,
    justifyContent: "center", 
    alignItems: "center",
  },

  cancelButtonStyles: {
    backgroundColor: "darkred",
    width: "80%",
    height: "15%",
    marginTop: 10,
    justifyContent: "center", 
    alignItems: "center",
  },
});