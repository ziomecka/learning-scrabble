require("../mongo.crud").createCollection({
  collection: "scrabble"
})
.then(() => {
  console.log("Collection scrabble created.");
})
.catch(err => {
  console.log(`Failed to create collection ${err}.`);
})
