import React, { useState } from "react";
import { Button, Form, Box } from "rimble-ui";


const UserForm = props => {
  const initialState = {
    name: null,
    photo: null,
    validated: true
  };

  const [formState, setFormState] = useState(initialState);

  const handleSubmit = e => {
    e.preventDefault();
    setFormState({ validated: true });

    props.handleFormSubmit(formState);
  };

  const handleValidation = e => {
    const { name, value } = e.target;

    setFormState({ ...formState, [name]: value });
    e.target.parentNode.classList.add("was-validated");
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Field label="Name" width={1}>
        <Form.Input
          type="Name"
          name="name"
          required
          width={1}
          onChange={handleValidation}
        />
      </Form.Field>
      <Form.Field validated={formState.validated} label="photo" width={1}>
        <Form.Input
          type="photo"
          name="photo"
          required
          width={1}
          onChange={handleValidation}
        />
      </Form.Field>
      <Box>
        <Form.Check label="Remember me?" mb={3} onChange={handleValidation} />
      </Box>
      <Button type="submit" width={1}>
        Sign Up
      </Button>
    </Form>
  );
};

export default UserForm;
