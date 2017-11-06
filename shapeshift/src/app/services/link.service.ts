import {Injectable, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Coin} from '../models/coin.model';
import {Quote} from '../models/quote.model';
import {BtcWalletModel} from '../models/btc-wallet.model';
import * as wallet from 'wallet';
import {QuoteService} from './quote.service';


@Injectable()
export class LinkService implements OnInit {

  private quotes: Quote[];

  constructor(private service: QuoteService) {
    this.quotes = [];
    this.service.SharedList.subscribe(lst => this.quotes = lst);
    this.service.getQuote('ETH');
  }

  ngOnInit() {
    this.service.SharedList.subscribe(lst => this.quotes = lst);
    this.service.getQuote('ETH');
  }


  // TODO this is obviously wrong, wallet needs to be more generic
  // TODO generate address for different wallets

  public generateLink(depositCoin: Coin, btcWallet: BtcWalletModel): Observable<string> {
    //TODO if btc

    const btc = new wallet.Wallet.Bitcoin.BtcWallet(btcWallet.xprivkey, true);

    const derivedPrivKey = btc.deriveHdPrivateKey(1); //TODO this also needs to be autoincremental
    const hdPublicKey = derivedPrivKey.hdPublicKey;
    const address = btc.generateAddress(hdPublicKey);

    const data = [
      new Date(),
      depositCoin.amount,
      address.toString(),
      'btc', // TODO ........
      'eth', // TODO in exchange for currency
      '1' // TODO in exchange for amount
    ];

    const stringified = JSON.stringify(data);
    const link = btoa(stringified);

    return Observable.of(link);
  }
}