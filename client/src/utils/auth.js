export const isAuthenticated = () => {
  return !!(localStorage.getItem('token') === 'admin');
};

export const isStudent = () => {
  return localStorage.getItem('token') === 'student';
};
