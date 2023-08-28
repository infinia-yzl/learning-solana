<script lang="ts">
  import {
    clusterApiUrl,
    Connection,
    Keypair,
    PublicKey,
    Transaction,
    TransactionInstruction,
    sendAndConfirmTransaction,
    SystemProgram,
    LAMPORTS_PER_SOL
  } from "@solana/web3.js";

  const existingSecret = import.meta.env.VITE_SOLANA_SECRET_KEY;
  const PROGRAM_ADDRESS = 'ChT1B39WKLS8qUrkLvFDXMhEJ4F1XZzwUNHUt4AU9aVa'
  const PROGRAM_DATA_ADDRESS = 'Ah9K7dQ8EHaZqcAsgBW8w37yN2eAy3koFmUn4x3CJtod'

  let walletAddress = "";

  let balance: number | null = null;
  let accountInfo: any = null;
  let keyPair: any = null;

  // Send transaction
  let transferAddress = "";
  let signature: any = null;

  const onSubmit = async (event: Event) => {
    event.preventDefault();
    await getBalance();
    await getAccountInfo();
  };

  const getBalance = async () => {
    const connection = new Connection(clusterApiUrl("devnet"));
    const publicKey = new PublicKey(walletAddress);
    const lamports = await connection.getBalance(publicKey);
    balance = lamports / 1e9; // Convert lamports to SOL
  };

  const getAccountInfo = async () => {
    const connection = new Connection(clusterApiUrl("devnet"));
    const publicKey = new PublicKey(walletAddress);
    accountInfo = await connection.getAccountInfo(publicKey);
  };

  // ED25519 Keypair
  const generateKeypair = async () => {
    keyPair = Keypair.generate();
  };

  const initializeKeyPair = async () => {
    const secret = JSON.parse(existingSecret ?? "") as number[]
    keyPair = Keypair.fromSecretKey(new Uint8Array(secret));
    return keyPair;
  };

  const pingProgram = async () => {
    await initializeKeyPair();
    const transaction = new Transaction();
    const programId = new PublicKey(PROGRAM_ADDRESS);
    const programDataPubkey = new PublicKey(PROGRAM_DATA_ADDRESS);

    const instruction = new TransactionInstruction({
      keys: [
        {
          pubkey: programDataPubkey,
          isSigner: false,
          isWritable: true
        },
      ],
      programId,
    });

    transaction.add(instruction);

    signature = await sendAndConfirmTransaction(
      new Connection(clusterApiUrl("devnet")),
      transaction,
      [keyPair],
    );
  }

  const transfer = async () => {
    await initializeKeyPair();
    const connection = new Connection(clusterApiUrl("devnet"));
    const transaction = new Transaction();

    const transferPubKey = new PublicKey(transferAddress);
    console.log(transferAddress);
    console.log(transferPubKey);

    const instruction = SystemProgram.transfer({
      fromPubkey: keyPair.publicKey,
      toPubkey: transferPubKey,
      lamports: LAMPORTS_PER_SOL * 0.069,
    })

    transaction.add(instruction);

    signature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [keyPair],
    );
  }

  const fundAccount = async () => {
    await initializeKeyPair();
    const connection = new Connection(clusterApiUrl("devnet"));
    const lamports = await connection.getBalance(keyPair.publicKey);
    if (lamports > 0) {
      return;
    }
    const signature = await connection.requestAirdrop(keyPair.publicKey, LAMPORTS_PER_SOL * 1);
    await connection.confirmTransaction(signature);
  };
</script>

<main>
    <h1>Solana Wallet Balance Checker (devnet)</h1>
    <form on:submit|preventDefault={onSubmit}>
        <label for="walletAddress">Wallet Address:</label>
        <input
                id="walletAddress"
                type="text"
                bind:value={walletAddress}
                placeholder="Enter Solana wallet address"
        />
        <button type="submit">Check Balance</button>
    </form>
    {#if balance !== null}
        <p>Balance: {balance} SOL</p>
    {/if}
    {#if accountInfo !== null}
        <p>Account Info:</p>
        <pre>{JSON.stringify(accountInfo, null, 2)}</pre>
    {/if}

    <p>Example addresses on devnet:</p>
    <pre>CenYq6bDRB7p73EjsPEpiYN7uveyPUTdXkDkgUduboaN</pre>

    <hr/>

    <h1>Transaction</h1>
    <p>Our public address:</p>
    <pre>3zzh3gZ7vS5xGQXuTevjwhFks5kjDaZDdRgefUpBZqNE</pre>
    <button><a href="https://explorer.solana.com/address/3zzh3gZ7vS5xGQXuTevjwhFks5kjDaZDdRgefUpBZqNE?cluster=devnet"
               target="_blank">View Account on Explorer</a></button>
    <button on:click={fundAccount}>Fund Account</button>
    <button on:click={pingProgram}>Initialize & Ping Program</button>
    <form on:submit|preventDefault={transfer}>
        <label for="transferAddress">Transfer to Wallet Address:</label>
        <input
                id="transferAddress"
                type="text"
                bind:value={transferAddress}
                placeholder="Enter Solana wallet address to transfer funds to"
        />
        <button type="submit">Send some $SOL!</button>
    </form>
    {#if signature !== null}
        <p>Transaction Signature:</p>
        <pre>{JSON.stringify(signature, null, 2)}</pre>
    {/if}

    <hr/>

    <h1>Generate keypair</h1>
    <button on:click={generateKeypair}>Generate Keypair</button>
    {#if keyPair !== null}
        <p>Keypair:</p>
        <pre>{JSON.stringify(keyPair, null, 2)}</pre>
        <p>Keypair secret:</p>
        <pre>{JSON.stringify(keyPair.secretKey.toString(), null, 2)}</pre>
    {/if}
    <p>This doesn't save the keypair, it just generates one.</p>
</main>

<style>
    /* Container */
    main {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        border-radius: 8px;
    }

    /* Heading */
    h1 {
        font-size: 24px;
        margin-bottom: 20px;
    }

    /* Form */
    form {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    label {
        font-weight: bold;
    }

    input {
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
    }

    button {
        padding: 10px 20px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    button:hover {
        background-color: #0056b3;
    }

    /* Output */
    p {
        margin-top: 20px;
        font-size: 18px;
    }

    pre {
        background-color: #f4f4f4;
        padding: 10px;
        border-radius: 4px;
        overflow-x: auto; /* Add horizontal scrolling for long lines */
    }

    code {
        font-family: "Courier New", monospace;
    }
</style>
