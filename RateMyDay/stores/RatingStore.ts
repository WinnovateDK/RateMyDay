import { create } from 'zustand'
import { MarkedDate } from '@/hooks/useStorageSavedDates' 

type State = {
    savedRatings: MarkedDate
}
  
type Action = {
    setSavedRatings: (savedRatings: State['savedRatings']) => void
}

export const useRatingStore = create<State & Action>((set) => ({
  savedRatings: {},
  setSavedRatings: (fetchedRatings: MarkedDate) => set(() => ({ savedRatings: fetchedRatings })),
}))