import algoliasearch from "algoliasearch";

const client = algoliasearch(
    process.env.ALGOLIA_APP_ID,
    process.env.ALGOLIA_ADMIN_API_KEY);
    
const productIndex = client.initIndex("products");

async function addOrUpdateProduct(product) {
  const record = {
    objectID: product._id.toString(),
    ...product,
  };
  return productIndex.saveObject(record);
}

async function deleteProduct(productId) {
  return productIndex.deleteObject(productId);
}

async function bulkDelete(productIds) {
    if (!productIds.length) return;
  await productIndex.deleteObjects(productIds.map(id => id.toString()));
  console.log(`🗑️ Deleted ${productIds.length} products from Algolia`);
}


module.exports= {
    addOrUpdateProduct,
    deleteProduct,
    bulkDelete,
}