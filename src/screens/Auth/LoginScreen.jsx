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
        if (firebaseUser) setUser(firebaseUser);
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
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Logo */}
        <Image
          source={require("../../../assets/images/linkup-logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Card */}
        <View style={styles.formContainer}>
          {user ? (
            <>
              <Text style={styles.loggedInText}>Logged in as: {user.email || user.name}</Text>
              
              {user.sub ? (
                <TouchableOpacity style={styles.button} onPress={() => logoutAuth0("dev-v3e75p3t5h0rdrr0.us.auth0.com")}>
                  <Text style={styles.buttonText}>Logout Auth0</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.button} onPress={logoutFirebase}>
                  <Text style={styles.buttonText}>Logout Firebase</Text>
                </TouchableOpacity>
              )}
            </>
          ) : (
            <>
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
                <Text style={styles.buttonText}>Login</Text>
              </TouchableOpacity>

              <Text style={styles.orText}>OR</Text>

              <Auth0LoginButton />

              <Text style={styles.link}>
                Don't have an account?{" "}
                <Text style={styles.linkText} onPress={() => navigation.navigate("Register")}>
                  Register
                </Text>
              </Text>
            </>
          )}
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F1F4F8",
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  logo: {
    width: 160,
    height: 120,
    marginBottom: 20,
  },
  formContainer: {
    width: "100%",
    maxWidth: 350,
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 6,
  },
  loggedInText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1E293B",
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#475569",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#F5F7FA",
    borderRadius: 12,
    padding: 14,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  button: {
    backgroundColor: "#0EA5E9",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 12,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  orText: {
    textAlign: "center",
    marginVertical: 10,
    color: "#6B7280",
    fontWeight: "500",
  },
  link: {
    textAlign: "center",
    marginTop: 15,
    color: "#6B7280",
  },
  linkText: {
    color: "#0EA5E9",
    fontWeight: "600",
  },
});
