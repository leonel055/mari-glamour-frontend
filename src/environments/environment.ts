export const environment = {
  get apiBase(): string {
    const host = window.location.hostname;
    return `http://${host}:3000/api`;
  },
};
