import Web3 from "web3";

let web3;

if (typeof window !== "undefined" && typeof window.web3 !== "undefined") {
    // we are in the browser and metamask is running
    web3 = new Web3(window.web3.currentProvider);
} else  {
    // we are on the server <OR> the user is not using metamask
    const provider = new Web3.providers.HttpProvider(
        'https://rinkeby.infura.io/v3/09023b67f1bd45d5baf6f394341822a3'
    );
    web3 = new Web3(provider);
}
export default web3;