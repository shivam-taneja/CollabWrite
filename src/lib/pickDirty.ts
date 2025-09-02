function pickDirty<T extends Record<string, any>>(
  values: T,
  dirty: Record<string, any>
): Partial<T> {
  return Object.fromEntries(
    Object.keys(dirty).map((key) => [key, values[key]])
  ) as Partial<T>;
}

export default pickDirty