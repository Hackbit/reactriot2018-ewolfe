import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Form from "../src/index";

const NAME = "input";

const dataReader = jest.fn();
const handleBlur = jest.fn();
const handleChange = jest.fn();
const handleChangeWithData = jest.fn();
const handleFocus = jest.fn();
const handleReset = jest.fn();
const handleResetWithData = jest.fn();
const handleSubmit = jest.fn();
const handleSubmitWithData = jest.fn();

beforeEach(() => {
  dataReader.mockReset();
  handleBlur.mockReset();
  handleChange.mockReset();
  handleChangeWithData.mockReset();
  handleFocus.mockReset();
  handleReset.mockReset();
  handleResetWithData.mockReset();
  handleSubmit.mockReset();
  handleSubmitWithData.mockReset();
});

test("Focus handling", async done => {
  const handleData = state => {
    try {
      if (state.touched[NAME]) dataReader("TOUCHED");
      else dataReader("UNTOUCHED");
    } catch (error) {
      // drop it
    }
  };

  const { getByLabelText, getByText } = render(
    <Form onData={handleData}>
      <label htmlFor={NAME}>
        Input here
        <input id={NAME} name={NAME} type="text" />
      </label>

      <button type="reset">Reset</button>
    </Form>
  );

  const input = getByLabelText(/input here/i);
  const reset = getByText("Reset");

  await fireEvent.focus(reset);

  expect(dataReader).toHaveBeenLastCalledWith("UNTOUCHED");

  await fireEvent.focus(input);
  await userEvent.tab();

  expect(dataReader).toHaveBeenLastCalledWith("TOUCHED");

  await userEvent.click(reset);

  // a setTimeout is used to make sure reset handling for all elements has finalized
  // this makes the reset button an asyncronous action
  await waitFor(() => expect(dataReader).toHaveBeenLastCalledWith("UNTOUCHED"));

  done();
});
