import { useState } from "react";
import { Modal, Pressable, Text, TextInput, TextStyle, View, ViewStyle } from "react-native";

function CreateModal() {
  const containerStyles: ViewStyle = {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%"
  }

  const textStyle : TextStyle = {
    textAlign: "center",
    fontSize: 32,
    paddingBottom: 10
  }

  const buttonTextStyle : TextStyle = {
    color: "white",
    fontSize: 20,
  }

  const inputStyle : TextStyle = {
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    width: "80%",
    height: "15%",
    fontSize: 20,
    marginVertical: 10,
    borderRadius: 5,
  }

  const buttonStyles : ViewStyle = {
    backgroundColor: "rebeccapurple",
    width: "80%",
    height: "15%",
    marginTop: 10,
    justifyContent: "center", 
    alignItems: "center",
  }

  const cancelButtonStyles : ViewStyle = {
    backgroundColor: "darkred",
    width: "80%",
    height: "15%",
    marginTop: 10,
    justifyContent: "center", 
    alignItems: "center",
  }
  
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
    <View style={containerStyles}>
      <Text style={textStyle} >{user.name}</Text>

      <Pressable style={buttonStyles} onPress={() => setModalVisible(true)}>
        <Text style={buttonTextStyle}>Cambiar Nombre</Text>
      </Pressable>

      <Modal visible={modalVisible}>
        <View style={containerStyles}>
            <Text style={textStyle}>Elije un nuevo nombre:</Text>
            <TextInput style={inputStyle} onChangeText={setInputText} onSubmitEditing={saveNewName} placeholder="Ingrese nuevo nombre"/>
            
            <Pressable style={buttonStyles} onPress={() => saveNewName()}>
              <Text style={buttonTextStyle}>Guardar</Text>
            </Pressable>

            <Pressable style={cancelButtonStyles} onPress={() => {setModalVisible(false); setInputText("")}}>
              <Text style={buttonTextStyle}>Cancelar</Text>
            </Pressable>
        </View>
      </Modal>
    </View>
  );
}

export default function Home() {
  const containerStyles: ViewStyle = {
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
  }

  return (
    <View style={containerStyles}>
      <CreateModal/>
    </View> 
  );
}