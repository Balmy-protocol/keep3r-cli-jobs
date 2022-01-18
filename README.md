# DCA CLI Job

This job enables The Keep3r Network keepers on Ethereum to execute the different DCA jobs.

## How to install

1. Open a terminal inside your [CLI](https://github.com/keep3r-network/cli) setup
2. Run `yarn add @Mean-Finance/keep3r-cli-jobs`
3. Add job inside your CLI config file. It should look something like this:
```
{
    ...
    "jobs": [
        ...,
        {
            "path": "node_modules/Mean-Finance/keep3r-cli-jobs/dist/src/mainnet/dca"
        }
    ]
}
```

## How to test
On Keep3r-CLI, use the following command:
`yarn simulate --job node_modules/Mean-Finance/keep3r-cli-jobs/dist/src/mainnet/dca --block 14029364 --config .config.simulation.json`

## Keeper Requirements

* Must be a valid Keeper on Keep3r V1

## Useful Links

* [Job](https://etherscan.io/address/0xEcbA21E26466727d705d48cb0a8DE42B11767Bf7)
* [Keep3r V1](https://etherscan.io/address/0x1ceb5cb57c4d4e2b2433641b95dd330a33185a44)
