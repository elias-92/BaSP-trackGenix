import { getTimeSheetsError, getTimeSheetsPending, getTimeSheetsSuccess } from './actions';

export const getTimesheets = () => {
  return async (dispatch) => {
    dispatch(getTimeSheetsPending());
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/timesheets`);
      const json = await response.json();
      if (json.error) {
        dispatch(getTimeSheetsError(json.message));
      } else {
        dispatch(getTimeSheetsSuccess(json.data));
      }
    } catch (error) {
      dispatch(getTimeSheetsError(error.toString()));
    }
  };
};
