import { defineConfig } from '@dethcrypto/eth-sdk';

export default defineConfig({
  outputPath: 'src/eth-sdk-build',
  contracts: {
    mainnet: {
      dca: '0xEcbA21E26466727d705d48cb0a8DE42B11767Bf7',
    },
  },
});
