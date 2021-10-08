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

  // Consistent generation of participant key
  const participantAcct = anchor.web3.Keypair.fromSeed(payer.publicKey.toBytes())

  let fetchedParticipantAcct;
  try {
    fetchedParticipantAcct = await program.account.raffleParticipant.fetch(
        participantAcct.publicKey
    );
    console.log("participant already exists")
  } catch (err) {
    console.log("creating participant acct")
    console.log(participantAcct.publicKey);
    // Execute the RPC.
    await program.rpc.createParticipant({
        accounts: {
            raffleParticipant: participantAcct.publicKey,
            authority: payer.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId, // I have no idea why this is not the programId variable
        },
        signers: [participantAcct, payer],
        authority: payer.publicKey,
    });

    console.log("created participant account")
    fetchedParticipantAcct = await program.account.raffleParticipant.fetch(
      raffleAcct.publicKey
    );
  }

  console.log(participantAcct.publicKey);
  console.log(fetchedParticipantAcct.num_tickets);
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
