import React, { useState, useContext, useCallback } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  RefreshControl,
} from "react-native";
import { AuthContext } from "../../context/AuthContext.jsx";
import { firebaseAuth } from "../../../config/firebase";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import Auth0LoginButton from "../../components/Auth0LoginButton.jsx";

export default function LoginScreen({ navigation }) {
  const { user, setUser, logoutFirebase, logoutAuth0 } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const loginWithFirebase = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      );
      setUser(userCredential.user);
    } catch (error) {
      Alert.alert("Login failed", error.message);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      onAuthStateChanged(firebaseAuth, (firebaseUser) => {
        if (firebaseUser) {
          setUser(firebaseUser);
        }
      });
    } catch (err) {
      console.error("Refresh error:", err);
    } finally {
      setRefreshing(false);
    }
  }, [setUser]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Image
          source={require("../../../assets/images/linkup-logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        {user ? (
          <View style={styles.formContainer}>
            <Text style={{ textAlign: "center", marginBottom: 20 }}>
              Logged in as: {user.email || user.name}
            </Text>

            {user.sub ? (
              <TouchableOpacity
                style={styles.button}
                onPress={() =>
                  logoutAuth0("dev-v3e75p3t5h0rdrr0.us.auth0.com")
                }
              >
                <Text style={styles.buttonText}>Logout Auth0</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.button} onPress={logoutFirebase}>
                <Text style={styles.buttonText}>Logout Firebase</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={styles.formContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              placeholder="Enter email"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              autoCapitalize="none"
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              placeholder="Enter password"
              value={password}
              secureTextEntry
              onChangeText={setPassword}
              style={styles.input}
            />

            <TouchableOpacity style={styles.button} onPress={loginWithFirebase}>
              <Text style={styles.buttonText}
                onPress={() => navigation.navigate("Profile")}
              >Login</Text>
            </TouchableOpacity>

            <Text style={{ textAlign: "center", marginVertical: 10 }}>OR</Text>

            <Auth0LoginButton />

            <Text style={styles.link}>
              Don't have an account?{" "}
              <Text
                style={styles.linkText}
                onPress={() => navigation.navigate("Register")}
              >
                Register
              </Text>
            </Text>
          </View>
        )}
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 20,
  },
  logo: {
    width: 160,
    height: 120,
    marginBottom: 10,
  },
  formContainer: {
    width: "100%",
    maxWidth: 350,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    elevation: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#555",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#28a745",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  link: {
    textAlign: "center",
    marginTop: 15,
    color: "#555",
  },
  linkText: {
    color: "#007bff",
    fontWeight: "600",
  },
});
