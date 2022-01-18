import { Job, JobWorkableGroup, makeid, prelog, toKebabCase } from '@keep3r-network/cli-utils';
import { getMainnetSdk } from '../../eth-sdk-build';
import metadata from './metadata.json';

const getWorkableTxs: Job['getWorkableTxs'] = async (args) => {
  const correlationId = toKebabCase(metadata.name);

  // setup logs
  const logMetadata = {
    job: metadata.name,
    block: args.advancedBlock,
    logId: makeid(5),
  };

  const logConsole = prelog(logMetadata);

  // skip strategy if already in progress
  if (args.skipIds.includes(correlationId)) {
    logConsole.log(`Job in progress, avoid running`);
    return args.subject.complete();
  }

  logConsole.log(`Trying to work`);

  // setup job with default fork provider
  const signer = args.fork.ethersProvider.getSigner(args.keeperAddress);
  const { dca: job } = getMainnetSdk(signer);

  try {
    // check if job is workable
    const [pairs, intervals] = await job.connect(args.keeperAddress).callStatic.workable({
      blockTag: args.advancedBlock,
    });

    logConsole.warn(`Job ${pairs.length ? 'is' : 'is not'} workable`);

    // return if there are no pairs
    if (!pairs.length) return args.subject.complete();

    try {
      // check if the call would work
      await job.connect(args.keeperAddress).callStatic.work(pairs, intervals, {
        blockTag: args.advancedBlock,
      });
    } catch (err: any) {
      // handle errors
      logConsole.warn('Workable but failed to work', {
        message: err.message,
      });
      // return if there's any error
      return args.subject.complete();
    }

    // create work tx
    const tx = await job.connect(args.keeperAddress).populateTransaction.work(pairs, intervals, {
      nonce: args.keeperNonce,
      gasLimit: 2_000_000,
      type: 2,
    });

    // create a workable group every bundle burst
    const workableGroups: JobWorkableGroup[] = new Array(args.bundleBurst).fill(null).map((_, index) => ({
      targetBlock: args.targetBlock + index,
      txs: [tx],
      logId: `${logMetadata.logId}-${makeid(5)}`,
    }));

    // submit all bundles
    args.subject.next({
      workableGroups,
      correlationId,
    });
  } catch (err: any) {
    // handle error logs
    logConsole.warn('Unexpected error', { message: err.message });
  }

  // finish job process
  args.subject.complete();
};

module.exports = {
  getWorkableTxs,
} as Job;
