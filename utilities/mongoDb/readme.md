### MongoDB Class Function Descriptions

#### `connect()`
- **Description:** Connects to the MongoDB database.
- **Input:** None.
- **Output:** Returns an object indicating the success of the connection.
- **Error Handling:** Throws an error if the connection fails.

#### `disconnect()`
- **Description:** Disconnects from the MongoDB database.
- **Input:** None.
- **Output:** None.
- **Error Handling:** Does not throw an error.

#### `find(collectionName, query, options = {})`
- **Description:** Finds multiple documents in a collection based on a query.
- **Input:**
    - `collectionName`: The name of the collection to search.
    - `query`: The query object.
    - `options`: (Optional) Query options.
- **Output:** Returns an array of found documents.
- **Error Handling:** Does not throw an error.

#### `findOne(collectionName, query, options = {})`
- **Description:** Finds a single document in a collection based on a query.
- **Input:**
    - `collectionName`: The name of the collection to search.
    - `query`: The query object.
    - `options`: (Optional) Query options.
- **Output:** Returns a single found document.
- **Error Handling:** Does not throw an error.

#### `findOneAndUpdate(collectionName, query, update, options = {})`
- **Description:** Updates a single document in a collection based on a query.
- **Input:**
    - `collectionName`: The name of the collection to update.
    - `query`: The query object.
    - `update`: The update object.
    - `options`: (Optional) Update options.
- **Output:** Returns the updated document.
- **Error Handling:** Does not throw an error.

#### `deleteOne(collectionName, query, options = {})`
- **Description:** Deletes a single document from a collection based on a query.
- **Input:**
    - `collectionName`: The name of the collection to delete from.
    - `query`: The query object.
    - `options`: (Optional) Delete options.
- **Output:** Returns an object indicating the result of the delete operation.
- **Error Handling:** Does not throw an error.
- 

#### `verifyFields(collectionName, query, fields)`
- **Description:** Verifies specified fields in a document based on a query.
- **Input:**
  - `collectionName`: The name of the collection to search.
  - `query`: The query object.
  - `fields`: The fields to verify in the document.
- **Output:** Returns `true` if all specified fields match the expected values.
- **Error Handling:** Throws an error if no document is found or if any field does not match the expected value.
