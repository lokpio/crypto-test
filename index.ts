import * as bitcoin from "bitcoinjs-lib";
import * as inquirer from "inquirer";
import * as fs from "fs";

function genHdSegWitAddress(path: string) {
    // read the seed
    const seed = fs.readFileSync(path);
    const master = bitcoin.bip32.fromSeed(seed);

    // HD
    // add the nodes path from the master to chain node, code 0 because it's the 1st account
    // m / purpose' / coin_type' / account' / chain / address_index
    const derived = master.derivePath("m/44'/0'/0'/0/0");
    // generate a SegWit address
    const {address} = bitcoin.payments.p2wpkh({pubkey: derived.publicKey});
    console.log("address: " + address);
}

function genMultisigP2SH(n: number, addresses: Array<string>) {
    // convert all the pubkeys to buffer
    const pubkeys = addresses.map(hex => Buffer.from(hex, 'hex'));
    // generate a P2SH Pay-To-Script-Hash (n-of-m) address
    const {address} = bitcoin.payments.p2sh({
        redeem: bitcoin.payments.p2ms({
            m: n,
            pubkeys: pubkeys
        })
    });
    console.log("address: " + address);
}

async function hdCli() {
    // ask user to provide seed path in the cli
    const hdCli = [
        {
            name: "PATH",
            type: "input",
            message: "What is the seed path?",
        }
    ];
    const hdCliResults = await inquirer.prompt(hdCli);
    // get the path
    const {PATH} = hdCliResults;
    if (typeof PATH === "string") {
        genHdSegWitAddress(PATH);
    } else {
        console.log("The path must be a string.")
    }
}

async function p2shCli() {
    // ask user to provide pubkeys in the cli
    const p2shKeysCli = [
        {
            name: "PUBKEYS",
            type: "input",
            message: "Please provide the pubKeys and split by comma.",
            filter: function (val: string) {
                return val.split(",");
            }
        }
    ];
    const p2shKeysCliResults = await inquirer.prompt(p2shKeysCli);
    // get all the splitted pubkeys
    const {PUBKEYS} = p2shKeysCliResults;
    if (Array.isArray(PUBKEYS)) {
        // ask user to provide the number to verify
        const p2shNumCli = [
            {
                name: "NUM",
                type: "input",
                message: `How many out of ${PUBKEYS.length}?`,
            }
        ];
        const p2shNumCliResults = await inquirer.prompt(p2shNumCli);
        // get the number
        const {NUM} = p2shNumCliResults;
        if (typeof NUM === "string") {
            // check the number is not larger than the length of the provide keys
            if (parseInt(NUM) > PUBKEYS.length) {
                console.log("The number cannot be larger than the number of pubkeys provide");
            } else {
                genMultisigP2SH(parseInt(NUM), PUBKEYS);
            }
        }
    } else {
        console.log("The input address is invalid.")
    }
}

async function run() {
    // init the cli with the action question
    const initCli = [
        {
            name: "ACTION",
            type: "list",
            message: "What action do you want to exec? Generate HD SegWit address(HD) or  Multisignature Pay-To-Script-Hash (P2SH)?",
            choices: ["HD", "P2SH"],
        }
    ];
    const results = await inquirer.prompt(initCli);
    const {ACTION} = results;
    // check user action whether want to gen HD or Multisig
    if (ACTION === "HD") {
        hdCli();
    } else if (ACTION === "P2SH") {
        p2shCli();
    } else {
        console.log("The action type does not exist.")
    }
}

run();