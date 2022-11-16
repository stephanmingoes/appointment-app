export enum UserType {
  PATIENT = "PATIENT",
  DOCTOR = "DOCTOR",
}

export enum Status {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
}
export type User = {
  name: string;
  email: string;
  type: UserType;
  password: string;
  ip: string;
  birthday: Date;
  about: string;
};

export type Appointment = {
  doctor: string;
  patient: string;
  description: string;
  to: Date;
  from: Date;
  status: Status;
};

export type ResponseData = {
  message: string;
  data?: string | {};
};
