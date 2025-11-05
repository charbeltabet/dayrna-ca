import { useState } from 'react';

export interface ScriptureSlide {
  id: string;
  imageUrl: string;
  scriptureText: string;
  reference: string;
}

export interface UseScriptureSlideEditorReturn {
  slides: ScriptureSlide[];
  addSlide: () => void;
  updateSlide: (id: string, updates: Partial<Omit<ScriptureSlide, 'id'>>) => void;
  deleteSlide: (id: string) => void;
  moveSlide: (id: string, direction: 'up' | 'down') => void;
}

function generateId(): string {
  return `slide-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function useScriptureSlideEditor(
  initialSlides: ScriptureSlide[] = [],
  onChange?: (slides: ScriptureSlide[]) => void
): UseScriptureSlideEditorReturn {
  const [slides, setSlides] = useState<ScriptureSlide[]>(initialSlides);

  const updateSlides = (updater: (slides: ScriptureSlide[]) => ScriptureSlide[]) => {
    setSlides(prev => {
      const updated = updater(prev);
      onChange?.(updated);
      return updated;
    });
  };

  const addSlide = () => {
    const newSlide: ScriptureSlide = {
      id: generateId(),
      imageUrl: '',
      scriptureText: '',
      reference: ''
    };

    updateSlides(slides => [...slides, newSlide]);
  };

  const updateSlide = (
    id: string,
    updates: Partial<Omit<ScriptureSlide, 'id'>>
  ) => {
    updateSlides(slides =>
      slides.map(slide => (slide.id === id ? { ...slide, ...updates } : slide))
    );
  };

  const deleteSlide = (id: string) => {
    updateSlides(slides => slides.filter(slide => slide.id !== id));
  };

  const moveSlide = (id: string, direction: 'up' | 'down') => {
    updateSlides(slides => {
      const index = slides.findIndex(slide => slide.id === id);
      if (index === -1) return slides;

      if (direction === 'up' && index > 0) {
        const newSlides = [...slides];
        [newSlides[index - 1], newSlides[index]] = [newSlides[index], newSlides[index - 1]];
        return newSlides;
      }

      if (direction === 'down' && index < slides.length - 1) {
        const newSlides = [...slides];
        [newSlides[index], newSlides[index + 1]] = [newSlides[index + 1], newSlides[index]];
        return newSlides;
      }

      return slides;
    });
  };

  return {
    slides,
    addSlide,
    updateSlide,
    deleteSlide,
    moveSlide
  };
}
