pragma solidity ^0.5.0;


contract DStorage {
   string public name = 'DStorage';// Name
    uint public fileCount = 0; // Number of files  
    mapping( uint => File ) public files; //public ->we can access this function outside of the smart contract
    


  //KEY 1: => Qwbvjlsbvksflsbjfkslb3uy283n4jkj
  //KEY 2: => Qwbvjlsbvksflsbjfkslb3uy283n4jk4637hrbjjfd
  
          

  // Struct
  struct File{    //allows to store files and attributes of the files that we need for dropstore
      uint fileId;
      string fileHash;
      uint fileSize;
      string fileType;
      string fileName;
      string fileDescription;
      uint uploadTime;
      address payable uploader;

  }

  // Event
  event FileUploaded(
      uint fileId,
      string fileHash,
      uint fileSize,
      string fileType,
      string fileName,
      string fileDescription,
      uint uploadTime,
      address payable uploader

  );

  constructor() public {
  }

  function uploadFile(string memory _fileHash, uint _fileSize, string memory _fileType, string memory _fileName, string memory _fileDescription ) public {  

    // Make sure the file hash exists
    require(bytes(_fileHash).length > 0); //require->makes sure somethin is true befroe exec->>makes sure that filehash length is > 0(it exists) before execution

    // Make sure file type exists
    require(bytes(_fileType).length > 0);

    // Make sure file description exists
    require(bytes(_fileDescription).length > 0);

    // Make sure file fileName exists
    require(bytes(_fileName).length > 0);
    
    // Make sure uploader address exists
    require(msg.sender!=address(0));
    // Make sure file size is more than 0
    require(_fileSize>0);


    fileCount ++;     // Increment file id

    // Add File to the contract
    files[1]=File( fileCount, _fileHash, _fileSize, _fileType,  _fileName, _fileDescription, now, msg.sender ); //now->timestamp,  msg.sender will give us the info of uploader.



    
    emit FileUploaded( fileCount, _fileHash, _fileSize, _fileType, _fileName, _fileDescription, now, msg.sender );// Trigger an event
  }
}