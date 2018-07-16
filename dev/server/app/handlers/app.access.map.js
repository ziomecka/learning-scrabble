/* jshint esversion: 6 */
const accessMap = map => {

  const listDetails = () => Array.from(map.values());

  const getOne =  id => map.get(id);

  // const setProperty = property => {
  //   if (map.set(property.name, property.value)) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }

  const getProperty = property => {
    return Array
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
    getOne: getOne,
    // setProperty: setProperty
  };
};

module.exports = accessMap;
