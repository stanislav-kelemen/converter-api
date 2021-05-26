import API from './apiConstants';
import populate from '../libs/populate-lib';
import axios from 'axios';

interface Currency {
  date: string;
  bid: string;
  ask: string;
}

interface CurrencyProcessed {
  cash: Currency | null;
  card: Currency | null;
}

interface Bank {
  slug: string;
  name_ru: string;
  name_uk: string;
  cash: Currency | null;
  card: Currency | null;
}

interface BankProcessed {
  [currency: string]: CurrencyProcessed | string;
  name: string;
}

interface BankProcessedFlat extends BankProcessed {
  bankId: string;
}

interface Banks {
  [bank: string]: BankProcessed;
}

async function fetchCurrency(currency: string): Promise<Bank[]> {
  return (await axios(`${API.BANKS}/${currency}`)).data.data;
}

function processCurrency(banks: Banks, data: Bank[], currency: string) {
  data.forEach((bankData: Bank) => {
    if (typeof banks[bankData.slug] === 'undefined') {
      banks[bankData.slug] = {
        name: bankData.name_uk,
        [currency]: {
          cash: bankData.cash,
          card: bankData.card,
        }
      }
    } else if (typeof banks[bankData.slug] === 'object') {
      banks[bankData.slug][currency] = {
        cash: bankData.cash,
        card: bankData.card,
      }
    }
  });
}

function flatBanks(banks: Banks): BankProcessedFlat[] {
  return Object.entries(banks).map(([bankId, bankData]) => ({
    bankId,
    ...bankData
  }));
}

const CURRENCIES = [
  'eur',
  'usd',
  'rub',
  'pln',
  'gbp',
  'czk',
  'chf',
];

async function seedBanks() {
  const banks: Banks = {};
  const rawCurrenciesData = await Promise.all(CURRENCIES.map(async (currencyName) =>  await fetchCurrency(currencyName)));
  
  rawCurrenciesData.forEach((rawCurrencyData, i) => processCurrency(banks, rawCurrencyData, CURRENCIES[i]));

  populate('banks', flatBanks(banks));
}

seedBanks();
