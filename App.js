import DStorage from '../abis/DStorage.json'
import React, { Component } from 'react';
import Navbar from './Navbar'
import Main from './Main'
import Web3 from 'web3';
import './App.css';

//Declare IPFS
import create from "ipfs-http-client"
async function ipfsClient() {
  const ipfs = await create(
      {
          host: "https://dropstore.infura-ipfs.io",
          port: 5001,
          protocol: "https"
      }
  );
  return ipfs;
}
// const ipfs = create({ host: '127.0.0.1', port: 5001, protocol: 'http' })
// const ipfs = create({ host: 'https://dropstore.infura-ipfs.io', port: 5001, protocol: 'https' })
 const projectId = '2JX2tj4qGIN0cBMOnUZxOWX2GrT';
 const projectSecret = 'b15e378d90583ae9d86edd8117f17326';
 const auth = 'Basic' + Buffer.from(projectId + ":" + projectSecret).toString('base64');
//  const client = IPFSHTTPClient({
//      host: 'ipfs.infura.io',
//      port: 5001,
//      protocol: 'https',
//      headers: {
//          authorization: auth,
//      },
//  });
// client.add('Hello World').then((res) => {
//     console.log(res);
// });

//const projectId = process.env.REACT_APP_PROJECT_ID;
//const projectSecretKey = process.env.REACT_APP_PROJECT_KEY;
//const authorization = "Basic " + btoa(projectId + ":" + projectSecretKey);


  // const [uploadedImages, setUploadedImages] = useState([]);
  //const ipfs = ipfsHttpClient({
    //url: "https://ipfs.infura.io:5001/api/v0",
    //headers: {
     // authorization,
    //},
  //});

 
class App extends Component {

  async componentWillMount() {  //lifecycle callback in react->when component gets added to dom/page,this function is going to run
    await this.loadWeb3()       //connects the app to the blockchain
    await this.loadBlockchainData() //connects the web3 console
  }

  async loadWeb3() {   //this code function connects the app to the blockchain
    //Setting up Web3
    if (window.ethereum){
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if(window.web3){
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected.You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3//Declare Web3
    console.log(web3)

    //Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account:accounts[0] })
    //Network ID
    const networkId = await web3.eth.net.getId()
    const networkData = DStorage.networks[networkId]
    if(networkData){
      //Assign contract
      const dstorage = new web3.eth.Contract(DStorage.abi, networkData.address)
      this.setState({dstorage})
      //Get files amount
      const filesCount = await dstorage.methods.fileCount().call()
      this.setState({filesCount})
      //Load files&sort by the newest
      for (var i = filesCount; i>= 1; i--){
        const file = await dstorage.methods.files(i).call()
        this.setState({
          files: [this.state.files, file]
        })
        console.log(this.state.files)
      }
    }else {
      window.alert('DStorage contract not deployed to detected network.')
    }
    this.setState({loading: false})

    //Else
      //alert Error
        this.setState({loading: false})
  }

  // Get file from user
  captureFile = event => {
    event.preventDefault()

    const file = event.target.files[0]
    const reader = new window.FileReader()
    console.log(file)
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.setState({
        buffer: Buffer(reader.result),
        type: file.type,
        name: file.name
      })
      console.log('buffer', this.state.buffer)
    }
    this.setState({
      type: file.type,
      name: file.name
    })
  }


  //Upload File
  uploadFile = async () => {
    console.log("Submitting file to ipfs...")
    // console.log(this.state.buffer);

    // const result = await ipfs.add(file);
    // console.log('IPFS result',result);
    let ipfs = await ipfsClient();
    console.log(this.state);
    const result = await ipfs.add(this.state.name, (result, error) => {
      console.log('ipfs result',result);
      console.log("ipfs result", error);
    })
    // console.log(output);
  }
  // uploadFile = description => {
  //       console.log("Submitting File to ipfs...")
  //       console.log(this.state.buffer);
  //   //Add file to the IPFS
  //       ipfs.add(this.state.buffer, (error, result) => {
  //           console.log('IPFS result',result);
       
  //     })
  //     //Check If error
  //       //Return error

  //     //Set state to loading

  //     //Assign value for the file without extension

  //     //Call smart contract uploadFile function 
      

  // }

  //Set states
  constructor(props) {
    super(props)
    this.state = {
      buffer:[],
      account: '',
      dstorage: null,
      files: [],
      loading: false,
      type: null,
      name: null
    }
    this.uploadFile = this.uploadFile.bind(this)
    this.captureFile = this.captureFile.bind(this)
  }
    //Bind functions
  
//React->javascript library to build user interface.
  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        { this.state.loading
          ? <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
          : <Main
              files={this.state.files}
              captureFile={this.captureFile}
              uploadFile={this.uploadFile}
            />
        }
      </div>
    );
  }
}

export default App;