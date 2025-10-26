/**
 * Vault store - manages password entries using Zustand
 * Provides offline-first data management with local persistence
 */

import {create} from 'zustand';
import {PasswordEntry, PasswordCategory, PasswordStrength} from '@/types';

interface VaultState {
  entries: PasswordEntry[];
  filteredEntries: PasswordEntry[];
  searchQuery: string;
  selectedCategory: PasswordCategory | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  addEntry: (entry: Omit<PasswordEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateEntry: (id: string, updates: Partial<PasswordEntry>) => void;
  deleteEntry: (id: string) => void;
  getEntry: (id: string) => PasswordEntry | undefined;
  toggleFavorite: (id: string) => void;
  updateLastAccessed: (id: string) => void;
  searchEntries: (query: string) => void;
  filterByCategory: (category: PasswordCategory | null) => void;
  loadEntries: () => Promise<void>;
  clearError: () => void;
}

export const useVaultStore = create<VaultState>((set, get) => ({
  entries: [],
  filteredEntries: [],
  searchQuery: '',
  selectedCategory: null,
  isLoading: false,
  error: null,

  addEntry: (entryData) => {
    const now = Date.now();
    const newEntry: PasswordEntry = {
      ...entryData,
      id: `entry_${now}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: now,
      updatedAt: now,
    };

    set((state) => {
      const entries = [...state.entries, newEntry];
      return {
        entries,
        filteredEntries: applyFilters(entries, state.searchQuery, state.selectedCategory),
      };
    });
  },

  updateEntry: (id, updates) => {
    set((state) => {
      const entries = state.entries.map((entry) =>
        entry.id === id ? {...entry, ...updates, updatedAt: Date.now()} : entry
      );
      return {
        entries,
        filteredEntries: applyFilters(entries, state.searchQuery, state.selectedCategory),
      };
    });
  },

  deleteEntry: (id) => {
    set((state) => {
      const entries = state.entries.filter((entry) => entry.id !== id);
      return {
        entries,
        filteredEntries: applyFilters(entries, state.searchQuery, state.selectedCategory),
      };
    });
  },

  getEntry: (id) => {
    return get().entries.find((entry) => entry.id === id);
  },

  toggleFavorite: (id) => {
    set((state) => {
      const entries = state.entries.map((entry) =>
        entry.id === id
          ? {...entry, isFavorite: !entry.isFavorite, updatedAt: Date.now()}
          : entry
      );
      return {
        entries,
        filteredEntries: applyFilters(entries, state.searchQuery, state.selectedCategory),
      };
    });
  },

  updateLastAccessed: (id) => {
    set((state) => ({
      entries: state.entries.map((entry) =>
        entry.id === id ? {...entry, lastAccessedAt: Date.now()} : entry
      ),
    }));
  },

  searchEntries: (query) => {
    set((state) => ({
      searchQuery: query,
      filteredEntries: applyFilters(state.entries, query, state.selectedCategory),
    }));
  },

  filterByCategory: (category) => {
    set((state) => ({
      selectedCategory: category,
      filteredEntries: applyFilters(state.entries, state.searchQuery, category),
    }));
  },

  loadEntries: async () => {
    set({isLoading: true, error: null});
    try {
      // In production, this would load from WatermelonDB
      // For now, we'll initialize with sample data
      const sampleEntries: PasswordEntry[] = [];
      set({
        entries: sampleEntries,
        filteredEntries: sampleEntries,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load entries',
        isLoading: false,
      });
    }
  },

  clearError: () => set({error: null}),
}));

// Helper function to apply search and category filters
function applyFilters(
  entries: PasswordEntry[],
  searchQuery: string,
  category: PasswordCategory | null
): PasswordEntry[] {
  let filtered = [...entries];

  // Apply category filter
  if (category) {
    filtered = filtered.filter((entry) => entry.category === category);
  }

  // Apply search filter
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (entry) =>
        entry.title.toLowerCase().includes(query) ||
        entry.username.toLowerCase().includes(query) ||
        entry.url?.toLowerCase().includes(query) ||
        entry.notes?.toLowerCase().includes(query) ||
        entry.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  }

  return filtered;
}

// Selectors for optimized access
export const vaultSelectors = {
  getFavorites: (state: VaultState) => state.entries.filter((e) => e.isFavorite),
  getByCategory: (state: VaultState, category: PasswordCategory) =>
    state.entries.filter((e) => e.category === category),
  getRecentlyAccessed: (state: VaultState) =>
    [...state.entries]
      .filter((e) => e.lastAccessedAt)
      .sort((a, b) => (b.lastAccessedAt || 0) - (a.lastAccessedAt || 0))
      .slice(0, 10),
  getWeakPasswords: (state: VaultState) =>
    state.entries.filter(
      (e) => e.strength === PasswordStrength.Weak || e.strength === PasswordStrength.VeryWeak
    ),
};
