# Food ledger app

Food ledger is an application that helps you manage all your perishable and non-perishable food stocks in your household.

To use this app, you need to use [food-ledger-api](https://github.com/SHergibo/food-ledger-api) REST api at the same time. Without it you will not be able to add, update, delete or view any data.

Food ledger is a project bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Features

- Search fields that make it quick and easy to find your product
- Statistics that help you show different data about your products
- Automatically create a shopping list when you remove one or more of your products
- A member manager system that allows you to invite or kick a member in your household
- Different options to manage the sending of a warning email for products that are close to their expiration date or you shopping list
- A log system that help you see when and how many products you have added or removed from your database

## Requirements

- [npm v8.1.0+](https://www.npmjs.com/package/npm)

## Getting Started

#### 1) Clone the repo

```bash
git clone https://github.com/SHergibo/food-ledger-front.git
cd food-ledger-front
rm -rf .git
```

#### 2) Add your environments data

Rename `.env.development-sample.local` and `.env.production-sample.local` to `.env.development.local` and `.env.production.local`.

In these files, you need to add the `REACT_APP_API_DOMAIN` that you will use to call your API when using the app in development or production mode.

#### 3) Install dependencies

```bash
npm install
```

#### 4) Running the app

- Locally

```bash
npm start
```

Runs the app in the development mode.

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.

You will also see any lint errors in the console.

- In production

```bash
npm build
```

Builds the app for production to the `build` folder.<br />

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## License

[MIT License](README.md) - [Sacha Hergibo](https://github.com/SHergibo)
