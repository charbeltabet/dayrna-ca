export function pluralize(count: number, singular: string, plural?: string): string {
  if (count === 1) {
    return singular;
  } else {
    return plural || (singular + 's');
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + '...';
}

// conserve the extension
export function truncateFilename(filename: string, maxLength: number): string {
  if (!filename) return '';
  if (filename.length <= maxLength) {
    return filename;
  }

  const lastDotIndex = filename.lastIndexOf('.');
  if (lastDotIndex === -1 || lastDotIndex === 0) {
    return filename.slice(0, maxLength) + '...';
  }

  const namePart = filename.slice(0, lastDotIndex);
  const extensionPart = filename.slice(lastDotIndex);

  const allowedNameLength = maxLength - extensionPart.length - 3; // 3 for '...'

  if (allowedNameLength <= 0) {
    return '...' + extensionPart;
  }

  return namePart.slice(0, allowedNameLength) + '...' + extensionPart;
}