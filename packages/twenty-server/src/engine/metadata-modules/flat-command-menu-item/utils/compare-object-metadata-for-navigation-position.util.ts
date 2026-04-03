export const compareObjectMetadataForNavigationPosition = (
  a: { isSystem: boolean },
  b: { isSystem: boolean },
): number => {
  if (a.isSystem !== b.isSystem) {
    return a.isSystem ? 1 : -1;
  }

  return 0;
};
