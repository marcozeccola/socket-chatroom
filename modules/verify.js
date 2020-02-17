  let verify = (str) => {
      //se è uno stringa e se non ha spazi (.trim toglie gli spazi ad inizio e fine)
      return typeof str === 'string' && str.trim().length > 0;
  };
  module.exports = {
      verify
  };