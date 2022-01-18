[![image](https://img.shields.io/npm/v/@mean-finance/keep3r-cli-jobs.svg?style=flat-square)](https://www.npmjs.org/package/@mean-finance/keep3r-cli-jobs)

# DCA Keep3r CLI Job

Even though we provide a lot of [incentives](https://docs.mean.finance/concepts/swappers#incentives) for swappers to execute our swaps, it could happen that, in some cases, they are not executed. For those scenarios we've developed a Keep3r job that will subsidy some pairs, and execute their swaps if no one else does it first.

It is important to realize that the goal behind the Keep3r job is to try to guarantee swaps, but as a last resort. In that sense, the job has a delay configured, so it can't be executed as soon as a swap is available. We want to provide swappers the opportunity to execute swaps themselves, and the job will act just in case that doesn't happen.

## How to install

1. Open a terminal inside your [CLI](https://github.com/keep3r-network/cli) setup
2. Run `yarn add @mean-finance/keep3r-cli-jobs`
3. Add job inside your CLI config file. It should look something like this:
```
{
    ...
    "jobs": [
        ...,
        {
            "path": "node_modules/@mean-finance/keep3r-cli-jobs/dist/src/mainnet/dca-v1"
        }
    ]
}
```

## How to test
On Keep3r-CLI, use the following command:
`yarn simulate --job node_modules/@mean-finance/keep3r-cli-jobs/dist/src/mainnet/dca-v1 --block 14029364 --config .config.simulation.json`

## Keeper Requirements

* Must be a valid Keeper on Keep3r V1

## Useful Links

* [DCA Keep3rV1 Job](https://etherscan.io/address/0xEcbA21E26466727d705d48cb0a8DE42B11767Bf7)
* [Documentation](https://docs.mean.finance/)
* [Keep3r V1](https://etherscan.io/address/0x1ceb5cb57c4d4e2b2433641b95dd330a33185a44)
