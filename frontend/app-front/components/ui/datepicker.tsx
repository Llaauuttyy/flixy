import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  DatePicker as DatePickerPrimitive,
  type DatePickerProps as DatePickerPropsPrimitive,
  type DatePickerSlotProps,
} from "@mui/x-date-pickers/DatePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

const defaultSlotProps: DatePickerSlotProps<true> = {
  textField: {
    variant: "outlined",
    size: "small",
    InputLabelProps: {
      sx: {
        color: "#cbd5e1",
      },
    },
    InputProps: {
      sx: {
        color: "#ffffff",
        "& .MuiSvgIcon-root": {
          color: "#ffffff",
        },
      },
    },
    sx: {
      "& .MuiOutlinedInput-root": {
        "& fieldset": {
          borderColor: "#cbd5e1",
        },
        "&:hover fieldset": {
          borderColor: "#cbd5e1",
        },
        "&.Mui-focused fieldset": {
          borderColor: "#cbd5e1",
        },
      },
      "& .MuiInputLabel-root": {
        color: "#cbd5e1",
      },
    },
  },
  popper: {
    disablePortal: true,
  },
};

const DatePicker = (props: DatePickerPropsPrimitive) => {
  const slotProps: DatePickerSlotProps<true> = props.slotProps
    ? props.slotProps
    : defaultSlotProps;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={["DatePicker"]}>
        <DatePickerPrimitive {...props} slotProps={slotProps} />
      </DemoContainer>
    </LocalizationProvider>
  );
};

DatePicker.displayName = "DatePicker";

export { DatePicker };
