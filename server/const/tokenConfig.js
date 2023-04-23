export const ACCESS_TOKEN_EXPIRE_TIME = '1h';
export const REFRESH_TOKEN_EXPIRE_TIME = '14d';
export const ISSUER = 'Vacay-Mate';
export const PAYLOAD = (user) => ({
  id: user.id,
  email: user.email,
  name: user.name,
  role: user.role,
  isLeave: user.is_leave
});
