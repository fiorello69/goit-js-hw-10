export function toggleLoader(visible) {
  const loaderContainer = document.querySelector('.loader-container');
  if (loaderContainer) {
    loaderContainer.style.display = visible ? 'flex' : 'none';
  }
}
