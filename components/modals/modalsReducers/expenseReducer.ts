interface FormState {
  selectedVehicle: { id: number; name: string };

  nameValue: string;
  nameValid: boolean | null;

  expenseType: { id: number; name: string };

  priceValue: number;
  priceValid: boolean | null;

  dateValue: string;
  dateValid: boolean | null;
}

type FormAction =
  | { type: 'SET_VEHICLE'; value: { id: number; name: string } }
  | { type: 'SET_EXPENSE_NAME'; value: string }
  | { type: 'SET_EXPENSE_TYPE'; value: { id: number; name: string } }
  | { type: 'SET_PRICE'; value: number }
  | { type: 'SET_DATE'; value: string }
  | { type: 'RESET_STATE' };

export const expenseReducer = (state: FormState, action: FormAction) => {
  switch (action.type) {
    case 'SET_VEHICLE':
      return {
        ...state,
        selectedVehicle: action.value,
      };
    case 'SET_EXPENSE_NAME':
      return {
        ...state,
        nameValue: action.value.trim(),
        nameValid: action.value.trim().length > 0,
      };
    case 'SET_EXPENSE_TYPE':
      return {
        ...state,
        expenseType: action.value,
      };
    case 'SET_PRICE':
      return {
        ...state,
        priceValue: action.value,
        priceValid: action.value > 0,
      };
    case 'SET_DATE':
      return {
        ...state,
        dateValue: action.value.trim(),
        dateValid: action.value.trim().length === 10,
      };
    case 'RESET_STATE':
      return {
        selectedVehicle: { id: -1, name: '' },

        nameValue: '',
        nameValid: null,

        expenseType: { id: -1, name: '' },

        priceValue: -1,
        priceValid: null,

        dateValue: '',
        dateValid: null,
      };
    default:
      return state;
  }
};
