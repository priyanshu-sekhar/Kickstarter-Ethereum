import web3 from "./web3";
import campaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
    JSON.parse(campaignFactory.interface),
    '0xf2c185C98C2e381653ef41a10d8E67171c5dbf00'
);

export default instance;
