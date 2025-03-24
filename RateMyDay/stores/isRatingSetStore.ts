import { create } from "zustand";

interface isRatingSet {
  isRatingUpdated: boolean;
  setRatingUpdated: () => void;
}

const useStore = create<isRatingSet>((set) => ({
  isRatingUpdated: false,
  setRatingUpdated: () =>
    set((state) => ({ isRatingUpdated: !state.isRatingUpdated })),
}));

export default useStore;
