/* jshint esversion: 6 */
const accessMap = map => {

  const listDetails = () => Array.from(map.values());

  const getOne =  id => map.get(id);

  const getProperty = property => {
    Array
    .from(map.values())
    .map(item => {
      return {
        id: item.id,
        [property]: item[property]
      };
    });
  };

  const listIds = () => Array.from(map.keys());

  return {
    listIds: listIds,
    listDetails: listDetails,
    getProperty: getProperty,
    getOne: getOne
  };
};

module.exports = accessMap;
