interface FormState {
  selectedVehicle: { id: number; name: string; mileageBefore: number };

  gasStationValue: string;
  gasStationValid: boolean | null;

  selectedFuelType: { id: number; name: string };

  pricePerLiterValue: number;
  pricePerLiterValid: boolean | null;

  capacityValue: number;
  capacityValid: boolean | null;

  mileageAfterValue: number;
  mileageAfterValid: boolean | null;

  buyDateValue: string;
  buyDateValid: boolean | null;
}

type FormAction =
  | {
      type: 'SET_VEHICLE';
      value: { id: number; name: string; mileageBefore: number };
    }
  | { type: 'SET_GAS_STATION'; value: string }
  | { type: 'SET_FUEL_TYPE'; value: { id: number; name: string } }
  | { type: 'SET_LITER_PRICE'; value: number }
  | { type: 'SET_CAPACITY'; value: number }
  | { type: 'SET_MILEAGE_AFTER'; value: number }
  | { type: 'SET_BUY_DATE'; value: string }
  | { type: 'RESET_STATE' };

export const defaultData = {
  selectedVehicle: { id: -1, name: '', mileageBefore: -1 },

  gasStationValue: '',
  gasStationValid: null,

  selectedFuelType: { id: -1, name: '' },

  pricePerLiterValue: -1,
  pricePerLiterValid: null,

  capacityValue: -1,
  capacityValid: null,

  mileageAfterValue: -1,
  mileageAfterValid: null,

  buyDateValue: '',
  buyDateValid: null,
};

export const formReducer = (state: FormState, action: FormAction) => {
  switch (action.type) {
    case 'SET_VEHICLE':
      return {
        ...state,
        selectedVehicle: {
          id: action.value.id,
          name: action.value.name,
          mileageBefore: action.value.mileageBefore,
        },
      };
    case 'SET_GAS_STATION':
      return {
        ...state,
        gasStationValue: action.value.trim(),
        gasStationValid: action.value.length > 0,
      };
    case 'SET_LITER_PRICE':
      return {
        ...state,
        pricePerLiterValue: action.value,
        pricePerLiterValid: action.value > 0,
      };
    case 'SET_CAPACITY':
      return {
        ...state,
        capacityValue: action.value,
        capacityValid: action.value > 0,
      };
    case 'SET_MILEAGE_AFTER':
      return {
        ...state,
        mileageAfterValue: action.value,
        mileageAfterValid: action.value > state.selectedVehicle.mileageBefore,
      };
    case 'SET_BUY_DATE':
      return {
        ...state,
        buyDateValue: action.value.trim(),
        buyDateValid: action.value.length === 10,
      };
    case 'SET_FUEL_TYPE':
      return {
        ...state,
        selectedFuelType: { id: action.value.id, name: action.value.name },
      };
    case 'RESET_STATE':
      return defaultData;
    default:
      return state;
  }
};
