export type MeasurementType =
  | "LengthUnit"
  | "WeightUnit"
  | "VolumeUnit"
  | "TemperatureUnit";

export type OperationType =
  | "convert"
  | "compare"
  | "add"
  | "subtract"
  | "divide";

export interface AuthResponse {
  token: string;
}

export interface QuantityDTO {
  value: number;
  unit: string;
  measurementType: MeasurementType;
}

export interface QuantityInputDTO {
  thisQuantityDTO: QuantityDTO;
  thatQuantityDTO: QuantityDTO;
  targetUnitDTO?: QuantityDTO | null;
}

export interface QuantityMeasurementDTO {
  operation: string;
  resultValue: number | null;
  resultUnit: string | null;
  resultMeasurementType: string | null;
  resultString: string | null;
  isError: boolean;
}