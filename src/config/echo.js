import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

const echo = new Echo({
  broadcaster: 'pusher',
  key: 'local', // mismo que REVERB_APP_KEY
  cluster: 'mt1', // ✅ Requerido por pusher-js (usa cualquier valor válido como 'mt1')
  wsHost: window.location.hostname,
  wsPort: 8080, // o 6001 si usas ese puerto
  forceTLS: false,
  encrypted: false,
  disableStats: true,
  enabledTransports: ['ws'],
});

export default echo;
