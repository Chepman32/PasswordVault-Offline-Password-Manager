/**
 * Unit tests for VaultStore
 */

import {useVaultStore, vaultSelectors} from '../store/vaultStore';
import {PasswordCategory, PasswordStrength} from '../types';

describe('VaultStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useVaultStore.setState({
      entries: [],
      filteredEntries: [],
      searchQuery: '',
      selectedCategory: null,
      isLoading: false,
      error: null,
    });
  });

  test('should add a new entry', () => {
    const {addEntry, entries} = useVaultStore.getState();

    addEntry({
      title: 'Test Entry',
      username: 'test@example.com',
      password: 'Test@123',
      category: PasswordCategory.Login,
      isFavorite: false,
      tags: [],
      customFields: [],
    });

    const state = useVaultStore.getState();
    expect(state.entries.length).toBe(1);
    expect(state.entries[0].title).toBe('Test Entry');
    expect(state.entries[0].username).toBe('test@example.com');
  });

  test('should update an entry', () => {
    const {addEntry, updateEntry} = useVaultStore.getState();

    addEntry({
      title: 'Original Title',
      username: 'user@example.com',
      password: 'Pass@123',
      category: PasswordCategory.Login,
      isFavorite: false,
      tags: [],
      customFields: [],
    });

    const state = useVaultStore.getState();
    const entryId = state.entries[0].id;

    updateEntry(entryId, {title: 'Updated Title'});

    const updatedState = useVaultStore.getState();
    expect(updatedState.entries[0].title).toBe('Updated Title');
    expect(updatedState.entries[0].username).toBe('user@example.com'); // Unchanged
  });

  test('should delete an entry', () => {
    const {addEntry, deleteEntry} = useVaultStore.getState();

    addEntry({
      title: 'To Delete',
      username: 'delete@example.com',
      password: 'Pass@123',
      category: PasswordCategory.Login,
      isFavorite: false,
      tags: [],
      customFields: [],
    });

    const state = useVaultStore.getState();
    const entryId = state.entries[0].id;

    deleteEntry(entryId);

    const updatedState = useVaultStore.getState();
    expect(updatedState.entries.length).toBe(0);
  });

  test('should toggle favorite', () => {
    const {addEntry, toggleFavorite} = useVaultStore.getState();

    addEntry({
      title: 'Favorite Test',
      username: 'fav@example.com',
      password: 'Pass@123',
      category: PasswordCategory.Login,
      isFavorite: false,
      tags: [],
      customFields: [],
    });

    const state = useVaultStore.getState();
    const entryId = state.entries[0].id;

    toggleFavorite(entryId);

    let updatedState = useVaultStore.getState();
    expect(updatedState.entries[0].isFavorite).toBe(true);

    toggleFavorite(entryId);

    updatedState = useVaultStore.getState();
    expect(updatedState.entries[0].isFavorite).toBe(false);
  });

  test('should search entries', () => {
    const {addEntry, searchEntries} = useVaultStore.getState();

    addEntry({
      title: 'Gmail Account',
      username: 'user@gmail.com',
      password: 'Pass@123',
      category: PasswordCategory.Login,
      isFavorite: false,
      tags: [],
      customFields: [],
    });

    addEntry({
      title: 'Facebook',
      username: 'user@facebook.com',
      password: 'Pass@456',
      category: PasswordCategory.Login,
      isFavorite: false,
      tags: [],
      customFields: [],
    });

    searchEntries('gmail');

    const state = useVaultStore.getState();
    expect(state.filteredEntries.length).toBe(1);
    expect(state.filteredEntries[0].title).toBe('Gmail Account');
  });

  test('should filter by category', () => {
    const {addEntry, filterByCategory} = useVaultStore.getState();

    addEntry({
      title: 'Login',
      username: 'user@example.com',
      password: 'Pass@123',
      category: PasswordCategory.Login,
      isFavorite: false,
      tags: [],
      customFields: [],
    });

    addEntry({
      title: 'Credit Card',
      username: 'card',
      password: '1234',
      category: PasswordCategory.CreditCard,
      isFavorite: false,
      tags: [],
      customFields: [],
    });

    filterByCategory(PasswordCategory.Login);

    const state = useVaultStore.getState();
    expect(state.filteredEntries.length).toBe(1);
    expect(state.filteredEntries[0].category).toBe(PasswordCategory.Login);
  });

  test('should get favorites', () => {
    const {addEntry} = useVaultStore.getState();

    addEntry({
      title: 'Favorite 1',
      username: 'fav1@example.com',
      password: 'Pass@123',
      category: PasswordCategory.Login,
      isFavorite: true,
      tags: [],
      customFields: [],
    });

    addEntry({
      title: 'Not Favorite',
      username: 'notfav@example.com',
      password: 'Pass@456',
      category: PasswordCategory.Login,
      isFavorite: false,
      tags: [],
      customFields: [],
    });

    const state = useVaultStore.getState();
    const favorites = vaultSelectors.getFavorites(state);
    expect(favorites.length).toBe(1);
    expect(favorites[0].title).toBe('Favorite 1');
  });
});
