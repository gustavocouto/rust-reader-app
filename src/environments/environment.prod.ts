export const environment = {
  production: true,
  readThreshold: {
    match: [-1000, 0],
    undef: [-10000, -1000],
    unmatch: [-20000, -10000]
  },
  apiUrl: 'https://rustreader.herokuapp.com/api'
};
