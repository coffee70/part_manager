import { render, screen, fireEvent, prettyDOM, waitFor } from '@testing-library/react';
import { Combobox } from './combobox';

describe('Combobox Component', () => {
    const options = ['Option 1', 'Option 2', 'Option 3'];

    // test('click input and floating element appears', () => {
    //     render(<Combobox options={options} />);
    //     const input = screen.getByRole('combobox');
    //     fireEvent.click(input);
    //     expect(screen.getByRole('listbox')).toBeInTheDocument();
    // });

    // test('tab to the input element and floating element does not appear', () => {
    //     render(<Combobox options={options} />);
    //     const input = screen.getByRole('combobox');
    //     fireEvent.keyDown(input, { key: 'Tab' });
    //     expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    // });
    
    test('click input and floating element appears with no item being active', async () => {
        render(<Combobox options={options} />);
        const input = screen.getByRole('combobox');
        fireEvent.click(input);
        
        // Wait for the options to appear
        await waitFor(() => {
            const optionsRole = screen.getAllByRole('option');
            optionsRole.forEach(option => {
                console.log(option.outerHTML); // Log the outer HTML of each option
                expect(option).toHaveAttribute('aria-selected', 'false');
            });
        });
    });

    // test('click input and floating element appears, then use arrow keys to move up and down list', () => {
    //     render(<Combobox options={options} />);
    //     const input = screen.getByRole('combobox');
    //     fireEvent.click(input);
    //     fireEvent.keyDown(input, { key: 'ArrowDown' });
    //     expect(screen.getByRole('option', { name: 'Option 1' })).toHaveAttribute('aria-selected', 'true');
    //     fireEvent.keyDown(input, { key: 'ArrowDown' });
    //     expect(screen.getByRole('option', { name: 'Option 2' })).toHaveAttribute('aria-selected', 'true');
    //     fireEvent.keyDown(input, { key: 'ArrowUp' });
    //     expect(screen.getByRole('option', { name: 'Option 1' })).toHaveAttribute('aria-selected', 'true');
    // });

    // test('arrow keys loop the list once you pass the bottom or top', () => {
    //     render(<Combobox options={options} />);
    //     const input = screen.getByRole('combobox');
    //     fireEvent.click(input);
    //     fireEvent.keyDown(input, { key: 'ArrowDown' });
    //     fireEvent.keyDown(input, { key: 'ArrowDown' });
    //     fireEvent.keyDown(input, { key: 'ArrowDown' });
    //     fireEvent.keyDown(input, { key: 'ArrowDown' });
    //     expect(screen.getByRole('option', { name: 'Option 1' })).toHaveAttribute('aria-selected', 'true');
    //     fireEvent.keyDown(input, { key: 'ArrowUp' });
    //     fireEvent.keyDown(input, { key: 'ArrowUp' });
    //     fireEvent.keyDown(input, { key: 'ArrowUp' });
    //     fireEvent.keyDown(input, { key: 'ArrowUp' });
    //     expect(screen.getByRole('option', { name: 'Option 3' })).toHaveAttribute('aria-selected', 'true');
    // });

    // test('the value is undefined and you type something in that is not an option, the input text should go back to empty string', () => {
    //     render(<Combobox options={options} />);
    //     const input = screen.getByRole('combobox');
    //     fireEvent.change(input, { target: { value: 'Non-existent' } });
    //     fireEvent.blur(input);
    //     expect(input).toHaveValue('');
    // });

    // test('the value is one of the options and you type something in that is not an option, the input text should go back to the value', () => {
    //     render(<Combobox options={options} value="Option 1" />);
    //     const input = screen.getByRole('combobox');
    //     fireEvent.change(input, { target: { value: 'Non-existent' } });
    //     fireEvent.blur(input);
    //     expect(input).toHaveValue('Option 1');
    // });
});