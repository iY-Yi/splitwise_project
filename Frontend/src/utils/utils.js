const getCurrentUser = () => {
  const id = localStorage.getItem('userId');
  if (id === null) {
    return false;
  }
  return id;
};

const dateTimeFormat = (dateString, timezone) => {
  const d = new Date(dateString);
  return d.toLocaleString('en-US', { timeZone: timezone });
};

export { getCurrentUser, dateTimeFormat };
