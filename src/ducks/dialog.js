const initialState = {
 data: null,
 enableResize: true
};

const SET_POPUP = 'SET_POPUP';

const dialogReducer = (state = initialState, action) => {
 switch (action.type) {
   case SET_POPUP:
     return {
       data: action.dialog,
       enableResize: action.resize
     };

   default:
     return state;
 };
};

const toggleDialog = (dialog, resize = true) => {
 return (dispatch) => {
   dispatch({
     type: SET_POPUP,
     dialog,
     resize
   });
 };
};

export default dialogReducer;

export {
 toggleDialog
};
