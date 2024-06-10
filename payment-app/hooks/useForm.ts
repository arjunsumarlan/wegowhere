import { useState } from 'react';

export const useForm = <T extends {}>(initialState: T) => {
  const [formState, setFormState] = useState(initialState);

  const handleChange = (name: keyof T, value: any) => {
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormState(initialState);
  };

  return { formState, handleChange, resetForm };
};