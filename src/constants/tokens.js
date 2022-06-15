import bamboo_logo from '../assets/tokens/bamboo.png'
import bnb_logo from '../assets/tokens/bnb.png'
import spnd_logo from '../assets/tokens/panda.png'
import wow_logo from '../assets/tokens/wow.png'

export const Tokens = {
    'BNB': {
        name: 'BNB',
        symbol: 'BNB',
        address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
        pair_address: '0x1B96B92314C44b159149f7E0303511fB2Fc4774f',
        decimals: 18,
        amount: '',
        color: '#EBA10F',
        logo: bnb_logo,
    },
    'SPND': {
        name: 'SafePanda',
        symbol: 'SPND',
        address: '0x75e3CF3DC6748ff6c92FE77646bE7d2fdFdFA623',
        pair_address: '0xfbF772E5497f1Dd5bF2a002F079b267EcfDfbbAB',
        decimals: 9,
        amount: '',
        color: '#7CF4D7',
        pcs: 1,
        slippage: 8,
        logo: spnd_logo,
        stake: 1
    },
    'BMBO': {
        name: 'Bamboo',
        symbol: 'BMBO',
        address: '0x4510e3ac69574f3dfdb43139e97773b542c386e1',
        pair_address: '0x47aeCb9A19712eACa2d90D6bedee4590323448cD',
        decimals: 9,
        amount: '',
        color: '#C654F3',
        pcs: 2,
        slippage: 11,
        logo: bamboo_logo,
        stake: 2,
        reward: true
    },
    'WOW': {
        name: 'World of Waves',
        symbol: 'WOW',
        address: '0x31353e2826cc4402735e55a175a75ce2569b4226',
        pair_address: '0xA6769994dbA50619c534DF1eB5ab032E032e84b3',
        decimals: 9,
        amount: '',
        color: '#0ACEFE',
        pcs: 2,
        slippage: 11,
        logo: wow_logo,
        reward: true
    }
}

export const TokenList = [
    Tokens.BNB, Tokens.SPND, Tokens.BMBO, Tokens.WOW,
]
