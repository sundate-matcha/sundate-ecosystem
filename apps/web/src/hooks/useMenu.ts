import { useState, useEffect } from 'react';
import { menuAPI, MenuItem } from '../services/api';

interface UseMenuReturn {
  menuItems: MenuItem[];
  loading: boolean;
  error: string | null;
  categories: string[];
  featuredItems: MenuItem[];
  getMenuByCategory: (category: string) => Promise<void>;
  searchMenu: (query: string) => Promise<void>;
  resetMenu: () => void;
}

export const useMenu = (): UseMenuReturn => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [featuredItems, setFeaturedItems] = useState<MenuItem[]>([]);

  // Load categories and featured items on mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const [categoriesData, featuredData] = await Promise.all([
          menuAPI.getCategories(),
          menuAPI.getFeatured(),
        ]);
        setCategories(categoriesData);
        setFeaturedItems(featuredData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load menu data');
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const getMenuByCategory = async (category: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await menuAPI.getByCategory(category);
      setMenuItems(result.menuItems);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load menu items');
    } finally {
      setLoading(false);
    }
  };

  const searchMenu = async (query: string) => {
    if (!query.trim()) {
      setMenuItems([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await menuAPI.search(query);
      setMenuItems(result.menuItems);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search menu');
    } finally {
      setLoading(false);
    }
  };

  const resetMenu = () => {
    setMenuItems([]);
    setError(null);
  };

  return {
    menuItems,
    loading,
    error,
    categories,
    featuredItems,
    getMenuByCategory,
    searchMenu,
    resetMenu,
  };
};
