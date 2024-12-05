import { create } from 'zustand'
import { MarkedDate } from '@/hooks/useStorageSavedDates' 

type State = {
    savedRatings: MarkedDate
}
  
type Action = {
    setSavedRatings: (savedRatings: State['savedRatings']) => void
    updateSavedRating: (key: string, value: MarkedDate[string]) => void;
}

export const useRatingStore = create<State & Action>((set) => ({
  savedRatings: {},
  setSavedRatings: (fetchedRatings: MarkedDate) => set(() => ({ savedRatings: fetchedRatings })),
  updateSavedRating: (key, value) =>
    set((state) => ({
      savedRatings: {
        ...state.savedRatings,
        [key]: value,
      },
    })),
}))