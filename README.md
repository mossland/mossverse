# Mossverse (Mossland Metaverse)
![Metavers](https://user-images.githubusercontent.com/109493423/196594917-b7e0ed27-6474-49fa-91cf-5a44ab2eeb03.png)

This is the Mossland’s metaverse project ‘Mossverse’ Repository. Mossland is a blockchain-based metaverse project that connects the real and virtual worlds, pursuing the realization of a hyper-connected world.
Mossverse is being developed as an open source, and anyone can participate in the suggestion and development of ideas.

## Overview of Mossverse

Users accumulate Points (PT) through various contents provided within Mossverse and receive rewards according to their scores. The rewards will be NFT (Non-fungible Token) and MetaMOC (MM).

- Currency system: Two types of currency are provided: Point (PT) and MetaMOC (MM).
  - Point (PT): The score resets to 0 every Monday, and you can accumulate points through the game.
  - MetaMOC (MM): A virtual currency in Metaverse that is exchanged 1:1 with MOC.
    
- User authentication system: Supports login through metamask.
    - The Luniverse chain, not Metamask's Ethereum chain, must be linked.
    - Automatically registers Luniverse Address as the ID in Database when logging in.
    
- User Profile Page
  - Kaikas wallet integration: You can map one Klaytn address to one Luniverse address.
  - Provides basic user information management functions such as nickname change.
  
- Buildings in the metaverse space: Various functions in the metaverse are implemented as buildings.
  - Polling Place: This is the building where the voting function of Mossland DAO is implemented.
    - View voting list and details
      - View ongoing, closed, and scheduled votes
      - View the details of ongoing, closed, and scheduled votes
      - Closed votes are displayed as closed, open votes are displayed as ongoing.
    - Voting function
      - Check ownership of MOC in the wallet
      - Discrimination in the number of votes exercised according to the number of MOC owned
      - Vote by calling the voting function on the voting contract on the Luniverse chain with connected Metamask wallet

  - Marketplace: A building where users purchase or trade virtual goods.
    - Exchange: MM and MOC exchange
      - Withdrawal: Deduct the MM the user has and withdraw MOC to the user's Luniverse wallet
      - Deposit: When you deposit MOC, MM is credited
    - Purchase: Purchase Gifticons and NFTs with MM
      - Gifticons (Gift + Emoticons, used alot in Korea to send gifts online)
      - NFT
        -Luniverse NFTs
        - Klaytn NFT: Klaytn NFT can only be purchased by users who have connected their Klaytn wallet address
    - Airdrop: For airdrop events
      - Luniverse NFT drop request
      - Klaytn NFT drop request
      
  - NFT P2P Marketplace: A building where P2P NFT transactions between users take place, and the payment currency is MM.
    - Types: Klaytn, Luniverse NFT
    - Purchase NFTs
    
- Dapp (Mini-game): Various contents in the metaverse are implemented as Dapp (Mini-game) and are expressed as buildings in the metaverse.
  - The goal is to develop and supply various contents as open source in Mossverse through the Mossverse Hackathon. Hackathons are held on the public GitHub Repository, where anyone can propose ideas and participate in development. [GitHub - mossland/Hackathon] (https://github.com/mossland/Hackathon)
   - For each Dapp or mini-game added, a new building is created.
   - Depending on the result of the game, PT is accumulated to the user.

- Inventory system: ERC-20, volatility point, Internal Currencies function

![image](https://user-images.githubusercontent.com/38033515/182839903-560fdbe9-d146-480d-8298-e6a5d4d2fe25.png)

![image](https://user-images.githubusercontent.com/38033515/182496602-1d910539-8e58-4d5a-8a2e-e2381e4b2625.png)


## Architecture

### MonoRepo

![image](https://user-images.githubusercontent.com/4978617/183641614-2a5562a6-1bf3-48c5-b04a-a38a00984628.png)


## Mossverse Development Milestones
(Development status as of August 9, 2022)
| Type | Name | Date |
| - | - | - |
| Task | Mosscoin Currency | August 4, 2022 |
| Sub Task | Moss Coin Linked Items | August 4, 2022 |
| Dev Ticket | Add Moss Coin Item from Admin Page | August 4, 2022 |
| Dev Ticket | client Load Moss Coin Item | August 4, 2022 |
| Sub Task | Items in the Metaverse | August 4, 2022 |
| Dev Ticket | Add MetaMoss Coin Item from Admin Page | August 4, 2022 |
| Dev Ticket | client Import MetaMoss Coin Item | August 4, 2022 |
| Task | point system | August 4, 2022 |
| Sub Task | Add point function | August 4, 2022 |
| Dev Ticket | Add points item from admin page | August 4, 2022 |
| Dev Ticket | client Import Moss Coin point items | August 4, 2022 |
| Sub Task | Point Reset | August 12, 2022 |
| Dev Ticket | Create batch to initialize points after one week | August 12, 2022 |
| Sub Task | Point Reward System | August 12, 2022 |
| Dev Ticket | Point rerender on game completion | August 12, 2022 |
| Task | login system | August 12, 2022 |
| Sub Task | metamask Luniverse Login | August 12, 2022 |
| Dev Ticket | metamask Luniverse network check | August 12, 2022 |
| Dev Ticket | Metamask Luniverse integration | August 12, 2022 |
| Task | Profile | August 19, 2022 |
| Sub Task | Profile Interface Implementation | August 19, 2022 |
| Dev Ticket | Profile UI Implementation | August 19, 2022 |
| Dev Ticket | Open Profile UI Implementation | August 19, 2022 |
| Sub Task | Kaikas wallet linkage | August 19, 2022 |
| Dev Ticket | Implementation of additional UI for Kaikas Wallet | August 19, 2022 |
| Dev Ticket | Implementing Kaikas Wallet Add-Ons | August 19, 2022 |
| Sub Task | Nickname Change | August 19, 2022 |
| Dev Ticket | Implementation of nickname change function | August 19, 2022 |
| Dev Ticket | Money consumption when changing a nickname? | August 19, 2022 |
| Dev Ticket | Implementation of nickname change UI | August 19, 2022 |
| Task | polling place | August 19, 2022 |
| Dev Ticket | Display web view | August 19, 2022 |
| Dev Ticket | Voting function linkage | August 12, 2022 |
| Dev Ticket | Implementation of separate page for polling places | August 12, 2022 |
| Dev Ticket | Voting List Simple View Implementation | August 12, 2022 |
| Dev Ticket | Voting Details View UI Implementation | August 12, 2022 |
| Dev Ticket | Implementation of voting function | August 12, 2022 |
| Task | currency exchange | August 19, 2022 |
| Sub Task | Coin exchange function | August 19, 2022 |
| Dev Ticket | Create a Moss Coin Savings Contract | August 19, 2022 |
| Dev Ticket | Contract to give currency as much as imported | August 19, 2022 |
| Sub Task | Product purchase function | August 19, 2022 |
| Sub Task | User-to-user token trading function | August 19, 2022 |

# MosslandMetaverse

This project was generated using [Nx](https://nx.dev).

<p style="text-align: center;"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="450"></p>

🔎 **Smart, Fast and Extensible Build System**

## Adding capabilities to your workspace

Nx supports many plugins which add capabilities for developing different types of applications and different tools.

These capabilities include generating applications, libraries, etc as well as the devtools to test, and build projects as well.

Below are our core plugins:

- [React](https://reactjs.org)
  - `npm install --save-dev @nrwl/react`
- Web (no framework frontends)
  - `npm install --save-dev @nrwl/web`
- [Angular](https://angular.io)
  - `npm install --save-dev @nrwl/angular`
- [Nest](https://nestjs.com)
  - `npm install --save-dev @nrwl/nest`
- [Express](https://expressjs.com)
  - `npm install --save-dev @nrwl/express`
- [Node](https://nodejs.org)
  - `npm install --save-dev @nrwl/node`

There are also many [community plugins](https://nx.dev/community) you could add.

## Generate an application

Run `nx g @nrwl/react:app my-app` to generate an application.

> You can use any of the plugins above to generate applications as well.

When using Nx, you can create multiple applications and libraries in the same workspace.

## Generate a library

Run `nx g @nrwl/react:lib my-lib` to generate a library.

> You can also use any of the plugins above to generate libraries as well.

Libraries are shareable across libraries and applications. They can be imported from `@mossland-metaverse/mylib`.

## Development server

Run `nx serve my-app` for a dev server. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `nx g @nrwl/react:component my-component --project=my-app` to generate a new component.

## Build

Run `nx build my-app` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `nx test my-app` to execute the unit tests via [Jest](https://jestjs.io).

Run `nx affected:test` to execute the unit tests affected by a change.

## Running end-to-end tests

Run `nx e2e my-app` to execute the end-to-end tests via [Cypress](https://www.cypress.io).

Run `nx affected:e2e` to execute the end-to-end tests affected by a change.

## Understand your workspace

Run `nx graph` to see a diagram of the dependencies of your projects.

## Further help

Visit the [Nx Documentation](https://nx.dev) to learn more.



## ☁ Nx Cloud

### Distributed Computation Caching & Distributed Task Execution

<p style="text-align: center;"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-cloud-card.png"></p>

Nx Cloud pairs with Nx in order to enable you to build and test code more rapidly, by up to 10 times. Even teams that are new to Nx can connect to Nx Cloud and start saving time instantly.

Teams using Nx gain the advantage of building full-stack applications with their preferred framework alongside Nx’s advanced code generation and project dependency graph, plus a unified experience for both frontend and backend developers.

Visit [Nx Cloud](https://nx.app/) to learn more.
