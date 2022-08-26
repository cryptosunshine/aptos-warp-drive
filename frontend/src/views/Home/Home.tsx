import React, { FC, useState, useEffect } from 'react';
import { AnimatorGeneralProvider, Animator } from '@arwes/animation';
import { BleepsProvider } from '@arwes/sounds';
import { ArwesThemeProvider, StylesBaseline, Text, Figure, Button } from '@arwes/core';
import { AptosAccount, AptosClient, TxnBuilderTypes, BCS, MaybeHexString, HexString, FaucetClient } from "aptos";

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
const generalAnimator = { duration: { enter: 200, exit: 200 } };
const Home: FC = () => {
  const [activate, setActivate] = useState(true);
  const [address, setAddress] = useState<any>()
  useEffect(() => {
    // const timeout = setTimeout(() => setActivate(!activate), 2000);
    // return () => clearTimeout(timeout);
    client.getAccountModules("0xa61e1e86e9f596e483283727d2739ba24b919012720648c29380f9cd0a96c11a").then(e => {
      console.log("getAccountModules")
      console.log(e)
      
    })
    client.getAccountResources("0xa61e1e86e9f596e483283727d2739ba24b919012720648c29380f9cd0a96c11a").then(e => {
      console.log("getAccountResources")
      console.log(e)
    });
  }, [activate]);

  const connect = () => {
    window.aptos.connect()
    window.aptos.account().then((data : {address: string}) => setAddress(data.address));
  }
  const getMessage = () => {
    const token = new TxnBuilderTypes.TypeTagStruct(TxnBuilderTypes.StructTag.fromString("0x1::aptos_coin::AptosCoin"));
    console.log(token)
    // const scriptFunctionPayload = TxnBuilderTypes.EntryFunction.natural(
    //   // Fully qualified module name, `AccountAddress::ModuleName`
    //   "0x373ca5924513f9d408156ad72209b6b8fc5ec954b7c16031628037dff5bf0737::Message",
    //   // Module function
    //   "add",
    //   // The coin type to transfer
    //   [],
    //   // Arguments for function `transfer`: receiver account address and amount to transfer
    //   [],
    // )
    // console.log(scriptFunctionPayload)
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
            <Button
              animator={{ activate }}
              onClick={event => getMessage()}
            
            >
              <Text>getMessage</Text>
            </Button>
            <Text as='p'>
              A nebula is an interstellar cloud of dust, hydrogen, helium and
              other ionized gases. Originally, the term was used to describe any
              diffused astronomical object, including galaxies beyond the Milky
              Way. The Andromeda Galaxy, for instance, was once referred to as
              the Andromeda Nebula (and spiral galaxies in general as "spiral
              nebulae") before the true nature of galaxies was confirmed in the
              early 20th century by Vesto Slipher, Edwin Hubble and others.
            </Text>
          </Animator>
        </AnimatorGeneralProvider>
      </BleepsProvider>
    </ArwesThemeProvider>
  );
};
export default Home

