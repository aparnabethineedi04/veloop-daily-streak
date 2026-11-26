import coins from '../assets/coins.png';
import gift from '../assets/gift-small.png';
import amazon from '../assets/amazon-card.png';
import crown from '../assets/crown-small.png';

// The backend sends an asset *identifier*; the static image lives in the frontend.
export const REWARD_ASSETS = { coin: coins, gift, 'gift-card': amazon, crown };
export const assetFor = (type) => REWARD_ASSETS[type] || coins;
