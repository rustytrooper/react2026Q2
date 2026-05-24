import { create } from 'zustand';
import { fetchData, fetchFilteredData } from '../helpers/fetchData';
import type { DisneyApiResponse, Character } from '../types/charachterType';

interface DisneyStoreState {
  data: DisneyApiResponse | null;
  loading: boolean;
  error: boolean;
  totalPages: number;
  selectedIds: Set<number>;
  allCharacters: Character[];
}

interface DisneyStoreActions {
  loadData: (
    query: string,
    page: number,
    itemsPerPage?: number
  ) => Promise<void>;
  selectCharacter: (id: number) => void;
  clearSelection: () => void;
  getSelectedCount: () => number;
  getSelectedCharacters: () => Character[];
}

type DisneyStore = DisneyStoreState & DisneyStoreActions;

const useDisneyStore = create<DisneyStore>()((set, get) => ({
  data: null,
  loading: false,
  error: false,
  totalPages: 0,
  selectedIds: new Set<number>(),
  allCharacters: [],

  loadData: async (query: string, page: number, itemsPerPage = 10) => {
    set({ loading: true, error: false });

    try {
      let response: DisneyApiResponse | null;

      if (query) {
        response = await fetchFilteredData(query, page, itemsPerPage);
      } else {
        response = await fetchData(page, itemsPerPage);
      }

      const newCharacters = response?.data || [];

      set((state) => {
        let updatedAllCharacters;
        if (page === 1) {
          updatedAllCharacters = newCharacters;
        } else {
          const existingIds = new Set(state.allCharacters.map((c) => c._id));
          const uniqueNew = newCharacters.filter(
            (c) => !existingIds.has(c._id)
          );
          updatedAllCharacters = [...state.allCharacters, ...uniqueNew];
        }

        return {
          data: response,
          totalPages: response?.info?.totalPages || 0,
          loading: false,
          allCharacters: updatedAllCharacters,
        };
      });
    } catch (err) {
      console.error('Error loading data:', err);
      set({ error: true, loading: false });
    }
  },

  selectCharacter: (id: number) => {
    set((state) => {
      const newSelectedIds = new Set(state.selectedIds);
      if (newSelectedIds.has(id)) {
        newSelectedIds.delete(id);
      } else {
        newSelectedIds.add(id);
      }
      return { selectedIds: newSelectedIds };
    });
  },

  clearSelection: () => {
    set({ selectedIds: new Set<number>() });
  },

  getSelectedCount: () => {
    return get().selectedIds.size;
  },

  getSelectedCharacters: () => {
    const { allCharacters, selectedIds } = get();
    const result = allCharacters.filter((char) => selectedIds.has(char._id));
    return result;
  },
}));

export default useDisneyStore;
