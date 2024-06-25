// import { create } from "zustand";

// const useStore = create((set) => ({
//   user: JSON.parse(localStorage.getItem("user")) || {},
//   isLoading: false,

//   theme: localStorage.getItem("theme") ?? "light",
//   isAuthenticated: false,
//   user: null,
//   signIn: (user) => set({ isAuthenticated: true, user }),
//   signOut: () => set({ isAuthenticated: false, user: null }),

//   // signIn: (data) => set((state) => ({ user: data })),

//   setTheme: (value) => set({ theme: value }),

//   // signOut: () => set({ user: {} }),

//   setIsLoading: (val) => set((state) => ({ isLoading: val })),
// }));

// export default useStore;
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set) => ({
      user: {},
      isLoading: false,
      theme: 'light',
      signIn: ({user,token}) => set({  user :{user,token}}),
      signOut: () => set({ user: null }),
      setTheme: (value) => set({ theme: value }),
      setIsLoading: (val) => set((state) => ({ isLoading: val })),
    }),
    {
      name: 'auth-store', // Name of the key in local storage
    }
  )
);

export default useStore;