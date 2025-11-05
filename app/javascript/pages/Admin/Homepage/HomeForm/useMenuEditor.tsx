import { useState } from 'react';

export interface MenuItem {
  id: string;
  label: string;
  link: string;
  children: MenuItem[];
}

export interface UseMenuEditorReturn {
  menuItems: MenuItem[];
  addMenuItem: (parentId?: string) => void;
  updateMenuItem: (id: string, updates: Partial<Omit<MenuItem, 'id' | 'children'>>) => void;
  deleteMenuItem: (id: string) => void;
  moveMenuItem: (id: string, direction: 'up' | 'down', parentId?: string) => void;
}

function generateId(): string {
  return `menu-item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function findMenuItem(items: MenuItem[], id: string): MenuItem | null {
  for (const item of items) {
    if (item.id === id) return item;
    const found = findMenuItem(item.children, id);
    if (found) return found;
  }
  return null;
}

function updateMenuItemRecursive(
  items: MenuItem[],
  id: string,
  updates: Partial<Omit<MenuItem, 'id' | 'children'>>
): MenuItem[] {
  return items.map(item => {
    if (item.id === id) {
      return { ...item, ...updates };
    }
    return {
      ...item,
      children: updateMenuItemRecursive(item.children, id, updates)
    };
  });
}

function deleteMenuItemRecursive(items: MenuItem[], id: string): MenuItem[] {
  return items
    .filter(item => item.id !== id)
    .map(item => ({
      ...item,
      children: deleteMenuItemRecursive(item.children, id)
    }));
}

function addMenuItemRecursive(items: MenuItem[], parentId: string | undefined, newItem: MenuItem): MenuItem[] {
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
      children: addMenuItemRecursive(item.children, parentId, newItem)
    };
  });
}

function moveMenuItemInArray(items: MenuItem[], id: string, direction: 'up' | 'down'): MenuItem[] {
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

function moveMenuItemRecursive(
  items: MenuItem[],
  id: string,
  direction: 'up' | 'down',
  parentId?: string
): MenuItem[] {
  // If no parentId, move at root level
  if (!parentId) {
    return moveMenuItemInArray(items, id, direction);
  }

  // Otherwise, move within parent's children
  return items.map(item => {
    if (item.id === parentId) {
      return {
        ...item,
        children: moveMenuItemInArray(item.children, id, direction)
      };
    }
    return {
      ...item,
      children: moveMenuItemRecursive(item.children, id, direction, parentId)
    };
  });
}

export function useMenuEditor(
  initialItems: MenuItem[] = [],
  onChange?: (items: MenuItem[]) => void
): UseMenuEditorReturn {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialItems);

  const updateMenuItems = (updater: (items: MenuItem[]) => MenuItem[]) => {
    setMenuItems(prev => {
      const updated = updater(prev);
      onChange?.(updated);
      return updated;
    });
  };

  const addMenuItem = (parentId?: string) => {
    const newItem: MenuItem = {
      id: generateId(),
      label: '',
      link: '',
      children: []
    };

    updateMenuItems(items => addMenuItemRecursive(items, parentId, newItem));
  };

  const updateMenuItem = (
    id: string,
    updates: Partial<Omit<MenuItem, 'id' | 'children'>>
  ) => {
    updateMenuItems(items => updateMenuItemRecursive(items, id, updates));
  };

  const deleteMenuItem = (id: string) => {
    updateMenuItems(items => deleteMenuItemRecursive(items, id));
  };

  const moveMenuItem = (id: string, direction: 'up' | 'down', parentId?: string) => {
    updateMenuItems(items => moveMenuItemRecursive(items, id, direction, parentId));
  };

  return {
    menuItems,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    moveMenuItem
  };
}
