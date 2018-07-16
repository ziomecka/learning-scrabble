/* jshint esversion: 6 */
const maps = new Map([
  ["rooms", new Map()]
])

const accessMap = (m = "rooms") => {
  const listDetails = () => {
    let map = maps.get(m);
    Array.from(map.values());
    map = null;
  }

  const getOne = id => {
    // console.log("map result herer: " + JSON.stringify(maps.get(m).get(String(id))));
    return maps.get(m).get(String(id));
  };

  const setOne = data => {
    if (maps.get(m).set(String(data[0]), data[1])) {
      return data[1];
    }
    else {
      return false;
    }
  }

  const getProperty = property => {
    return Array
    .from(maps.get(m).values())
    .map(item => {
      return {
        id: item.id,
        [property]: item[property]
      };
    });
  };

  const listIds = () => {
    Array.from(maps.get(m).keys());
  }

  return {
    listIds: listIds,
    listDetails: listDetails,
    getProperty: data => getProperty(data),
    getOne: data => getOne(data),
    setOne: data => setOne(data)
  };
};

module.exports = accessMap;
