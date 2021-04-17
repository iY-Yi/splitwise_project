const getCurrentUser = () => {
  const id = localStorage.getItem('userId');
  if (id === null) {
    return false;
  }
  return id;
};

export { getCurrentUser };