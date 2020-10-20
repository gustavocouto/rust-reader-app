export const environment = {
  production: true,
  readThreshold: {
    match: [-1000, 0],
    undef: [-30000, -1000],
    unmatch: [-Infinity, -30000]
  },
  apiUrl: 'https://rustreader.herokuapp.com/api'
};
