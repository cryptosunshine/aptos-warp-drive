import React, { FC, useState, useEffect } from 'react';
import { AnimatorGeneralProvider, Animator } from '@arwes/animation';
import { BleepsProvider } from '@arwes/sounds';
import { ArwesThemeProvider, StylesBaseline, Text, Figure, Button, FrameBox, Card } from '@arwes/core';
import { AptosAccount, AptosClient, TxnBuilderTypes, BCS, MaybeHexString, HexString, FaucetClient } from "aptos";
export type Uint64 = bigint;
// For the font-family to work, you would have to setup the Google Fonts link:
// <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Titillium+Web:wght@300;400;600&display=swap" />
const ROOT_FONT_FAMILY = '"Titillium Web", sans-serif';

const SOUND_OBJECT_URL = 'https://playground.arwes.dev/assets/sounds/object.mp3';
const SOUND_TYPE_URL = 'https://playground.arwes.dev/assets/sounds/type.mp3';

const NODE_URL = "https://fullnode.devnet.aptoslabs.com";
const client = new AptosClient(NODE_URL);

const audioSettings = { common: { volume: 0.25 } };
const playersSettings = {
  object: { src: [SOUND_OBJECT_URL] },
  type: { src: [SOUND_TYPE_URL], loop: true }
};
const bleepsSettings = {
  object: { player: 'object' },
  type: { player: 'type' }
};
const coinMoveHex = (coinName:string) => {
  return `0xa11ceb0b05000000050100020202040706130819200a39050000000100000${toHexString(BCS.bcsSerializeStr(coinName))}04436f696e0b64756d6d795f6669656c640b7052b67f7874d936f53e4c02d17157b0134d4635359bfd225775dfe6c2a3e3000201020100`
}
function byteToHex(byte:any) {
  const unsignedByte = byte & 0xff;
  return unsignedByte.toString(16);
  // if (unsignedByte < 16) {
  //   return '0' + unsignedByte.toString(16);
  // } else {
  //   return unsignedByte.toString(16);
  // }
}
function toHexString(bytes:any) {
  return Array.from(bytes)
    .map(byte => byteToHex(byte))
    .join('');
}
type CoinMessage = {
  symbol: string,
  description: string,
  precision: number,
}
const generalAnimator = { duration: { enter: 200, exit: 200 } };
const Coin: FC = () => {
  const [activate, setActivate] = useState(true);
  const [address, setAddress] = useState<string>()
  const [accountAddress, setAccountAddress] = useState<string>("0x0b7052b67f7874d936f53e4c02d17157b0134d4635359bfd225775dfe6c2a3e3")
  const [coinType, setCoinType] = useState<string>("0x1::coin::CoinStore<0x0b7052b67f7874d936f53e4c02d17157b0134d4635359bfd225775dfe6c2a3e3::coin::Coin>")
  const [balance, setBlance] = useState<any>()
  const [coinMessage, setCoinMessage] = useState<CoinMessage>({symbol: "", description: "", precision: 6})

  useEffect(() => {
    // const timeout = setTimeout(() => setActivate(!activate), 2000);
    // return () => clearTimeout(timeout);
    console.log(toHexString(BCS.bcsSerializeStr("a")))
 
  }, [activate]);
  
  const connect = () => {
    window.aptos.connect()
    window.aptos.account().then((data : {address: string}) => setAddress(data.address));
  }

  async function getBalance(accountAddress: MaybeHexString, coinTypeAddress: string): Promise<string | number> {

    try {
      const resource = await client.getAccountResource(
        accountAddress,
        coinTypeAddress, //`0x1::coin::CoinStore<0x9e3b75c2459ee3af660236209afd2e4078f04d5d52e1693ef63a3a164a25562f::coin::Coin>`,
      );
  
      return parseInt((resource.data as any)["coin"]["value"]);
    } catch (_) {
      return 0;
    }
  }

  const inputContractOnChange = (e:any) => {
    setAccountAddress(e.target.value)
  } 
  const inputTypeOnChange = (e:any) => {
    setCoinType(e.target.value)
  } 
  const getContractMessage = async () => {
    console.log(accountAddress, coinType)
    let balance = await getBalance(accountAddress, coinType)
    console.log(balance)
    setBlance(balance)
  }
  async function registerCoin(coinType: string) {

      const transaction = {
        type: "entry_function_payload",
        function: `0x1::coins::register`,
        arguments: [],
        type_arguments: [`0x0b7052b67f7874d936f53e4c02d17157b0134d4635359bfd225775dfe6c2a3e3::coin::Coin`],
      };
    
      window.aptos.signAndSubmitTransaction(transaction).then((e:any) => {
        console.log(e)
      })
  }
  const initiCoin = async () => {
    
    const transaction = {
      type: "entry_function_payload",
      function: `0x1::managed_coin::initialize`,
      arguments: [
        parseInt("Bitcoin",16).toString(),
        parseInt("btc",16).toString(),
        6,
        false
      ],
      type_arguments: [`0x0b7052b67f7874d936f53e4c02d17157b0134d4635359bfd225775dfe6c2a3e3::coin::Coin`],
    };
    console.log(transaction)
    window.aptos.signAndSubmitTransaction(transaction).then((e:any) => {
      console.log(e)
    })
  }
  const mintTo = async () => {
    
    const transaction = {
      type: "entry_function_payload",
      function: `0x1::managed_coin::mint`,
      arguments: [
        "0x2ced2345c8fbb68c31ce6821d30a720fccdbdaa31c2e890a53cfb01b64a9d921",
        "1000",
      ],
      type_arguments: [`0x0b7052b67f7874d936f53e4c02d17157b0134d4635359bfd225775dfe6c2a3e3::coin::Coin`],
    };
    console.log(transaction)
    window.aptos.signAndSubmitTransaction(transaction).then((e:any) => {
      console.log(e)
    })
  }

  const publishMoule = async () => {
    let bytecode = coinMoveHex(coinMessage.symbol);
    const transaction = {
      type: "module_bundle_payload",
      modules: [
        {
          bytecode: bytecode //0x...
        }
      ]
    };
    console.log(transaction)
    window.aptos.signAndSubmitTransaction(transaction).then((e:any) => {
      console.log(e)
    }).catch((err:any) => {
      console.log(err)
    })
  }
  
  return (
    <ArwesThemeProvider>
      <StylesBaseline styles={{ body: { fontFamily: ROOT_FONT_FAMILY } }} />
      <BleepsProvider
        audioSettings={audioSettings}
        playersSettings={playersSettings}
        bleepsSettings={bleepsSettings}
      >
        <AnimatorGeneralProvider animator={generalAnimator}>
          <Animator animator={{ activate, manager: 'stagger' }}>
            <Text as='h1'>
              Aptos Lend
            </Text>
            

            <Button
              animator={{ activate }}
              onClick={event => connect()}

            >
              <Text>Connect</Text>
            </Button>
            
            <Text>
              {address}
            </Text>
            <br></br>
            <input type="text" onChange={(e) => {inputContractOnChange(e)}} placeholder="合约地址" value={accountAddress} />
            <input type="text" onChange={(e) => {inputTypeOnChange(e)}} placeholder="合约参数" value={coinType} />
            <Button
              animator={{ activate }}
              onClick={event => getContractMessage()}

            >
              <Text>获取余额</Text>
            </Button>
            <Text>{balance}</Text>
            <br />
            <Button
              animator={{ activate }}
              onClick={event => registerCoin(coinType)}

            >
              <Text>注册币种</Text>
            </Button>
            <br />
            <input type="text" onChange={(e) => {setCoinMessage({ symbol: e.target.value,description: coinMessage.description,precision: coinMessage.precision })}} placeholder="币种名" value={coinMessage.symbol} />
            <input type="text" onChange={(e) => {setCoinMessage({ symbol: coinMessage.symbol, description: e.target.value,precision: coinMessage.precision })}} placeholder="描述" value={coinMessage.description} />
            <input type="number" onChange={(e) => {setCoinMessage({ symbol: coinMessage.symbol, description: coinMessage.description, precision: Number(e.target.value) })}} placeholder="精度" value={coinMessage.precision} />
            <Button
              animator={{ activate }}
              onClick={event => publishMoule()}

            >
              <Text>发布</Text>
            </Button>
            <br />
            <Button
              animator={{ activate }}
              onClick={event => initiCoin()}

            >
              <Text>初始化</Text>
            </Button>
            <br />
            <Button
              animator={{ activate }}
              onClick={event => mintTo()}

            >
              <Text>mintTo</Text>
            </Button>
            
          </Animator>
        </AnimatorGeneralProvider>
      </BleepsProvider>
    </ArwesThemeProvider>
  );
};
export default Coin

