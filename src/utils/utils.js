export const $ = (property) => {
  return document.querySelector(property);
} 

export const generateId = function* (givenId) {
  let id = givenId;
  while (true) {
    id++;
    yield id;
  }
}