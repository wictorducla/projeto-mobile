import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

const CreateProduct = ({ navigation, route }) => {
  const getDetails = (type) => {
    if (route.params) {
      switch (type) {
        case 'name':
          return route.params.name;
        case 'weight':
          return route.params.weight;
        case 'type':
          return route.params.type;
        case 'price':
          return route.params.price;
        case 'fuction':
          return route.params.fuction;
        case 'benefits':
          return route.params.benefits;
      }
    }
    return '';
  };

  const [name, setName] = useState(getDetails('name'));
  const [weight, setWeight] = useState(getDetails('weight'));
  const [type, setType] = useState(getDetails('type'));
  const [price, setPrice] = useState(getDetails('price'));
  const [fuction, setFuction] = useState(getDetails('fuction'));
  const [benefits, setBenefits] = useState(getDetails('benefits'));
  const [modal, setModal] = useState(false);
  const [enableshift, setenableShift] = useState(false);

  const submitData = () => {
    fetch('http://10.0.0.19:3000/send-data', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        type,
        weight,
        price,
        fuction,
        benefits,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        Alert.alert(`${data.name} foi cadastrado com sucesso!`);
        navigation.navigate('Home');
      })
      .catch((err) => {
        Alert.alert('alguma coisas deu errado' + err);
      });
  };

  const updateDetails = () => {
    fetch('http://10.0.0.19:3000/update', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: route.params._id,
        name,
        type,
        weight,
        price,
        fuction,
        benefits,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        Alert.alert(`${data.name} foi editado com sucesso!`);
        navigation.navigate('Home');
      })
      .catch((err) => {
        Alert.alert('alguma coisa deu errado');
      });
  };

  const pickFromGallery = async () => {
    const { granted } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (granted) {
      let data = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });
      if (!data.cancelled) {
        let newfile = {
          uri: data.uri,
          type: `test/${data.uri.split('.')[1]}`,
          name: `test.${data.uri.split('.')[1]}`,
        };
        handleUpload(newfile);
      }
    } else {
      Alert.alert('você precisa de permissão para isso');
    }
  };
  const pickFromCamera = async () => {
    const { granted } = await Permissions.askAsync(Permissions.CAMERA);
    if (granted) {
      let data = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });
      if (!data.cancelled) {
        let newfile = {
          uri: data.uri,
          type: `test/${data.uri.split('.')[1]}`,
          name: `test.${data.uri.split('.')[1]}`,
        };
        handleUpload(newfile);
      }
    } else {
      Alert.alert('você precisa de permissão para isso');
    }
  };

  const handleUpload = (image) => {
    const data = new FormData();
    data.append('file', image);
    data.append('upload_preset', 'productApp');
    data.append('cloud_name', 'dxnoiuj66');

    fetch('https://api.cloudinary.com/v1_1/dxnoiuj66/image/upload', {
      method: 'post',
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setPicture(data.url);
        setModal(false);
      })
      .catch((err) => {
        Alert.alert('erro durante o upload');
      });
  };

  return (
    <KeyboardAvoidingView
      behavior="benefits"
      style={styles.root}
      enabled={enableshift}
    >
      <View>
        <TextInput
          label="Nome"
          style={styles.inputStyle}
          value={name}
          onFocus={() => setenableShift(false)}
          theme={theme}
          mode="outlined"
          onChangeText={(text) => setName(text)}
        />
        <TextInput
          label="Tipo"
          style={styles.inputStyle}
          value={type}
          theme={theme}
          onFocus={() => setenableShift(false)}
          mode="outlined"
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          label="Peso"
          style={styles.inputStyle}
          value={weight}
          theme={theme}
          onFocus={() => setenableShift(false)}
          keyboardType="number-pad"
          mode="outlined"
          onChangeText={(text) => setPhone(text)}
        />

        <TextInput
          label="Preço"
          style={styles.inputStyle}
          value={price}
          theme={theme}
          onFocus={() => setenableShift(true)}
          mode="outlined"
          onChangeText={(text) => setSalary(text)}
        />
        <TextInput
          label="Beneficios"
          style={styles.inputStyle}
          value={benefits}
          theme={theme}
          onFocus={() => setenableShift(true)}
          mode="outlined"
          onChangeText={(text) => setPosition(text)}
        />
        <Button
          style={styles.inputStyle}
          icon={fuction == '' ? 'upload' : 'check'}
          mode="contained"
          theme={theme}
          onPress={() => setModal(true)}
        >
          Upload de Imagem
        </Button>
        {route.params ? (
          <Button
            style={styles.inputStyle}
            icon="content-save"
            mode="contained"
            theme={theme}
            onPress={() => updateDetails()}
          >
            Atualizar Detalhes
          </Button>
        ) : (
          <Button
            style={styles.inputStyle}
            icon="content-save"
            mode="contained"
            theme={theme}
            onPress={() => submitData()}
          >
            Salvar
          </Button>
        )}

        <Modal
          animationType="slide"
          transparent={true}
          visible={modal}
          onRequestClose={() => {
            setModal(false);
          }}
        >
          <View style={styles.modalView}>
            <View style={styles.modalButtonView}>
              <Button
                icon="camera"
                theme={theme}
                mode="contained"
                onPress={() => pickFromCamera()}
              >
                Câmera
              </Button>
              <Button
                icon="image-area"
                mode="contained"
                theme={theme}
                onPress={() => pickFromGallery()}
              >
                Galeria
              </Button>
            </View>
            <Button theme={theme} onPress={() => setModal(false)}>
              Cancelar
            </Button>
          </View>
        </Modal>
      </View>
    </KeyboardAvoidingView>
  );
};

const theme = {
  colors: {
    primary: '#006aff',
  },
};
const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  inputStyle: {
    margin: 5,
  },
  modalView: {
    benefits: 'absolute',
    bottom: 2,
    width: '100%',
    backgroundColor: 'white',
  },
  modalButtonView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});

export default CreateProduct;
