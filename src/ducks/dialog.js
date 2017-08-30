const initialState = {
 data: null
};

const SET_POPUP = 'SET_POPUP';

const dialogReducer = (state = initialState, action) => {
 switch (action.type) {
   case SET_POPUP:
     return {
       data: action.dialog
     };
   default:
     return state;
 };
};

const toggleDialog = (dialog) => {
 return (dispatch) => {
   dispatch({
     type: SET_POPUP,
     dialog,
   });
 };
};

export default dialogReducer;

export {
 toggleDialog
};
