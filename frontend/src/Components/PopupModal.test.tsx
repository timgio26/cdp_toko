import { expect, test} from 'vitest'
import { render,screen} from "@testing-library/react";
import { PopupModal } from './PopupModal';
// import userEvent from "@testing-library/user-event";


test("test confirm button",async()=>{
  render(<PopupModal visible={true}>
    <p>test</p>
  </PopupModal>)
  expect(screen.getByTestId("confirmButton").textContent).toBe("Confirm")
})
