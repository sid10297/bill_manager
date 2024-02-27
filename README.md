# Bill Manager

Welcome to the Bill Manager project! This application helps you manage customers and create bills for them.

## Features

- Admin Login
- Create and Edit Customers
- Create and Update Bills for Customers
- Rich Text Editor

## Installation

1. Clone this repository to your local machine.
2. Install the required dependencies using `yarn`.
3. Start the application with `yarn dev`.

## Usage

1. Open the app in your browser.
2. Add your customers.
3. Create bills for the customers.
4. View all the bills in the Bills page.

## Known Bugs
- The Snackbar, in certain scenarios, shows the previous error message. It is because errors are not handled properly by useAPI Hook.

## Improvements

- Snackbar errors issue can easily be fixed by react-query.
- Use form validation libraries like yup along with react-form-hook.

