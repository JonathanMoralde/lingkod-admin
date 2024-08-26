"use client";

import React, { useContext, createContext, useState, useEffect } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  UserCredential,
  User,
} from "firebase/auth";
import { auth, db } from "@/config/firebase";
import { doc, getDoc } from "firebase/firestore";

// interface User {
//   uid: string;
//   email: string;
// }
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }
  return context;
};

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<Boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        // setUser({
        //   uid: user.uid,
        //   email: user.email!,
        // });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    if (user) {
      // Retrieve the user document from Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();

        // Check if the user role is 'admin'
        if (userData?.role === "admin") {
          // Proceed with the admin-specific logic
          return userCredential;
        } else {
          // If user is not an admin, log out and throw an error
          await auth.signOut();
          throw new Error("You do not have admin privileges.");
        }
      } else {
        // If the user document does not exist
        await auth.signOut();
        throw new Error("User document not found.");
      }
    } else {
      throw new Error("User authentication failed.");
    }
    // signinwithemail

    // use uid to get the doc in firestore

    // check if user doc in users collection if its role is 'admin'

    // proceed

    // if user is not an admin, logout and throw an error

    // return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    setUser(null);
    await signOut(auth);
  };

  return (
    // <AuthContext.Provider value={{ user, login, logout }}>
    <AuthContext.Provider value={{ user, login, logout }}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
