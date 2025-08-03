/**
 * Utility functions for ProductSelector component
 */

export const createFilterConfig = (
  selectedBrand: string,
  brandOptions: Array<{ value: string; label: string }>
): Array<{ id: string; label: string; value: string; options: Array<{ value: string; label: string }> }> => [
  {
    id: 'brand',
    label: '',
    value: selectedBrand,
    options: brandOptions,
  },
]

export const shouldShowClearAll = (searchTerm: string, selectedBrand: string): boolean => {
  return searchTerm !== '' || selectedBrand !== ''
}
