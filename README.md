# crypto-test

## Requirement
```
npm
node
```

## Run
```
npm install
// start the program
npm start
```

## Hierarchical Deterministic (HD) Segregated Witness (SegWit) bitcoin address
```
? What action do you want to exec? Generate HD SegWit address(HD) or  Multisigna
ture Pay-To-Script-Hash (P2SH)? (Use arrow keys)
❯ HD
  P2SH
? What is the seed path? ./seed
address: bc1q6c4qt3vsh78emx0jvyeds9vss3k7f4505hy6tl
```

## n-out-of-m Multisignature (multisig) Pay-To-Script-Hash (P2SH) bitcoin address
```
? What action do you want to exec? Generate HD SegWit address(HD) or  Multisigna
ture Pay-To-Script-Hash (P2SH)? (Use arrow keys)
  HD
❯ P2SH
? Please provide the pubKeys and split by comma. 026477115981fe981a6918a6297d980
3c4dc04f328f22041bedff886bbc2962e01,02c96db2302d19b43d4c69368babace7854cc84eb9e0
61cde51cfa77ca4a22b8b9,023e4740d0ba639e28963f3476157b7cf2fb7c6fdf4254f97099cf867
0b505ea59
? How many out of 3? 2
address: 3DQoEFJEWqJYqmrkdV5gPRNrnZv9ompoEr
```