export function normalizeFormIds(obj: any, keys: string[]): any {
  const updated = { ...obj };

  keys.forEach(key => {
    const value = updated[key];

    if (Array.isArray(value)) {
      updated[key] = value.map((item: any) =>
        typeof item === 'object' && item !== null ? item.id ?? item : item
      );
    } else if (typeof value === 'object' && value !== null) {
      updated[key] = value.id ?? value;
    }
  });

  return updated;
}
