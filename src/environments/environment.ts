export const environment = {
  get apiBase(): string {
    const host = window.location.hostname;
    if (host === 'localhost' || /^\d+\.\d+\.\d+\.\d+$/.test(host)) {
      return `http://${host}:3000/api`;
    }
    return 'https://mari-glamour-backend.onrender.com/api';
  },
};
//permite trabajar en local y en la nube netlifi (desplegada)