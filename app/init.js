const anchor = require('@project-serum/anchor');
const solana = require('@solana/web3.js');

// Configure the local cluster.
anchor.setProvider(anchor.Provider.local());

async function main() {
  // #region main
  // Read the generated IDL.
  const idl = JSON.parse(require('fs').readFileSync('./target/idl/lotto.json', 'utf8'));

  // Address of the deployed program.
  const programId = new anchor.web3.PublicKey('283J3ppWdCmM9FoYv95x6q9EsDa1RXCfG8xQXE3ccfMG');

  // Generate the program client from IDL.
  const program = new anchor.Program(idl, programId);

  const payer = await getPayer();

  // Consistent generation of raffle key
  // TODO: make this a pda
  const raffleAcct = anchor.web3.Keypair.fromSeed(payer.publicKey.toBytes())
  console.log(raffleAcct.publicKey);

  // Execute the RPC.
  await program.rpc.createRaffle({
      accounts: {
          raffle: raffleAcct.publicKey,
          authority: payer.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId, // I have no idea why this is not the programId variable
      },
      signers: [raffleAcct, payer] // TODO: do we need the payer here?,
  });

  console.log("created raffle account")

  const fetchedRaffleAcct = await program.account.raffle.fetch(
    raffleAcct.publicKey
  );
  console.log(fetchedRaffleAcct.ticketPrice);
  // #endregion main
}

/**
 * Load and parse the Solana CLI config file to determine which payer to use
 * Returns Promise<Keypair>
 */
async function getPayer() {
  try {
    return createKeypairFromFile('/Users/shekarramaswamy/.config/solana/id.json');
  } catch (err) {
    console.log(err);
    console.warn(
      'Failed to create keypair from CLI config file, falling back to new random keypair',
    );
    return solana.Keypair.generate();
  }
}

/**
 * Create a Keypair from a secret key stored in file as bytes' array
 * Returns Promise<Keypair>
 */
async function createKeypairFromFile(filePath) {
  const secretKeyString = require('fs').readFileSync(filePath,  'utf8');
  const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
  return solana.Keypair.fromSecretKey(secretKey);
}

console.log('Running client.');
main().then(() => console.log('Success'));
