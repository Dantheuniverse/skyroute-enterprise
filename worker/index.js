import { handleRequest } from './router.js';

export default {
  async fetch(request, env) {
    return handleRequest(request, env);
  }
};
