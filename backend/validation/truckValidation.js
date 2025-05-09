export const validateTruckInput = (data) => {
    const errors = {};
    let isValid = true;
  
    if (!data.licensePlate || !/^[A-Z0-9]{6,8}$/.test(data.licensePlate)) {
      errors.licensePlate = 'Invalid or missing license plate';
      isValid = false;
    }
  
    if (!data.make) {
      errors.make = 'Make is required';
      isValid = false;
    }
  
    if (!data.model) {
      errors.model = 'Model is required';
      isValid = false;
    }
  
    if (!data.capacity || data.capacity < 1000 || data.capacity > 40000) {
      errors.capacity = 'Capacity must be between 1000 and 40000';
      isValid = false;
    }
  
    return { errors, isValid };
  };
  