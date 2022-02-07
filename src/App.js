import React, { useEffect, useState } from 'react';


import { ColorModeSwitcher } from './ColorModeSwitcher';
//import { Logo } from './Logo';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, transformCharacterData } from './constants';
import myEpicGame from './utils/marriages.json';
import Execute from './components/Execute';

import { Logo } from './components/Logo';
//Components
import Identicon from "./components/identicon";
import SelectCharacter from "./components/SelectCharacter";
import Arena from './components/Arena';

import {
  ChakraProvider,
  Box,
  Text,
 
  VStack,
  HStack,
  Flex,
  Spacer,

  Grid,
  theme,
  GridItem,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  //MenuItemOption,
  MenuGroup,
  //MenuOptionGroup,
  //MenuDivider,

  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  chakra,
  Textarea,
  createStandaloneToast,
  VisuallyHidden,

  Image,
  IconProps,
  Icon,
 
  Heading,
  Center,
  createIcon,


 
  IconButton,
  
  Stack,
  Collapse,
  
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Avatar,
  useColorModeValue,
  useBreakpointValue,
  Container,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  
 
  
  
} from '@chakra-ui/react';

import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from '@chakra-ui/icons';

import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons'
import { useTable, useSortBy } from 'react-table'

import { FaGithub, FaTwitter, FaYoutube } from 'react-icons/fa';


// Constants
//const TWITTER_HANDLE = '0xaltyni';
//const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;


function App() {
// State
const [currentAccount, setCurrentAccount] = useState(null);
const [characterNFT, setCharacterNFT] = useState(null);
const [gameContract, setGameContract] = useState(null);
const [userBeenProposed, setuserBeenProposed] = useState(null);
const [balanceETH, setbalanceETH] = useState("");
const [familyStats,setfamilyStats] = useState("")
const [familyBudget,setfamilyBudget] = useState("")
const [Provider,setProvider] =useState(null);
const [value, setvalue] = useState("");
const [message, setMessage] = useState("");
const [marriedto, setmarriedto] = useState("");
const [imageNFT,setimageNFT] = useState([]);

const { isOpen: isMobileNavOpen, onToggle: onToggle2  } = useDisclosure();
const { isOpenother, onToggle } = useDisclosure();


const [txarray,settxarray] = useState([]);

const toast = createStandaloneToast()

const format = (val) => `Ξ` + val;
// eslint-disable-next-line 
const parse = (val) => val.replace(/^\Ξ/, '')

const { isOpen, onOpen, onClose } = useDisclosure()


const finalRef = React.useRef()


const { 
  isOpen: isOpen2, 
  onOpen: onOpen2, 
  onClose: onClose2 
} = useDisclosure()


const { 
  isOpen: isOpen3, 
  onOpen: onOpen3, 
  onClose: onClose3 
} = useDisclosure()


const { 
  isOpen: isOpen4, 
  onOpen: onOpen4, 
  onClose: onClose4 
} = useDisclosure()


 
const data = React.useMemo(
  () => txarray,
  [txarray],
)


const columns = React.useMemo(
  () => [
    {
      Header: 'ID',
      accessor: 'id',
    },
    {
      Header: 'Date/Time',
      accessor: 'time',
    },
    {
      Header: 'Amount',
      accessor: 'amount',
      isNumeric: true,
    },
  ],
  // eslint-disable-next-line 
  [txarray],
)



const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data }, useSortBy)


    // World of connections to wallets
const checkIfWalletIsConnected = async () => {
  try {
    const { ethereum } = window;

    if (!ethereum) {
      console.log('Make sure you have MetaMask!');
      return;
    } else {
      console.log('We have the ethereum object', ethereum);

      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log('Found an authorized account:', account);
        setCurrentAccount(account);
        
        
      } else {
        console.log('No authorized account found');
      }
    }
  } catch (error) {
    console.log(error);
  }
};


const connectWalletAction = async () => {
  try {
    const { ethereum } = window;

    if (!ethereum) {
      alert('Get MetaMask!');
      return;
    }
    const accounts = await ethereum.request({
      method: 'eth_requestAccounts',
    });
    console.log('Connected', accounts[0]);
    setCurrentAccount(accounts[0]);
  } catch (error) {
    console.log(error);
  }
};


useEffect(() => {
  checkIfWalletIsConnected();

}, []);

// UseEffect
useEffect(() => {
  const { ethereum } = window;

  if (ethereum) {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const gameContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      myEpicGame.abi,
      signer
    );
    //eventFilterv5WithPagination(CONTRACT_ADDRESS,myEpicGame.abi,provider,10);
    /*
     * This is the big difference. Set our gameContract in state.
     */
    setGameContract(gameContract);
    setProvider(signer);
    console.log("Connected to the smart contract.")
    
  } else {
    console.log('Contract object not found');
  }
  // eslint-disable-next-line
}, [])


 /*
 * Add this useEffect right under the other useEffect where you are calling checkIfWalletIsConnected
 */
 useEffect(() => {
  /*
   * The function we will call that interacts with out smart contract
   */

  const fetchNFTMetadata = async () => {
    console.log('Checking for Character NFT on address:', currentAccount);

    try {
    const txn = await gameContract.checkIfUserHasProposed();
    console.log("Proposal Status ",txn.ProposalStatus, txn)
    
    if (txn.ProposalStatus!==0) {
      console.log('User has Proposed');
      setCharacterNFT(transformCharacterData(txn));
      setfamilyStats(transformCharacterData(txn));
  
      console.log("Family Status is: ",familyStats);
    } else {
      console.log('User has not proposed');
    }
  } catch (error) {
    console.log(error)
  }
  }

  const fetchProposedtodata = async () => {
    console.log('Checking whether address was proposed', currentAccount);
    try {
    const txn2 = await gameContract.checkIfUserHasBeenProposed();
    console.log(txn2)
  
    if (txn2.ProposalStatus!==0) {
      console.log('User has been Proposed to');
      setuserBeenProposed(transformCharacterData(txn2))
      setfamilyStats(transformCharacterData(txn2));
    
      console.log("Family Status is: ", familyStats);
    } else {
      console.log('User has not been proposed to');
    }
  } catch (error) {
    console.log(error)
  }
  }

  if (currentAccount) {
    console.log('CurrentAccount:', currentAccount);
    fetchNFTMetadata();
    fetchProposedtodata(); 
    EthBalance();
  }

  // eslint-disable-next-line 
}, [setfamilyStats, currentAccount]);


useEffect(() => {

  const onNewWave = async (id, waver, proposed, sender, message, time,vid) => {
    console.log("Incoming message with:",id, waver,proposed, sender,message,time,vid);
  
    if (gameContract && sender.toUpperCase() === currentAccount.toUpperCase()) {
      let txn;
  if (currentAccount.toUpperCase() === familyStats.proposed.toUpperCase()) {txn = await gameContract.checkIfUserHasBeenProposed();} 
  else if (currentAccount.toUpperCase() === familyStats.waver.toUpperCase()) {txn = await gameContract.checkIfUserHasProposed();}
  
      if (txn.ProposalStatus!==0){
        console.log('Status has been updated');
        setfamilyStats(transformCharacterData(txn));
        toast({
          title: 'Family Status has been updated',
          description: "Your request has been sent",
          status: 'info',
          duration: 9000,
          isClosable: true,
        })
      
      } 
        else if (txn.ProposalStatus===0) { alert(`Your marriage has been annuled.`)
        window.location.reload(false);}
    } else {
      console.log('Other users event.');}
    }


const onsendingStake = async (sender,time, value) => { 
console.log("Incoming message with:", sender,time, value);
console.log(sender)
console.log(currentAccount)

if (gameContract && sender.toUpperCase() === currentAccount.toUpperCase()) {
  let txn;
  console.log(familyStats.proposed.toUpperCase())
  if (currentAccount.toUpperCase() === familyStats.proposed.toUpperCase()) {txn = await gameContract.checkIfUserHasBeenProposed();} 
  else if (currentAccount.toUpperCase() === familyStats.waver.toUpperCase()) {txn = await gameContract.checkIfUserHasProposed();}
  
  if (txn.ProposalStatus!==0){
    console.log('Status has been updated');
    setfamilyStats(transformCharacterData(txn));
    toast({
      title: 'Family Stake update',
      description: "Your ETH has been sent",
      status: 'success',
      duration: 9000,
      isClosable: true,
    })
    //Close Addstake Modal
    onClose();
  
  } else if (txn.ProposalStatus===0) { 
    alert(`Your marriage has been annuled.`)
    window.location.reload(false);}
} else {
  console.log('Other users event.');}
};

  if (gameContract) {
    /*
     * Setup NFT Minted Listener
     */
    gameContract.on('NewWave', onNewWave);
    gameContract.on('AddStake', onsendingStake);
   
  }

  return () => {
    /*
     * When your component unmounts, let/s make sure to clean up this listener
     */
    if (gameContract) {
      gameContract.off('NewWave', onNewWave);
      gameContract.off('AddStake', onsendingStake);
    }
  };
// eslint-disable-next-line 
}, [familyStats,gameContract, currentAccount]);



useEffect(() => {

  FamilyEthBalance()
    // eslint-disable-next-line 
}, [currentAccount, familyStats]);

useEffect(() => {

  setmarriedtofunction()
    // eslint-disable-next-line 
}, [currentAccount,familyStats]);


const setmarriedtofunction = async () => {
  console.log ("Setting Married to...",currentAccount.toUpperCase(), familyStats.proposed.toUpperCase(),familyStats.waver.toUpperCase() )

  if (currentAccount.toUpperCase() === familyStats.proposed.toUpperCase()) {setmarriedto(familyStats.waver)} 
  else if (currentAccount.toUpperCase() === familyStats.waver.toUpperCase()) {setmarriedto(familyStats.proposed)}
  console.log ("So Married to is.....:", marriedto )
}


//Balances update 

const EthBalance = async () => {
  Provider.getBalance("latest").then((balance) => {
    // convert a currency unit from wei to ether
    const balanceInEth = ethers.utils.formatEther(balance)
    setbalanceETH(balanceInEth);
    console.log(`balance: ${balanceInEth} ETH`)
   })
}

const FamilyEthBalance = async () => {
  const FamilybalanceInEth = Number(familyStats.FamilyBudget)/1000000000000000000;
  setfamilyBudget(FamilybalanceInEth);
}



// Render Methods
const renderContent = () => {
  if (!currentAccount) {
    return (
         
         <Button
         display={{ base: 'none', md: 'inline-flex' }}
         fontSize={'sm'}
         fontWeight={600}
         color={'white'}
         bg={'pink.400'}
         href={'#'}
         onClick={connectWalletAction}
         _hover={{
           bg: 'pink.300',
         }}>
         Connect Wallet
       </Button>
    );
  
} else {
 return (
   
<HStack>
 {familyStats.ProposalStatus === 4 ? ( 
   <HStack>
 <Box
  display="flex"
  alignItems="center"
  bgGradient='linear(to-l, #7928CA, #FF0080)'
  borderRadius="md"
  py="2"
>

<Box px="4">
<HStack>
        <Text color="white" fontSize="md">
        Family
        </Text>
        <Text color="white" fontSize="md">Stake: 
        </Text>
        <Text color="white" fontSize="md">
        {parseFloat(familyBudget).toFixed(3)}
        </Text>
        <Text color="white" fontSize="md">
        ETH
        </Text>

  </HStack>
      </Box>
</Box>
<Box
  display="flex"
  alignItems="center"
  bgGradient='linear(to-r, teal.500, green.500)'
  borderRadius="md"
  py="2"
>

<Box px="3">
         {texttransformer()}    
      </Box>
</Box>



</HStack>) :null}


<Box
  display="flex"
  alignItems="center"
  background="gray.600"
  borderRadius="md"
  py="2"
>

<Box px="5">
  <HStack>
        <Text color="white" fontSize="md">
        {parseFloat(balanceETH).toFixed(3)} 
        </Text>
        <Text color="white" fontSize="md">
        ETH
        </Text>
  </HStack>
</Box>
</Box>
<Box>
<Menu>
  <MenuButton 
  as={Button} 
  colorScheme='pink'
  px={4}
  py={2}
  transition='all 0.2s'
  borderRadius='md'
  borderWidth='1px'
  _hover={{ bg: 'gray.400' }}
  _focus={{ boxShadow: 'outline' }}
  >
  <HStack spacing={1}>
  <Text color="white" fontSize="md" fontWeight="medium" mr="2">    
            {currentAccount.slice(0, 4)}...{currentAccount.slice(
              currentAccount.length - 4,
              currentAccount.length
            )}
        </Text>
        <Identicon currentAccount={currentAccount} />
        </HStack>
  </MenuButton>
  <MenuList>
    <MenuGroup title=''>
    {familyStats.ProposalStatus === 5 ? (
      <MenuItem>Initiate Family Voting</MenuItem>):null}
    {familyStats.ProposalStatus === 4 ? (
      <MenuItem onClick={onOpen}>Add Stake
      
      <Modal finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Enter ETH value</ModalHeader>
          <ModalCloseButton />
          <ModalBody>

          <NumberInput
                onChange={(valueString) => setvalue(parse(valueString))}
                value={format(value)}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>

          </ModalBody>

          <ModalFooter>
            <Button  mr={3} variant='ghost' onClick={onClose}>
              Close
            </Button>
            <Button colorScheme='blue' onClick={addStake} >Add Stake</Button>
          </ModalFooter>
        </ModalContent>
      </Modal> 
      </MenuItem>):null}
    {familyStats.ProposalStatus === 4 && familyStats.DivorceStatus === 0 ? (
       <MenuItem onClick={onOpen2}> Initiate Divorce
      
       <Modal finalFocusRef={finalRef} isOpen={isOpen2} onClose={onClose2}>
         <ModalOverlay />
         <ModalContent>
           <ModalHeader>Are you sure you want to initiate Divorce?</ModalHeader>
           <ModalCloseButton />
           <ModalBody>

           <Textarea
            value={message}
             onChange={e => setMessage(e.target.value)}
             placeholder='Include a note'
              size='sm'
            />
            <Text fontSize='sm' color = 'red.500'>*If Divorce is accepted, the Family Stake will be split between partners.</Text>
 
           
           </ModalBody>
 
           <ModalFooter>
             <Button colorScheme='blue' mr={3} onClick={onClose2}>
               Close
             </Button>
             <Button variant='ghost' onClick={ProposeDivorce} >Proceed</Button>
           </ModalFooter>
         </ModalContent>
       </Modal>
       
       
       </MenuItem>):null}
       <MenuItem onClick={onOpen3}>Transactions History
       
       <Modal finalFocusRef={finalRef} isOpen={isOpen3} onClose={onClose3}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Transaction History</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          <Table {...getTableProps()}>
      <Thead>
        {headerGroups.map((headerGroup) => (
          <Tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <Th
                {...column.getHeaderProps(column.getSortByToggleProps())}
                isNumeric={column.isNumeric}
              >
                {column.render('Header')}
                <chakra.span pl='4'>
                  {column.isSorted ? (
                    column.isSortedDesc ? (
                      <TriangleDownIcon aria-label='sorted descending' />
                    ) : (
                      <TriangleUpIcon aria-label='sorted ascending' />
                    )
                  ) : null}
                </chakra.span>
              </Th>
            ))}
          </Tr>
        ))}
      </Thead>
      <Tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row)
          return (
            <Tr {...row.getRowProps()}>
              {row.cells.map((cell) => (
                <Td {...cell.getCellProps()} isNumeric={cell.column.isNumeric}>
                  {cell.render('Cell')}
                </Td>
              ))}
            </Tr>
          )
        })}
      </Tbody>
    </Table>
          </ModalBody>

          <ModalFooter>
            <Button  mr={3} variant='ghost' onClick={onClose3}>
              Close
            </Button>
            <Button colorScheme='blue' onClick={getTransactions} >Get Latest History</Button>
          </ModalFooter>
        </ModalContent>
      </Modal> 
       
       </MenuItem>
       
       <MenuItem onClick={onOpen4}> See your onchain NFT
       
       <Modal finalFocusRef={finalRef} isOpen={isOpen4} onClose={onClose4}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader> Your NFT</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            
          <Image src={imageNFT.image} alt='Image NFT' />
        
          </ModalBody>

          <ModalFooter>
            <Button  mr={3} variant='ghost' onClick={onClose4}>
              Close
            </Button>
            <Button colorScheme='blue'onClick={loadNFTimage} >Load NFT Image</Button>
          </ModalFooter>
        </ModalContent>
      </Modal> 
       </MenuItem>


    
    </MenuGroup>
  </MenuList>
</Menu>
</Box>

</HStack>

 )
} 
}

const loadNFTimage = async () => {

  try {
    const txn = await gameContract.nftHolders(familyStats.waver,familyStats.proposed)
    console.log("Token ID", txn)
    const txn2 = await gameContract.tokenURI(txn);
    console.log(txn2)
    const decodedtxn = txn2.slice(29,txn2.length)
    let base64ToString = atob(decodedtxn);
    const jsonobject = JSON.parse(base64ToString);
    setimageNFT(jsonobject);
    console.log(jsonobject.image)


    } catch (error) {
      console.log(error)
    }
}


const texttransformer =  () => {

  if (familyStats.ProposalStatus === 1 && familyStats.DivorceStatus === 0 ) {
  return ("Proposal Initiated")
  } else if (familyStats.ProposalStatus === 2 && familyStats.DivorceStatus === 0 ) {
    return("Proposal Cancelled")
  }else if (familyStats.ProposalStatus === 3 && familyStats.DivorceStatus === 0 ) {
    return("Proposal Accepted")
  }else if (familyStats.ProposalStatus === 4 && familyStats.DivorceStatus === 0 ) {
    return(
      <HStack>
    <Text color="white" fontSize="md">Married</Text>
      <Text color="white" fontSize="md">to:</Text>
      <Text color="white" fontSize="md">
      {marriedto.slice(0, 4)}...{marriedto.slice(
      marriedto.length - 4,
      marriedto.length)}</Text>
      </HStack>
    )
  }else if (familyStats.ProposalStatus === 4 && familyStats.DivorceStatus === 1 ) {
    return(
      <HStack> 
    <Text color="white" fontSize="md">Divorce</Text>
    <Text color="white" fontSize="md">with</Text>
    <Text color="white" fontSize="md">
    {marriedto.slice(0, 4)}...{marriedto.slice(
    marriedto.length - 4,
    marriedto.length)}</Text>   
    <Text color="white" fontSize="md">initiated</Text> 
  </HStack>
  
    )
  }else if (familyStats.ProposalStatus === 4 && familyStats.DivorceStatus === 2 ) {
    return(
      <HStack> 
      <Text color="white" fontSize="md">Divorce</Text>
      <Text color="white" fontSize="md">with</Text>
      <Text color="white" fontSize="md">
      {marriedto.slice(0, 4)}...{marriedto.slice(
      marriedto.length - 4,
      marriedto.length)}</Text>   
      <Text color="white" fontSize="md">initiated</Text> 
    </HStack>
   
      )
  } else if (familyStats.ProposalStatus === 4 && familyStats.DivorceStatus === 3 ) {
    return("Divorced.")
  };
  } 
 


  const getTransactions = async () => {
    var txarray =[]
    // eslint-disable-next-line 
    const myAddress = await Provider.getAddress()
    const filterFrom = gameContract.filters.AddStake(myAddress,null,null)
    const query = await gameContract.queryFilter(filterFrom, -10000);

    if (query.length>0) {
      for (let i=0; i<query.length; i++) {
        const {timestamp,amount} = query[i].args
        console.log(timestamp.toNumber(),ethers.utils.formatEther(amount))
        
    
        txarray.push({
          id: i,
          time: Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(timestamp.toNumber()),
          amount: ethers.utils.formatEther(amount)})
      }
      
    }   
    settxarray(txarray);
    console.log(data)
    console.log(columns)
    console.log(txarray)
   
  }





  const addStake = async () => {
   
    try {
      //implement gas estimation
        const waveTxn = await gameContract.addstake( {value: ethers.utils.parseUnits(value, 'ether'),gasPrice: ethers.utils.parseUnits('100', 'gwei'), gasLimit: 2000000});
        console.log("Mining...", waveTxn.hash);
        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);
      } catch (error) {
        console.log(error)
      }
  };

  const ProposeDivorce = async () => {
  
    try {
        const waveTxn = await gameContract.divorceproposal(message);
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);
        

      } catch (error) {
        console.log(error)
      }

  };


const renderContent2 = () => {


  if (!currentAccount) {
    return (
//Here is a main screen

<Container maxW={'7xl'}>
<Stack
  align={'center'}
  spacing={{ base: 8, md: 10 }}
  py={{ base: 20, md: 28 }}
  direction={{ base: 'column', md: 'row' }}>
  <Stack flex={1} spacing={{ base: 4, md: 5 }}>
    <Heading
      lineHeight={1.1}
      fontWeight={700}
      fontSize={{ base: '3xl', sm: '4xl', lg: '6xl' }}>
      Register your marriage on the {' '}
            <Text
              as={'span'}
              bgGradient="linear(to-r, red.400,pink.400)"
              bgClip="text">
              Ethereum Blockchain
            </Text>{' '}
            and Get {' '}
            <Text
              as={'span'}
              bgGradient="linear(to-r, red.400,pink.400)"
              bgClip="text">
              NFT Certificate.
            </Text>
    </Heading>
    <Text >
    <Text
              as={'span'}
              bgGradient="linear(to-r, red.400,pink.400)"
              bgClip="text"
              fontWeight='bold'>
              CryptoMarry
            </Text> {' '}
    is more than a registration service, it is a platform that makes partners' committment to marriage real.
     Staked ETHs are split between sides upon divorce. No lawyers needed.  

    </Text>
    <Center>
    <Stack
      spacing={{ base: 4, sm: 6 }}
      direction={{ base: 'column', sm: 'row' }}>
      
       <Button
         fontSize={'lg'}
         fontWeight={600}
         color={'white'}
         bg={'pink.400'}
         href={'#'}
         onClick={connectWalletAction}
         _hover={{
           bg: 'pink.300',
         }}>
         Connect your Wallet to Start
       </Button>
        
    </Stack>
    </Center>
  </Stack>
  <Flex
    flex={1}
    justify={'center'}
    align={'center'}
    position={'relative'}
    w={'full'}>
    <Blob
      w={'170%'}
      h={'170%'}
      position={'absolute'}
      top={'-20%'}
      left={0}
      zIndex={-1}
      
    />
    <Box
      position={'relative'}
      height={'480px'}
      rounded={'2xl'}
      boxShadow={'2xl'}
      width={'480px'}
      overflow={'hidden'}>
      
      <Image
        alt={'Hero Image'}
        fit={'cover'}
        align={'center'}
        w={'100%'}
        h={'100%'}
        src={
          'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nNTAwJyBoZWlnaHQ9JzUwMCcgdmlld0JveD0nMCAwIDUwMCA1MDAnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycgeG1sbnM6eGxpbms9J2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsnPjxkZWZzPjxmaWx0ZXIgaWQ9J2InPjxmZUltYWdlIHJlc3VsdD0ncDAnIHhsaW5rOmhyZWY9J2RhdGE6aW1hZ2Uvc3ZnK3htbDtiYXNlNjQsUEhOMlp5QjNhV1IwYUQwaU5UQXdJaUJvWldsbmFIUTlJalV3TUNJZ2RtbGxkMEp2ZUQwaU1DQXdJRFV3TUNBMU1EQWlJSGh0Ykc1elBTSm9kSFJ3T2k4dmQzZDNMbmN6TG05eVp5OHlNREF3TDNOMlp5SStQSEJoZEdnZ1ptbHNiRDBpSXpjeU1EbGlOeUlnWkQwaVRUQWdNR2cxTURCMk5UQXdTREI2SWk4K1BDOXpkbWMrJy8+PGZlSW1hZ2UgcmVzdWx0PSdwMScgeGxpbms6aHJlZj0nZGF0YTppbWFnZS9zdmcreG1sO2Jhc2U2NCxQSE4yWnlCM2FXUjBhRDBpTlRBd0lpQm9aV2xuYUhROUlqVXdNQ0lnZG1sbGQwSnZlRDBpTUNBd0lEVXdNQ0ExTURBaUlIaHRiRzV6UFNKb2RIUndPaTh2ZDNkM0xuY3pMbTl5Wnk4eU1EQXdMM04yWnlJK1BHTnBjbU5zWlNCamVEMGlNVEEzSWlCamVUMGlNemN3SWlCeVBTSXhOVEFpSUdacGJHdzlJaU5tTnpJMU9EVWlMejQ4TDNOMlp6ND0nLz48ZmVJbWFnZSByZXN1bHQ9J3AyJyB4bGluazpocmVmPSdkYXRhOmltYWdlL3N2Zyt4bWw7YmFzZTY0LFBITjJaeUIzYVdSMGFEMGlOVEF3SWlCb1pXbG5hSFE5SWpVd01DSWdkbWxsZDBKdmVEMGlNQ0F3SURVd01DQTFNREFpSUhodGJHNXpQU0pvZEhSd09pOHZkM2QzTG5jekxtOXlaeTh5TURBd0wzTjJaeUkrUEdOcGNtTnNaU0JqZUQwaU1qUTVJaUJqZVQwaU1qUXlJaUJ5UFNJeE1EQWlJR1pwYkd3OUlpTmlOVEUzT1dVaUx6NDhMM04yWno0PScvPjxmZUltYWdlIHJlc3VsdD0ncDMnIHhsaW5rOmhyZWY9J2RhdGE6aW1hZ2Uvc3ZnK3htbDtiYXNlNjQsUEhOMlp5QjNhV1IwYUQwaU5UQXdJaUJvWldsbmFIUTlJalV3TUNJZ2RtbGxkMEp2ZUQwaU1DQXdJRFV3TUNBMU1EQWlJSGh0Ykc1elBTSm9kSFJ3T2k4dmQzZDNMbmN6TG05eVp5OHlNREF3TDNOMlp5SStQR05wY21Oc1pTQmplRDBpTkRJM0lpQmplVDBpTWprd0lpQnlQU0l4TkRBaUlHWnBiR3c5SWlNME9EazFaV1lpTHo0OEwzTjJaejQ9Jy8+PGZlQmxlbmQgbW9kZT0nb3ZlcmxheScgaW49J3AwJyBpbjI9J3AxJy8+PGZlQmxlbmQgbW9kZT0nZXhjbHVzaW9uJyBpbjI9J3AyJy8+PGZlQmxlbmQgbW9kZT0nb3ZlcmxheScgaW4yPSdwMycgcmVzdWx0PSdibGVuZE91dCcvPjxmZUdhdXNzaWFuQmx1ciBpbj0nYmxlbmRPdXQnIHN0ZERldmlhdGlvbj0nNDUnLz48L2ZpbHRlcj48ZmlsdGVyIGlkPSdjJz48ZmVHYXVzc2lhbkJsdXIgaW49J1NvdXJjZUdyYXBoaWMnIHN0ZERldmlhdGlvbj0nMjUnLz48L2ZpbHRlcj48Y2xpcFBhdGggaWQ9J2EnPjxyZWN0IHdpZHRoPSc1MDAnIGhlaWdodD0nNTAwJyByeD0nNDInIHJ5PSc0MicvPjwvY2xpcFBhdGg+PC9kZWZzPjxnIGNsaXAtcGF0aD0ndXJsKCNhKSc+PHBhdGggZmlsbD0nNmIxNzU0JyBkPSdNMCAwaDUwMHY1MDBIMHonLz48cGF0aCBzdHlsZT0nZmlsdGVyOnVybCgjYiknIGQ9J00wIDBoNTAwdjUwMEgweicvPjxnIHN0eWxlPSdmaWx0ZXI6dXJsKCNjKTt0cmFuc2Zvcm06c2NhbGUoMS41KTt0cmFuc2Zvcm0tb3JpZ2luOmNlbnRlciB0b3AnPjxwYXRoIGZpbGw9J25vbmUnIGQ9J00wIDBoNTAwdjUwMEgweicvPjxlbGxpcHNlIGN4PSc1MCUnIHJ4PScxODAnIHJ5PScxMjAnIG9wYWNpdHk9Jy41NScvPjwvZz48L2c+PGcgbWFzaz0ndXJsKCNnKScgZmlsbD0nI2ZmZicgZm9udC1mYW1pbHk9J0NvdXJpZXIgTmV3Jz48dGV4dCB5PSc4MCcgeD0nOTAnIGZvbnQtd2VpZ2h0PSc1MjAnIGZvbnQtc2l6ZT0nNTAnPkNFUlRJRklDQVRFPC90ZXh0Pjx0ZXh0IHk9JzEzMCcgeD0nMTMwJyBmb250LXdlaWdodD0nNDAwJyBmb250LXNpemU9JzQwJz5vZiBNYXJyaWFnZTwvdGV4dD48L2c+PHJlY3QgeD0nMTYnIHk9JzE2JyB3aWR0aD0nNDY4JyBoZWlnaHQ9JzQ2OCcgcng9JzI2JyByeT0nMjYnIGZpbGw9J3JnYmEoMCwwLDAsMCknIHN0cm9rZT0ncmdiYSgyNTUsMjU1LDI1NSwwLjIpJy8+PGcgc3R5bGU9J3RyYW5zZm9ybTp0cmFuc2xhdGUoMzVweCwxNzBweCknPjxyZWN0IHdpZHRoPScxNTAnIGhlaWdodD0nNDAnIHJ4PSc4JyByeT0nOCcgZmlsbD0ncmdiYSgwLDAsMCwwLjYpJy8+PHRleHQgeD0nMTInIHk9JzMwJyBmb250LWZhbWlseT0nQ291cmllciBOZXcnIGZvbnQtc2l6ZT0nMzAnIGZpbGw9JyNmZmYnPjx0c3BhbiBmaWxsPSdyZ2JhKDI1NSwyNTUsMjU1LDAuNiknPklEOiA8L3RzcGFuPjI8L3RleHQ+PC9nPjxnIHN0eWxlPSd0cmFuc2Zvcm06dHJhbnNsYXRlKDM1cHgsMjMwcHgpJz48cmVjdCB3aWR0aD0nMzAwJyBoZWlnaHQ9JzQwJyByeD0nOCcgcnk9JzgnIGZpbGw9J3JnYmEoMCwwLDAsMC42KScvPjx0ZXh0IHg9JzEyJyB5PSczMCcgZm9udC1mYW1pbHk9J0NvdXJpZXIgTmV3JyBmb250LXNpemU9JzMwJyBmaWxsPScjZmZmJz48dHNwYW4gZmlsbD0ncmdiYSgyNTUsMjU1LDI1NSwwLjYpJz5TdGFrZTogPC90c3Bhbj4zMDAwIEVUSDwvdGV4dD48L2c+PGcgc3R5bGU9J3RyYW5zZm9ybTp0cmFuc2xhdGUoMzVweCwyOTBweCknPjxyZWN0IHdpZHRoPSc0MDAnIGhlaWdodD0nNDAnIHJ4PSc4JyByeT0nOCcgZmlsbD0ncmdiYSgwLDAsMCwwLjYpJy8+PHRleHQgeD0nMTInIHk9JzMwJyBmb250LWZhbWlseT0nQ291cmllciBOZXcnIGZvbnQtc2l6ZT0nMzAnIGZpbGw9JyNmZmYnPjx0c3BhbiBmaWxsPSdyZ2JhKDI1NSwyNTUsMjU1LDAuNiknPkJsb2NrIzogPC90c3Bhbj4xNjU8L3RleHQ+PC9nPjxnIHN0eWxlPSd0cmFuc2Zvcm06dHJhbnNsYXRlKDM1cHgsMzUwcHgpJz48cmVjdCB3aWR0aD0nNDMwJyBoZWlnaHQ9Jzk1JyByeD0nOCcgcnk9JzgnIGZpbGw9J3JnYmEoMCwwLDAsMC42KScvPjx0ZXh0IHg9JzEyJyB5PSczMCcgZm9udC1mYW1pbHk9J0NvdXJpZXIgTmV3JyBmb250LXNpemU9JzMwJyBmaWxsPScjZmZmJz48dHNwYW4gZmlsbD0ncmdiYSgyNTUsMjU1LDI1NSwwLjYpJz5CZXR3ZWVuOiA8L3RzcGFuPjwvdGV4dD48dGV4dCB4PScxMicgeT0nNTUnIGZvbnQtZmFtaWx5PSdDb3VyaWVyIE5ldycgZm9udC1zaXplPScxNicgZmlsbD0nI2ZmZic+MHhiY2Q0MDQyZGU0OTlkMTRlNTUwMDFjY2JiMjRhNTUxZjNiOTU0MDk2PC90ZXh0Pjx0ZXh0IHg9JzEyJyB5PSc3NScgZm9udC1mYW1pbHk9J0NvdXJpZXIgTmV3JyBmb250LXNpemU9JzE2JyBmaWxsPScjZmZmJz4weGNkM2I3NjZjY2RkNmFlNzIxMTQxZjQ1MmM1NTBjYTYzNTk2NGNlNzE8L3RleHQ+PC9nPjwvc3ZnPg=='
        }
      />
    </Box>
  </Flex>
</Stack>

<Container maxW={'5xl'}>
      <Stack
        textAlign={'center'}
        align={'center'}
        spacing={{ base: 8, md: 10 }}
        py={{ base: 20, md: 28 }}>
        <Heading
          fontWeight={600}
          fontSize={{ base: '3xl', sm: '4xl', md: '6xl' }}
          lineHeight={'110%'}>
          Setting a Marriage Contract{' '}
          <Text
              as={'span'}
              bgGradient="linear(to-r, red.400,pink.400)"
              bgClip="text"
              fontWeight='bold'>
              is Easy.
            </Text> {' '}
        </Heading>
        <Text color={'gray.500'} maxW={'3xl'}>
          Propose your loved one and demonstrate your strong commitment to the partnership by staking ETHs and minting a NFT Certificate. {' '}
          <Text
              as={'span'}
              bgGradient="linear(to-r, red.400,pink.400)"
              bgClip="text"
              fontWeight='bold'>
              Ethereum Smart Contracts
            </Text> {' '}
           will make sure that your promises are delivered.  
        </Text>
        
        <Stack spacing={6} direction={'row'}>
          
        <Box
        role={'group'}
        p={6}
        maxW={'330px'}
        w={'full'}
       
        boxShadow={'2xl'}
        rounded={'lg'}
        pos={'relative'}
        zIndex={1}>
        <Box
          rounded={'lg'}
          mt={-12}
          pos={'relative'}
          height={'230px'}
          _after={{
            transition: 'all .3s ease',
            content: '""',
            w: 'full',
            h: 'full',
            pos: 'absolute',
            top: 5,
            left: 0,
            backgroundImage: `url(${'https://images.unsplash.com/photo-1534515729281-5ddf2c470538?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1035&q=80'})`,
            filter: 'blur(15px)',
            zIndex: -1,
          }}
          _groupHover={{
            _after: {
              filter: 'blur(20px)',
            },
          }}>
          <Image
            rounded={'lg'}
            height={230}
            width={282}
            objectFit={'cover'}
            src={
              'https://images.unsplash.com/photo-1534515729281-5ddf2c470538?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1035&q=80'
            }
          />
        </Box>
        <Stack pt={10} align={'center'}>
          <Text color={'gray.500'} fontSize={'sm'} textTransform={'uppercase'}>
            STEP 1
          </Text>
          <Heading fontSize={'2xl'} fontFamily={'body'} fontWeight={500}>
          <Text
              as={'span'}
              bgGradient="linear(to-r, red.400,pink.400)"
              bgClip="text"
              fontWeight='bold'>
              Make a proposal 
            </Text> 
            
          </Heading>
          <Stack direction={'row'} align={'center'}>
            <Text fontWeight={300} fontSize={'1xl'}>
            Within the proposal, indicate partner's wallet address, the amount of ETH you are willing to stake. You can also send a Gift in ETH as a part of the deal.   
            </Text>
          </Stack>
        </Stack>
      </Box>

      <Box
        role={'group'}
        p={6}
        maxW={'330px'}
        w={'full'}
       
        boxShadow={'2xl'}
        rounded={'lg'}
        pos={'relative'}
        zIndex={1}>
        <Box
          rounded={'lg'}
          mt={-12}
          pos={'relative'}
          height={'230px'}
          _after={{
            transition: 'all .3s ease',
            content: '""',
            w: 'full',
            h: 'full',
            pos: 'absolute',
            top: 5,
            left: 0,
            backgroundImage: `url(${'https://images.unsplash.com/photo-1515255999692-f4f725690af8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80'})`,
            filter: 'blur(15px)',
            zIndex: -1,
          }}
          _groupHover={{
            _after: {
              filter: 'blur(20px)',
            },
          }}>
          <Image
            rounded={'lg'}
            height={230}
            width={282}
            objectFit={'cover'}
            src={
              'https://images.unsplash.com/photo-1515255999692-f4f725690af8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80'
            }
          />
        </Box>
        <Stack pt={10} align={'center'}>
          <Text color={'gray.500'} fontSize={'sm'} textTransform={'uppercase'}>
            STEP 2
          </Text>
          <Heading fontSize={'2xl'} fontFamily={'body'} fontWeight={500}>
          <Text
              as={'span'}
              bgGradient="linear(to-r, red.400,pink.400)"
              bgClip="text"
              fontWeight='bold'>
              Register your marriage 
            </Text>  
          </Heading>
          <Stack direction={'row'} align={'center'}>
            <Text fontWeight={300} fontSize={'1xl'}>
            If your proposal is accepted, register your Marriage and create a Smart Contract. Both partners will receive NFT Certificate that is 100%  stored on the Ethereum Chain.   
            </Text>
          </Stack>
        </Stack>
      </Box>

      <Box
        role={'group'}
        p={6}
        maxW={'330px'}
        w={'full'}
       
        boxShadow={'2xl'}
        rounded={'lg'}
        pos={'relative'}
        zIndex={1}>
        <Box
          rounded={'lg'}
          mt={-12}
          pos={'relative'}
          height={'230px'}
          _after={{
            transition: 'all .3s ease',
            content: '""',
            w: 'full',
            h: 'full',
            pos: 'absolute',
            top: 5,
            left: 0,
            backgroundImage: `url(${'https://images.unsplash.com/photo-1610624764045-5255643109c6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80'})`,
            filter: 'blur(15px)',
            zIndex: -1,
          }}
          _groupHover={{
            _after: {
              filter: 'blur(20px)',
            },
          }}>
          <Image
            rounded={'lg'}
            height={230}
            width={282}
            objectFit={'cover'}
            src={
              'https://images.unsplash.com/photo-1610624764045-5255643109c6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80'
            }
          />
        </Box>
        <Stack pt={10} align={'center'}>
          <Text color={'gray.500'} fontSize={'sm'} textTransform={'uppercase'}>
            STEP 3
          </Text>
          <Heading fontSize={'2xl'} fontFamily={'body'} fontWeight={500}>
          <Text
              as={'span'}
              bgGradient="linear(to-r, red.400,pink.400)"
              bgClip="text"
              fontWeight='bold'>
              Strengthen your Marriage 
            </Text>  
          </Heading>
          <Stack direction={'row'} align={'center'}>
            <Text fontWeight={300} fontSize={'1xl'}>
            Both partners can inrease Family Staking as a part of their committment. Remember staying out of divorce, but if there are no other options, the Staking amount will be split between partners upon mutual agreement. 
            </Text>
          </Stack>
        </Stack>
      </Box>

        </Stack>
</Stack>
    </Container>
    <Container maxW={'5xl'}>
      <Stack
        textAlign={'center'}
        align={'center'}
        spacing={{ base: 8, md: 10 }}
        py={{ base: 20, md: 28 }}>
        <Heading
          fontWeight={600}
          fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}
          lineHeight={'110%'}>
          <Text
              as={'span'}
              bgGradient="linear(to-r, red.400,pink.400)"
              bgClip="text"
              fontWeight='bold'>
              F.A.Q.
            </Text> {' '}
        </Heading>
        
        <Stack spacing={6} direction={'row'}>
          
       
        <Accordion 
        allowToggle 
      
        >
  <AccordionItem>
    <h2>
      <AccordionButton>
        <Box flex='1' textAlign='left'>
          Should I propose/marry in Real Life?
        </Box>
        <AccordionIcon />
      </AccordionButton>
    </h2>
    <AccordionPanel pb={4}>
     Absolutely. CryptoMarry is not substitute for IRL experiences. But the platform provides a number of instruments that are very difficult to arrange in IRL.
     For example, proposals without Skin in the Game (e.g ETH Staking) are not always credible. The one who proposes through CryptoMarry, can make credible committment to the Partnership.
     Most importantly, if couples decide to divorce, it can be quite difficult to fairly split joint assets (sometimes legal procedures are unavoidable). But with CryptoMarry, Staked resources are split instantly upon divorce.     

    </AccordionPanel>
  </AccordionItem>

  <AccordionItem>
    <h2>
      <AccordionButton>
        <Box flex='1' textAlign='left'>
          Are staked (deposited) ETH safe? 
        </Box>
        <AccordionIcon />
      </AccordionButton>
    </h2>
    <AccordionPanel pb={4}>
     Ethereum provides unmatched security in ensuring authorized transactions (unless private keys are lost). 
     Security Audit of CryptoMarry Smart Contracts is still in progress, thus Users should consider all associated risks before using the service. 
     The Smart Contracts are Open Sourced for the community review.  
     Developers and Associates do not take any responsibilities in case of loss of Staked ETH Funds by any means. It is also impossible to recover funds if wallet accounts are lost. 

     </AccordionPanel>
  </AccordionItem>

<AccordionItem>
    <h2>
      <AccordionButton>
        <Box flex='1' textAlign='left'>
          Where can I find my NFT Certificate? 
        </Box>
        <AccordionIcon />
      </AccordionButton>
    </h2>
    <AccordionPanel pb={4}>
    NFT Certificates can be loaded within the CryptoMarry Menu Bar. They are also available in OpenSea and similar indexing platforms. 
    It is possible to import NFT certificates into wallet address if viewing NFT assets is possible within the wallet. For instance, only mobile version of Metamask allows viewing NFTs. 

     </AccordionPanel>
  </AccordionItem>

  <AccordionItem>
    <h2>
      <AccordionButton>
        <Box flex='1' textAlign='left'>
          Is it possible to withdraw Staked ETH?
        </Box>
        <AccordionIcon />
      </AccordionButton>
    </h2>
    <AccordionPanel pb={4}>
   Withdrawing is possible only through divorcing procedures and will be split between provided wallet addresses. It is done by design.
   Divorce procedures are complete if both sides have agreed. 
     </AccordionPanel>
  </AccordionItem>

  <AccordionItem>
    <h2>
      <AccordionButton>
        <Box flex='1' textAlign='left'>
          If one of the wallet addresses is lost is it possible to withdraw funds? 
        </Box>
        <AccordionIcon />
      </AccordionButton>
    </h2>
    <AccordionPanel pb={4}>
   Deposits can be withdrawn if the other wallet address does not provide any response within the 60 days. The full amount will be sent to the account that initiated divorce. If both wallet adresses are lost, then it is not possible to recover funds. 
     </AccordionPanel>
  </AccordionItem>

  <AccordionItem>
    <h2>
      <AccordionButton>
        <Box flex='1' textAlign='left'>
          What are the transaction fees and associtated costs? 
        </Box>
        <AccordionIcon />
      </AccordionButton>
    </h2>
    <AccordionPanel pb={4}>
   There are two types of fees. First, Developer Community fee is 1% from all transactions. There is also an Ethereum fee. 
   Ethereum transaction fees may vary depending on network congestion. It should be noted that transaction fee form Minting NFT Certificate may cost up to 0.6 ETHs. This is because all data in stored on chain. If you are looking for more affordable options, CryptoMarry is available in Polygon Chain. 
     </AccordionPanel>
  </AccordionItem>
  <AccordionItem>
    <h2>
      <AccordionButton>
        <Box flex='1' textAlign='left'>
          Do you collect Data?
        </Box>
        <AccordionIcon />
      </AccordionButton>
    </h2>
    <AccordionPanel pb={4}>
   CryptoMarry does not collect any personal data. All interactions happen 100% on chain. 
     </AccordionPanel>
  </AccordionItem>


</Accordion>
          
        



        </Stack>
</Stack>
  
</Container>



</Container>




//Here where main screen ends 



    );
  } else if (currentAccount && !characterNFT &&!userBeenProposed) {
    return <SelectCharacter setCharacterNFT={setCharacterNFT} currentAccount={currentAccount} />;	
	
  } else if (currentAccount && userBeenProposed && !characterNFT ) {
    return <Arena Provider = {Provider} currentAccount={currentAccount} userBeenProposed={userBeenProposed} setuserBeenProposed={setuserBeenProposed}/>;
  } else if (currentAccount && characterNFT && !userBeenProposed  ) {
    return <Execute currentAccount={currentAccount} characterNFT={characterNFT} setCharacterNFT={setCharacterNFT} />;
  } 

}











const DesktopNav = () => {
  const linkColor = useColorModeValue('gray.600', 'gray.200');
  const linkHoverColor = useColorModeValue('gray.800', 'white');
  const popoverContentBgColor = useColorModeValue('white', 'gray.800');

  return (
    <Stack direction={'row'} spacing={4}>
      {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.label}>
          <Popover trigger={'hover'} placement={'bottom-start'}>
            <PopoverTrigger>
              <Link
                p={2}
                href={navItem.href ?? '#'}
                fontSize={'sm'}
                fontWeight={500}
                color={linkColor}
                _hover={{
                  textDecoration: 'none',
                  color: linkHoverColor,
                }}>
                {navItem.label}
              </Link>
            </PopoverTrigger>

            {navItem.children && (
              <PopoverContent
                border={0}
                boxShadow={'xl'}
                bg={popoverContentBgColor}
                p={4}
                rounded={'xl'}
                minW={'sm'}>
                <Stack>
                  {navItem.children.map((child) => (
                    <DesktopSubNav key={child.label} {...child} />
                  ))}
                </Stack>
              </PopoverContent>
            )}
          </Popover>
        </Box>
      ))}
    </Stack>
  );
};

const DesktopSubNav = ({ label, href, subLabel }: NavItem) => {
  return (
    <Link
      href={href}
      role={'group'}
      display={'block'}
      p={2}
      rounded={'md'}
      _hover={{ bg: useColorModeValue('pink.50', 'gray.900') }}>
      <Stack direction={'row'} align={'center'}>
        <Box>
          <Text
            transition={'all .3s ease'}
            _groupHover={{ color: 'pink.400' }}
            fontWeight={500}>
            {label}
          </Text>
          <Text fontSize={'sm'}>{subLabel}</Text>
        </Box>
        <Flex
          transition={'all .3s ease'}
          transform={'translateX(-10px)'}
          opacity={0}
          _groupHover={{ opacity: '100%', transform: 'translateX(0)' }}
          justify={'flex-end'}
          align={'center'}
          flex={1}>
          <Icon color={'pink.400'} w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </Link>
  );
};

const MobileNav = () => {
  return (
    <Stack
      bg={useColorModeValue('white', 'gray.800')}
      p={4}
      display={{ md: 'none' }}>
      {NAV_ITEMS.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  );
};

const MobileNavItem = ({ label, children, href }: NavItem) => {
  const { isOpenother, onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        py={2}
        as={Link}
        href={href ?? '#'}
        justify={'space-between'}
        align={'center'}
        _hover={{
          textDecoration: 'none',
        }}>
        <Text
          fontWeight={600}
          color={useColorModeValue('gray.600', 'gray.200')}>
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={'all .25s ease-in-out'}
            transform={isOpenother ? 'rotate(180deg)' : ''}
            w={6}
            h={6}
          />
        )}
      </Flex>

      <Collapse in={isOpenother} animateOpacity style={{ marginTop: '0!important' }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={'solid'}
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          align={'start'}>
          {children &&
            children.map((child) => (
              <Link key={child.label} py={2} href={child.href}>
                {child.label}
              </Link>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

interface NavItem {
  label: string;
  subLabel?: string;
  children?: Array<NavItem>;
  href?: string;
}

const NAV_ITEMS: Array<NavItem> = [
  
];


const SocialButton = ({
  children,
  label,
  href,
}: {
  children: ReactNode;
  label: string;
  href: string;
}) => {
  return (
    <chakra.button
      bg={useColorModeValue('blackAlpha.100', 'whiteAlpha.100')}
      rounded={'full'}
      w={8}
      h={8}
      cursor={'pointer'}
      as={'a'}
      href={href}
      display={'inline-flex'}
      alignItems={'center'}
      justifyContent={'center'}
      transition={'background 0.3s ease'}
      _hover={{
        bg: useColorModeValue('blackAlpha.200', 'whiteAlpha.200'),
      }}>
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </chakra.button>
  );
};



  return (
    <ChakraProvider theme={theme}>


<Grid

  templateRows='repeat(1, 1fr)'
  templateColumns='repeat(1, 1fr)'
  gap={2}
>

  <GridItem colSpan={1}>

  <Box>
      <Flex
        bg={useColorModeValue('gray.100', 'gray.800')}
        color={useColorModeValue('gray.600', 'gray.100')}
        minH={'60px'}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={'solid'}
        borderColor={useColorModeValue('gray.200', 'gray.900')}
        align={'center'}>
        <Flex
          flex={{ base: 1, md: 'auto' }}
          ml={{ base: -2 }}
          display={{ base: 'flex', md: 'none' }}>
          <IconButton
            onClick={onToggle}
            icon={
              isOpenother ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant={'ghost'}
            aria-label={'Toggle Navigation'}
          />
        </Flex>
        <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
        <Link href={'/'} passHref>
        <Stack
                as={'a'}
                direction={'row'}
                alignItems={'center'}
                spacing={{ base: 1, sm: 1 }}>
                <Icon as={Logo} w={{ base: 8 }} h={{ base: 8 }} />
                <Heading
                  as={'h1'}
                  fontSize={'xl'}
                  display={{ base: 'none', md: 'block' }}>
                  <Text
                   as={'span'}
                   bgGradient="linear(to-r, red.400,pink.400)"
                   bgClip="text"
                  >CryptoMarry</Text>
                </Heading>
              </Stack>
            </Link>

          <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
          
          
           <DesktopNav />
          </Flex>
        </Flex>

        <Stack
          flex={{ base: 2, md: 0 }}
          justify={'flex-end'}
          direction={'row'}
          spacing={6}>
         
         {renderContent()}
          <ColorModeSwitcher justifySelf="flex-end" />
        
        </Stack>
      </Flex>

      <Collapse in={isOpenother} animateOpacity>
        <MobileNav />
      </Collapse>
    </Box>
    

  </GridItem>
  
  <GridItem colSpan={2} >
  


  <Box textAlign="center" fontSize="xl">

        <VStack spacing={1}>
        
        {renderContent2()}

            </VStack>
      </Box>

  </GridItem>



  <Box
      bg={useColorModeValue('gray.50', 'gray.900')}
      color={useColorModeValue('gray.700', 'gray.200')}>
      <Container
        as={Stack}
        maxW={'6xl'}
        py={4}
        direction={{ base: 'column', md: 'row' }}
        spacing={4}
        justify={{ base: 'center', md: 'space-between' }}
        align={{ base: 'center', md: 'center' }}>
        <Text>© 2022 CryptoMarry. All rights reserved</Text>
        <Stack direction={'row'} spacing={6}>
          <SocialButton label={'Twitter'} href={'#'}>
            <FaTwitter />
          </SocialButton>
          <SocialButton label={'YouTube'} href={'#'}>
            <FaYoutube />
          </SocialButton>
          <SocialButton label={'Github'} href={'#'}>
            <FaGithub />
          </SocialButton>
        </Stack>
      </Container>
    </Box>

</Grid>

    </ChakraProvider>
  );


}

/*
  <Blur
        position={'absolute'}
        top={-10}
        left={-10}
        style={{ filter: 'blur(80px)' }}
      />
*/

export default App;

export const Blur = (props: IconProps) => {
  return (
    <Icon
      width={useBreakpointValue({ base: '100%', md: '40vw', lg: '30vw' })}
      zIndex={useBreakpointValue({ base: -1, md: -1, lg: 0 })}
      height="800px"
      viewBox="0 0 528 800"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <circle cx="71" cy="61" r="111" fill="#F56565" />
      <circle cx="244" cy="106" r="139" fill="#ED64A6" />
      <circle cy="291" r="139" fill="#ED64A6" />
      <circle cx="80.5" cy="189.5" r="101.5" fill="#ED8936" />
      <circle cx="196.5" cy="317.5" r="101.5" fill="#ECC94B" />
      <circle cx="70.5" cy="458.5" r="101.5" fill="#48BB78" />
      <circle cx="426.5" cy="-0.5" r="101.5" fill="#4299E1" />
    </Icon>
  );

};


export const Blob = (props: IconProps) => {
  return (
    <Icon
      width={'100%'}
      viewBox="0 0 578 440"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M239.184 439.443c-55.13-5.419-110.241-21.365-151.074-58.767C42.307 338.722-7.478 282.729.938 221.217c8.433-61.644 78.896-91.048 126.871-130.712 34.337-28.388 70.198-51.348 112.004-66.78C282.34 8.024 325.382-3.369 370.518.904c54.019 5.115 112.774 10.886 150.881 49.482 39.916 40.427 49.421 100.753 53.385 157.402 4.13 59.015 11.255 128.44-30.444 170.44-41.383 41.683-111.6 19.106-169.213 30.663-46.68 9.364-88.56 35.21-135.943 30.551z"
        fill="pink"
      />
    </Icon>
  );
};
