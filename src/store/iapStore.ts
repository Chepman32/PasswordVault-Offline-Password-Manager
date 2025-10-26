/**
 * In-App Purchase store - manages IAP state and products
 */

import {create} from 'zustand';
import {IAPProduct, PurchaseState} from '@/types';

interface IAPState extends PurchaseState {
  products: IAPProduct[];
  isLoading: boolean;
  error: string | null;

  // Actions
  loadProducts: () => Promise<void>;
  purchaseProduct: (productId: string) => Promise<void>;
  restorePurchases: () => Promise<void>;
  unlockPro: () => void;
  checkSubscriptionStatus: () => void;
}

export const useIAPStore = create<IAPState>((set, get) => ({
  isPro: false,
  purchasedProducts: [],
  subscriptionExpiryDate: undefined,
  products: [],
  isLoading: false,
  error: null,

  loadProducts: async () => {
    set({isLoading: true, error: null});
    try {
      // In production, this would use react-native-iap
      // For now, we'll use mock products
      const mockProducts: IAPProduct[] = [
        {
          productId: 'com.passwordvault.pro',
          type: 'non_consumable',
          title: 'PasswordVault Pro',
          description: 'Unlock all premium features',
          price: '$9.99',
          localizedPrice: '$9.99',
        },
        {
          productId: 'com.passwordvault.pro.monthly',
          type: 'subscription',
          title: 'PasswordVault Pro Monthly',
          description: 'Premium features with monthly subscription',
          price: '$2.99',
          localizedPrice: '$2.99',
        },
        {
          productId: 'com.passwordvault.pro.yearly',
          type: 'subscription',
          title: 'PasswordVault Pro Yearly',
          description: 'Premium features with yearly subscription (Save 50%)',
          price: '$19.99',
          localizedPrice: '$19.99',
        },
      ];

      set({products: mockProducts, isLoading: false});
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load products',
        isLoading: false,
      });
    }
  },

  purchaseProduct: async (productId) => {
    set({isLoading: true, error: null});
    try {
      // In production, this would use react-native-iap
      // Mock purchase success
      await new Promise((resolve) => setTimeout(resolve, 1000));

      set((state) => ({
        isPro: true,
        purchasedProducts: [...state.purchasedProducts, productId],
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Purchase failed',
        isLoading: false,
      });
    }
  },

  restorePurchases: async () => {
    set({isLoading: true, error: null});
    try {
      // In production, this would restore from react-native-iap
      await new Promise((resolve) => setTimeout(resolve, 1000));
      set({isLoading: false});
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Restore failed',
        isLoading: false,
      });
    }
  },

  unlockPro: () => {
    set({isPro: true});
  },

  checkSubscriptionStatus: () => {
    const {subscriptionExpiryDate} = get();
    if (subscriptionExpiryDate && Date.now() > subscriptionExpiryDate) {
      set({isPro: false});
    }
  },
}));
