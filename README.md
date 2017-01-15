# ExMont
Exchange monitor, connects to various exchanges through API, may be useful to find arbitrage opportunities

## Intention
It is a known fact that the Bitcoin prices differ from exchange to exchange. The question of how to help different markets find equilibrium by buying a cheap market and selling an expensive one, taking profit for the operation, has a long history.

This project's idea is to provide a live tool to compare exchanges' bid/ask (=buy/sell) prices to the same number which indicates a "fair" Bitcoin price for the moment. This creates a system of coordinates to the comparison, and clearly divides "cheap" markets from "expensive" ones.

Obviously, the "fairness" concept is a subjective one. Exmont uses [a weighted average of several impactful exchange prices](https://tradeblock.com/) to get the Bitcoin price index which all prices are compared to.

We can also go further and see how much we can win if Bitcoin is purchased at the lowest market and sold on the highest one right now. We should warn, however, that such strategy has some risk involved, because it is difficult to perform two operations at the same time, and each exchange market has its own rules about moving funds.

## Demo
http://exmont-lbror.rhcloud.com/

## Supported exchanges
* http://bitfinex.com/
* http://btc-e.com/
* http://okcoin.com/
* http://itbit.com/
* http://bitstamp.com/
* http://quadrigacx.com/
* http://quoine.com/

## Planned exchanges to support:
* http://kraken.com/
* http://coinbase.com/
* http://gemini.com/
