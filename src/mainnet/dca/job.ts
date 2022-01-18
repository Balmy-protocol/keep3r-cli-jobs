import { Job, JobWorkableGroup, makeid, prelog, toKebabCase } from '@keep3r-network/cli-utils';
import { getMainnetSdk } from '../../eth-sdk-build';
import metadata from './metadata.json';

const getWorkableTxs: Job['getWorkableTxs'] = async (args) => {
  const correlationId = toKebabCase(metadata.name);
  const logMetadata = {
    job: metadata.name,
    block: args.advancedBlock,
    logId: makeid(5),
  };
  const logConsole = prelog(logMetadata);

  if (args.skipIds.includes(correlationId)) {
    logConsole.log(`Job in progress, avoid running`);
    return args.subject.complete();
  }

  logConsole.log(`Trying to work`);

  const signer = args.fork.ethersProvider.getSigner(args.keeperAddress);
  const { dca: job } = getMainnetSdk(signer);

  try {
    const [pairs, intervals] = await job.connect(args.keeperAddress).callStatic.workable({
      blockTag: args.advancedBlock,
    });

    logConsole.warn(`Job ${pairs.length ? 'is' : 'is not'} workable`);
    if (!pairs.length) return args.subject.complete();

    try {
      await job.connect(args.keeperAddress).callStatic.work(pairs, intervals, {
        blockTag: args.advancedBlock,
      });
    } catch (err: any) {
      logConsole.warn('Workable but failed to work', {
        message: err.message,
      });
      return args.subject.complete();
    }

    const workableGroups: JobWorkableGroup[] = [];

    for (let index = 0; index < args.bundleBurst; index++) {
      const tx = await job.connect(args.keeperAddress).populateTransaction.work(pairs, intervals, {
        nonce: args.keeperNonce,
        gasLimit: 2_000_000,
        type: 2,
      });

      workableGroups.push({
        targetBlock: args.targetBlock + index,
        txs: [tx],
        logId: `${logMetadata.logId}-${makeid(5)}`,
      });
    }

    args.subject.next({
      workableGroups,
      correlationId,
    });

    // send it to the core in case it passed the simulation
  } catch (err: any) {
    logConsole.warn('Unexpected error', { message: err.message });
  }

  args.subject.complete();
};

module.exports = {
  getWorkableTxs,
} as Job;
