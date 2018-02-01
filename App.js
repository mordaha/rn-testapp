/**
 * Sample React Native App With Auth0 and Maps
 */

import React, { Component } from 'react'
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  AsyncStorage,
  TextInput,
} from 'react-native'

import Auth0 from 'react-native-auth0'

import MapView from 'react-native-maps'

const auth0 = new Auth0({
  domain: 'mordaha-test.auth0.com',
  clientId: '', // ask me! :)
})

const TOKEN_KEY = 'AUTH/ACCESS_TOKEN'

export default class App extends Component<{}> {
  state = {
    isAuthenticated: false,
    credentials: null,
    text: '',
  }

  componentDidMount() {
    this.checkToken()
  }

  checkToken = async () => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY)
      console.log('token', token)
      if (token) {
        this.setState({ accessToken: token, isAuthenticated: true })
      }
    } catch (ex) {
      // pass
    }
  }

  doAuth = () => {
    auth0.webAuth
      .authorize({
        scope: 'openid profile email',
        audience: 'https://mordaha-test.auth0.com/userinfo',
      })
      .then(credentials => {
        console.log(credentials)
        this.setState({
          isAuthenticated: true,
          accessToken: credentials.accessToken,
        })

        // save token
        AsyncStorage.setItem(TOKEN_KEY, credentials.accessToken)
      })
      .catch(
        error => console.log(error) || Alert.alert(error.error_description),
      )
  }

  render() {
    const { isAuthenticated, accessToken, text } = this.state

    if (!isAuthenticated) {
      return (
        <View style={styles.container}>
          <TouchableOpacity onPress={() => this.doAuth()}>
            <Text style={{ padding: 20, borderWidth: 1, borderRadius: 3 }}>
              Login
            </Text>
          </TouchableOpacity>
        </View>
      )
    }

    return (
      <View style={styles.container}>
        <MapView
          initialRegion={{
            latitude: 25.2,
            longitude: 55.5,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />
        <Text style={{ textAlign: 'center' }}>Succesfully logged in!</Text>
        <Text style={{ textAlign: 'center' }}>Token: {accessToken}</Text>
        <TextInput
          style={{
            height: 40,
            margin: 20,
            padding: 5,
            borderColor: 'gray',
            borderWidth: 2,
            backgroundColor: 'white',
          }}
          onChangeText={text => this.setState({ text })}
          value={text}
          placeholder={'Enter the address here'}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: '#F5FCFF',
    paddingTop: 30,
  },
})
