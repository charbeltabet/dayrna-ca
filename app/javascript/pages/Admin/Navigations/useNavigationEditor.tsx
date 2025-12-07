import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';

export interface Page {
  id: number;
  title: string;
  slug: string;
  position: number;
  navigation_id: number;
  full_path: string;
  content?: string;
}

export interface NavigationItem {
  id: number;
  name: string;
  url: string;
  position: number;
  navigation_parent_id: number | null;
  item_type: 'NAV' | 'PAGE' | 'MENU';
  external_link?: string;
  label?: string;
  children: NavigationItem[];
  pages: Page[];
}

export interface UseNavigationEditorReturn {
  navigationItems: NavigationItem[];
  addNavigationItem: (parentId?: number) => void;
  updateNavigationItem: (id: number, updates: Partial<Omit<NavigationItem, 'id' | 'children'>>) => void;
  deleteNavigationItem: (id: number) => void;
  moveNavigationItem: (id: number, direction: 'up' | 'down', parentId?: number) => void;
  addPage: (navigationId: number) => void;
  deletePage: (navigationId: number, pageId: number) => void;
  movePage: (navigationId: number, pageId: number, direction: 'up' | 'down') => void;
}

function findNavigationItem(items: NavigationItem[], id: number): NavigationItem | null {
  for (const item of items) {
    if (item.id === id) return item;
    const found = findNavigationItem(item.children, id);
    if (found) return found;
  }
  return null;
}

function updateNavigationItemRecursive(
  items: NavigationItem[],
  id: number,
  updates: Partial<Omit<NavigationItem, 'id' | 'children'>>
): NavigationItem[] {
  return items.map(item => {
    if (item.id === id) {
      return { ...item, ...updates };
    }
    return {
      ...item,
      children: updateNavigationItemRecursive(item.children, id, updates)
    };
  });
}

function deleteNavigationItemRecursive(items: NavigationItem[], id: number): NavigationItem[] {
  return items
    .filter(item => item.id !== id)
    .map(item => ({
      ...item,
      children: deleteNavigationItemRecursive(item.children, id)
    }));
}

function addNavigationItemRecursive(items: NavigationItem[], parentId: number | undefined, newItem: NavigationItem): NavigationItem[] {
  if (!parentId) {
    return [...items, newItem];
  }

  return items.map(item => {
    if (item.id === parentId) {
      return {
        ...item,
        children: [...item.children, newItem]
      };
    }
    return {
      ...item,
      children: addNavigationItemRecursive(item.children, parentId, newItem)
    };
  });
}

function moveNavigationItemInArray(items: NavigationItem[], id: number, direction: 'up' | 'down'): NavigationItem[] {
  const index = items.findIndex(item => item.id === id);
  if (index === -1) return items;

  if (direction === 'up' && index > 0) {
    const newItems = [...items];
    [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
    return newItems;
  }

  if (direction === 'down' && index < items.length - 1) {
    const newItems = [...items];
    [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
    return newItems;
  }

  return items;
}

function moveNavigationItemRecursive(
  items: NavigationItem[],
  id: number,
  direction: 'up' | 'down',
  parentId?: number
): NavigationItem[] {
  // If no parentId, move at root level
  if (!parentId) {
    return moveNavigationItemInArray(items, id, direction);
  }

  // Otherwise, move within parent's children
  return items.map(item => {
    if (item.id === parentId) {
      return {
        ...item,
        children: moveNavigationItemInArray(item.children, id, direction)
      };
    }
    return {
      ...item,
      children: moveNavigationItemRecursive(item.children, id, direction, parentId)
    };
  });
}

function flattenNavigations(items: NavigationItem[]): Array<{ id: number; position: number; navigation_parent_id: number | null }> {
  const result: Array<{ id: number; position: number; navigation_parent_id: number | null }> = [];

  function flatten(navItems: NavigationItem[], parentId: number | null = null) {
    navItems.forEach((item, index) => {
      result.push({
        id: item.id,
        position: index,
        navigation_parent_id: parentId
      });
      if (item.children.length > 0) {
        flatten(item.children, item.id);
      }
    });
  }

  flatten(items);
  return result;
}

export function useNavigationEditor(
  initialItems: NavigationItem[] = []
): UseNavigationEditorReturn {
  const [navigationItems, setNavigationItems] = useState<NavigationItem[]>(initialItems);

  // Sync local state when props change (e.g., after create/delete)
  useEffect(() => {
    setNavigationItems(initialItems);
  }, [initialItems]);

  const updateNavigationItems = (updater: (items: NavigationItem[]) => NavigationItem[]) => {
    setNavigationItems(prev => {
      const updated = updater(prev);
      return updated;
    });
  };

  const addNavigationItem = (parentId?: number) => {
    router.post("/admin/navigations", {
      name: "New Navigation",
      navigation_parent_id: parentId,
      position: parentId ?
        (findNavigationItem(navigationItems, parentId)?.children.length || 0) :
        navigationItems.length
    });
  };

  const updateNavigationItem = (
    id: number,
    updates: Partial<Omit<NavigationItem, 'id' | 'children'>>
  ) => {
    const updatedItems = updateNavigationItemRecursive(navigationItems, id, updates);
    updateNavigationItems(() => updatedItems);

    // Debounce or batch these updates in production
    const item = findNavigationItem(updatedItems, id);
    if (item) {
      // Only send fields that were updated (slug will be auto-generated from name)
      const payload: any = {};
      if (updates.name !== undefined) payload.name = item.name;
      if (updates.external_link !== undefined) payload.external_link = item.external_link;
      if (updates.navigation_parent_id !== undefined) payload.navigation_parent_id = item.navigation_parent_id;
      if (updates.position !== undefined) payload.position = item.position;

      router.patch(`/admin/navigations/${id}`, payload, {
        preserveScroll: true,
        preserveState: true
      });
    }
  };

  const deleteNavigationItem = (id: number) => {
    if (confirm("Are you sure you want to delete this navigation item and all its children?")) {
      router.delete(`/admin/navigations/${id}`, {
        preserveScroll: true
      });
    }
  };

  const moveNavigationItem = (id: number, direction: 'up' | 'down', parentId?: number) => {
    const updatedItems = moveNavigationItemRecursive(navigationItems, id, direction, parentId);
    updateNavigationItems(() => updatedItems);

    // Batch update all positions
    const flattened = flattenNavigations(updatedItems);
    flattened.forEach(({ id: navId, position, navigation_parent_id }) => {
      router.patch(`/admin/navigations/${navId}`, {
        position,
        navigation_parent_id
      }, {
        preserveScroll: true,
        preserveState: true,
        only: ['navigations']
      });
    });
  };

  const addPage = (navigationId: number) => {
    router.post(`/admin/navigations/${navigationId}/pages`, {
      title: "New Page",
      content: "Page content goes here."
    });
  };

  const deletePage = (navigationId: number, pageId: number) => {
    if (confirm("Are you sure you want to delete this page?")) {
      router.delete(`/admin/navigations/${navigationId}/pages/${pageId}`, {
        preserveScroll: true
      });
    }
  };

  const movePage = (navigationId: number, pageId: number, direction: 'up' | 'down') => {
    const navigation = findNavigationItem(navigationItems, navigationId);
    if (!navigation) return;

    const pageIndex = navigation.pages.findIndex(p => p.id === pageId);
    if (pageIndex === -1) return;

    const newPosition = direction === 'up' ? pageIndex - 1 : pageIndex + 1;
    if (newPosition < 0 || newPosition >= navigation.pages.length) return;

    router.patch(`/admin/navigations/${navigationId}/pages/${pageId}`, {
      position: newPosition
    }, {
      preserveScroll: true,
      preserveState: true
    });
  };

  return {
    navigationItems,
    addNavigationItem,
    updateNavigationItem,
    deleteNavigationItem,
    moveNavigationItem,
    addPage,
    deletePage,
    movePage
  };
}
