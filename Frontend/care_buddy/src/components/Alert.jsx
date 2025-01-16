import Swal from "sweetalert2";
import './css/alert.css'

// Function to show success alert
export const alertSuccess = (message) => {
  Swal.fire({
    icon: "success",
    title: "Success",
    text: message || "Operation was successful!",
    timer: 1800,
    timerProgressBar: true, // Enables the progress bar
    showConfirmButton: true, // Removes the OK button
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer); // Pause timer on hover
      toast.addEventListener("mouseleave", Swal.resumeTimer); // Resume timer on mouse leave
    },
  });
};

// Function to show error alert
export const alertError = (message) => {
  Swal.fire({
    icon: "error",
    title: "Error",
    text: message || "Something went wrong. Please try again.",
    showConfirmButton: true,
  });
};
