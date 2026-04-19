import { create } from "zustand";
import { persist } from "zustand/middleware";

const useUserStore = create(
  persist(
    (set) => ({
      userName: "",

      setUserName: (name) =>
        set({
          userName: name,
        }),

      logout: () =>
        set({
          userName: "",
        }),
    }),
    {
      name: "user-storage",
    }
  )
);

export default useUserStore;
