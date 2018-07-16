/* jshint esversion: 6 */
const factory = () => {
  let modals = [];

  const add = modal => {
    modals.push(modal);
  };

  const remove = id => {
    modals = modals.filter(item => {
      return item.id !== id;
    });
  };

  const find = id => {
    // improve TODO
    return modals.find(item => item.id === id);
  };

  const open = options => {
    let {id, message} = options;
    find(id).open(message);
  };

  const close = id => {
    find(id).close();
  };

  return {
    add: add,
    remove: remove,
    open: open,
    close: close
  };
};

angular // eslint-disable-line no-undef
  .module("modalsModule")
  .factory("modalsFactory", factory);
