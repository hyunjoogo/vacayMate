import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import RequestPage from "./RequestPage.tsx";

describe("RequestPage", () => {
  beforeEach(() => {
    render(<RequestPage />);
  });

  test("displays the initial state correctly", () => {
    expect(screen.getByText("연차 : 31 / 31")).toBeInTheDocument();
    expect(screen.getByText("여름휴가 : 5 / 5")).toBeInTheDocument();
    expect(screen.getByText("대체휴무 : 3 / 3")).toBeInTheDocument();
  });

  test("adds a new request when the add button is clicked", () => {
    const vacationSelect = screen.getByLabelText("휴가 유형");
    const usageTypeSelect = screen.getByLabelText("사용 유형");
    const startDateInput = screen.getByLabelText("시작날짜");
    const endDateInput = screen.getByLabelText("종료일");
    const addButton = screen.getByText("+");

    fireEvent.change(vacationSelect, { target: { value: "연차" } });
    fireEvent.change(usageTypeSelect, { target: { value: "오전반차" } });
    fireEvent.change(startDateInput, { target: { value: "2023-05-12" } });
    fireEvent.change(endDateInput, { target: { value: "2023-05-12" } });
    fireEvent.click(addButton);

    const 추가된요청 = screen.getByText(/연차 - 오전반차 : 0.5/i);
    expect(추가된요청).toBeInTheDocument();
  });

  test("removes a request when the remove button is clicked", () => {
    const vacationSelect = screen.getByLabelText("휴가 유형");
    const usageTypeSelect = screen.getByLabelText("사용 유형");
    const startDateInput = screen.getByLabelText("시작날짜");
    const endDateInput = screen.getByLabelText("종료일");
    const addButton = screen.getByText("+");

    fireEvent.change(vacationSelect, { target: { value: "연차" } });
    fireEvent.change(usageTypeSelect, { target: { value: "오전반차" } });
    fireEvent.change(startDateInput, { target: { value: "2023-05-12" } });
    fireEvent.change(endDateInput, { target: { value: "2023-05-12" } });
    fireEvent.click(addButton);

    fireEvent.change(vacationSelect, { target: { value: "연차" } });
    fireEvent.change(usageTypeSelect, { target: { value: "오전반차" } });
    fireEvent.change(startDateInput, { target: { value: "2023-05-12" } });
    fireEvent.change(endDateInput, { target: { value: "2023-05-12" } });
    fireEvent.click(addButton);

    const 추가된요청 = screen.getByText(/연차 - 오전반차 : 0.5/i);
    expect(추가된요청).toBeInTheDocument();

    const removeButton = screen.getByText("X");
    fireEvent.click(removeButton);
    expect(추가된요청).not.toBeInTheDocument();
  });
});
