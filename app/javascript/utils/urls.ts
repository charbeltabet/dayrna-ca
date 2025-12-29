export function isValidUrl(string: string) {
  try {
    if (!string.startsWith('http://') && !string.startsWith('https://')) {
      return false;
    }

    new URL(string);
    return true
  } catch (err) {
    return false;
  }
}

export const urlsListIsValid = (urlString: string) => {
  const splittedUrls = urlString.split(/[\n,]+/).map(url => url.trim()).filter(url => url.length > 0);

  if (splittedUrls.length === 0) {
    return false;
  }

  for (const url of splittedUrls) {
    if (!isValidUrl(url)) {
      return false;
    }
  }
  return true;
}

export const urlsFromList = (urlString: string): string[] => {
  const splittedUrls = urlString.split(/[\n,]+/).map(url => url.trim()).filter(url => url.length > 0);
  return splittedUrls;
}

export const urlsToFiles = async (urlString: string): Promise<File[]> => {
  const urls = urlsFromList(urlString);

  const filePromises = urls.map(async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    }

    const blob = await response.blob();
    const fileName = url.split('/').pop() || 'file'; // Extract file name from URL or use a default name
    return new File([blob], fileName, { type: blob.type });
  });

  return Promise.all(filePromises);
};