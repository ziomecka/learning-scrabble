/* jshint esversion: 6 */
// TODO add off events
const reqCookies = options => {
  let {events, socket} = options;
  events.forEach(event => socket.emit(event.name, event.data));
  events = null;
  socket = null;
};

const resCookies = options => {
  // let {event, callback, socket} = options;
  options.socket.on(options.event, data => {
    if (options.callback) {
      options.callback(data);
    }
    // socket = null;
    // callback = null;
  });
};

const listenCookies = options => {
  let {events, socket} = options;
  events.forEach(event => resCookies({
    event: event.name,
    callback: event.callback,
    socket: socket
  }));
  events = null;
  socket = null;
};

const stopListenCookies = options => {
  let {events, socket} = options;
  events.forEach(event => {
    socket.removeAllListeners(event);
  });
};

const sendCookies =  options => {
  let {event, socket, cookies, time = 60 * 60 * 24 * 7, path = "/"} = options;
  cookies.forEach(cookie => {
    cookie.time = time;
    cookie.path = path;
  });
  socket.emit(event, cookies);
};

const destroy = () => {
  stopListenCookies();
  socket = null;
  io = null;
};

module.exports = {
  resCookies: resCookies,
  reqCookies: reqCookies,
  listenCookies: listenCookies,
  stopListenCookies: stopListenCookies,
  sendCookies: sendCookies
};
