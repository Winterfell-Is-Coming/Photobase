import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground } from 'react-native'
// import Autoshoot from './Autoshoot.js'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { Icon } from 'native-base'
import { Camera, Permissions } from 'expo';
import { createStackNavigator } from 'react-navigation'; 

//insert SERVER URL
const SERVER_URL = 'https://postman-echo.com/post';


class Autoshoot extends React.Component {
  state = {
    photo: null
  }
  takePicture = ()=> {
    this.camera.takePictureAsync({
      quality: 0.1,
      base64: true,
      exif: false
    }).then(photo => {

      this.setState({photo});
    })
  }

  uploadPicture = () => {
    if(this.state.photo){
      let data = new FormData();
      data.append('picture', {
        uri: this.state.photo,
        name: 'myImg.jpg',
        type: 'image/jpg'
      });

      const config = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data;',
          // Authorization: 
        }, 
        body: data
      };
      return fetch(SERVER_URL, {
        body: JSON.stringify({
          image: this.state.photo.base64
        }),
        headers: {
          'content-type': 'application/json'
        },
        method: 'POST'
      })
      .then(response => {console.log('success!'); response.json()})
    }
  }
  render() {
     const {photo} = this.state;

    return (
      <View style={{ flex: 1, width: '100%'}}>
      {photo ? (
        <ImageBackground style={{flex:1}} source={{uri:photo.uri}}/>):
      (
        <Camera 
        style={{flex: 1 }}
          type={Camera.Constants.Type.back}
          ref={cam => this.camera = cam}>
          <View style={{flex: 1, paddingHorizontal: 10, marginBottom: 15}}>
            <View style={{flex: 1}}>
                <MaterialCommunityIcons name="circle-outline" onPress={this.takePicture} style={{ color: 'white',justifyContent: 'flex-end',alignContent: 'flex-end', alignItems: 'flex-end', fontSize : 100 } }></MaterialCommunityIcons>
                {this.uploadPicture()};
              <Icon name="ios-images" style={{ color: 'white', fontSize: 36 }} />
            </View>
          </View>
        </Camera>  
      )} 
      </View>
    );
  }
}

export default class StartCamera extends React.Component {
  //initialize state
  state = {
    cameraPermission: null
  };

  componentDidMount() {
    Permissions.askAsync(Permissions.CAMERA)
      .then(({ status }) =>
        this.setState({
          cameraPermission: status === 'granted'
          // photo: null
        })
      );
  }

  render() {
    const { cameraPermission } = this.state;

    //Render one of 3 things depending on permissions
    return (
      <View style={styles.container}>
        {cameraPermission === null ? (<Text>Waiting for permission...</Text>) : cameraPermission === false}
        {cameraPermission === false ? (<Text>Permission denied</Text>) : (<Autoshoot/>)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
