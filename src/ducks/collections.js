const SELECT_COLLECTION = 'SELECT_COLLECTION';

// Reducer
const initialState = {
  selectedCollections: []
};

const collectionsReducer = (state = initialState, action) => {
 switch (action.type) {

   case SELECT_COLLECTION:
     return {
       selectedCollections: action.collection,
     };

   default:
     return state;
 };
};

const selectCollection = (collection) => {
 return (dispatch) => {
   dispatch({
     type: SELECT_COLLECTION,
     collection,
   });
 };
};

export default collectionsReducer;

export {
 selectCollection
};
