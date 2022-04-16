export const environment = {
  production: true,
  apiUrl: ["localhost", "127.0.0.1", ""].includes(window.location.hostname) ? '' : "https://budget-buddy-app1.herokuapp.com/"
};
